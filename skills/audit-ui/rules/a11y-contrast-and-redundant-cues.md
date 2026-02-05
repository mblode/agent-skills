---
title: Meet Contrast and Avoid Color-Only Meaning
impact: CRITICAL
impactDescription: prevents inaccessible status communication
tags: accessibility, contrast, status
---

## Meet Contrast and Avoid Color-Only Meaning

Status and validation states should combine text, iconography, or shape with color.

**Incorrect (color-only status):**

```tsx
<span className="text-red-500">Error</span>
```

**Correct (redundant cue + label):**

```tsx
<span className="text-red-700" role="status" aria-live="polite">
  <WarningIcon aria-hidden="true" /> Error: Invalid email format
</span>
```
