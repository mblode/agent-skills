---
title: Handle Long and Unbroken Content Safely
id: layout-long-content-safety
category: layout
defaultTier: fix-this-sprint
detect: static
---

## Handle Long and Unbroken Content Safely

Protect UI against long names, URLs, and dense content blocks. Unhandled, a single long token overflows its container and breaks the layout around it.

**Incorrect (overflow risk):**

```css
.card-title {
  white-space: nowrap;
}
```

**Correct (safe truncation/wrapping):**

```css
.card {
  min-width: 0;
}
.card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-body {
  overflow-wrap: anywhere;
}
```
