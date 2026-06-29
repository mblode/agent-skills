---
title: Use Real Small Caps, Not Pseudo
impact: MEDIUM-HIGH
tags: small-caps, font-variant, opentype, abbreviations
---

## Use Real Small Caps, Not Pseudo

Real small caps are designed glyphs whose proportions match lowercase letters. Pseudo small caps (shrunken uppercase) look thin and uneven. Enable real ones via `font-variant-caps` or `font-feature-settings`, with slight letter-spacing (0.05em). Use them for abbreviations (NASA, HTML) in running text and for subheadings.

**Incorrect (pseudo small caps via font-size reduction):**

```css
.abbr {
  font-size: 0.8em;
  text-transform: uppercase; /* fake small caps */
}
```

**Correct (real OpenType small caps):**

```css
.abbr {
  font-variant-caps: all-small-caps;
  letter-spacing: 0.05em;
}

/* Or using font-feature-settings */
.abbr {
  font-feature-settings: "smcp", "c2sc";
  letter-spacing: 0.05em;
}
```

Verify the font ships `smcp` (small caps from lowercase) and optionally `c2sc` (from uppercase); not all fonts include real small-cap glyphs.
