---
title: Match Stress and Skeleton When Pairing
impact: MEDIUM
tags: stress, skeleton, pairing, genre, structure
---

## Match Stress and Skeleton When Pairing

A typeface's stress angle (where the thickest part of curved strokes falls) and its skeleton (calligraphic vs constructed) predict compatibility. Pair within a group; crossing groups creates subtle but persistent visual tension.

| Group | Stress and skeleton | Serifs | Sans |
|-------|---------------------|--------|------|
| Calligraphic | Diagonal, moderate contrast | Old-style: Garamond, Caslon, Jenson | Humanist: Gill Sans, Frutiger, Myriad, Optima |
| Rational | Vertical, high contrast | Modern/Didone: Bodoni, Didot | Geometric: Futura, Avenir, Century Gothic |
| Static | Vertical, low contrast | Transitional: Baskerville, Times, Georgia. Slab: Rockwell, Clarendon, Sentinel | Grotesque: Franklin Gothic, News Gothic, Trade Gothic. Neo-grotesque: Helvetica, Univers, Akzidenz-Grotesk |

**Incorrect (crossed groups):**

```css
h1 { font-family: 'Futura', sans-serif; }    /* rational, vertical stress */
body { font-family: 'Garamond', serif; }      /* calligraphic, diagonal stress */

h1 { font-family: 'Helvetica Neue', sans-serif; } /* static, constructed */
body { font-family: 'Adobe Caslon', serif; }      /* calligraphic, diagonal */
```

**Correct (paired within a group):**

```css
/* Calligraphic */
h1 { font-family: 'Frutiger', sans-serif; }
body { font-family: 'Adobe Caslon', serif; }

/* Rational */
h1 { font-family: 'Avenir', sans-serif; }
body { font-family: 'Didot', serif; }

/* Static: neo-grotesque over slab */
h1 { font-family: 'Helvetica Neue', sans-serif; }
body { font-family: 'Sentinel', serif; }
```

Inside the static group, grotesques suit transitional serifs and neo-grotesques suit slabs. Body-text caveat by genre: geometric and neo-grotesque sans are weak at small sizes, so verify extended reading before setting body in either, while humanist sans and slabs carry body well. For screens, a neo-humanist sans over a contemporary serif (Calibri over Charter) is the most reliable all-around pair. "Grotesque", "grotesk", and "gothic" name the same genre. Treat these groupings as guidance, not law: know them before breaking them.
