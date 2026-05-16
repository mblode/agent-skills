---
title: llms-full.txt exists
impact: HIGH
tags: discovery, llms-txt
---

## llms-full.txt exists

`/llms-full.txt` provides the complete documentation content in a single markdown file. Where llms.txt is a lightweight index, llms-full.txt delivers everything at once for tools that want full context. Early data shows llms-full.txt gets accessed more often than llms.txt when both exist.

**Failing:**

```
GET /llms-full.txt → 404 Not Found
```

**Passing:**

```
GET /llms-full.txt → 200 OK
Content-Type: text/markdown

# Example Site — Full Documentation

> Complete documentation for Example Site.

## Getting Started
[Full content of getting started page...]

## API Reference
[Full content of API reference page...]
```
