---
title: Set Body Text Size by Context
impact: HIGH
tags: font-size, body-text, mobile, desktop, print
---

## Set Body Text Size by Context

Set body size first; it anchors the whole typographic system. Use 16-24px desktop, 15-19px mobile, 10-12pt print. Adjust for x-height (a large x-height feels bigger at the same pixel size). Avoid oversized desktop body (above 24px); scale headings down proportionally on smaller screens.

**Incorrect (one size for all contexts):**

```css
body {
  font-size: 14px; /* too small for comfortable reading */
}
```

**Correct (responsive body sizing):**

```css
body {
  font-size: 18px; /* desktop default */
  line-height: 1.5;
}

@media (max-width: 768px) {
  body {
    font-size: 16px; /* mobile */
  }
}

@media print {
  body {
    font-size: 11pt;
  }
}
```

Find the typeface's sweet spot by testing one size up and down. If 19px looks right but 18px is too small and 20px too large, use 19px even if it breaks your modular scale.
