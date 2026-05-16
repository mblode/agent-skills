---
title: MCP server card
impact: HIGH
tags: protocols, mcp, discovery
---

## MCP server card

Publish a server card at `/.well-known/mcp.json` (SEP-2127) so agents can discover MCP capabilities before connecting. Also serve at `/.well-known/mcp/server-card.json` (SEP-1649) until the spec consolidates. Must be HTTPS with permissive CORS.

**Failing:**

```
GET /.well-known/mcp.json → 404 Not Found
```

**Passing:**

```json
{
  "$schema": "https://modelcontextprotocol.io/schemas/server-card.json",
  "version": "1.0",
  "protocolVersion": "2025-06-18",
  "serverInfo": {
    "name": "example-mcp",
    "version": "1.0.0"
  },
  "transport": {
    "type": "streamable-http",
    "endpoint": "https://mcp.example.com/mcp"
  },
  "capabilities": {
    "tools": "dynamic"
  },
  "description": "Example MCP server for managing widgets",
  "documentationUrl": "https://example.com/docs/mcp"
}
```
