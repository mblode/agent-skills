---
title: Limit to Two Typefaces
impact: MEDIUM
tags: pairing, typeface-count, simplicity, system
---

## Limit to Two Typefaces

Use at most two typefaces in a project: one for body text and one for display/headings. Adding more faces increases complexity and the risk of visual discord. If you need more than two, enforce a strict system with clear roles for each face.

**Incorrect (too many faces, no system):**

```css
h1 { font-family: 'Playfair Display', serif; }
h2 { font-family: 'Lora', serif; }
h3 { font-family: 'Merriweather', serif; }  /* three serifs! */
p { font-family: 'Open Sans', sans-serif; }
.label { font-family: 'Roboto', sans-serif; } /* two sans! */
```

**Correct (two typefaces with clear roles):**

```css
:root {
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
}

h1, h2, h3 { font-family: var(--font-heading); }
body { font-family: var(--font-body); }
```

A single typeface with multiple weights can also work for an entire project, especially with a versatile superfamily.
