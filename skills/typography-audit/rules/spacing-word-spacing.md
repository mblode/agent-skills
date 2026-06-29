---
title: Adjust Word Spacing with Letterspacing
impact: HIGH
tags: word-spacing, letter-spacing, tracking, balance
---

## Adjust Word Spacing with Letterspacing

When letterspacing small text or uppercase, increase word spacing proportionally; otherwise words merge as inter-letter gaps approach inter-word gaps. For small text, prefer increasing the font size instead.

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

If text is too small to read, increase font size rather than adding letterspacing.
