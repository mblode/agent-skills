---
title: Vary header on negotiated responses
impact: HIGH
tags: markdown, headers, caching
---

## Vary header on negotiated responses

Any response that varies by Accept header must include `Vary: Accept`. Without it, CDNs cache one format (HTML or markdown) and serve it to all clients — a cache poisoning bug.

**Failing:**

```http
HTTP/1.1 200 OK
Content-Type: text/markdown
Cache-Control: public, max-age=3600
(no Vary header)
```

**Passing:**

```http
HTTP/1.1 200 OK
Content-Type: text/markdown
Cache-Control: public, max-age=3600
Vary: Accept
```
