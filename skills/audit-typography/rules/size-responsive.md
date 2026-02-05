---
title: Adapt Typography Across Breakpoints
impact: HIGH
tags: responsive, mobile, media-queries, display-faces, scaling
---

## Adapt Typography Across Breakpoints

Scale headings down on smaller screens. Swap display faces to text faces on small screens via media queries \u2014 display cuts with fine details lose legibility at small sizes. Limit long light-on-dark text on mobile where screen glare reduces contrast.

**Incorrect (desktop type unchanged on mobile):**

```css
h1 {
  font-family: 'Playfair Display', serif;
  font-size: 72px; /* stays huge on mobile */
}
```

**Correct (responsive scaling and font swapping):**

```css
h1 {
  font-family: 'Playfair Display', serif;
  font-size: 48px;
}

@media (max-width: 768px) {
  h1 {
    font-family: 'Source Serif Pro', serif; /* text cut for small screens */
    font-size: 28px;
    line-height: 1.2;
  }
}
```

Identify display faces by their naming: Display, Banner, Headline, Poster, Titling. These should not appear at body sizes on any screen.
