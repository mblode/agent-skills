---
title: Use Oldstyle Figures in Running Text
impact: MEDIUM-HIGH
tags: oldstyle-figures, onum, lnum, lining, numbers
---

## Use Oldstyle Figures in Running Text

Oldstyle (lowercase) figures blend with body text because they have ascenders and descenders like lowercase letters. Use `onum` for running text. Use lining figures (`lnum`) next to uppercase letters, in UI elements, and in headings where alignment matters.

**Incorrect (lining figures disrupting body text flow):**

```css
body {
  /* default lining figures stick up from the baseline */
}
```

```html
<p>The event attracted 1,247 attendees in 2024.</p>
<!-- Lining "1,247" and "2024" look oversized in body text -->
```

**Correct (oldstyle figures for body, lining for UI):**

```css
body {
  font-variant-numeric: oldstyle-nums;
}

/* Or using font-feature-settings */
body {
  font-feature-settings: "onum";
}

/* Lining figures for UI and headings */
.btn, .heading, .table-cell {
  font-variant-numeric: lining-nums;
}
```

Spell out numbers one through nine in prose if desired (style guide dependent). Verify the font supports `onum` before enabling \u2014 not all fonts include oldstyle figure glyphs.
