---
title: Preload Critical Fonts and Preconnect Asset Origins
impact: HIGH
impactDescription: reduces text flash and network setup latency
tags: performance, fonts, preload, preconnect
---

## Preload Critical Fonts and Preconnect Asset Origins

Preload the smallest set of critical fonts and preconnect to remote asset domains.

**Incorrect (late font fetch):**

```html
<link rel="stylesheet" href="https://fonts.example.com/site.css" />
```

The `crossorigin` attribute on the preload tag is mandatory. CSS `@font-face` fonts always use CORS anonymous mode, so a `<link rel="preload">` without `crossorigin` is preloaded in a different CORS mode, then discarded and re-fetched when CSS references it, doubling the download and defeating the preload.

**Correct (critical path optimized):**

```html
<link rel="preconnect" href="https://fonts.example.com" crossorigin />
<link rel="preload" as="font" href="/fonts/Inter-Variable.woff2" type="font/woff2" crossorigin />
```
