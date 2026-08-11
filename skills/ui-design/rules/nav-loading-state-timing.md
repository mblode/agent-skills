---
title: Stabilize Loading Indicator Timing
impact: MEDIUM
impactDescription: avoids flicker and perceived instability
tags: navigation, loading, feedback
---

## Stabilize Loading Indicator Timing

Apply a short reveal delay and minimum visible duration for spinners/skeletons.

**Incorrect (instant flicker):**

```tsx
{isLoading && <Spinner />}
```

**Correct (delay + minimum duration):**

```tsx
const shouldShowSpinner = isLoading && elapsedMs > 180
const keepSpinner = shouldShowSpinner || spinnerVisibleForMs < 320
```
