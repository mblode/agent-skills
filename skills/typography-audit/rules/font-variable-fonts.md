---
title: Prefer WOFF2 and Variable Fonts
impact: CRITICAL
tags: woff2, variable-fonts, font-format, performance
---

## Prefer WOFF2 and Variable Fonts

Use WOFF2 as the primary web font format \u2014 it offers the best compression (30-50% smaller than WOFF). Variable fonts bundle multiple weights and styles into a single file, reducing HTTP requests and total file size.

**Incorrect (legacy formats, multiple files):**

```css
@font-face {
  font-family: 'MyFont';
  font-weight: 400;
  src: url('/fonts/MyFont-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'MyFont';
  font-weight: 700;
  src: url('/fonts/MyFont-Bold.ttf') format('truetype');
}
```

**Correct (WOFF2 with variable font):**

```css
@font-face {
  font-family: 'MyFont';
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  src: url('/fonts/MyFont-Variable.woff2') format('woff2-variations');
}

body { font-weight: 400; }
h1 { font-weight: 700; }
.light { font-weight: 300; }
```

Use `font-display: swap` to prevent invisible text during loading.
