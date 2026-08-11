---
title: Lazy-Load Offscreen Media, Never the LCP Element
id: perf-lazy-load-offscreen
category: perf
defaultTier: fix-this-sprint
detect: static
---

## Lazy-Load Offscreen Media, Never the LCP Element

Add `loading="lazy"` to offscreen images and iframes so they defer until the user scrolls near. Never lazy-load the LCP/above-the-fold hero; that delays the largest paint. Pair with `eager`/`priority` on the hero.

## Detection

Search for lazy-loaded images whose tag also names a first-viewport role or a priority hint, the combination that delays the largest paint.

```bash
rg -nUP '<(?:img|Image)\b(?=[^>]*loading="lazy")(?=[^>]*(?i:hero|banner|cover|masthead|priority))[^>]*>' -g '*.tsx' -g '*.jsx' src/
```

A "hero" or "cover" inside a below-the-fold component (a card cover in a feed, a banner in a footer CTA) is correctly lazy, so confirm the element renders in the first viewport before reporting. The mirror defect, an offscreen image with no `loading` attribute, needs that same position evidence rather than a grep.

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
