---
title: Carry a Stable, Documentable Error Code
impact: CRITICAL
impactDescription: lets callers branch on errors without string-matching messages
tags: errors, codes, api-stability
---

## Carry a Stable, Documentable Error Code

Callers handle specific failures programmatically. If the only discriminator is the message string, every consumer breaks the moment you reword it. Attach a stable `code` and a distinct error type so handling survives message changes.

**Incorrect (forces brittle message string-matching):**

```ts
throw new Error("rate limit exceeded, retry later");
// caller: if (err.message.includes("rate limit")) ...  breaks on reword
```

**Correct (typed error with a stable code):**

```ts
class RateLimitError extends Error {
  code = "ERR_RATE_LIMIT" as const;
  constructor(public retryAfterMs: number) {
    super(`Rate limit exceeded. Retry after ${retryAfterMs}ms.`);
  }
}
// caller: if (err.code === "ERR_RATE_LIMIT") wait(err.retryAfterMs);
```
