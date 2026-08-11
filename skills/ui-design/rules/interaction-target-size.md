---
title: Meet Minimum Hit Target Size
id: interaction-target-size
category: interaction
defaultTier: fix-this-sprint
detect: static
---

## Meet Minimum Hit Target Size

Touch targets need 44x44px (WCAG 2.5.5 Target Size Enhanced). 24x24px (WCAG 2.5.8 Target Size Minimum) is the floor only for dense desktop UI under `pointer: fine`; on touch it is a mistap generator, not a pass.

This file owns the 44px number, and it is a conformance floor, not a build target. New UI in this skill ships 48x48 per `guidelines/buttons.md`, which owns that number. An existing control between 44 and 47px is a pass with a note, never a fail.

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
