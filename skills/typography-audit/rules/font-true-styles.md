---
title: Load Real Italic and Bold Styles
impact: CRITICAL
tags: font-face, italic, bold, faux-styles, font-loading
---

## Load Real Italic and Bold Styles

Load actual regular, italic, bold, and bold-italic files so the browser never synthesizes faux styles. Faux italics are mechanically slanted, lacking true italics' redesigned letterforms. Faux bold adds artificial, blotchy weight.

Prefer true italics (redesigned letterforms) over obliques (slanted roman). Use WOFF2; consider variable fonts to cut file count.

**Incorrect (single font file, browser synthesizes styles):**

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/MyFont-Regular.woff2') format('woff2');
}

/* Browser will synthesize italic and bold */
em { font-style: italic; }
strong { font-weight: bold; }
```

**Correct (all four styles loaded explicitly):**

```css
@font-face {
  font-family: 'MyFont';
  font-weight: 400;
  font-style: normal;
  src: url('/fonts/MyFont-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'MyFont';
  font-weight: 400;
  font-style: italic;
  src: url('/fonts/MyFont-Italic.woff2') format('woff2');
}
@font-face {
  font-family: 'MyFont';
  font-weight: 700;
  font-style: normal;
  src: url('/fonts/MyFont-Bold.woff2') format('woff2');
}
@font-face {
  font-family: 'MyFont';
  font-weight: 700;
  font-style: italic;
  src: url('/fonts/MyFont-BoldItalic.woff2') format('woff2');
}
```

If bandwidth is constrained, drop the least-used style (usually bold italic) rather than relying on faux rendering.
