---
title: llms.txt follows spec
impact: CRITICAL
tags: discovery, llms-txt, format
---

## llms.txt follows spec

The file must follow the llmstxt.org structure: H1 heading (required), optional blockquote summary, optional body paragraphs, and H2 sections containing URL lists in `- [Title](URL): Description` format. An `## Optional` section signals content that can be skipped for shorter context.

**Failing:**

```markdown
Welcome to our docs!
Here are some links:
https://example.com/docs/api
https://example.com/docs/start
```

**Passing:**

```markdown
# Example Site

> Developer platform for building real-time applications.

## Docs
- [Getting Started](https://example.com/docs/start): Quick start guide
- [API Reference](https://example.com/docs/api): Full API documentation

## Optional
- [Changelog](https://example.com/changelog): Release history
```
