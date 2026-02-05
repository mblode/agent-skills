---
title: Choose Body Fonts for Legibility
impact: CRITICAL
tags: body-text, x-height, apertures, counters, contrast
---

## Choose Body Fonts for Legibility

Select body text fonts with low stroke contrast, large x-height, open apertures, and large counters. These traits maximize readability at small sizes. Prefer text-cut faces designed for body use. Avoid overly large x-heights, which reduce the distinctiveness of ascenders and descenders.

Humanist and modern sans-serifs work well if they meet these legibility traits. Geometric sans-serifs are generally weaker for body text.

**Incorrect (display face used for body):**

```css
body {
  font-family: 'Playfair Display', serif; /* high contrast, display face */
  font-size: 16px;
}
```

**Correct (text-optimized face for body):**

```css
body {
  font-family: 'Source Serif Pro', serif; /* low contrast, large x-height */
  font-size: 18px;
}
```

Look for these qualities when evaluating a body typeface:
- **Low stroke contrast** \u2014 even thickness between thick and thin strokes
- **Large x-height** \u2014 lowercase letters are tall relative to capitals
- **Open apertures** \u2014 openings in letters like c, e, s are wide
- **Large counters** \u2014 enclosed spaces in letters like o, d, b are spacious
