---
title: Distinguish Links Without Layout Shift
id: type-link-distinction-no-shift
category: type
defaultTier: backlog
detect: rendered
---

## Distinguish Links Without Layout Shift

Keep links visually distinct, but hover must not change text metrics.

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
