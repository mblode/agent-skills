---
title: Use Tabular Figures in Data Contexts
impact: MEDIUM-HIGH
tags: tabular-figures, tnum, tables, alignment, numbers
---

## Use Tabular Figures in Data Contexts

Use tabular (monospaced-width) figures wherever numbers align vertically: tables, price lists. Right-align number columns; use commas as thousands separators. Enable `tnum` via `font-feature-settings`, or pick a font with tabular figures by default.

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

Fallback: if the font lacks tabular figures, use a monospaced or system font for data columns.
