---
title: Set Line Height for Comfortable Reading
impact: HIGH
tags: line-height, leading, readability, unitless
---

## Set Line Height for Comfortable Reading

Set line height to approximately 1.45\u20131.5 for body text. Always use unitless values to ensure proper inheritance. Adjust based on font size, line length, and x-height: sans-serif faces with large x-heights may need slightly more line height. Longer lines need more line height; shorter lines need less.

Avoid excessive leading (above 1.8) which disconnects lines visually.

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

Set line height before paragraph spacing. The two work together to establish vertical rhythm.
