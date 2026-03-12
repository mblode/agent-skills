---
title: Start Layout with Body Text
impact: MEDIUM-HIGH
tags: body-text, layout, design-process, hierarchy
---

## Start Layout with Body Text

Begin every design by setting the body text: choose the typeface, set the size, line height, and measure. All other type decisions (headings, labels, captions) derive from this foundation. Starting with headings or decorative type and working backward leads to body text that feels like an afterthought.

**Incorrect (starting with the hero heading):**

```css
/* Designed the flashy heading first */
h1 {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
}

/* Then tried to make body text work around it */
body {
  font-family: Arial, sans-serif;  /* default, unconsidered */
  font-size: 14px;                 /* too small, squeezed in */
}
```

**Correct (body text first, headings derived):**

```css
/* 1. Set body text foundation */
body {
  font-family: 'Source Serif Pro', serif;
  font-size: 18px;
  line-height: 1.5;
  max-width: 65ch;
}

/* 2. Derive headings from body */
h1 {
  font-family: 'Source Serif Pro', serif;
  font-size: 2.5rem;
  line-height: 1.15;
}

h2 { font-size: 1.75rem; }
h3 { font-size: 1.25rem; }
```

Edit copy for clarity. Remove redundant UI text. Typography is best served by well-written content.
