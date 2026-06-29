---
title: Avoid Pairing Two Serifs
impact: MEDIUM
tags: serif, pairing, contrast, families
---

## Avoid Pairing Two Serifs

Two serifs tend to compete rather than complement. If you must, use strong contrast (e.g. a slab serif heading over an old-style body) or two cuts from the same family. Never mix modern with old-style serifs; their structural philosophies clash.

**Incorrect (two competing serifs):**

```css
h1 { font-family: 'Bodoni', serif; }      /* modern serif */
body { font-family: 'Garamond', serif; }   /* old-style serif */
/* Vertical stress clashes with diagonal stress */
```

**Correct (serif + sans, or same-family serifs):**

```css
/* Option A: serif + sans */
h1 { font-family: 'Garamond', serif; }
body { font-family: 'Gill Sans', sans-serif; }

/* Option B: same family, different cuts */
h1 { font-family: 'Freight Display', serif; }
body { font-family: 'Freight Text', serif; }
```

Pairing typefaces by the same designer also helps; designers reuse consistent principles.
