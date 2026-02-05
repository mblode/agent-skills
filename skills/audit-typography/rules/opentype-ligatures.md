---
title: Manage Ligatures by Context
impact: MEDIUM-HIGH
tags: ligatures, discretionary, standard, code, opentype
---

## Manage Ligatures by Context

Enable standard ligatures (`liga`) for body text. Keep discretionary ligatures (`dlig`) off in body \u2014 they can be distracting. Disable all ligatures in code blocks where character accuracy matters (fi, fl, ffi ligatures obscure individual characters).

**Incorrect (discretionary ligatures in body, ligatures in code):**

```css
body {
  font-feature-settings: "liga", "dlig"; /* dlig distracting in body */
}

code {
  /* inherits ligatures, fi becomes a single glyph */
}
```

**Correct (standard only in body, none in code):**

```css
body {
  font-feature-settings: "liga", "clig", "calt";
  /* no "dlig" in body text */
}

code, pre {
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
}

/* Discretionary ligatures for headlines only */
h1 {
  font-feature-settings: "liga", "dlig", "calt";
}
```

Standard ligatures: fi, fl, ffi, ffl (always appropriate in body).
Discretionary ligatures: st, ct, decorative forms (headlines/display only).
