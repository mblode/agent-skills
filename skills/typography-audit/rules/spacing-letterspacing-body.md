---
title: Never Letterspace Body Text
impact: HIGH
tags: letter-spacing, tracking, body-text, readability
---

## Never Letterspace Body Text

Adding letter-spacing to body text destroys the carefully designed spacing built into the font's metrics. Professional typefaces are spaced for optimal readability at text sizes. The only exceptions are tiny captions (below 10px) where slight positive tracking aids legibility, and display-size lowercase.

**Incorrect (letterspacing applied to body):**

```css
body {
  letter-spacing: 0.05em; /* disrupts natural rhythm */
}

p {
  letter-spacing: 1px; /* even worse */
}
```

**Correct (no letterspacing on body):**

```css
body {
  letter-spacing: normal;
}

/* Only tiny text may benefit from slight tracking */
.caption {
  font-size: 10px;
  letter-spacing: 0.02em;
}
```

Remember: kerning adjusts space between specific letter pairs; letterspacing (tracking) adjusts uniform space between all letters. They are different tools.
