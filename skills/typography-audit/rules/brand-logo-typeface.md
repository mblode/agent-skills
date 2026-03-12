---
title: Choose Logo Typeface Based on Specific Letters
impact: LOW-MEDIUM
tags: logo, typeface, letterforms, brand, identity
---

## Choose Logo Typeface Based on Specific Letters

When selecting a typeface for a logo or wordmark, choose based on the specific letters in the brand name, not on overall typeface aesthetics. Favor typefaces with distinctive glyphs for the letters you actually use. An "A" or "g" that looks generic in one typeface may be striking in another.

**Process:**

1. Type the brand name in 20\u201330 candidate typefaces
2. Focus on the most prominent letters in the name
3. Look for distinctive, memorable letterforms
4. Test at both large and small sizes
5. Verify the typeface license covers logo use

**Correct (chosen for specific letter beauty):**

```css
/* "Agatha" \u2014 chosen because Didot's 'A' and 'g' are distinctive */
.logo {
  font-family: 'Didot', serif;
  font-size: 2rem;
  letter-spacing: 0.05em;
}
```

Use swashes, discretionary ligatures, and stylistic alternates sparingly in logos for memorability. Check italic variants for swash characters \u2014 they are often stored in separate font files or accessible via OpenType features.
