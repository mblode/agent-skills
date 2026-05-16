---
title: Agent Skills discovery index
impact: MEDIUM
tags: protocols, agent-skills, cloudflare
---

## Agent Skills discovery index

Publish an Agent Skills index at `/.well-known/agent-skills/index.json` following the Cloudflare Agent Skills Discovery RFC (v0.2.0). Lists available agent skills with name, description, type, URL, and SHA-256 digest.

**Failing:**

```
GET /.well-known/agent-skills/index.json → 404 Not Found
```

**Passing:**

```json
{
  "skills": [
    {
      "name": "example-api-skill",
      "description": "Interact with the Example API",
      "type": "skill-md",
      "url": "https://example.com/.well-known/agent-skills/example-api-skill.md",
      "sha256": "abc123..."
    }
  ]
}
```

Adoption is near-zero outside Cloudflare properties — implement for future-proofing and isitagentready.com score.
