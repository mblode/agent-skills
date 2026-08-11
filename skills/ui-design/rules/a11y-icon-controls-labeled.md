---
title: Label Icon-Only Controls
id: a11y-icon-controls-labeled
category: a11y
defaultTier: fix-this-sprint
detect: static
---

## Label Icon-Only Controls

Any control with no visible text requires an accessible name. Without one, assistive tech announces nothing usable and the control cannot be identified.

**Incorrect (no accessible name):**

```tsx
<button onClick={closeModal}>
  <XIcon />
</button>
```

**Correct (explicit label):**

```tsx
<button type="button" aria-label="Close dialog" onClick={closeModal}>
  <XIcon aria-hidden="true" />
</button>
```
