---
title: Avoid Pairing Two Sans-Serifs
impact: MEDIUM
tags: sans-serif, pairing, contrast, confusion
---

## Avoid Pairing Two Sans-Serifs

Two sans-serif typefaces in the same design typically lack sufficient contrast and create visual confusion. Readers cannot distinguish their roles. The safer approach is serif + sans-serif, which provides inherent structural contrast.

The exception is pairing sans-serifs from distinctly different genres (e.g., a geometric sans for headings with a humanist sans for body), but this requires careful handling.

**Incorrect (two similar sans-serifs):**

```css
h1 { font-family: 'Helvetica', sans-serif; }
body { font-family: 'Arial', sans-serif; }
/* Nearly identical \u2014 no contrast, no purpose */
```

**Correct (serif + sans-serif):**

```css
h1 { font-family: 'Source Serif Pro', serif; }
body { font-family: 'Source Sans Pro', sans-serif; }
```

If you must use two sans-serifs, ensure they come from different genre families (geometric vs humanist) and serve clearly different roles.
