---
title: Set Line Height for Comfortable Reading
impact: HIGH
tags: line-height, leading, readability, unitless
---

## Set Line Height for Comfortable Reading

Set body line height to about 1.45-1.5, always unitless so it inherits correctly. Adjust for font size, line length, and x-height: large-x-height sans faces may need slightly more. Longer lines need more leading, shorter lines less. Avoid excessive leading (above 1.8); it disconnects lines visually.

**Incorrect (too tight, units used):**

```css
body {
  font-size: 18px;
  line-height: 20px; /* fixed value, doesn't scale */
}

h1 {
  font-size: 48px;
  /* inherits 20px line-height, causing overlap */
}
```

**Correct (unitless, proportional):**

```css
body {
  font-size: 18px;
  line-height: 1.5; /* unitless, scales with font-size */
}

h1 {
  font-size: 48px;
  line-height: 1.15; /* tighter for large headings */
}

.caption {
  font-size: 14px;
  line-height: 1.4; /* slightly tighter for small text */
}
```

Set line height before paragraph spacing; together they establish vertical rhythm.
