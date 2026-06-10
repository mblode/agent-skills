---
title: Evaluate Font Quality Before Use
impact: CRITICAL
tags: font-quality, kerning, licensing, sources
---

## Evaluate Font Quality Before Use

Test a font's quality by examining its kerning with word samples before committing. Poor kerning (uneven letter spacing) indicates low quality. Prefer fonts from reputable foundries and distributors; never use pirated fonts.

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

1. Set the font in a paragraph of body text and look for uneven spacing between letter pairs (T+y, A+V, W+a are common problem pairs)
2. Check that punctuation is well-positioned relative to letters
3. Verify the font includes all needed glyphs (accents, special characters, figure styles)
4. Confirm the license covers web use

Reputable sources, commercial: Adobe Fonts, Hoefler&Co, Commercial Type, Klim, Grilli Type; open source: Google Fonts, Font Squirrel (with verification), fonts.bunny.net; variable fonts: v-fonts.com.
