---
title: Link to existing docs instead of re-explaining
impact: MEDIUM-HIGH
tags: dry, linking, maintenance
---

## Link to existing docs instead of re-explaining

If a concept is already explained in another document, link to it. Don't re-explain it. Duplicate explanations drift apart over time -- one gets updated while the other goes stale, and readers can't tell which is authoritative.

**Incorrect (re-explains webhook setup in every guide):**

```markdown
## Send notifications

To configure webhooks, create a JSON payload with the event type,
target URL, and authentication header. Set the retry policy to
exponential backoff with a maximum of 5 attempts...
```

**Correct (links to the canonical explanation):**

```markdown
## Send notifications

Configure a webhook to receive event callbacks. For setup
details, see [Configure webhooks](../reference/webhooks.md).
```

Reference: [Diataxis — Reference documentation](https://diataxis.fr/reference/)
