---
title: Avoid Faux Bold, Italic, and Small Caps
impact: MEDIUM-HIGH
tags: faux-styles, font-synthesis, italic, bold, small-caps
---

## Avoid Faux Bold, Italic, and Small Caps

Browsers synthesize bold, italic, and small caps when real font files aren't loaded: faux italic mechanically slants the roman, faux bold adds blotchy weight, faux small caps shrink uppercase into thin unbalanced glyphs. Load real styles to prevent this. Confirm a true italic by its redesigned letterforms (a, e, f, g change shape).

**Incorrect (relying on browser synthesis):**

```css
@font-face {
  font-family: 'MyFont';
  src: url('MyFont-Regular.woff2') format('woff2');
  /* Only regular loaded: browser fakes everything else */
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

`font-synthesis: none` blocks faux generation and surfaces missing font files during development.
