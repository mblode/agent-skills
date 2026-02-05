---
title: Adjust Word Spacing with Letterspacing
impact: HIGH
tags: word-spacing, letter-spacing, tracking, balance
---

## Adjust Word Spacing with Letterspacing

When adding letterspacing to small text or uppercase, also increase word spacing proportionally. Otherwise words start to merge visually as the inter-letter gaps approach the inter-word gaps. If letterspacing small text, prefer increasing the font size instead.

**Incorrect (letterspaced without word-spacing adjustment):**

```css
.small-caps-label {
  font-variant-caps: all-small-caps;
  letter-spacing: 0.15em;
  /* words blur together at this tracking level */
}
```

**Correct (word-spacing increases with letter-spacing):**

```css
.small-caps-label {
  font-variant-caps: all-small-caps;
  letter-spacing: 0.15em;
  word-spacing: 0.1em;
}
```

Better yet, if the text is too small to read, increase the font size rather than adding letterspacing.
