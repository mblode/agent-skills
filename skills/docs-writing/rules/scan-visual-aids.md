---
title: Replace text with diagrams and tables when possible
impact: MEDIUM
tags: diagrams, tables, visuals
---

## Replace text with diagrams and tables when possible

A diagram of a 3-step flow communicates faster than 3 paragraphs describing it. Use diagrams for architecture and flows, tables for comparisons and option lists, and screenshots for UI procedures.

**Incorrect (prose describing a flow that a diagram would show faster):**

```markdown
The client sends a request to the API gateway. The gateway
validates the authentication token and forwards the request to
the backend service. The backend service queries the database,
processes the result, and returns a response through the gateway
back to the client.
```

**Correct (diagram with brief context):**

```markdown
Client → API Gateway → Backend Service → Database

The gateway validates authentication before forwarding requests.
```

Reference: [Nielsen Norman Group — Text vs. diagrams](https://www.nngroup.com/articles/text-vs-diagrams/)
