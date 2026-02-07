---
title: Use semantic HTML for content structure
impact: MEDIUM-HIGH
tags: html, semantics, accessibility
---

## Use semantic HTML for content structure

Use the correct HTML element for the content type: headings for sections, lists for groups, tables for tabular data, `<code>` for inline code. Generic `<div>` and `<span>` elements carry no meaning for screen readers or search engines.

**Incorrect (divs used for structure):**

```html
<div class="heading">Prerequisites</div>
<div class="list-item">Node.js 18+</div>
<div class="list-item">PostgreSQL 15+</div>
```

**Correct (semantic elements match content type):**

```html
<h2>Prerequisites</h2>
<ul>
  <li>Node.js 18+</li>
  <li>PostgreSQL 15+</li>
</ul>
```

Reference: [MDN — Semantics](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
