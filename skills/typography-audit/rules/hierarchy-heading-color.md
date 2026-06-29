---
title: Lighten Headings as They Grow
impact: MEDIUM-HIGH
tags: headings, color, weight, large-type, balance
---

## Lighten Headings as They Grow

As headings grow, reduce weight or lighten color to keep balance: a 48px bold heading feels overwhelming. Prefer darkened brand hues over flat gray, which looks lifeless.

**Incorrect (heavy weight at all sizes):**

```css
h1 { font-size: 48px; font-weight: 900; color: #000; }
h2 { font-size: 32px; font-weight: 900; color: #000; }
h3 { font-size: 24px; font-weight: 900; color: #000; }
```

**Correct (progressive lightening):**

```css
h1 {
  font-size: 48px;
  font-weight: 400;    /* lighter weight at large size */
  color: #1a1a2e;      /* slightly tinted, not pure black */
}

h2 {
  font-size: 32px;
  font-weight: 600;
}

h3 {
  font-size: 24px;
  font-weight: 700;
}
```

Avoid heading colors that match your link color (typically blue), as readers will try to click them.
