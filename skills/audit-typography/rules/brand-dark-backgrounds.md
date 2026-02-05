---
title: Handle Dark Backgrounds Carefully
impact: LOW-MEDIUM
tags: dark-mode, reversed-text, contrast, readability
---

## Handle Dark Backgrounds Carefully

Light text on dark backgrounds (reversed type) is harder to read for long passages. Use off-white text (not pure white) on dark backgrounds to reduce glare. Reserve reversed type for short sections, headers, and UI elements \u2014 not for extended body text.

Limit long light-on-dark text blocks. If the design requires dark mode, increase font weight slightly and loosen line height.

**Incorrect (pure white on pure black, extended body):**

```css
.dark-section {
  background: #000;
  color: #fff; /* harsh contrast, eye strain */
}

.dark-section .article {
  /* Long body text in reversed type \u2014 hard to read */
}
```

**Correct (off-white on dark, limited reversed body text):**

```css
.dark-section {
  background: #1a1a2e;
  color: #e8e8ed; /* off-white, reduces glare */
}

.dark-section body {
  font-weight: 450; /* slightly heavier for dark backgrounds */
  line-height: 1.6; /* slightly looser */
}
```

Test dark backgrounds at different screen brightness levels and in various lighting conditions.
