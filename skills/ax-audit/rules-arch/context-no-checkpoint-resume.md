---
title: Long-running agent with no checkpoint/resume
slug: context-no-checkpoint-resume
category: context
defaultTier: backlog
surfaces: agent-tool-execution, agent-dashboard
agent-native-principle: Improvement Over Time
detection: hybrid
related: comm-no-completion-signal
---

## Long-running agent with no checkpoint/resume

Agent runs a multi-step task with no durability. Browser closes, network drops, session times out, all progress lost. User starts from scratch. Violates Improvement Over Time: completed work should survive interruption.

## What goes wrong

User asks the agent to refactor 15 files. Agent completes 12 over 4 minutes. Laptop sleeps. On reconnect the session is gone, with no record of what was done. Agent redoes all 15, possibly making different choices.

## Detection

**Surfaces:** agent-tool-execution, agent-dashboard

**Static signals:**
1. Find execution loops or multi-step task handlers.
2. Check whether they persist state between iterations.
3. Check whether resume/recovery logic exists.
4. Flag multi-step agents with no checkpoint writes.

**Runtime signals:** Agent runs >60s with no state persistence. Reconnect restarts from scratch.

**Concrete commands:**
```bash
rg '(for\s*\(|while\s*\(|for await)' --type=ts -A 5 src/ | rg -B 1 '(toolCall|executeStep|runTool)'
rg '(checkpoint|saveState|persistSession|saveProgress)' --type=ts src/
rg '(resume|recover|restoreSession|loadCheckpoint)' --type=ts src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:context-no-checkpoint-resume`.
- Skip single-step agents (no loop, single tool call).
- Skip agents reliably under 10 seconds.
- Skip test files and fixtures.

## Fix

```tsx
// before
async function refactorFiles(files: string[]) {
  for (const file of files) await agent.refactor(file);
}

// after: checkpoint after each step, resume on reconnect
async function refactorFiles(sessionId: string, files: string[]) {
  const cp = await loadCheckpoint(sessionId);
  const done = new Set(cp?.completed ?? []);
  for (const file of files) {
    if (done.has(file)) continue;
    await agent.refactor(file);
    done.add(file);
    await saveCheckpoint(sessionId, { completed: [...done], updatedAt: Date.now() });
  }
}
```

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Agent tool execution | fix-this-sprint |
| Agent chat | backlog |
| Agent config | backlog |
| Agent dashboard | backlog |

## Examples

**Anti-pattern (fails):** `for (const t of tasks) await agent.execute(t)` -- tab closes at task 8, all lost.

**Applied (passes):** Loop resumes from `loadCheckpoint(id)` index, calls `saveCheckpoint` after each step.

## Suppression

```tsx
// ax-audit-ignore:context-no-checkpoint-resume, sub-second operation
await agent.formatSingleFile(filePath);
```
