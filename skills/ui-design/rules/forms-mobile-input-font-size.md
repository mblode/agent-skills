---
title: Keep Mobile Input Text at Readable Size
id: forms-mobile-input-font-size
category: forms
defaultTier: fix-this-sprint
detect: static
---

## Keep Mobile Input Text at Readable Size

Set input text to at least 16px on mobile and avoid autofocus on touch-first flows. iOS zooms the viewport in on any field below 16px and does not zoom back out, leaving the user panned into a form they now have to scroll sideways.

**Incorrect (tiny field text):**

```css
input,
textarea {
  font-size: 13px;
}
```

**Correct (touch-safe field text):**

```css
input,
textarea,
select {
  font-size: 16px;
}
```
