---
title: Stay Responsive and Show Progress
impact: HIGH
impactDescription: keeps a working command from looking hung
tags: cli, progress, responsiveness, timeouts
---

## Stay Responsive and Show Progress

A command that prints nothing for seconds looks broken, so print something within about 100ms, show a progress indicator (gated on a TTY, see `cli-pipes-tty-and-json`) for any operation that can run long, and give network calls a configurable timeout with a sane default so the tool fails instead of hanging forever.

**Incorrect (silent during a long network call, no timeout):**

```ts
const res = await fetch(url); // no output for 30s, and no timeout: a stall hangs forever
const data = await res.json();
console.log(JSON.stringify(data));
```

**Correct (announce the work, bound it, report to stderr):**

```ts
console.error(`Fetching ${url}...`); // something within 100ms, on stderr
const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs ?? 30_000) });
const data = await res.json();
console.log(JSON.stringify(data));
```
