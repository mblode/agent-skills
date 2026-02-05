---
title: Distinguish Links Without Layout Shift
impact: MEDIUM
impactDescription: improves discoverability and stability
tags: typography, links, interaction
---

## Distinguish Links Without Layout Shift

Links should remain visually distinct, but hover states must not change text metrics.

**Incorrect (hover changes weight and shifts layout):**

```css
a {
  text-decoration: none;
}
a:hover {
  font-weight: 700;
}
```

**Correct (stable hover treatment):**

```css
a {
  text-decoration: underline;
  text-underline-offset: 0.12em;
}
a:hover {
  color: var(--link-hover);
}
```
