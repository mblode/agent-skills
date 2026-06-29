---
title: Never Distort Type
impact: MEDIUM
tags: distortion, stretch, squish, transform, condensed
---

## Never Distort Type

Never stretch, squish, or skew type via CSS transforms or width hacks; distortion destroys the letterforms' designed proportions. Need narrower or wider? Use a condensed or extended variant.

Exception: intentional distortion in a logo as an explicit design choice.

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
