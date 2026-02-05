---
title: Tighten Spacing for Large Headlines
impact: LOW-MEDIUM
tags: headlines, tracking, line-height, negative-leading, display
---

## Tighten Spacing for Large Headlines

Large display text needs tighter line height and letter-spacing than body text. At 48px+, the default line height creates excessive vertical gaps, and default tracking feels too loose.

Display cuts may need less tracking adjustment than text cuts used at large sizes.

**Incorrect (body line-height applied to headlines):**

```css
h1 {
  font-size: 64px;
  line-height: 1.5; /* way too much space between lines */
}
```

**Correct (tightened for display):**

```css
h1 {
  font-size: 64px;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

/* Responsive scaling */
@media (max-width: 768px) {
  h1 {
    font-size: 36px;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }
}
```

Use negative letter-spacing carefully. Test multi-line headlines to ensure letters do not overlap or collide. Descenders on one line should not touch ascenders on the next.
