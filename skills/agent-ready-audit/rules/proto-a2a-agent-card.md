---
title: A2A Agent Card
impact: MEDIUM
tags: protocols, a2a, google
---

## A2A Agent Card

If the site exposes an agent (not just content), publish an A2A (Agent-to-Agent) Agent Card at `/.well-known/agent-card.json`. This follows Google's A2A protocol for agent interoperability.

**Failing:**

```
GET /.well-known/agent-card.json → 404 Not Found
```

**Passing:**

```json
{
  "name": "Example Agent",
  "description": "Helps users manage their widgets",
  "url": "https://agent.example.com",
  "capabilities": ["search", "create", "update"],
  "authentication": {
    "type": "oauth2",
    "authorizationUrl": "https://auth.example.com/authorize"
  }
}
```

Only applicable if the site exposes agent capabilities — skip for content-only sites.
