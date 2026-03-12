---
title: Use Large Type as a Design Element
impact: LOW-MEDIUM
tags: large-type, display, hero, design-element
---

## Use Large Type as a Design Element

Huge type can anchor an entire design. If you are loading a web font, use it to its full advantage at large sizes where its character is most visible. Small web fonts are indistinguishable from system fonts, wasting bandwidth.

Scale large type down on smaller screens. Large letters can also be screened back and layered as abstract background elements.

**Incorrect (web font only at body size):**

```css
body {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  /* Wasting a beautiful display face at tiny size */
}
```

**Correct (web font showcased at large size):**

```css
.hero-headline {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 8vw, 8rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

body {
  font-family: 'Source Serif Pro', serif; /* text face for body */
  font-size: 18px;
}
```

On smaller screens, tone down huge type so readers do not scroll through three screen heights to read a headline.
