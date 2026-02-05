---
title: Prefer Native Semantics Before ARIA
impact: CRITICAL
impactDescription: improves assistive technology compatibility
tags: accessibility, semantics, aria
---

## Prefer Native Semantics Before ARIA

Use semantic HTML controls first; only add ARIA when native elements cannot express intent.

**Incorrect (clickable div):**

```tsx
<div onClick={submitForm}>Save</div>
```

**Correct (semantic button):**

```tsx
<button type="button" onClick={submitForm}>Save</button>
```
