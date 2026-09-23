---
title: Ensure Strong Size Contrast Between Levels
impact: MEDIUM-HIGH
tags: size-contrast, hierarchy, headings, near-equal
---

## Ensure Strong Size Contrast Between Levels

When two elements have different roles, make their sizes clearly different. Near-equal sizes (e.g., 16px and 18px) read as ambiguous: the reader cannot tell which ranks higher. Sizes should be either identical (same role) or noticeably different (different levels).

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

Use at least a 20 to 25% size jump between adjacent levels. If size alone cannot differentiate, add weight, color, or caps.
