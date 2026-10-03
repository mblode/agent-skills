---
title: Set Body Text Size by Context
impact: CRITICAL
tags: font-size, body-text, mobile, desktop, print
---

## Set Body Text Size by Context

Set body size first; it anchors the whole typographic system. Use 16-24px desktop, 16-19px mobile, 10-12pt print. Never go below 16px on mobile, and never set mobile body smaller than desktop body: `ui-design`'s house default keeps product UI body at 16px (`text-base`) at every breakpoint, and where it applies it wins over the ranges here. Adjust for x-height (a large x-height feels bigger at the same pixel size). Avoid oversized desktop body (above 24px); scale headings down proportionally on smaller screens.

**Incorrect (one size for all contexts):**

```css
body {
  font-size: 14px; /* too small for comfortable reading */
}
```

**Correct (16px floor, larger only for long-form reading):**

```css
body {
  font-size: 1rem; /* 16px at every breakpoint; reading surfaces may go larger */
  line-height: 1.5;
}

@media (min-width: 1024px) {
  .article {
    font-size: 1.125rem; /* long-form desktop reading */
  }
}

@media print {
  body {
    font-size: 11pt;
  }
}
```

Find the typeface's sweet spot by testing one size up and down. If 19px looks right but 18px is too small and 20px too large, use 19px even if it breaks your modular scale.
