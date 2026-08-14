---
title: Orchestrator executes high-stakes tools with no gate on the code path
slug: comm-no-approval-gate
category: comm
defaultTier: release-blocker
surfaces: agent-tool-execution, agent-chat
agent-native-principle: Parity (agent-UI communication)
detection: hybrid
related: comm-no-progress-visibility, control-no-approval-gate
---

## Orchestrator executes high-stakes tools with no gate on the code path

The tool-use loop calls `tool.execute()` directly, so nothing in the orchestrator can interpose a confirmation. Whatever the UI renders, a destructive tool registered tomorrow ships ungated by default. Violates Parity: oversight belongs on the execution path both the user and the agent go through.

Scope: this rule asks whether a gate exists in the orchestrator at all, and whether tool definitions carry the risk metadata a gate needs. Which approval treatment each risk level earns (auto-apply, quick confirm, diff, modal) is `rules-ax/control-no-approval-gate`.

## What goes wrong

A chat surface ships a confirmation modal for the three delete tools it knows about, wired at the call site. Someone adds `transfer_funds` to the registry. The loop calls it the same way it calls `list_files`, and no reviewer notices, because the gate was never on the path, only on three call sites.

## Detection

**Surfaces:** agent-tool-execution, agent-chat

**Static signals:**
1. Find the tool-use loop and every call site that reaches `.execute(`. More than one path to execution means there is no single gate.
2. Identify destructive/financial/external operations: send, delete, publish, deploy, charge, transfer.
3. Check whether an approval handler sits between dispatch and execution on that path, and whether it is reached for every tool or only for named ones.
4. Check what happens to a tool with no stakes metadata: defaulting to auto-approve is a fail even when today's registry is fully labelled.
5. Check what the checkpoint receives. Tool name and arguments alone cannot express provenance (did the agent create this object this conversation, does the target leave the workspace), so a gate given only those can be tuned by strictness and nothing else.

**Runtime signals:** a destructive tool added to the registry with no other change executes without prompting.

**Concrete commands:**
```bash
rg '(name|toolName).*["'"'"'](send|delete|remove|publish|deploy|charge|transfer)' --type=ts src/
rg '(executeTool|callTool|invokeTool)' --type=ts -A 10 src/ | rg -v '(confirm|approve|requireApproval)'
rg '(requireApproval|confirmBefore|approvalGate|stakesLevel)' --type=ts src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:comm-no-approval-gate`.
- Skip read-only operations (get, list, search, fetch).
- Skip operations marked safe/reversible in tool metadata.
- Skip test files and fixtures.

## Fix

Every tool call passes through one checkpoint, and tools declare their own risk so the checkpoint can classify them without a hardcoded name list. Fail closed: a tool with no declared stakes is treated as high.

```tsx
// before: no interposition point, gating is per-call-site or absent
async function executeTool(tc: ToolCall) {
  return tools[tc.name].execute(tc.args);
}

// after: single choke point, risk declared on the tool
async function executeTool(tc: ToolCall, onApproval: ApprovalHandler) {
  const tool = tools[tc.name];
  const risk = tool.stakes ?? "high";        // unlabelled tools are not auto-approved
  const decision = await onApproval({ tool: tc.name, args: tc.args, risk, reversibility: tool.reversibility });
  if (decision !== "approved") return { status: "cancelled", reason: decision };
  return tool.execute(tc.args);
}
```

The `onApproval` handler owns the treatment per risk level, so it is audited by `rules-ax/control-no-approval-gate`, not here. This rule passes once the checkpoint exists, covers every tool, and cannot be bypassed by registering a new one.

## Default tier and overrides

**Defaults to:** `release-blocker`

The gap is in shared orchestrator code, so it reaches every surface that can trigger a mutating tool. The rows do not taper the way a presentation rule's do.

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | release-blocker |

## Examples

**Anti-pattern (fails):** the tool-use loop calls `tools[tc.name].execute(tc.args)` with no handler parameter threaded in, and `grep` for `requireApproval|approvalGate` in the orchestrator returns nothing. Confirmation modals in the chat component do not count; they cannot see a tool call the loop makes on the server.

**Applied (passes):** one `executeTool` wrapper, every registration path goes through it, and tool definitions carry `stakes` / `reversibility` fields the checkpoint reads.

## Suppression

```tsx
// ax-audit-ignore:comm-no-approval-gate, internal cleanup, operates only on temp files
const cleanupTool = { execute: (args) => fs.rm(args.tempDir) };
```
