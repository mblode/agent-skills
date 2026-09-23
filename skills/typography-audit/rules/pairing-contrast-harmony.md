---
title: Pair by Contrast or Harmony, Never Similarity
impact: MEDIUM
tags: pairing, contrast, harmony, similarity, same-genre
---

## Pair by Contrast or Harmony, Never Similarity

Typefaces should either harmonize (share structural qualities) or contrast strongly (differ clearly and intentionally). Almost-the-same pairs create tension without purpose, and two faces from one category are the usual cause: two neo-grotesques, or two serifs, read as an accident rather than a decision because the reader cannot tell the roles apart. Serif plus sans is the safe default, since it carries structural contrast for free.

Judge harmony by comparing handwritten vs constructed feel, stress angles, and skeletal structures.

**Incorrect (same category, neither matching nor contrasting):**

```css
h1 { font-family: 'Helvetica', sans-serif; }
body { font-family: 'Arial', sans-serif; }
/* Both neo-grotesque, nearly identical: no contrast, no harmony */

h1 { font-family: 'Bodoni', serif; }      /* modern serif, vertical stress */
body { font-family: 'Garamond', serif; }   /* old-style serif, diagonal stress */
/* Two serifs whose structural philosophies clash */
```

**Correct (harmonious, shared calligraphic roots):**

```css
h1 { font-family: 'Palatino', serif; }
body { font-family: 'Optima', sans-serif; }
/* Both have calligraphic influence and humanist proportions */
```

**Correct (contrasting, clear structural difference):**

```css
h1 { font-family: 'Futura', sans-serif; }   /* geometric */
body { font-family: 'Baskerville', serif; }  /* transitional */
```

Two faces from one category work only when their genres are distinctly different and their roles are distinct: a geometric sans over a humanist sans, a slab serif over an old-style body, or two cuts of one family (Freight Display over Freight Text). Never mix modern with old-style serifs. Faces by the same designer also tend to pair well, since designers reuse consistent principles.
