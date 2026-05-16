---
title: Semantic HTML elements
impact: MEDIUM
tags: content-quality, html, accessibility
---

## Semantic HTML elements

Use `<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>` instead of generic `<div>` wrappers. Agentic browsers (ChatGPT browsing, Perplexity Comet) read the accessibility tree, not the visual DOM — semantic HTML produces a cleaner tree.

**Failing:**

```html
<div class="content">
  <div class="header">
    <div class="title">API Reference</div>
  </div>
  <div class="body">
    <div class="section">...</div>
  </div>
</div>
```

**Passing:**

```html
<article>
  <header>
    <h1>API Reference</h1>
  </header>
  <section>
    <h2>Authentication</h2>
    <p>...</p>
  </section>
</article>
```
