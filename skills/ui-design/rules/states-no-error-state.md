---
title: Async fetch has no inline error state
id: states-no-error-state
category: states
defaultTier: release-blocker
detect: static
related: states-no-empty-state, async-no-error-boundary
---

## Async fetch has no inline error state

Every async op can fail. A happy-path-only component turns a transient 500 into a blank screen, an infinite spinner, or a silent stale render. This rule owns the component's own error branch: the failure renders a message naming what broke plus a way out (retry, go back, contact support), in place, without unmounting the surrounding UI. Structural boundaries (`error.tsx`, `<ErrorBoundary>`) are `async-no-error-boundary`'s job; a component needs both, and a boundary alone still loses the working parts of the page.

## What goes wrong

A list fetch fails; the component has no error branch, so it renders the loading skeleton forever. The user reloads, sees the same skeleton, and assumes the product is broken. Or the fetch resolves to `undefined` and the render reads `data.name`, so the widget throws and the nearest boundary swallows the whole surrounding page along with it.

## Detection

**Surfaces:** every async fetcher.

**Static signals:**
1. Find async calls: `useQuery`, `useSWR`, `fetch(`, `await`, async server components.
2. Per component, look for a render-time error branch: `if (isError|error) return ...`.
3. That branch must carry a retry path (`refetch`, `reset`, `onClick`) and name what failed.
4. Fail if a fetching component has no error branch, or has one with no retry path.

**Concrete commands:**
```bash
# Async fetchers
rg -l 'useQuery|useSWR|await fetch|async function' --type=ts src/ app/

# Files lacking an inline error branch
rg -l 'useQuery|useSWR' --type=ts src/ | while read f; do
  rg -q 'isError|hasError|onError|catch' "$f" \
    || echo "$f: fetcher without an inline error branch"
done

# Inline error branches without retry
rg -l 'isError|hasError' --type=ts src/ | while read f; do
  rg -A 5 'isError|hasError' "$f" | rg -q 'retry|tryAgain|refetch|onClick' \
    || echo "$f: error branch without retry path"
done
```

**False-positive guards:**
- Skip files with `// ui-audit-ignore:states-no-error-state`.
- Static / pre-rendered components with no fetch are exempt.
- A wrapping `<ErrorBoundary>` does not clear this finding: it replaces the subtree instead of the failed part. Report the boundary gap under `async-no-error-boundary` and the missing branch here.

## Fix

Add the error branch with a retry, next to the loading branch:

```tsx
// before
"use client";
export function InvoiceList() {
  const { data, isLoading } = useInvoices();
  if (isLoading) return <InvoiceListSkeleton />;
  return <ul>{data.map(InvoiceRow)}</ul>;
}

// after: inline error branch with retry
"use client";
export function InvoiceList() {
  const { data, isLoading, isError, refetch } = useInvoices();
  if (isLoading) return <InvoiceListSkeleton />;
  if (isError) {
    return (
      <div role="alert" className="rounded-md border p-4">
        <p className="font-medium">Couldn't load invoices.</p>
        <p className="text-sm text-muted-foreground">Check your connection or try again.</p>
        <Button onClick={() => refetch()} variant="outline">Try again</Button>
      </div>
    );
  }
  return <ul>{data.map(InvoiceRow)}</ul>;
}
```

For a server component, the equivalent is a `try`/`catch` around the fetch that returns the same error markup, so the failure stays inside the widget's slot.

Then add the structural boundary underneath it: see `async-no-error-boundary`.

Docs:
- TanStack Query error handling: https://tanstack.com/query/latest/docs/framework/react/guides/query-functions#handling-and-throwing-errors
- SWR error handling: https://swr.vercel.app/docs/error-handling

## Default tier and overrides

**Defaults to:** `release-blocker` on critical paths, `fix-this-sprint` elsewhere.

**Surface overrides:**
| Surface | Tier |
|---|---|
| Checkout / Payment | release-blocker |
| Sign-in / Sign-up | release-blocker |
| Dashboard root | release-blocker (per-widget branch, so one failure keeps the rest usable) |
| First-run onboarding | release-blocker |
| List / Feed / Inbox | fix-this-sprint |
| Search results | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | fix-this-sprint |

## Defer-to (when this is another tool's job)

- Sentry / observability captures the error itself; this rule covers what the user sees.
- A monitoring rule verifies error rates <= threshold; this rule verifies the UI handles the error.

## Suppression

```tsx
{/* ui-audit-ignore:states-no-error-state, prefetched by the parent route loader, cannot fail here */}
<RevenueWidget />
```
