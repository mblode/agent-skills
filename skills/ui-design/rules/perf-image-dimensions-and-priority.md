---
title: Set Image Dimensions and Priority Intentionally
id: perf-image-dimensions-and-priority
category: perf
defaultTier: release-blocker
detect: static
---

## Set Image Dimensions and Priority Intentionally

Declare `width`/`height` (or aspect ratio) and prioritize only above-the-fold hero images. Undeclared dimensions shift the page as images arrive, and an unprioritized hero delays the largest paint.

**Incorrect (layout shift risk):**

```tsx
<img src="/hero.jpg" alt="Product screenshot" />
```

**Correct (stable image rendering):**

```tsx
<Image
  src="/hero.jpg"
  alt="Product screenshot"
  width={1600}
  height={900}
  priority
/>
```
