---
title: Use semantic HTML for content structure
impact: MEDIUM-HIGH
tags: html, semantics, accessibility
---

## Use semantic HTML for content structure

Use the correct element for each content type: headings for sections, lists for groups, tables for tabular data, `<code>` for inline code. In Markdown and MDX, that means the Markdown syntax, not raw HTML: `<b>` and `<br>` carry no structure for screen readers, and a hand-rolled `<ul>` or `<h2>` skips the docs site's own renderer, so it gets no heading anchor, no table-of-contents entry, and no copy button.

**Incorrect (raw HTML in an MDX file where Markdown carries the semantics):**

```markdown
<b>Prerequisites</b><br>
<ul>
  <li>Node.js 18+</li>
  <li>PostgreSQL 15+</li>
</ul>
```

**Correct (Markdown syntax; reach for HTML only where Markdown has no equivalent):**

```markdown
## Prerequisites

- Node.js 18+
- PostgreSQL 15+
```

Reference: [MDN: Semantics](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
