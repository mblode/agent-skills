---
title: Doherty Threshold
impact: HIGH
kind: programmatic
prefix: interaction
tags: latency, response-time, loading, skeleton, optimistic-ui
related: memory-zeigarnik, interaction-fittss-law
---

## Doherty Threshold

Productivity climbs sharply when system response stays under 400 ms: neither user nor machine waits on the other. Above it, attention scatters and engagement drops. Source: Doherty & Thadani, IBM (1982).

Tiered targets: under 100 ms feels instant (hover, focus, expand/collapse); under 400 ms maintains flow (navigation, search, save); over 1000 ms requires explicit progress feedback (skeletons, progress bars, streaming). When real work cannot finish under 400 ms, fake the perception with optimistic UI, skeleton screens, or streamed partial results; never block on a centered spinner.

## Check

**Surfaces:** loading, search-results, error-state

**Procedure:** Static heuristic (runtime measurement isn't always available in source review).
1. Find async actions: `fetch`, `mutate`, route changes, async `onClick`/`onSubmit` handlers.
2. For each, check for one of: a skeleton/spinner placeholder rendered synchronously within ~100 ms (a `loading`/`isPending`/`<Skeleton>` branch in the same component), optimistic UI for low-risk actions, or a progress indicator for operations expected to exceed 1000 ms.
3. Flag any blocking `await` in a handler that shows no intermediate feedback.

**Concrete commands:**
```bash
rg -n 'await fetch|await mutate|onClick.*async|onSubmit.*async' src/
rg -n 'isLoading|isPending|<Skeleton|<Spinner|optimistic' src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | Every async path has a skeleton, spinner, or optimistic UI on the same component |: |
| warn | ≥1 async path lacks immediate feedback but other paths have it | MEDIUM |
| fail | Blocking `await` in a handler with no feedback UI anywhere on the surface | HIGH |

## Fix

**If fail:** Add an immediate state change before the `await`: set `isPending` and render `<Skeleton>` or a disabled-button state. For mutations on owned data, apply optimistic UI with a rollback path on error.

**If warn:** Standardize one `<Skeleton>`/pending-indicator pattern across all async branches on the surface for uniform coverage.

## Examples

**Anti-pattern (fails):**

```tsx
async function handleSubmit(form: FormData) {
  setLoading(true);
  await api.saveProfile(form); // 1.8s round trip
  setLoading(false);
  setSavedAt(Date.now());
}
// UI: full-screen overlay + centered spinner for 1.8s
```

**Applied (passes):**

```tsx
async function handleSubmit(form: FormData) {
  setProfile(toOptimistic(form));     // <16ms: UI reflects new state
  setStatus("saving");                 // subtle inline indicator
  try {
    const saved = await api.saveProfile(form);
    setProfile(saved);
    setStatus("saved");
  } catch (err) {
    setProfile(prevProfile);          // rollback
    setStatus("error");
  }
}
```

Pair with a skeleton for first paint and a streamed response for long operations.

Reference: https://lawsofux.com/doherty-threshold/
