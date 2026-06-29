---
title: Choose Logo Typeface Based on Specific Letters
impact: LOW-MEDIUM
tags: logo, typeface, letterforms, brand, identity
---

## Choose Logo Typeface Based on Specific Letters

Choose a logo or wordmark typeface by the specific letters in the brand name, not overall aesthetics. An A or g that's generic in one face may be striking in another.

**Incorrect (default UI face reused for the wordmark, no distinctive glyphs):**

```css
/* "Agatha" set in the same face as the rest of the UI;
   nothing in the wordmark is memorable */
.logo {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 700;
}
```

**Correct (chosen for the specific letters in the name):**

```css
/* "Agatha": chosen because Didot's 'A' and 'g' are distinctive */
.logo {
  font-family: 'Didot', serif;
  font-size: 2rem;
  letter-spacing: 0.05em;
}
```

**Process:** set the brand name in 20-30 candidates, focus on the most prominent letters, test at large and small sizes, verify the license covers logo use. Use swashes, discretionary ligatures, and stylistic alternates sparingly; check italic variants for swash characters (often in separate files or behind OpenType features).
