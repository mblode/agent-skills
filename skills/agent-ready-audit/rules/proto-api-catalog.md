---
title: API Catalog
impact: MEDIUM
tags: protocols, api, rfc-9727
---

## API Catalog

Publish an API catalog at `/.well-known/api-catalog` following RFC 9727. This lets agents discover available APIs and their documentation formats (OpenAPI, GraphQL, etc.).

**Failing:**

```
GET /.well-known/api-catalog → 404 Not Found
```

**Passing:**

```json
{
  "apis": [
    {
      "name": "Example API",
      "description": "REST API for managing widgets",
      "url": "https://api.example.com",
      "documentation": "https://example.com/docs/api",
      "specification": "https://example.com/openapi.json",
      "specificationFormat": "application/vnd.oai.openapi+json;version=3.1"
    }
  ]
}
```
