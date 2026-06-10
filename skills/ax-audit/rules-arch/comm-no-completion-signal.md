---
title: Agent completion detected by heuristic instead of explicit signal
slug: comm-no-completion-signal
category: comm
defaultTier: release-blocker
surfaces: agent-tool-execution, agent-dashboard
agent-native-principle: Parity (agent-UI communication)
detection: code-auditable
related: comm-no-progress-visibility
---

## Agent completion detected by heuristic instead of explicit signal

Orchestrator detects "done" by counting idle iterations, checking output files, or waiting for a timeout. Agent pausing to think looks like completion; slow API calls trigger premature termination. Violates Parity: the UI must receive an explicit signal, not guess.

## What goes wrong

Agent researches a complex question. Makes 3 tool calls, then pauses 8 seconds composing a response. Orchestrator counts 2 idle iterations, hits `maxIdleIterations: 2`, terminates. User sees a truncated answer.

## Detection

**Surfaces:** agent-tool-execution, agent-dashboard

**Static signals:**
1. Find the orchestrator control loop that decides continue/stop.
2. Check for idle-counting, timeout-based completion, or file-existence as termination.
3. Flag any heuristic used as the primary completion signal.

**Concrete commands:**
```bash
rg '(consecutiveIdle|noToolCall|idleCount|maxIdle)' --type=ts src/
rg '(setTimeout|setInterval)' --type=ts -A 5 src/ | rg '(done|complete|finish|terminate)'
rg '(stop_reason|end_turn|shouldContinue)' --type=ts src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:comm-no-completion-signal`.
- Skip timeout logic alongside an explicit signal (both `stop_reason` AND `setTimeout`).
- Skip test files and fixtures.

## Fix

```tsx
// before: heuristic completion
let idle = 0;
while (idle < 3) {
  const res = await llm.chat(messages);
  if (!res.toolCalls.length) { idle++; continue; }
  idle = 0;
  await executeTools(res.toolCalls, messages);
}

// after: explicit signal via stop_reason or completion tool
while (true) {
  const res = await llm.chat(messages);
  if (res.stopReason === "end_turn") return { status: "complete", content: res.content };
  for (const tc of res.toolCalls) {
    if (tc.name === "task_complete") return { status: "complete", summary: tc.args.summary };
    messages.push({ role: "tool", content: await executeTool(tc) });
  }
}
```

## Default tier and overrides

**Defaults to:** `release-blocker`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent dashboard | release-blocker |
| Agent chat | fix-this-sprint |
| Agent config | backlog |

## Examples

**Anti-pattern (fails):** `while (noToolCalls < 2)`: thinking pause triggers premature termination.

**Applied (passes):** `if (res.stopReason === "end_turn") return res.content`: explicit model signal.

## Suppression

```tsx
// ax-audit-ignore:comm-no-completion-signal, timeout is safety net, primary signal is stop_reason
const SAFETY_TIMEOUT = 120_000;
```
