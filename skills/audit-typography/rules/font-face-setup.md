---
title: Correct @font-face Declarations
impact: CRITICAL
tags: font-face, css, web-fonts, font-loading
---

## Correct @font-face Declarations

Each `@font-face` declaration must map to the same `font-family` name with distinct `font-weight` and `font-style` values. This lets the browser automatically select the correct font file when CSS applies `font-weight: bold` or `font-style: italic`.

**Incorrect (separate family names per weight):**

```css
@font-face {
  font-family: 'MyFont-Regular';
  src: url('/fonts/MyFont-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'MyFont-Bold';
  src: url('/fonts/MyFont-Bold.woff2') format('woff2');
}

h1 { font-family: 'MyFont-Bold'; }  /* manual switching */
p { font-family: 'MyFont-Regular'; }
```

**Correct (single family, weight/style differentiated):**

```css
@font-face {
  font-family: 'MyFont';
  font-weight: 400;
  font-style: normal;
  src: url('/fonts/MyFont-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'MyFont';
  font-weight: 700;
  font-style: normal;
  src: url('/fonts/MyFont-Bold.woff2') format('woff2');
}

body { font-family: 'MyFont', sans-serif; }
h1 { font-weight: 700; }  /* browser selects correct file */
p { font-weight: 400; }
```
