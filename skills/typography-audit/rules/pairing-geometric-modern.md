---
title: Pair Geometric Sans with Modern Serifs
impact: MEDIUM
tags: geometric, modern, rational, pairing, futura
---

## Pair Geometric Sans with Modern Serifs

Geometric sans-serifs (Futura, Avenir, Century Gothic) share the rational, constructed quality of modern/didone serifs (Bodoni, Didot). Both have vertical stress and clean geometry. This creates a harmonious pair with inherent serif/sans contrast.

Geometric sans-serifs are generally weaker for body text at small sizes \u2014 ensure legibility when using them.

**Incorrect (geometric sans + old-style serif):**

```css
h1 { font-family: 'Avenir', sans-serif; }   /* geometric/vertical */
body { font-family: 'Caslon', serif; }       /* old-style/diagonal */
/* Stress mismatch */
```

**Correct (geometric sans + modern serif):**

```css
h1 { font-family: 'Avenir', sans-serif; }
body { font-family: 'Didot', serif; }
/* Both share vertical stress and rational geometry */
```

Ensure the text remains legible at small sizes. Geometric sans at body sizes can be challenging for extended reading.
