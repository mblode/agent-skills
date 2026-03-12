---
title: Define Strong Fallback Font Stacks
impact: CRITICAL
tags: fallback, font-stack, system-fonts, glyphs
---

## Define Strong Fallback Font Stacks

Every `font-family` declaration needs a carefully chosen fallback stack. Include likely-installed system fonts that match the primary font's metrics and style. Test with fallbacks active to catch layout shifts. Ensure accent and special character support.

**Incorrect (no meaningful fallback):**

```css
body {
  font-family: 'Libre Baskerville';
}
```

**Correct (robust fallback stack):**

```css
body {
  font-family: 'Libre Baskerville', 'Georgia', 'Times New Roman', serif;
}

/* Sans-serif example */
h1 {
  font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
}
```

Use `size-adjust`, `ascent-override`, and `descent-override` in `@font-face` for fallbacks to minimize layout shift (CLS):

```css
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
}
```

Avoid over-subsetting fonts, which can cause empty glyph boxes for characters outside the subset range.
