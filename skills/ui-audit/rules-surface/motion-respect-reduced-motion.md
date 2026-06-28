---
title: Respect prefers-reduced-motion
impact: HIGH
impactDescription: prevents vestibular distress, migraines, and seizures
tags: motion, accessibility, animation, reduced-motion
---

## Respect prefers-reduced-motion

Gate non-essential animation, parallax, and autoplay behind `prefers-reduced-motion`. Users who set "reduce motion" should get an instant or cross-fade transition instead of large movement. Keep essential motion (e.g. a loading spinner) but tone down decorative effects.

**Incorrect (animation always runs):**

```css
.card {
  transition: transform 400ms ease;
}
.card:hover { transform: translateY(-12px) scale(1.05); }
```

**Correct (motion reduced on request):**

```css
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
  .card:hover { transform: none; }
}
```
