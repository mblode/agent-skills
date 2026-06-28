---
title: Keep Mobile Input Text at Readable Size
impact: HIGH
impactDescription: prevents iOS zoom jumps and input friction
tags: forms, mobile, typography
---

## Keep Mobile Input Text at Readable Size

Set input text to at least 16px on mobile and avoid autofocus on touch-first flows.

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
