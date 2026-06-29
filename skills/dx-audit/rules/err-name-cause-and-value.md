---
title: Name the Cause and the Offending Value
impact: CRITICAL
impactDescription: turns a guessing game into a one-line fix
tags: errors, messages, debugging
---

## Name the Cause and the Offending Value

An error must say what went wrong and which value caused it. "Invalid input" sends the developer hunting; "Expected a positive integer for `port`, received -1" points straight at the bug. Always interpolate the offending value and the field or parameter name.

**Incorrect (vague, no value, no field):**

```ts
throw new Error("Invalid input");
throw new Error("Something went wrong");
```

**Correct (names the field, the expectation, and the received value):**

```ts
throw new TypeError(
  `Expected a positive integer for "port", received ${JSON.stringify(port)}`,
);
```
