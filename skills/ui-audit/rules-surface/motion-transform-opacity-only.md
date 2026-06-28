---
title: Animate Transform and Opacity, Not Layout
impact: HIGH
impactDescription: reduces jank and improves smoothness
tags: motion, performance, animation
---

## Animate Transform and Opacity, Not Layout

Avoid animating properties that trigger layout/reflow.

**Incorrect (layout-thrashing animation):**

```css
.panel {
  transition: width 220ms ease, left 220ms ease;
}
```

**Correct (compositor-friendly animation):**

```css
.panel {
  transition: transform 220ms ease, opacity 220ms ease;
}
```
