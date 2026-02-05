---
title: Use Condensed Faces for Headlines Only
impact: CRITICAL
tags: condensed, extended, width, headlines, body-text
---

## Use Condensed Faces for Headlines Only

Condensed and extra-condensed typefaces are designed for headlines and tight spaces where you need to control line breaks. Never use condensed faces for body copy \u2014 the narrow letterforms reduce readability at small sizes.

Extended variants are rarely needed but can be used for stylistic effect at large sizes. When swapping between normal and condensed widths, re-tune all spacing values.

**Incorrect (condensed face for body):**

```css
body {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 16px;
}
```

**Correct (condensed for headlines, normal for body):**

```css
body {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
}

h1 {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 48px;
  letter-spacing: -0.01em;
}
```

Condensed faces can also work for tight UI labels (navigation, badges, tags) where space is limited.

When switching fonts on a project, if the new font is metrically compatible with the old one, the swap is easier. Always re-tune size, line-height, letter-spacing, and padding after a font change.
