---
title: Meet Minimum Hit Target Size
impact: HIGH
impactDescription: reduces mistaps on touch devices
tags: interaction, touch, targets
---

## Meet Minimum Hit Target Size

Touch targets need 44x44px (WCAG 2.5.5 Target Size Enhanced). 24x24px (WCAG 2.5.8 Target Size Minimum) is the floor only for dense desktop UI under `pointer: fine`; on touch it is a mistap generator, not a pass.

**Incorrect (small tap area):**

```css
.icon-button {
  width: 18px;
  height: 18px;
}
```

**Correct (expanded hit area):**

```css
.icon-button {
  min-width: 44px;
  min-height: 44px;
  display: inline-grid;
  place-items: center;
}
```
