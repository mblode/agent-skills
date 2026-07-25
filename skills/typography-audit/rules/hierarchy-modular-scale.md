---
title: Use a Modular Scale as a Guide, Not a Constraint
impact: MEDIUM
tags: modular-scale, type-scale, sizing, hierarchy
---

## Use a Modular Scale as a Guide, Not a Constraint

A modular scale (e.g., 1.25, 1.333, 1.5 ratios) gives a starting set of harmonious sizes, but it's a guide, not a rule. If a size feels optically wrong for the typeface, break the scale: typefaces have sweet spots where they look best; use those sizes even when they fall outside the scale.

**Incorrect (rigid adherence to scale despite optical issues):**

```css
/* Scale: 1.25 ratio */
:root {
  --text-sm: 12.8px;  /* scale says 12.8, but 13px reads better */
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 25px;    /* scale says 25, but 24px pairs better */
}
```

**Correct (scale as starting point, optical adjustments):**

```css
:root {
  --text-sm: 13px;    /* rounded for readability */
  --text-base: 18px;  /* typeface sweet spot */
  --text-lg: 20px;
  --text-xl: 24px;    /* optically balanced with body */
  --text-2xl: 32px;
  --text-3xl: 48px;
}
```

Store the resolved sizes as tokens rather than computing the ratio in CSS. The whole point of the rule is that some steps deviate from the ratio, and a `calc()` chain cannot hold a deviation.
