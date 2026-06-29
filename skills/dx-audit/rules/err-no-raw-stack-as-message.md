---
title: Never Surface a Raw Stack as the Primary Message
impact: CRITICAL
impactDescription: keeps the actionable summary readable instead of buried in noise
tags: errors, messages, stack-traces
---

## Never Surface a Raw Stack as the Primary Message

A wall of stack frames or a leaked internal exception (`TypeError: undefined is not a function`) tells the developer nothing about their mistake. Catch low-level failures, wrap them in a domain error with a human summary, and keep the original as `cause`.

**Incorrect (raw internal error reaches the user as the headline):**

```ts
const data = JSON.parse(raw); // throws SyntaxError: Unexpected token < in JSON
// user sees the bare SyntaxError and a stack, with no context
```

**Correct (domain summary first, original preserved as cause):**

```ts
try {
  return JSON.parse(raw);
} catch (cause) {
  throw new Error(
    `Failed to parse response from ${url} as JSON. ` +
      `The server may have returned an HTML error page.`,
    { cause },
  );
}
```
