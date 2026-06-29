---
title: Exit 0 on Success, Non-Zero on Failure
impact: HIGH
impactDescription: makes the tool composable in scripts and CI gates
tags: cli, exit-codes, scripting
---

## Exit 0 on Success, Non-Zero on Failure

Every script, Makefile, and CI step branches on the exit code. Exit 0 only on real success, non-zero on any failure. Exiting 0 after printing an error passes a CI gate it should have failed.

**Incorrect (prints an error but exits 0; CI thinks it passed):**

```ts
if (errors.length) {
  console.error(`${errors.length} checks failed`);
}
process.exit(0); // always 0, even on failure
```

**Correct (exit code reflects the outcome):**

```ts
if (errors.length) {
  console.error(`${errors.length} checks failed`);
  process.exitCode = 1; // non-zero so `&&`, set -e, and CI all catch it
  return;
}
console.log("All checks passed");
```
