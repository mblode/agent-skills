---
title: Use Metrics Kerning, Adjust Tracking First
impact: MEDIUM-HIGH
tags: kerning, tracking, metrics, optical, letter-spacing
---

## Use Metrics Kerning, Adjust Tracking First

Use the font's built-in kerning tables (metrics kerning) rather than optical kerning. High-quality fonts have carefully crafted kern pairs. Before manually adjusting individual kern pairs, adjust overall tracking (letter-spacing) first. Manual kerning should only be necessary for large display type and logos.

**Incorrect (optical kerning or excessive manual adjustment):**

```css
body {
  font-kerning: auto; /* may not use metrics */
}

/* Over-kerning body text */
body {
  letter-spacing: -0.02em;
}
```

**Correct (metrics kerning, tracking adjustments before kerning):**

```css
body {
  font-kerning: normal; /* use font's built-in kern tables */
}

/* If large heading spacing feels off, adjust tracking first */
h1 {
  letter-spacing: -0.02em; /* tracking adjustment */
}

/* Manual kerning only for logos/display (use spans) */
.logo .letter-A { margin-right: -0.05em; }
```

Use hair spaces (`&hairsp;`) or thin spaces (`&thinsp;`) where normal spacing feels off but a full adjustment is too much. Accept minor kerning irregularities in body text \u2014 they are inherent in the Latin alphabet.
