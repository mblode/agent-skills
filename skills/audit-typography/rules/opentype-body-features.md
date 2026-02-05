---
title: Enable Standard OpenType Features for Body
impact: MEDIUM-HIGH
tags: font-feature-settings, kern, liga, calt, opentype
---

## Enable Standard OpenType Features for Body

Always enable these four OpenType features for body text: `kern` (kerning), `liga` (standard ligatures), `clig` (contextual ligatures), and `calt` (contextual alternates). These improve letter spacing and glyph substitution automatically.

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

Most browsers enable `kern` and `liga` by default, but explicit declarations ensure consistent behavior across browsers and font configurations.
