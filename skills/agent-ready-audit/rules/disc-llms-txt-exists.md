---
title: llms.txt exists
impact: CRITICAL
tags: discovery, llms-txt
---

## llms.txt exists

`/llms.txt` must be reachable at the site root. This is the primary entry point for AI agents and developer tools (Cursor, Claude Code) to discover site content. Over 844K sites have adopted the standard.

**Failing:**

```
GET /llms.txt → 404 Not Found
```

**Passing:**

```
GET /llms.txt → 200 OK
Content-Type: text/markdown

# Example Site

> A brief description of Example Site and what it offers.

## Docs
- [Getting Started](https://example.com/docs/start): Quick start guide
- [API Reference](https://example.com/docs/api): Full API documentation
```
