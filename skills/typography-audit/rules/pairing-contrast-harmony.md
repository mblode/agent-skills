---
title: Pair by Contrast or Harmony, Not Similarity
impact: MEDIUM
tags: pairing, contrast, harmony, similarity
---

## Pair by Contrast or Harmony, Not Similarity

Typefaces should either harmonize (share underlying structural qualities) or contrast strongly (differ in a clear, intentional way). Avoid pairs that are "almost the same" \u2014 similar but not matching faces create visual tension without purpose.

Judge harmony by comparing the handwritten vs constructed feel of the letterforms. Compare stress angles and skeletal structures.

**Incorrect (almost the same, neither matching nor contrasting):**

```css
h1 { font-family: 'Helvetica', sans-serif; }
body { font-family: 'Univers', sans-serif; }
/* Both neo-grotesque, nearly identical \u2014 no contrast, no harmony */
```

**Correct (harmonious pair \u2014 shared calligraphic roots):**

```css
h1 { font-family: 'Palatino', serif; }
body { font-family: 'Optima', sans-serif; }
/* Both have calligraphic influence and humanist proportions */
```

**Correct (contrasting pair \u2014 clear structural difference):**

```css
h1 { font-family: 'Futura', sans-serif; }  /* geometric */
body { font-family: 'Baskerville', serif; } /* transitional */
/* Strong serif vs sans contrast with different geometries */
```

Match stress direction to find harmony: vertical-stress fonts pair with other vertical-stress fonts; diagonal-stress fonts pair with other diagonal-stress fonts.
