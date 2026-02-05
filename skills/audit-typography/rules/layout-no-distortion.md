---
title: Never Distort Type
impact: MEDIUM
tags: distortion, stretch, squish, transform, condensed
---

## Never Distort Type

Never stretch, squish, or skew type using CSS transforms or width adjustments. Distortion destroys the carefully designed proportions of letterforms. If you need a narrower or wider typeface, use a condensed or extended variant.

The only exception is intentional distortion for logos as an explicit design choice.

**Incorrect (CSS distortion):**

```css
h1 {
  font-family: 'Inter', sans-serif;
  transform: scaleX(0.8); /* squished horizontally */
}

.wide-text {
  transform: scaleX(1.3); /* stretched */
}
```

**Correct (use proper width variants):**

```css
h1 {
  font-family: 'Inter Tight', sans-serif; /* condensed variant */
}

/* Or with a variable font width axis */
h1 {
  font-family: 'Inter VF', sans-serif;
  font-stretch: 85%; /* proper condensed rendering */
}
```
