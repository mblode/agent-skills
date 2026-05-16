# MCP Server Discovery Setup

## Contents

- MCP server card (SEP-2127)
- OAuth protected resource metadata (RFC 9728)
- Agent Skills index (Cloudflare RFC)
- API Catalog (RFC 9727)
- A2A Agent Card
- CORS configuration
- Testing

## MCP Server Card (SEP-2127)

The frontrunner standard. Publish at both paths until the spec consolidates:
- `/.well-known/mcp.json` (SEP-2127 — primary)
- `/.well-known/mcp/server-card.json` (SEP-1649 — legacy)

### Required fields

```json
{
  "$schema": "https://modelcontextprotocol.io/schemas/server-card.json",
  "version": "1.0",
  "protocolVersion": "2025-06-18",
  "serverInfo": {
    "name": "your-server-name",
    "version": "1.0.0"
  },
  "transport": {
    "type": "streamable-http",
    "endpoint": "https://mcp.example.com/mcp"
  },
  "capabilities": {
    "tools": "dynamic"
  }
}
```

### Optional fields

```json
{
  "description": "Human-readable description of what the server does",
  "iconUrl": "https://example.com/icon.png",
  "documentationUrl": "https://example.com/docs/mcp",
  "authentication": {
    "required": true,
    "schemes": ["oauth2"]
  },
  "instructions": "Natural language instructions for agents using this server",
  "tools": "dynamic",
  "resources": "dynamic",
  "prompts": "dynamic",
  "requires": {
    "sampling": true
  }
}
```

Tools, resources, and prompts accept `"dynamic"` (discovered at runtime) or a static array describing available items.

### Next.js static file approach

Place the JSON file at `public/.well-known/mcp.json`. For the legacy path, use a rewrite:

```ts
// next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/.well-known/mcp/server-card.json',
        destination: '/.well-known/mcp.json',
      },
    ];
  },
};
```

## OAuth Protected Resource Metadata (RFC 9728)

Required for any MCP server with authentication. Already mandatory in the MCP spec.

### Discovery flow

1. Client sends unauthenticated request to MCP endpoint
2. Server returns `401 Unauthorized` with:
   ```
   WWW-Authenticate: Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource/mcp"
   ```
3. Client fetches the metadata URL
4. Client discovers auth server via `/.well-known/oauth-authorization-server`

### Protected resource metadata document

```json
{
  "resource": "https://mcp.example.com/mcp",
  "authorization_servers": ["https://auth.example.com"],
  "scopes_supported": ["read", "write", "admin"],
  "bearer_methods_supported": ["header"]
}
```

### OAuth authorization server metadata

At `https://auth.example.com/.well-known/oauth-authorization-server`:

```json
{
  "issuer": "https://auth.example.com",
  "authorization_endpoint": "https://auth.example.com/authorize",
  "token_endpoint": "https://auth.example.com/token",
  "scopes_supported": ["read", "write", "admin"],
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code"],
  "code_challenge_methods_supported": ["S256"]
}
```

## Agent Skills Index (Cloudflare RFC v0.2.0)

Publish at `/.well-known/agent-skills/index.json`:

```json
{
  "skills": [
    {
      "name": "example-api",
      "description": "Interact with the Example API — create, read, update, and delete widgets",
      "type": "skill-md",
      "url": "https://example.com/.well-known/agent-skills/example-api.md",
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  ]
}
```

Each skill can be type `"skill-md"` (markdown) or `"archive"` (bundled). The skill markdown files follow the Agent Skills open format.

## API Catalog (RFC 9727)

Publish at `/.well-known/api-catalog`:

```json
{
  "apis": [
    {
      "name": "Widgets API",
      "description": "REST API for managing widgets",
      "url": "https://api.example.com/v1",
      "documentation": "https://example.com/docs/api",
      "specification": "https://api.example.com/openapi.json",
      "specificationFormat": "application/vnd.oai.openapi+json;version=3.1"
    }
  ]
}
```

## A2A Agent Card

Only needed if the site exposes an interactive agent. Publish at `/.well-known/agent-card.json`:

```json
{
  "name": "Example Assistant",
  "description": "Helps users manage their widgets and integrations",
  "url": "https://agent.example.com",
  "version": "1.0.0",
  "capabilities": ["search", "create", "update", "delete"],
  "authentication": {
    "type": "oauth2",
    "authorizationUrl": "https://auth.example.com/authorize"
  },
  "skills": [
    {
      "id": "widget-management",
      "description": "Create and manage widgets"
    }
  ]
}
```

## CORS Configuration

All `.well-known` endpoints must serve permissive CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Testing

```bash
# MCP server card
curl -s https://example.com/.well-known/mcp.json | jq .
curl -s https://example.com/.well-known/mcp/server-card.json | jq .

# OAuth discovery
curl -I https://mcp.example.com/mcp  # Should return 401 with WWW-Authenticate
curl -s https://mcp.example.com/.well-known/oauth-protected-resource/mcp | jq .

# Agent Skills
curl -s https://example.com/.well-known/agent-skills/index.json | jq .

# API Catalog
curl -s https://example.com/.well-known/api-catalog | jq .

# CORS headers
curl -I -H "Origin: https://other.com" https://example.com/.well-known/mcp.json | grep -i "access-control"
```
