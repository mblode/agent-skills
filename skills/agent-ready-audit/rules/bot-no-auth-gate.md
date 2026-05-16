---
title: Public content accessible without auth
impact: HIGH
tags: bot-policy, authentication
---

## Public content accessible without auth

Public content must be accessible to AI crawlers without authentication. Auth walls block all AI indexing. If authentication is required, provide an alternative access path: public llms.txt, an MCP server, or a CLI docs endpoint.

**Failing:**

```
GET /docs/api HTTP/1.1

HTTP/1.1 302 Found
Location: /login?redirect=/docs/api
```

**Passing:**

```
GET /docs/api HTTP/1.1

HTTP/1.1 200 OK
Content-Type: text/html
(public content served directly)
```

If some content must be gated, ensure llms.txt and the sitemap are still publicly accessible so agents know the content exists.
