---
title: Carry a Stable Code and Structured Fields, Not Just a Message
impact: CRITICAL
impactDescription: lets callers branch on errors without string-matching messages
tags: errors, codes, api-stability, structured
---

## Carry a Stable Code and Structured Fields, Not Just a Message

Callers handle specific failures programmatically. If the only discriminator is the message string, every consumer breaks the moment you reword it. Attach a stable `code` and a distinct error type, and put request-specific facts the caller needs (the offending parameter, a retry delay, a docs URL) in named fields rather than only interpolated into the message. Once those fields exist the message text can improve freely; Stripe's `type`/`code`/`param`/`doc_url` and Google's `ErrorInfo.reason`/`metadata` are the same split.

**Incorrect (forces brittle message string-matching):**

```ts
throw new Error("rate limit exceeded, retry after 2000ms");
// caller: if (err.message.includes("rate limit")) wait(parseInt(err.message.match(/\d+/)![0]));
```

**Correct (typed error with a stable code and structured fields):**

```ts
class RateLimitError extends Error {
  readonly code = "ERR_RATE_LIMIT";
  constructor(public readonly retryAfterMs: number, public readonly docUrl = "https://mytool.dev/errors#rate-limit") {
    super(`Rate limit exceeded. Retry after ${retryAfterMs}ms.`);
  }
}
// caller: if (err.code === "ERR_RATE_LIMIT") wait(err.retryAfterMs);
```
