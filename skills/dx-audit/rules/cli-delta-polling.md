---
title: Expose Compact State Snapshots for Polling
impact: MEDIUM
impactDescription: keeps a monitoring loop from re-reading unchanged state every tick and spending the caller's context on it
tags: cli, agents, polling, status, structured-output
---

## Expose Compact State Snapshots for Polling

A script or agent watching a long-running operation calls `status` on a timer. When the only status output is the full object with logs, every tick costs as much as the first and the caller has to diff prose to learn whether anything moved. Give `status` a compact structured snapshot with a stable fingerprint (`stateHash`, `etag`, or `updatedAt`), and where the operation supports it a `wait` that returns only on change or timeout. Full detail stays behind `--verbose` or a `logs` command.

**Incorrect (every poll returns the whole object; change is invisible without a diff):**

```text
$ mytool job status 42
# 400 lines: full config, every log line so far, timestamps, identical to the previous tick
```

**Correct (compact snapshot with a fingerprint; wait blocks until the fingerprint changes):**

```text
$ mytool job status 42 --json
{"id":"42","state":"running","stateHash":"9f3a","blocker":null}
$ mytool job wait 42 --since 9f3a --timeout 300 --json
{"id":"42","state":"blocked","stateHash":"b71c","blocker":"approval"}
```
