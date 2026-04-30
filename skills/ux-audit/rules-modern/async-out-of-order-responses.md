---
title: Out-of-order async responses (stale results)
slug: async-out-of-order-responses
category: async
defaultTier: release-blocker
surfaces: search, list, form, dashboard
react-apis: AbortController, useDeferredValue, useTransition, useEffect cleanup
related: async-double-submit, states-no-skeleton, async-no-suspense-boundary
---

## Out-of-order async responses (stale results)

Type "ca" then "cat" quickly. Two requests fly. The "ca" response can arrive after the "cat" response on slow networks — and now the UI shows results for "ca" while the input says "cat." The user sees a lie. The fix is to either cancel in-flight requests with `AbortController` or to drive the request key with `useDeferredValue` so React naturally collapses to the latest value.

## What goes wrong

Search input fires a fetch on every keystroke. Network is jittery. Response for "iphon" arrives after response for "iphone." UI overwrites the iphone results with iphon results. The search looks broken — and worse, it intermittently looks correct, so the bug is hard to reproduce.

## Detection

**Surfaces:** search (highest priority), list filter, form async-validation, dashboard with a date-range picker that refetches.

**Static signals:**
1. `rg 'onChange|onInput' --type=tsx -A 5` — find handlers that contain `fetch(`, `useQuery`, or any async call.
2. For each, confirm one of:
   - An `AbortController` is created and `signal` is passed to fetch, with abort on the next call (or in `useEffect` cleanup).
   - `useDeferredValue` drives the request key (debouncing via React).
   - A query library (TanStack Query, SWR) keys the request such that the latest wins.
3. Flag handlers that fire fetches without any of the above.

**Concrete commands:**
```bash
# onChange/onInput handlers that fetch
rg -A 8 'onChange=|onInput=' --type=tsx | rg -B 2 'fetch\(|useQuery\(|axios\.'

# Files using fetch in inputs without AbortController
rg 'onChange|onInput' --type=tsx -l | while read f; do
  rg -L 'AbortController|useDeferredValue|signal:' "$f" && echo "$f: input fetch with no cancellation"
done

# useEffect with fetch but no cleanup
rg -A 10 'useEffect\(' --type=tsx | rg -B 2 'fetch\(' | rg -L 'return \(\) =>|abort\(\)'
```

**False-positive guards:**
- Skip files where the only fetch in a handler is a fire-and-forget mutation (POST without rendering the response).
- Skip if a query library is in use and the query key includes the input value (TanStack Query, SWR keep the freshest).
- Skip files annotated `// ux-audit-ignore:async-out-of-order-responses`.

## Fix

Two canonical approaches.

**A. AbortController in `useEffect`** — best for plain `fetch` driven by state:

```tsx
// before — race condition
function Search({ q }: { q: string }) {
  const [results, setResults] = useState<Item[]>([]);
  useEffect(() => {
    fetch(`/api/search?q=${q}`).then((r) => r.json()).then(setResults);
  }, [q]);
  return <Results items={results} />;
}

// after — abort on re-render or unmount
function Search({ q }: { q: string }) {
  const [results, setResults] = useState<Item[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/search?q=${q}`, { signal: controller.signal })
      .then((r) => r.json())
      .then(setResults)
      .catch((err) => {
        if (err.name !== 'AbortError') throw err;
      });
    return () => controller.abort();
  }, [q]);
  return <Results items={results} />;
}
```

**B. `useDeferredValue` + Suspense** — React keeps the latest:

```tsx
function SearchPage({ q }: { q: string }) {
  const deferred = useDeferredValue(q);
  return (
    <Suspense fallback={<Results.Skeleton />}>
      <Results key={deferred} q={deferred} />
    </Suspense>
  );
}
```

Docs:
- React useDeferredValue: https://react.dev/reference/react/useDeferredValue
- AbortController: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- TanStack Query cancellation: https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation

## Default tier and overrides

**Defaults to:** `release-blocker` for search; `fix-this-sprint` elsewhere.

**Surface overrides:**
| Surface | Tier |
|---|---|
| Search / Combobox | release-blocker |
| Async form validation | fix-this-sprint |
| Dashboard date-range refetch | fix-this-sprint |
| Marketing | backlog |

## Examples

**Anti-pattern (fails):**
```tsx
<input onChange={(e) => fetch(`/api/search?q=${e.target.value}`).then(r => r.json()).then(setResults)} />
```

**Applied (passes):**
```tsx
const deferred = useDeferredValue(q);
useEffect(() => {
  const ac = new AbortController();
  fetch(`/api/search?q=${deferred}`, { signal: ac.signal })
    .then((r) => r.json()).then(setResults)
    .catch((e) => { if (e.name !== 'AbortError') throw e; });
  return () => ac.abort();
}, [deferred]);
```

## Defer-to (when this is another tool's job)

- TanStack Query / SWR: built-in cancellation — verify it's wired up rather than re-implementing.
- ESLint `react-hooks/exhaustive-deps` for missing cleanup.
- Lighthouse / Vercel Speed Insights for INP impact (out-of-order also wastes bandwidth).

## Suppression

```tsx
{/* ux-audit-ignore:async-out-of-order-responses — backend is idempotent and last-wins */}
```
