---
title: Use Large Type as a Design Element
impact: LOW-MEDIUM
tags: large-type, display, hero, design-element
---

## Use Large Type as a Design Element

Huge type can anchor a design. If you load a web font, show it at large sizes where its character is most visible: small web fonts are indistinguishable from system fonts and waste bandwidth. Large letters can also be screened back and layered as abstract background elements.

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

On small screens, tone down huge type so readers don't scroll three screen-heights through one headline.
