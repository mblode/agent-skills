---
title: Poll State Deltas, Not Full Workflows
impact: HIGH
impactDescription: avoids spending agent context and work when monitored state has not changed
tags: cli, agents, polling, tokens, structured-output
---

## Poll State Deltas, Not Full Workflows

An agent monitoring a long-running operation needs a compact snapshot with a stable fingerprint.
Polling should compare that fingerprint and resume the expensive workflow only when state changes.
Do not reinject the original brief, full object graph, or complete instruction set on every timer
tick; unchanged polling context compounds across the entire run.

**Incorrect (every tick restarts the full workflow context):**

```ts
setInterval(() => runAgent(`${originalBrief}\nCheck whether job ${id} changed.`), 60_000);
```

**Correct (poll a compact snapshot and wake only on a delta):**

```ts
const snapshot = await getJobSnapshot(id); // { id, state, stateHash, blocker }
if (snapshot.stateHash !== previousStateHash) {
  await resumeAgent({ id, snapshot });
  previousStateHash = snapshot.stateHash;
}
```
