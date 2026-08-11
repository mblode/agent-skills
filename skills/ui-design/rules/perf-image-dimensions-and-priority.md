---
title: Set Image Dimensions and Priority Intentionally
id: perf-image-dimensions-and-priority
category: perf
defaultTier: release-blocker
detect: static
---

## Set Image Dimensions and Priority Intentionally

Declare `width`/`height` (or aspect ratio) and prioritize only above-the-fold hero images. Undeclared dimensions shift the page as images arrive, and an unprioritized hero delays the largest paint.

## Detection

Search for `<img>` tags with no `width` attribute, which is the layout-shift half of this rule.

```bash
rg -nUP '<img\b(?![^>]*\bwidth=)[^>]*>' -g '*.tsx' -g '*.jsx' src/
```

An image whose box is already reserved in CSS (`aspect-video`, `aspect-[16/9]`, a fixed `h-` plus `w-`, or `<Image fill>` in a sized parent) matches but does not shift. The priority half is not greppable on its own: identify the first-viewport image, then confirm it carries `priority` or `fetchPriority="high"`.

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
