---
title: Enable Extra OpenType Features for Headlines
impact: LOW-MEDIUM
tags: opentype, headlines, dlig, swsh, display
---

## Enable Extra OpenType Features for Headlines

Headlines benefit from OpenType features that distract in body text. On display sizes, add discretionary ligatures (`dlig`) and swashes (`swsh`) to the standard body set (`kern`, `liga`, `clig`, `calt`).

**Incorrect (display face stuck on the body feature set):**

```css
body, h1, h2 {
  font-feature-settings: "kern", "liga", "clig", "calt";
  /* Headlines never show the dlig/swsh glyphs the display font ships */
}
```

**Correct (extended feature set on headlines only):**

```css
body {
  font-feature-settings: "kern", "liga", "clig", "calt";
}

h1, h2 {
  font-feature-settings: "kern", "liga", "clig", "calt", "dlig", "swsh";
}
```

Enable swashes on specific letters when the font indexes swash variants:

```css
.headline .decorative-letter {
  font-feature-settings: "swsh" 2; /* second swash variant */
}
```

Only enable features the font supports: unsupported tags are silently ignored but add CSS weight. Never apply `dlig`/`swsh` to body text; they hurt sustained reading.
