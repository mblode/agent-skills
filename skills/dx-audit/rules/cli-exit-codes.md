---
title: Exit 0 on Success, Non-Zero on Failure
impact: HIGH
impactDescription: makes the tool composable in scripts, CI gates, and agent loops that branch only on the code
tags: cli, exit-codes, scripting, agents
---

## Exit 0 on Success, Non-Zero on Failure

Every script, Makefile, CI step, and agent loop branches on the exit code, often on nothing else. Exit 0 only on real success and non-zero on any failure; printing an error and exiting 0 passes a gate it should have failed. Where callers need to distinguish failure kinds, give each its own documented code (2 for usage errors is the long-standing convention) and keep the codes stable across releases. Set `process.exitCode` and return rather than calling `process.exit()`: stdout writes are asynchronous when piped, and `exit()` can cut off the very message that explains the failure.

**Incorrect (prints an error but exits 0; CI thinks it passed):**

```ts
if (errors.length) {
  console.error(`${errors.length} checks failed`);
}
process.exit(0); // always 0, even on failure
```

**Correct (exit code reflects the outcome, and pending output flushes):**

```ts
if (errors.length) {
  console.error(`${errors.length} checks failed`);
  process.exitCode = 1; // non-zero so &&, set -e, and CI all catch it
  return;
}
console.log("All checks passed");
```
