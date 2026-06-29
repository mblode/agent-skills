---
title: Choose Body Fonts for Legibility
impact: CRITICAL
tags: body-text, x-height, apertures, counters, contrast
---

## Choose Body Fonts for Legibility

Select body fonts with low stroke contrast, large x-height, open apertures, and large counters; these maximize readability at small sizes. Prefer text-cut faces. Avoid overly large x-heights, which flatten the distinction between ascenders and descenders.

Humanist and modern sans-serifs work well if they meet these traits; geometric sans-serifs are generally weaker for body.

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

Qualities to evaluate:
- **Low stroke contrast**: even thickness across strokes
- **Large x-height**: tall lowercase relative to capitals
- **Open apertures**: wide openings in c, e, s
- **Large counters**: spacious enclosed areas in o, d, b
