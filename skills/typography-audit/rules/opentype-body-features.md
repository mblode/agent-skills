---
title: Enable Standard OpenType Features for Body
impact: MEDIUM-HIGH
tags: font-feature-settings, kern, liga, calt, opentype
---

## Enable Standard OpenType Features for Body

Enable four OpenType features on body text: `kern` (kerning), `liga` (standard ligatures), `clig` (contextual ligatures), `calt` (contextual alternates). They improve letter spacing and glyph substitution automatically.

**Incorrect (default browser settings, features may be off):**

```css
body {
  font-family: 'Source Serif Pro', serif;
  /* relies on browser defaults */
}
```

**Correct (explicit OpenType features enabled):**

```css
body {
  font-family: 'Source Serif Pro', serif;
  font-kerning: normal;
  font-feature-settings: "kern", "liga", "clig", "calt";
}
```

Modern CSS alternative using individual properties:

```css
body {
  font-kerning: normal;
  font-variant-ligatures: common-ligatures contextual;
}
```

Browsers enable `kern` and `liga` by default; explicit declarations ensure consistent behavior across browsers and font configs.
