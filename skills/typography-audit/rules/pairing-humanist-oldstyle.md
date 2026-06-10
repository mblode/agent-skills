---
title: Pair Humanist Sans with Old-Style Serifs
impact: MEDIUM
tags: humanist, old-style, calligraphic, pairing, screen
---

## Pair Humanist Sans with Old-Style Serifs

Humanist sans-serifs (Gill Sans, Frutiger, Myriad) and old-style serifs (Garamond, Caslon, Jenson) share calligraphic roots and diagonal stress, a versatile, readable pairing. Pairing a humanist sans with a high-contrast rational serif (Bodoni, Didot) clashes: one skeleton is calligraphic, the other geometric.

**Incorrect (humanist sans + Didone, conflicting stress and contrast):**

```css
h1 { font-family: 'Gill Sans', sans-serif; } /* calligraphic, low contrast */
body { font-family: 'Bodoni', serif; }       /* vertical stress, extreme contrast */
```

**Correct (humanist sans + old-style serif):**

```css
h1 { font-family: 'Frutiger', sans-serif; }
body { font-family: 'Adobe Caslon', serif; }
/* Shared calligraphic DNA, diagonal stress */
```

**Correct (neo-humanist + contemporary serif, best all-around for screens):**

```css
h1 { font-family: 'Calibri', sans-serif; }
body { font-family: 'Charter', serif; }
/* Optimized for screens, highly readable */
```

Treat all pairing rules as guidance, not law. Know the rules before breaking them.
