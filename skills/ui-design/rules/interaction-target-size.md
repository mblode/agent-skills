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

## Detection

Search for interactive elements sized below 44px, in Tailwind classes (anything under `h-11`) and in button-like CSS rules.

```bash
rg -nP '\b(h|w|size)-([1-9]|10)\b' -g '*.tsx' -g '*.jsx' src/ | rg 'button|role="button"'
rg -nUP '[.\w-]*(button|btn|icon)[^{}]*\{[^}]*(width|height):\s*([1-9]|[1-3][0-9])px' -g '*.css' src/
```

The small class usually belongs to the glyph inside an adequately sized control (`<XIcon className="h-4 w-4" />` inside an `h-11` button), which matches whenever both sit on one line. Read the enclosing element: the hit target is the button's box, not the icon's.

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
