---
title: Place Subheadings Closer to Following Content
impact: HIGH
tags: subheadings, proximity, whitespace, visual-grouping
---

## Place Subheadings Closer to Following Content

A subheading should have more space above it (separating from previous content) than below it (connecting to the content it introduces). This proximity principle groups the heading with its section. Use extra spacing above large subheaders.

**Incorrect (equal spacing, heading floats between sections):**

```css
h2 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
```

**Correct (more space above, less below):**

```css
h2 {
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
}

h3 {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}
```

The larger the heading, the more top margin it needs to establish visual separation from the preceding section.
