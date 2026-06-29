---
title: Fail Fast with Actionable Validation
impact: CRITICAL
impactDescription: surfaces the mistake at the call site, not three async hops later
tags: errors, validation, fail-fast
---

## Fail Fast with Actionable Validation

Validate inputs at the boundary and throw immediately with a precise message. Deferred validation lets a bad value travel deep, then explode somewhere unrelated where the stack no longer points at the real cause. Check at the door; name what failed.

**Incorrect (bad input slips through, fails later somewhere else):**

```ts
function connect(opts: { url: string }) {
  this.url = opts.url; // empty string accepted
  // ... 200ms later, a socket layer throws "ECONNREFUSED" with no context
}
```

**Correct (validate at the boundary, throw with the field and value):**

```ts
function connect(opts: { url: string }) {
  if (!opts.url || !/^wss?:\/\//.test(opts.url)) {
    throw new TypeError(
      `connect() requires a ws:// or wss:// url, received ${JSON.stringify(opts.url)}`,
    );
  }
  this.url = opts.url;
}
```
