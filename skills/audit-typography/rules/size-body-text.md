---
title: Set Body Text Size by Context
impact: HIGH
tags: font-size, body-text, mobile, desktop, print
---

## Set Body Text Size by Context

Set body text size first \u2014 it anchors the entire typographic system. Use 16\u201324px for desktop, 15\u201319px for mobile, and 10\u201312pt for print. Adjust based on the typeface's x-height: faces with a large x-height feel bigger at the same pixel size.

Avoid oversized desktop body text (above 24px). Scale headings down proportionally on smaller screens.

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

Find the typeface's "sweet spot" by testing one size up and down. If 19px looks right but 18px feels too small and 20px too large, use 19px even if it is not part of your modular scale.
