---
title: Ensure Full Keyboard Operability
id: interaction-keyboard-operable
category: interaction
defaultTier: release-blocker
detect: static
---

## Ensure Full Keyboard Operability

Pointer-only handlers are not acceptable for critical actions. Anything reachable only by pointer cannot be completed by keyboard, switch, or screen reader users at all.

**Incorrect (mouse only):**

```tsx
<div onClick={openMenu}>Open menu</div>
```

**Correct (keyboard + pointer by default):**

```tsx
<button type="button" onClick={openMenu}>Open menu</button>
```
