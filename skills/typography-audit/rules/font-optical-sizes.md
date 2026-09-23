---
title: Use Text and Display Optical Sizes Correctly
impact: MEDIUM-HIGH
tags: optical-size, display, text, caption, font-selection
---

## Use Text and Display Optical Sizes Correctly

Many families ship optical-size variants, named Text, Display, Banner, Headline, Poster, Titling, or Caption, each tuned to a size range. Display cuts have finer details, tighter spacing, and higher contrast for large sizes. Text cuts have more open spacing, a larger x-height, and lower contrast for body readability.

Never use a Display, Banner, Headline, Poster, or Titling cut for body copy: the fine details disappear and the tight spacing closes up. Never use a Caption cut for web body text; it is drawn for very small print sizes. The reverse also shows: a text cut at 72px looks clunky and loose.

**Incorrect (display cut used at body size):**

```css
body {
  font-family: 'Garamond Display', serif; /* designed for 24px+ */
  font-size: 16px; /* too small for a display cut */
}
```

**Correct (text cut for body, display cut for headings):**

```css
body {
  font-family: 'Garamond Text', serif; /* optimized for 12-18px */
  font-size: 18px;
}

h1 {
  font-family: 'Garamond Display', serif; /* optimized for 24px+ */
  font-size: 48px;
}
```

Variable fonts with an `opsz` axis handle this automatically:

```css
body {
  font-family: 'Garamond VF', serif;
  font-optical-sizing: auto; /* browser adjusts based on font-size */
}
```

A display cut also wants a richer OpenType feature set than body text; see `display-headline-opentype`. For swapping a display face out at small breakpoints, see `size-responsive`.
