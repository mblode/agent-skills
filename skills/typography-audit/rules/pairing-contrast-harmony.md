---
title: Pair by Contrast or Harmony, Not Similarity
impact: MEDIUM
tags: pairing, contrast, harmony, similarity
---

## Pair by Contrast or Harmony, Not Similarity

Typefaces should either harmonize (share structural qualities) or contrast strongly (differ clearly and intentionally). Avoid almost-the-same pairs: similar but not matching faces create tension without purpose.

Judge harmony by comparing handwritten vs constructed feel, stress angles, and skeletal structures.

**Incorrect (almost the same, neither matching nor contrasting):**

```css
h1 { font-family: 'Helvetica', sans-serif; }
body { font-family: 'Univers', sans-serif; }
/* Both neo-grotesque, nearly identical: no contrast, no harmony */
```

**Correct (harmonious pair: shared calligraphic roots):**

```css
h1 { font-family: 'Palatino', serif; }
body { font-family: 'Optima', sans-serif; }
/* Both have calligraphic influence and humanist proportions */
```

**Correct (contrasting pair: clear structural difference):**

```css
h1 { font-family: 'Futura', sans-serif; }  /* geometric */
body { font-family: 'Baskerville', serif; } /* transitional */
/* Strong serif vs sans contrast with different geometries */
```

Match stress direction: pair vertical-stress with vertical-stress, diagonal with diagonal.
