---
title: Label Icon-Only Controls
impact: HIGH
impactDescription: ensures controls are announced clearly
tags: accessibility, aria-label, controls
---

## Label Icon-Only Controls

Any control with no visible text requires an accessible name.

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
