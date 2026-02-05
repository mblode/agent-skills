---
title: Use Tabular Figures in Data Contexts
impact: MEDIUM-HIGH
tags: tabular-figures, tnum, tables, alignment, numbers
---

## Use Tabular Figures in Data Contexts

Use tabular (monospaced-width) figures in tables, price lists, and anywhere numbers need to align vertically. Right-align columns of numbers. Use commas as thousands separators. Enable `tnum` via `font-feature-settings` or use a font with tabular figures by default.

**Incorrect (proportional figures in a table):**

```css
.price-table td {
  /* default proportional figures, numbers don't align */
  text-align: left;
}
```

**Correct (tabular figures, right-aligned):**

```css
.price-table td.number {
  font-variant-numeric: tabular-nums;
  text-align: right;
}

/* Or using font-feature-settings */
.price-table td.number {
  font-feature-settings: "tnum";
  text-align: right;
}
```

If the chosen font lacks tabular figure support, use a monospaced or system font for data columns as a fallback.
