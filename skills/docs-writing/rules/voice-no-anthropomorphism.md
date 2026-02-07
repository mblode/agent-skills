---
title: Don't give software human qualities
impact: CRITICAL
tags: voice, anthropomorphism, precision
---

## Don't give software human qualities

Software doesn't think, want, know, try, remember, or decide. Anthropomorphic language is imprecise and can mislead readers about what the system actually does. Use precise technical verbs instead: returns, sends, rejects, creates, deletes, validates, stores, triggers.

**Incorrect (anthropomorphic language):**

```markdown
The server thinks the request is invalid and tries to recover
gracefully. The scheduler knows when to run the next job and wants
to keep the queue balanced. The load balancer prefers healthy nodes
and remembers which ones failed recently.
```

**Correct (precise technical verbs):**

```markdown
The server rejects the request and returns a 400 error with a
validation message. The scheduler checks the cron expression to
determine the next run time and distributes jobs across the queue.
The load balancer routes traffic to healthy nodes and skips nodes
that failed a health check in the last 60 seconds.
```

Reference: [Google developer documentation style guide — Anthropomorphism](https://developers.google.com/style/anthropomorphism)
