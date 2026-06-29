---
title: Pair Geometric Sans with Modern Serifs
impact: MEDIUM
tags: geometric, modern, rational, pairing, futura
---

## Pair Geometric Sans with Modern Serifs

Geometric sans-serifs (Futura, Avenir, Century Gothic) share the rational, constructed quality of modern/didone serifs (Bodoni, Didot): both have vertical stress and clean geometry, making a harmonious pair with built-in serif/sans contrast.

Geometric sans is weak for body text at small sizes, so verify legibility for extended reading.

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
