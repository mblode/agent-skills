---
title: Ensure Strong Size Contrast Between Levels
impact: MEDIUM-HIGH
tags: size-contrast, hierarchy, headings, near-equal
---

## Ensure Strong Size Contrast Between Levels

When two elements have different roles, make their sizes clearly different. Near-equal sizes (e.g., 16px and 18px) create ambiguity \u2014 the reader cannot tell which is more important. Sizes should either be identical (same role) or noticeably different (different hierarchy levels).

**Incorrect (ambiguous near-equal sizes):**

```css
h2 { font-size: 20px; }
h3 { font-size: 18px; }  /* barely different from h2 */
p  { font-size: 16px; }  /* barely different from h3 */
```

**Correct (clear size jumps between levels):**

```css
h2 { font-size: 28px; }
h3 { font-size: 20px; }  /* clearly smaller than h2 */
p  { font-size: 18px; }  /* clearly body text */
```

Use at least a 20\u201325% size increase between adjacent hierarchy levels. If you cannot achieve clear differentiation with size alone, use weight, color, or caps as additional differentiators.
