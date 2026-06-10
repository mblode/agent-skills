---
title: No way to interrupt, redirect, or undo agent action
slug: control-no-escape-hatch
category: control
defaultTier: release-blocker
surfaces: agent-chat, agent-tool-execution
ax-pattern: Escape Hatch
detection: hybrid
related: control-no-approval-gate, trust-no-escalation-path, comm-no-intent-handshake
---

## No way to interrupt, redirect, or undo agent action

Agent starts a long response or multi-step workflow. User realizes it's wrong. No stop button, no undo, no "go back." User watches the agent do the wrong thing and can't intervene. Autonomy without exit is coercion.

## What goes wrong

User asks the agent to refactor a module. Agent begins a 12-step migration. After step 3, user sees it's the wrong approach. No stop button. Agent runs to completion, leaving the codebase in an unwanted state. Manual revert takes longer than doing it themselves.

## Detection

**Surfaces:** agent-chat, agent-tool-execution

**Auditability:** hybrid

**Static signals:**
1. Find agent execution UI (chat panels, action panels, tool execution views).
2. Check for cancel/stop during execution (`onCancel`, `AbortController`).
3. Check for undo/revert after completion. Flag flows with neither.

**Concrete commands:**
```bash
rg -l 'AbortController|onCancel|stopGenerat' --type=ts src/
rg -A 10 'isGenerating|isStreaming|isPending' --type=ts src/ | rg -v 'cancel|stop|abort'
```

**Judgment signals:**
- A cancel button not wired to `AbortController.abort()` is a false affordance, worse than nothing.

**False-positive guards:**
- Skip `// ax-audit-ignore:control-no-escape-hatch`, test, and Storybook files.

## Fix

During execution: stop button wired to `AbortController`. After completion: undo/revert for reversible actions. For irreversible actions, the approval gate (`control-no-approval-gate`) is the pre-execution escape hatch.

## Examples

**Anti-pattern (fails):**

```tsx
<div>
  {messages.map((m) => <Message key={m.id} {...m} />)}
  {isGenerating && <Spinner />}
  {/* no stop button, no undo */}
</div>
```

**Applied (passes):**

```tsx
<div>
  {messages.map((m) => <Message key={m.id} {...m} />)}
  {isGenerating && (
    <>
      <Spinner />
      <Button onClick={onStop} aria-label="Stop generating">Stop</Button>
    </>
  )}
  {!isGenerating && <Button onClick={onUndo} variant="ghost">Undo</Button>}
</div>
```

## Default tier and overrides

**Defaults to:** `release-blocker`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | release-blocker |
| Agent config | fix-this-sprint |
| Agent dashboard | fix-this-sprint |

## Suppression

```tsx
{/* ax-audit-ignore:control-no-escape-hatch, single status check, completes in <1s */}
<StatusCheckResult result={result} />
```
