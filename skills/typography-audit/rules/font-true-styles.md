---
title: Load Real Italic and Bold Styles
impact: CRITICAL
tags: font-face, italic, bold, faux-styles, font-synthesis
---

## Load Real Italic and Bold Styles

Load actual regular, italic, bold, and bold-italic files so the browser never synthesizes styles. Faux italic mechanically slants the roman instead of using redesigned letterforms; faux bold smears artificial weight onto the outline; faux small caps shrink uppercase into thin, unbalanced glyphs. Confirm a real italic by its letterforms: a, e, f, and g change shape, they do not just lean.

Prefer true italics over obliques (slanted roman). Use WOFF2; consider variable fonts to cut file count.

**Incorrect (single font file, browser synthesizes styles):**

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/MyFont-Regular.woff2') format('woff2');
}

/* Browser fakes both */
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

`font-synthesis: none` surfaces missing style files, but do not ship it on `body`. It applies to fallback fonts too, so if the webfont fails to load, `<strong>` renders at regular weight and `<em>` renders upright: emphasis vanishes from the page. Keep it to a development build. Real small caps come from `font-variant-caps`, not from synthesis; see `opentype-small-caps`.
