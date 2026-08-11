---
title: Set a Readable Type Scale
id: type-readable-scale
category: type
defaultTier: fix-this-sprint
detect: static
---

## Set a Readable Type Scale

Use body sizes and weights readable across desktop and mobile. Undersized or underweight body text slows scanning and tires readers.

**Incorrect (too small and too light):**

```css
body {
  font-size: 12px;
  font-weight: 300;
  line-height: 1.2;
}
```

**Correct (readable defaults):**

```css
body {
  font-size: clamp(0.95rem, 0.2vw + 0.9rem, 1.125rem);
  font-weight: 400;
  line-height: 1.45;
}
```
