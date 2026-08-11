---
title: Animate Transform and Opacity, Not Layout
id: motion-transform-opacity-only
category: motion
defaultTier: fix-this-sprint
detect: static
---

## Animate Transform and Opacity, Not Layout

Avoid animating properties that trigger layout/reflow. Layout-property animation forces reflow on every frame, which reads as jank.

## Detection

Find transitions whose property list names a box-model property, which is what forces reflow per frame.

```bash
rg -nP 'transition(-property)?:[^;]*(?<![-\w])(width|height|top|left|right|bottom|margin|padding)\b' -g '*.css' -g '*.tsx' src/
```

The lookbehind keeps `border-width` and `outline-width` out, but `transition: all` (and Tailwind's `transition-all`) animates layout properties without naming one, so it never matches. Search for those separately, and confirm which property actually changes before reporting.

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
