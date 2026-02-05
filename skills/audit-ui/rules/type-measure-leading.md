---
title: Keep Line Length and Leading in Range
impact: HIGH
impactDescription: reduces fatigue and rereading
tags: typography, line-length, line-height
---

## Keep Line Length and Leading in Range

Target roughly 45-75 characters per line with line-height around 1.45-1.6.

**Incorrect (long measure, cramped leading):**

```css
.article {
  max-width: none;
  line-height: 1.2;
}
```

**Correct (controlled measure):**

```css
.article {
  max-width: 65ch;
  line-height: 1.5;
}
```
