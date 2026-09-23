---
title: Out-of-order async responses (stale results)
id: async-out-of-order-responses
category: async
defaultTier: release-blocker
detect: static
related: async-no-suspense-boundary
---

## Out-of-order async responses (stale results)

Type "ca" then "cat" quickly: two requests fly. On a slow network the "ca" response can land after "cat", so the UI shows "ca" results while the input says "cat." Fix: cancel in-flight requests with `AbortController`, or drive the request key with `useDeferredValue` so React collapses to the latest value.

## What goes wrong

A search input fetches on every keystroke over a jittery network. The "iphon" response lands after "iphone", overwriting the iphone results with iphon results. It looks broken, yet intermittently looks correct, so it is hard to reproduce.

## Detection

**Surfaces:** search (highest priority), list filter, form async-validation, dashboard with a date-range picker that refetches.

**Static signals:**
1. `rg 'onChange|onInput' --type=ts -A 5`: find handlers containing `fetch(`, `useQuery`, or any async call.
2. For each, confirm one of:
   - `AbortController` created, `signal` passed to fetch, aborted on the next call or in `useEffect` cleanup.
   - `useDeferredValue` drives the request key (React debounces).
   - A query library (TanStack Query, SWR) keys the request so the latest wins.
3. Flag handlers that fetch without any of the above.

**Concrete commands:**
```bash
# onChange/onInput handlers that fetch
rg -A 8 'onChange=|onInput=' --type=ts | rg -B 2 'fetch\(|useQuery\(|axios\.'

# Files using fetch in inputs without AbortController
rg 'onChange|onInput' --type=ts -l | while read f; do
  rg -q 'AbortController|useDeferredValue|signal:' "$f" || echo "$f: input fetch with no cancellation"
done

# useEffect with fetch but no cleanup
rg -l 'useEffect\(' --type=ts src/ app/ | while read f; do
  rg -A 10 'useEffect\(' "$f" | rg -q 'fetch\(' \
    && ! rg -q 'return \(\) =>|abort\(\)' "$f" \
    && echo "$f: useEffect fetch without cleanup or abort"
done
```

**False-positive guards:**
- Skip handlers whose only fetch is a fire-and-forget mutation (POST without rendering the response).
- Skip when a query library is in use and the query key includes the input value (TanStack Query, SWR keep the freshest).
- Skip files annotated `// ui-audit-ignore:async-out-of-order-responses`.

## Fix

Two canonical approaches.

**A. AbortController in `useEffect`**, best for plain `fetch` driven by state:

```tsx
// before: race condition
function Search({ q }: { q: string }) {
  const [results, setResults] = useState<Item[]>([]);
  useEffect(() => {
    fetch(`/api/search?q=${q}`).then((r) => r.json()).then(setResults);
  }, [q]);
  return <Results items={results} />;
}

// after: abort on re-render or unmount
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

**B. `useDeferredValue` + Suspense**, React keeps the latest:

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

## Defer-to (when this is another tool's job)

- TanStack Query / SWR: built-in cancellation; verify it's wired up rather than re-implementing.
- ESLint `react-hooks/exhaustive-deps` for missing cleanup.
- Lighthouse / Vercel Speed Insights for INP impact (out-of-order also wastes bandwidth).

## Suppression

```tsx
{/* ui-audit-ignore:async-out-of-order-responses, backend is idempotent and last-wins */}
```
