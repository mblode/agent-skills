---
title: Avoid Faux Bold, Italic, and Small Caps
impact: MEDIUM-HIGH
tags: faux-styles, font-synthesis, italic, bold, small-caps
---

## Avoid Faux Bold, Italic, and Small Caps

Browsers synthesize bold, italic, and small caps when the actual font files are not loaded. Faux italic mechanically slants the roman design. Faux bold adds artificial weight that looks blotchy. Faux small caps shrink uppercase, resulting in thin, unbalanced glyphs.

Load real font styles to prevent this. Identify true italics by checking if letterforms are redesigned (a, e, f, g typically change shape in true italic).

**Incorrect (relying on browser synthesis):**

```css
@font-face {
  font-family: 'MyFont';
  src: url('MyFont-Regular.woff2') format('woff2');
  /* Only regular loaded \u2014 browser fakes everything else */
}
```

**Correct (prevent synthesis, load real styles):**

```css
/* Load all needed styles */
@font-face {
  font-family: 'MyFont';
  font-weight: 400;
  font-style: normal;
  src: url('MyFont-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'MyFont';
  font-weight: 400;
  font-style: italic;
  src: url('MyFont-Italic.woff2') format('woff2');
}

/* Prevent synthesis as a safety net */
body {
  font-synthesis: none;
}
```

`font-synthesis: none` prevents the browser from generating faux styles, which helps catch missing font files during development.
