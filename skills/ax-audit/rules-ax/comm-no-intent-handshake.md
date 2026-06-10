---
title: Agent acts on non-trivial request without confirming intent
slug: comm-no-intent-handshake
category: comm
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-tool-execution
ax-pattern: Intent Handshake
detection: hybrid
related: control-no-escape-hatch, control-no-approval-gate
---

## Agent acts on non-trivial request without confirming intent

User says "reorganize my files." Agent immediately starts moving files. User meant "suggest a new folder structure" not "execute a restructure right now." Intent Handshake requires agents to play back their interpretation before executing. The gap between intent and interpretation is invisible until the damage is done.

## What goes wrong

User asks "clean up my project." Agent deletes unused files, renames directories, and updates imports, all in one shot. User wanted a report. No playback, no scoping choices, no "here's what I'll do" before action. Destructive and ambiguous requests get instant-execute treatment.

## Detection

**Surfaces:** agent-chat, agent-tool-execution

**Auditability:** hybrid

**Static signals:**
1. Find agent action triggers for non-trivial operations (multi-step, destructive, ambiguous).
2. Check for a confirmation/playback step between request and execution.
3. Flag direct execution of complex requests with no preview.

**Concrete commands:**
```bash
rg '(executeTool|runAction|performAction|handleToolCall)' --type=ts -l src/
rg '(delete|remove|move|rename|reorganize|migrate|deploy|publish)' --type=ts src/tools/ src/actions/
rg '(confirm|approval|preview|playback|requireApproval)' --type=ts src/
rg '(autoExecute|skipConfirm|auto_approve)' --type=ts src/
```

**Judgment signals:**
- Trivial, unambiguous requests ("what time is it?") don't need a handshake.
- Targets multi-step, destructive, ambiguous, or high-stakes requests.

**False-positive guards:**
- Skip files with `// ax-audit-ignore:comm-no-intent-handshake`.
- Skip test and Storybook fixtures.
- Skip read-only operations (queries, lookups, status checks).

## Fix

Before executing non-trivial actions, play back understanding: "I'll reorganize your files by moving X to Y. Proceed?" Options: text playback, structured plan preview, or scoping choices.

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | fix-this-sprint |

## Examples

**Anti-pattern (fails):**

```tsx
async function onToolCall(tool: string, args: Record<string, unknown>) {
  const result = await tools[tool].execute(args); // no confirmation, even for destructive ops
  return { role: "tool", content: result };
}
```

**Applied (passes):**

```tsx
async function onToolCall(tool: string, args: Record<string, unknown>) {
  const meta = tools[tool].metadata;
  if (meta.destructive || meta.multiStep)
    return { type: "pending_approval", message: `I'll ${meta.describe(args)}. Proceed?`,
      onApprove: () => tools[tool].execute(args) };
  return tools[tool].execute(args);
}
```

## Suppression

```tsx
{/* ax-audit-ignore:comm-no-intent-handshake, read-only lookup, no side effects */}
<QuickSearchAgent />
```
