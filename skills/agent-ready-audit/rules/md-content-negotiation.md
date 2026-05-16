---
title: Markdown content negotiation
impact: CRITICAL
tags: markdown, content-negotiation, headers
---

## Markdown content negotiation

When an agent sends `Accept: text/markdown`, the server should return clean markdown instead of HTML. This reduces token consumption by ~80% (Cloudflare measurement). Only 3.9% of top 200K sites support this.

**Failing:**

```
GET /docs/api HTTP/1.1
Accept: text/markdown

HTTP/1.1 200 OK
Content-Type: text/html
<html><body>...</body></html>
```

**Passing:**

```
GET /docs/api HTTP/1.1
Accept: text/markdown

HTTP/1.1 200 OK
Content-Type: text/markdown
Vary: Accept
X-Robots-Tag: noindex, nofollow

# API Reference
...
```

The `Vary: Accept` header is required to prevent CDN cache poisoning. `X-Robots-Tag: noindex` prevents search engines from indexing the markdown variant.
