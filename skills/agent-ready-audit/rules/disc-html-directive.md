---
title: HTML link element for llms.txt
impact: MEDIUM
tags: discovery, html, llms-txt
---

## HTML link element for llms.txt

HTML pages should include a `<link>` element in `<head>` pointing to llms.txt. This provides an in-document discovery mechanism for agents that parse HTML but don't inspect HTTP headers.

**Failing:**

```html
<head>
  <title>Example</title>
  <!-- no llms.txt link -->
</head>
```

**Passing:**

```html
<head>
  <title>Example</title>
  <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM site index" />
</head>
```
