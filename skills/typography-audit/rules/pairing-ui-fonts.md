---
title: Choose UI Fonts with Distinct Ambiguous Glyphs
impact: MEDIUM
tags: ui, glyphs, l-I-1, legibility, interface
---

## Choose UI Fonts with Distinct Ambiguous Glyphs

For UI and data-heavy interfaces, choose fonts where l (lowercase L), I (uppercase i), and 1 (one) are visually distinct. Ambiguous glyphs cause confusion in IDs, codes, passwords, and data entry. Consider serifs for UI \u2014 the serifs on I and l aid disambiguation.

Use condensed faces for headlines and labels when space is tight, but never for body text.

**Incorrect (ambiguous glyphs in UI):**

```css
.code-input {
  font-family: 'Helvetica', sans-serif;
  /* I, l, and 1 look nearly identical */
}
```

**Correct (distinct glyphs for UI):**

```css
.code-input {
  font-family: 'Inter', sans-serif;
  /* Inter has distinct I (with serifs), l, and 1 */
}

/* Or use a monospaced font for code/ID fields */
.code-input {
  font-family: 'JetBrains Mono', monospace;
}
```

**Fonts with distinct l/I/1:** Inter, IBM Plex Sans, Fira Sans, Source Sans Pro, Noto Sans. Test with the string "Il1|" before committing to a UI typeface.
