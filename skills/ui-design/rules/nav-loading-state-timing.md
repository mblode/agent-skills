---
title: Stabilize Loading Indicator Timing
id: nav-loading-state-timing
category: nav
defaultTier: backlog
detect: static
---

## Stabilize Loading Indicator Timing

Apply a short reveal delay and minimum visible duration for spinners/skeletons. Without them a fast response flashes a spinner for one frame and the page reads as unstable.

## Detection

Find spinners and skeletons rendered straight off a raw loading flag, with no delay or minimum-duration gate between the flag and the render.

```bash
rg -nP '\{\s*\w*(?i:loading|pending|fetching)\w*\s*&&\s*<\s*(?i:spinner|skeleton|loader)' -g '*.tsx' -g '*.jsx' src/
```

A flag that is already debounced upstream (a `useDelayedLoading` hook, a TanStack Query `isPending` combined with `keepPreviousData`) still matches on its name. Trace where the boolean comes from: if the delay and floor live in the hook, the call site is correct as written.

**Incorrect (instant flicker):**

```tsx
{isLoading && <Spinner />}
```

**Correct (delay + minimum duration):**

```tsx
const shouldShowSpinner = isLoading && elapsedMs > 180
const keepSpinner = shouldShowSpinner || spinnerVisibleForMs < 320
```
