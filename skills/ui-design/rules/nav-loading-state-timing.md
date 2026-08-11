---
title: Stabilize Loading Indicator Timing
id: nav-loading-state-timing
category: nav
defaultTier: backlog
detect: static
---

## Stabilize Loading Indicator Timing

Apply a short reveal delay and minimum visible duration for spinners/skeletons. Without them a fast response flashes a spinner for one frame and the page reads as unstable.

**Incorrect (instant flicker):**

```tsx
{isLoading && <Spinner />}
```

**Correct (delay + minimum duration):**

```tsx
const shouldShowSpinner = isLoading && elapsedMs > 180
const keepSpinner = shouldShowSpinner || spinnerVisibleForMs < 320
```
