---
title: Enable Extra OpenType Features for Headlines
impact: LOW-MEDIUM
tags: opentype, headlines, dlig, swsh, display
---

## Enable Extra OpenType Features for Headlines

Headlines benefit from OpenType features that would be distracting in body text. Enable discretionary ligatures (`dlig`), swashes (`swsh`), and contextual alternates (`calt`) in addition to the standard body features.

**Body features (always on):**

```css
body {
  font-feature-settings: "kern", "liga", "clig", "calt";
}
```

**Headline features (extended set):**

```css
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

Only enable features the font actually supports. Unsupported feature tags are silently ignored but add unnecessary CSS weight.
