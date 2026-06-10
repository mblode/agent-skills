---
title: Choose Logo Typeface Based on Specific Letters
impact: LOW-MEDIUM
tags: logo, typeface, letterforms, brand, identity
---

## Choose Logo Typeface Based on Specific Letters

When selecting a typeface for a logo or wordmark, choose based on the specific letters in the brand name, not on overall typeface aesthetics. An "A" or "g" that looks generic in one typeface may be striking in another.

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

**Process:** type the brand name in 20-30 candidate typefaces, focus on the most prominent letters, test at large and small sizes, and verify the license covers logo use. Use swashes, discretionary ligatures, and stylistic alternates sparingly for memorability; check italic variants for swash characters, often stored in separate files or behind OpenType features.
