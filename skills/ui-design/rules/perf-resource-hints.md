---
title: Preload Critical Resources and Preconnect to Origins
impact: HIGH
impactDescription: shaves request-chain latency off the largest paint
tags: performance, resource-hints, preload, preconnect, fonts
---

## Preload Critical Resources and Preconnect to Origins

Preload the LCP image and critical web font so the browser fetches them early; `preconnect` to third-party origins you will request from. Don't over-hint: preloading everything cancels the benefit and wastes bandwidth.

**Incorrect (no hints; hero font and image discovered late):**

```html
<head><link rel="stylesheet" href="/app.css" /></head>
```

**Correct (targeted hints for above-the-fold assets):**

```html
<head>
  <link rel="preconnect" href="https://cdn.example.com" crossorigin />
  <link rel="preload" as="image" href="/hero.avif" fetchpriority="high" />
  <link rel="preload" as="font" type="font/woff2" href="/inter.woff2" crossorigin />
</head>
```

`crossorigin` on a font preload is mandatory even for a same-origin file. CSS `@font-face` always fetches in CORS anonymous mode, so a preload without it lands in a different mode, gets discarded, and is re-fetched when the stylesheet references the font: double download, preload defeated.
