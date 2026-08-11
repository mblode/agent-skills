---
title: Set Image Dimensions and Priority Intentionally
impact: CRITICAL
impactDescription: prevents layout shift and improves LCP
tags: performance, images, cls, lcp
---

## Set Image Dimensions and Priority Intentionally

Declare `width`/`height` (or aspect ratio) and prioritize only above-the-fold hero images.

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
