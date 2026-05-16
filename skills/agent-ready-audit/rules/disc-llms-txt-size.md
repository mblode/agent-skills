---
title: llms.txt under size limit
impact: HIGH
tags: discovery, llms-txt, size
---

## llms.txt under size limit

llms.txt must stay under 50K characters to avoid truncation by agent tools. 50-100K triggers a warning; over 100K is a hard fail (Claude Code's limit is ~100KB).

**Failing:**

```
GET /llms.txt → 200 OK
Content-Length: 156000  (156K chars — will be truncated)
```

**Passing:**

```
GET /llms.txt → 200 OK
Content-Length: 12400  (12K chars — well within limits)
```

Link to detailed content in llms-full.txt instead of inlining everything.
