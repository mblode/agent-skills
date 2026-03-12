---
title: Add Letterspacing to Uppercase Text
impact: HIGH
tags: letter-spacing, uppercase, tracking, small-caps
---

## Add Letterspacing to Uppercase Text

Uppercase letters are designed to sit next to lowercase letters. When set in all caps, they appear too tightly spaced. Add approximately 0.05\u20130.2em of letter-spacing to uppercase text. Increase spacing for smaller uppercase text; decrease for larger.

Avoid setting multi-line blocks in all uppercase \u2014 it significantly reduces reading speed.

**Incorrect (uppercase without letterspacing):**

```css
.label {
  text-transform: uppercase;
  /* no letter-spacing adjustment */
}
```

**Correct (uppercase with tracking):**

```css
.label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
}

/* Larger uppercase needs less tracking */
.section-title {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 1.25rem;
}
```

Do not letterspace or use optical kerning on monospaced fonts or connected script fonts. Keep their spacing at the font's built-in metrics.
