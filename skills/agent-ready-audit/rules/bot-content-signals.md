---
title: AI content usage signals
impact: MEDIUM
tags: bot-policy, robots-txt, content-signals
---

## AI content usage signals

Declare AI usage preferences in robots.txt or via structured headers. Only 4% of top 200K sites include these signals, but isitagentready.com checks for them.

**Failing:**

```
User-agent: *
Disallow: /admin/
# No AI usage preferences declared
```

**Passing:**

```
# AI Usage Preferences
# training: no — do not use content for model training
# search-grounding: yes — content may be used for search citations
# input-use: yes — content may be used when user provides URL
```

These are policy signals, not enforcement mechanisms. Layer with rate limiting and legal terms for real protection.
