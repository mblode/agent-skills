---
title: Document errors with codes, meanings, and fixes
impact: HIGH
tags: errors, troubleshooting, status-codes
---

## Document errors with codes, meanings, and fixes

Don't just list error codes. Show the error message, explain what caused it, and tell the reader how to fix it. Developers reach for error docs when stuck -- help them get unstuck.

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

Reference: [Microsoft REST API Guidelines — Error handling](https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md)
