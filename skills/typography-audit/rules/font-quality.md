---
title: Evaluate Font Quality Before Use
impact: CRITICAL
tags: font-quality, kerning, licensing, sources
---

## Evaluate Font Quality Before Use

Test a font's kerning with word samples before committing. Poor kerning (uneven letter spacing) signals low quality. Prefer reputable foundries and distributors; never use pirated fonts.

**Incorrect (unvetted free font from an aggregator):**

```css
@font-face {
  font-family: 'CoolFreeFont';
  /* Downloaded from a free-fonts aggregator: no kerning pairs,
     missing accents and figure styles, unknown license */
  src: url('/fonts/coolfreefont.woff2') format('woff2');
}
```

**Correct (vetted face from a reputable source):**

```css
@font-face {
  font-family: 'Source Serif 4';
  /* Adobe-designed, SIL OFL: full kerning, complete glyph set,
     verified at https://fonts.google.com */
  src: url('/fonts/SourceSerif4-Variable.woff2') format('woff2');
}
```

**How to evaluate:**

1. Set it in body text; look for uneven spacing in pairs like T+y, A+V, W+a
2. Check punctuation positioning relative to letters
3. Verify all needed glyphs (accents, special characters, figure styles)
4. Confirm the license covers web use

Reputable sources, commercial: Adobe Fonts, Hoefler&Co, Commercial Type, Klim, Grilli Type; open source: Google Fonts, Font Squirrel (with verification), fonts.bunny.net; variable fonts: v-fonts.com.
