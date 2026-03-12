---
title: Use Text and Display Optical Sizes Correctly
impact: CRITICAL
tags: optical-size, display, text, caption, font-selection
---

## Use Text and Display Optical Sizes Correctly

Many type families offer optical size variants: Text, Display, Headline, and Caption. Each is optimized for a specific size range. Display cuts have finer details, tighter spacing, and higher contrast suited for large sizes. Text cuts have more open spacing, larger x-height, and lower contrast for body readability.

Never use Display/Headline cuts for body copy. Never use Caption cuts for web body text (they are designed for very small print sizes).

**Incorrect (display cut used at body size):**

```css
body {
  font-family: 'Garamond Display', serif; /* designed for 24px+ */
  font-size: 16px; /* too small for display cut */
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
