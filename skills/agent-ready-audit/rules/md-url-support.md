---
title: .md URL support
impact: HIGH
tags: markdown, urls
---

## .md URL support

Appending `.md` to any page URL should return the markdown version of that page. This provides a simple, discoverable pattern for agents to request markdown content.

**Failing:**

```
GET /docs/api.md → 404 Not Found
```

**Passing:**

```
GET /docs/api.md → 200 OK
Content-Type: text/markdown

# API Reference
...
```

Caveat: this convention conflicts with user-generated URL spaces where slugs can end in `.md` (e.g., `linktr.ee/juliarose.md`). For those sites, use content negotiation via Accept header instead.
