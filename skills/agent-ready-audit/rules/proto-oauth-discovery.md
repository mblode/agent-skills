---
title: OAuth protected resource metadata
impact: HIGH
tags: protocols, oauth, mcp
---

## OAuth protected resource metadata

MCP servers with authentication MUST implement RFC 9728 (OAuth 2.0 Protected Resource Metadata) at `/.well-known/oauth-protected-resource`. This is already required by the MCP spec, not optional.

**Failing:**

MCP server requires auth but returns no discovery metadata — agents cannot determine how to authenticate.

**Passing:**

```
GET /.well-known/oauth-protected-resource/mcp HTTP/1.1

HTTP/1.1 200 OK
Content-Type: application/json

{
  "resource": "https://mcp.example.com/mcp",
  "authorization_servers": ["https://auth.example.com"],
  "scopes_supported": ["read", "write"],
  "bearer_methods_supported": ["header"]
}
```

The unauthenticated request to the MCP endpoint should return `401` with `WWW-Authenticate: Bearer resource_metadata="https://..."`.
