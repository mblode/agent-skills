---
title: Use Condensed Faces for Headlines Only
impact: CRITICAL
tags: condensed, extended, width, headlines, body-text
---

## Use Condensed Faces for Headlines Only

Use condensed and extra-condensed faces for headlines and tight spaces where you control line breaks. Never for body copy: narrow letterforms cut readability at small sizes. Extended variants are rarely needed but work for stylistic effect at large sizes. Re-tune all spacing when swapping widths.

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

Condensed faces also suit tight UI labels (navigation, badges, tags). When switching project fonts, a metrically compatible replacement swaps in more easily, but always re-tune size, line-height, letter-spacing, and padding after any change.
