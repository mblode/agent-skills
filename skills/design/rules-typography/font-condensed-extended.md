---
title: Change Width with Real Faces, Never Distortion
impact: HIGH
tags: condensed, extended, width, distortion, font-stretch
---

## Change Width with Real Faces, Never Distortion

Never stretch, squish, or skew type with CSS transforms or width hacks; distortion destroys the designed stroke proportions, thinning verticals and thickening horizontals. Need narrower or wider text? Use a condensed or extended cut, or a variable font's width axis. Use condensed faces for headlines and tight UI labels (navigation, badges, tags) where you control line breaks, never for body copy: narrow letterforms cut readability at small sizes. Extended cuts are rarely needed but work for stylistic effect at large sizes.

**Incorrect (CSS distortion, or condensed used for body):**

```css
h1 {
  font-family: 'Inter', sans-serif;
  transform: scaleX(0.8); /* squished, stroke weights now uneven */
}

body {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 16px; /* narrow letterforms at reading size */
}
```

**Correct (real width variants):**

```css
body {
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
}

h1 {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 48px;
  letter-spacing: -0.01em;
}

/* Or a variable font's width axis */
h1 {
  font-family: 'Inter VF', sans-serif;
  font-stretch: 85%; /* real condensed rendering */
}
```

Exception: deliberate distortion inside a logo, as an explicit design choice on a fixed piece of artwork. Re-tune size, line height, letter-spacing, and padding after any width swap; a metrically compatible replacement swaps in more easily but still needs the pass.
