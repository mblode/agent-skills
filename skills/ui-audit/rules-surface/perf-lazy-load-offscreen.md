---
title: Lazy-Load Offscreen Media, Never the LCP Element
impact: HIGH
impactDescription: cuts initial payload without delaying the largest paint
tags: performance, images, lazy-loading, lcp
---

## Lazy-Load Offscreen Media, Never the LCP Element

Add `loading="lazy"` to offscreen images and iframes so they defer until the user scrolls near them. Never lazy-load the LCP/above-the-fold hero; that delays the largest paint. Pair lazy with `eager`/`priority` on the hero.

**Incorrect (hero lazy-loaded, offscreen image eager):**

```tsx
<img src="/hero.jpg" alt="..." loading="lazy" />
<img src="/footer-logo.png" alt="..." />
```

**Correct (hero eager, offscreen deferred):**

```tsx
<img src="/hero.jpg" alt="..." fetchPriority="high" />
<img src="/footer-logo.png" alt="..." loading="lazy" />
<iframe src="/map" loading="lazy" title="Location map" />
```
