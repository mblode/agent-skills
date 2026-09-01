---
title: Document errors with codes, meanings, and fixes
impact: HIGH
tags: errors, troubleshooting, status-codes
---

## Document errors with codes, meanings, and fixes

Readers reach for error docs when stuck, so a bare code-to-label table sends them away with nothing to do. For each error, show the message as the reader sees it, state the cause, and give the fix, with a link to where the fix happens. Google's error-message guidance names the two questions to answer: what went wrong, and how does the reader fix it.

**Incorrect (error code with no actionable guidance):**

```markdown
| Code | Description |
|------|-------------|
| 403  | Forbidden   |
| 429  | Rate limited |
```

**Correct (each error includes cause and fix):**

```markdown
### 403 Forbidden

Your API key doesn't have permission for this endpoint. Check
that your key has the `billing:read` scope in the
[API dashboard](https://dashboard.acme.com/keys).

### 429 Too Many Requests

You exceeded 100 requests per minute. Add exponential backoff
to your retry logic or request a rate limit increase in the
[API dashboard](https://dashboard.acme.com/limits).
```

Reference: [Google Technical Writing: Error messages](https://developers.google.com/tech-writing/error-messages), [Stripe: Error codes](https://docs.stripe.com/error-codes)
