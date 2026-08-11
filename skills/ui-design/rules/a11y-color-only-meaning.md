---
title: Avoid Color-Only Meaning
impact: CRITICAL
impactDescription: keeps state readable without color perception
tags: accessibility, status, color-only
---

## Avoid Color-Only Meaning

State carried by hue alone (a red row, a green dot, a colored border) is invisible to color-blind users and on washed-out screens. Pair color with text, an icon, or shape. Contrast ratios are axe's job, not this rule's.

**Incorrect (status is hue only):**

```tsx
<td className={run.failed ? 'text-red-700' : 'text-green-700'}>{run.name}</td>
```

**Correct (same color, state also in text):**

```tsx
<td className={run.failed ? 'text-red-700' : 'text-green-700'}>
  {run.name} <Badge>{run.failed ? 'Failed' : 'Passed'}</Badge>
</td>
```
