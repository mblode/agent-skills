---
title: Animate Transform and Opacity, Not Layout
id: motion-transform-opacity-only
category: motion
defaultTier: fix-this-sprint
detect: static
---

## Animate Transform and Opacity, Not Layout

Avoid animating properties that trigger layout/reflow. Layout-property animation forces reflow on every frame, which reads as jank.

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
