---
title: Respect prefers-reduced-motion
id: motion-respect-reduced-motion
category: motion
defaultTier: fix-this-sprint
detect: static
---

## Respect prefers-reduced-motion

Large unreduced movement can trigger vestibular distress, migraines, and seizures, so gate non-essential animation, parallax, and autoplay behind `prefers-reduced-motion`. Users who request reduced motion get an instant or cross-fade instead of large movement. Keep essential motion (e.g. a loading spinner); tone down decorative effects.

## Detection

List the files that move something (keyframes, `animation`, translate/scale/rotate, framer-motion elements), then keep only those with no reduced-motion guard anywhere in them.

```bash
rg -lP '@keyframes|\banimation:|translate[XYZ]?\(|\bscale\(|\brotate\(|<motion\.' -g '*.css' -g '*.tsx' src/ \
| xargs -r rg --files-without-match -P 'prefers-reduced-motion|useReducedMotion'
```

Essential motion matches too: a spinner has to keep spinning under reduced motion, so a loader stylesheet is a false positive. So is a codebase whose guard lives in one global reset (`@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important } }`); check for that block before reporting per-file misses.

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
