---
title: Ensure Full Keyboard Operability
impact: CRITICAL
impactDescription: enables non-pointer users to complete tasks
tags: interaction, keyboard, operability
---

## Ensure Full Keyboard Operability

Pointer-only handlers are not acceptable for critical actions.

**Incorrect (mouse only):**

```tsx
<div onClick={openMenu}>Open menu</div>
```

**Correct (keyboard + pointer by default):**

```tsx
<button type="button" onClick={openMenu}>Open menu</button>
```
