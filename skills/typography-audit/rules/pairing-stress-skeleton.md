---
title: Match Stress Angles When Pairing
impact: MEDIUM
tags: stress, skeleton, pairing, structure, angles
---

## Match Stress Angles When Pairing

A typeface's stress angle (where the thickest part of curved strokes falls) predicts compatibility: vertical pairs with vertical, diagonal with diagonal. Mixing angles creates subtle but persistent visual tension.

**Stress angle guide:**

| Stress | Serif Examples | Sans Examples |
|--------|---------------|---------------|
| Vertical | Bodoni, Didot, Modern serifs | Futura, Avenir, Geometric sans |
| Diagonal | Garamond, Caslon, Old-style serifs | Gill Sans, Optima, Humanist sans |

**Incorrect (mismatched stress):**

```css
h1 { font-family: 'Futura', sans-serif; }     /* vertical/geometric */
body { font-family: 'Garamond', serif; }       /* diagonal/old-style */
/* Stress mismatch creates tension */
```

**Correct (matched stress):**

```css
/* Both diagonal/humanist stress */
h1 { font-family: 'Gill Sans', sans-serif; }
body { font-family: 'Garamond', serif; }

/* Both vertical/rational stress */
h1 { font-family: 'Futura', sans-serif; }
body { font-family: 'Bodoni', serif; }
```
