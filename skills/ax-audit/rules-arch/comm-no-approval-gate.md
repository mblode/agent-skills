---
title: High-stakes irreversible action with no approval step
slug: comm-no-approval-gate
category: comm
defaultTier: release-blocker
surfaces: agent-tool-execution, agent-chat
agent-native-principle: Parity (agent-UI communication)
detection: hybrid
related: comm-no-progress-visibility
---

## High-stakes irreversible action with no approval step

Agent autonomously sends email, deletes files, or publishes content with no confirmation. User discovers the action after the fact. Trust destroyed. Violates Parity: stakes and reversibility must determine oversight level, not agent confidence.

## What goes wrong

User says "clean up my inbox." Agent archives 200 emails including an unread message from the CEO. Or: "deploy the fix" and the agent pushes to production without showing what changed.

## Detection

**Surfaces:** agent-tool-execution, agent-chat

**Static signals:**
1. Find tool execution handlers.
2. Identify destructive/financial/external operations: send, delete, publish, deploy, charge, transfer.
3. Check for confirmation dialog or approval handler between decision and execution.
4. Flag direct execution of high-stakes operations with no gate.

**Runtime signals:** Agent executes destructive tools with no preceding user confirmation.

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

Stakes x reversibility matrix: low+easy = auto, low+hard = quick confirm, high+easy = suggest with diff, high+hard = explicit modal.

```tsx
// before
async function executeTool(tc: ToolCall) {
  return tools[tc.name].execute(tc.args);
}

// after: approval gate based on stakes and reversibility
async function executeTool(tc: ToolCall, onApproval: ApprovalHandler) {
  const tool = tools[tc.name];
  switch (getApprovalLevel(tool.stakes, tool.reversibility)) {
    case "auto":     return tool.execute(tc.args);
    case "quick":    await onApproval({ type: "toast", timeout: 5000 }); return tool.execute(tc.args);
    case "suggest":  await onApproval({ type: "diff", diff: await tool.preview(tc.args) }); return tool.execute(tc.args);
    case "explicit": await onApproval({ type: "modal", requireConfirm: true }); return tool.execute(tc.args);
  }
}
```

## Default tier and overrides

**Defaults to:** `release-blocker`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | release-blocker |
| Agent config | fix-this-sprint |
| Agent dashboard | fix-this-sprint |

## Examples

**Anti-pattern (fails):** `execute: async (args) => emailClient.send(args)`: no confirmation.

**Applied (passes):** Tool declares `stakes: "high", reversibility: "hard"`: gate applied automatically.

## Suppression

```tsx
// ax-audit-ignore:comm-no-approval-gate, internal cleanup, operates only on temp files
const cleanupTool = { execute: (args) => fs.rm(args.tempDir) };
```
