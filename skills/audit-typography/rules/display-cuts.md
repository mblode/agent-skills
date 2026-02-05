---
title: Use Display Cuts Only at Large Sizes
impact: LOW-MEDIUM
tags: display, text, optical-size, headlines
---

## Use Display Cuts Only at Large Sizes

Display cuts (Display, Banner, Headline, Poster, Titling) have finer details, higher contrast, and tighter spacing optimized for large sizes. They become illegible at body text sizes. Conversely, text cuts look clunky at large sizes.

Enable discretionary ligatures and swashes for display sizes, not for body text.

**Incorrect (display cut at body size):**

```css
body {
  font-family: 'Garamond Display', serif;
  font-size: 16px; /* too small for display cut */
}
```

**Correct (display cut for headlines, text cut for body):**

```css
body {
  font-family: 'Garamond Text', serif;
  font-size: 18px;
}

h1 {
  font-family: 'Garamond Display', serif;
  font-size: 48px;
  font-feature-settings: "kern", "liga", "dlig", "calt";
}
```

With variable fonts that have an `opsz` axis, this happens automatically via `font-optical-sizing: auto`.
