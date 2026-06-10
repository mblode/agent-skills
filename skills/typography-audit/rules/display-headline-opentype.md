---
title: Enable Extra OpenType Features for Headlines
impact: LOW-MEDIUM
tags: opentype, headlines, dlig, swsh, display
---

## Enable Extra OpenType Features for Headlines

Headlines benefit from OpenType features that would be distracting in body text. Enable discretionary ligatures (`dlig`) and swashes (`swsh`) on display sizes in addition to the standard body features (`kern`, `liga`, `clig`, `calt`).

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

Enable swashes on specific letters if the font supports indexed swash variants:

```css
.headline .decorative-letter {
  font-feature-settings: "swsh" 2; /* second swash variant */
}
```

Only enable features the font actually supports; unsupported feature tags are silently ignored but add unnecessary CSS weight. Never apply `dlig`/`swsh` to body text; they hurt sustained reading.
