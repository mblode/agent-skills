---
title: Add Letterspacing to Uppercase Text
impact: MEDIUM-HIGH
tags: letter-spacing, uppercase, tracking, small-caps, word-spacing
---

## Add Letterspacing to Uppercase Text

Uppercase letters are designed to sit next to lowercase letters, so in all caps they appear too tightly spaced. Add roughly 0.05 to 0.2em of letter-spacing, more for smaller uppercase text and less for larger. Raise `word-spacing` alongside it: as inter-letter gaps approach the inter-word gap, words merge into one run of caps.

Avoid setting multi-line blocks in all uppercase; it significantly reduces reading speed.

**Incorrect (uppercase untracked, or tracked without word spacing):**

```css
.label {
  text-transform: uppercase;
  /* no letter-spacing adjustment */
}

.small-caps-label {
  font-variant-caps: all-small-caps;
  letter-spacing: 0.15em;
  /* words blur together at this tracking */
}
```

**Correct (tracking plus proportional word spacing):**

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

.small-caps-label {
  font-variant-caps: all-small-caps;
  letter-spacing: 0.15em;
  word-spacing: 0.1em;
}
```

Do not letterspace or apply optical kerning to monospaced or connected script fonts; keep their spacing at the font's built-in metrics.
