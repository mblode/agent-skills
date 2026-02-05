---
title: Meet Minimum Hit Target Size
impact: HIGH
impactDescription: reduces mistaps on touch devices
tags: interaction, touch, targets
---

## Meet Minimum Hit Target Size

Tap targets should be at least 24px (44px preferred on mobile).

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
