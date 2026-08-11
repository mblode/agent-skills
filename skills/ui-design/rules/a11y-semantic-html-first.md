---
title: Prefer Native Semantics Before ARIA
id: a11y-semantic-html-first
category: a11y
defaultTier: release-blocker
detect: static
---

## Prefer Native Semantics Before ARIA

Use semantic HTML controls first; only add ARIA when native elements cannot express intent. Rebuilding those semantics in ARIA reimplements keyboard behaviour, role, and state by hand, and any gap leaves assistive tech reporting the wrong thing.

**Incorrect (clickable div):**

```tsx
<div onClick={submitForm}>Save</div>
```

**Correct (semantic button):**

```tsx
<button type="button" onClick={submitForm}>Save</button>
```
