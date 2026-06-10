---
title: Async fetch has no error state or boundary
slug: states-no-error-state
category: states
defaultTier: release-blocker
surfaces: checkout, sign-in, list, dashboard, search, error-state
react-apis: error.tsx, Suspense, ErrorBoundary
related: states-no-skeleton, states-no-empty-state
---

## Async fetch has no error state or boundary

Every async operation can fail. A component that renders only the happy path turns a transient 500 into a blank screen, an infinite spinner, or (worse) a silent stale render. The fix is two-layered: per-component error fallbacks for inline failures (one widget down, the rest still work) and a route-level `error.tsx` for catastrophic crashes. Both must offer the user a way out: retry, go back, or contact support.

## What goes wrong

Dashboard loads. Three of four widgets succeed. The fourth widget's API returns 500. Without an error boundary, the exception bubbles to the route, the entire dashboard renders the global 500 page, and the user loses access to the three working widgets. Or: a list view's fetch fails. The component renders the loading skeleton forever (no error branch at all). The user reloads, sees the same skeleton, and assumes the product is broken.

## Detection

**Surfaces:** every async fetcher, every Suspense boundary, every route.

**Static signals:**
1. Find async data calls: `useQuery`, `useSWR`, `fetch(`, `await`, server components with `async function`.
2. For each component, check both render-time error branches AND structural error boundaries:
   - **Inline error branch:** `if (isError|error) return ...` with retry path.
   - **Suspense + error boundary:** `<ErrorBoundary fallback={...}><Suspense>...</Suspense></ErrorBoundary>` (React) OR `<Suspense errorFallback={...}>` patterns.
   - **Route-level:** `app/<route>/error.tsx` exists where catastrophic failures are possible.
3. Fail if a component fetches data without inline error handling AND is not wrapped in any error boundary AND its route has no `error.tsx`.

**Concrete commands:**
```bash
# Async fetchers
rg -l 'useQuery|useSWR|await fetch|async function' --type=tsx --type=ts src/ app/

# Files lacking error handling
rg -l 'useQuery|useSWR' --type=tsx src/ | while read f; do
  rg -L 'isError|hasError|onError|catch|ErrorBoundary|errorFallback' "$f" \
    && echo "$f: fetcher without inline error or boundary"
done

# Routes lacking error.tsx
find app -type d | while read d; do
  if ls "$d"/page.* >/dev/null 2>&1 && ! ls "$d"/error.* >/dev/null 2>&1; then
    echo "$d: route without error.tsx"
  fi
done

# Inline error branches without retry
rg -A 5 'isError|hasError' --type=tsx src/ | rg -L 'retry|tryAgain|refetch|onClick'
```

**False-positive guards:**
- Skip files with `// ux-audit-ignore:states-no-error-state`.
- Static / pre-rendered components with no fetch are exempt.
- Skip layouts that explicitly delegate error handling to a child route.

## Fix

Use both layers: per-widget fallback + route-level error boundary:

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

// app/invoices/error.tsx: route-level catch
"use client";
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong loading invoices</h1>
      <p className="mt-2 text-muted-foreground">
        We've logged the issue. You can retry or go back home.
      </p>
      <div className="mt-4 flex gap-2 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Button variant="ghost" asChild><Link href="/">Home</Link></Button>
      </div>
    </div>
  );
}

// app/dashboard/page.tsx: Suspense + ErrorBoundary per widget
import { ErrorBoundary } from "react-error-boundary";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ErrorBoundary fallback={<WidgetError name="Revenue" />}>
        <Suspense fallback={<WidgetSkeleton />}><RevenueWidget /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError name="Users" />}>
        <Suspense fallback={<WidgetSkeleton />}><UsersWidget /></Suspense>
      </ErrorBoundary>
    </div>
  );
}
```

Docs:
- React: https://react.dev/reference/react/Suspense
- Next.js error.tsx: https://nextjs.org/docs/app/api-reference/file-conventions/error
- react-error-boundary: https://github.com/bvaughn/react-error-boundary

## Default tier and overrides

**Defaults to:** `release-blocker` on critical paths, `fix-this-sprint` elsewhere.

**Surface overrides:**
| Surface | Tier |
|---|---|
| Checkout / Payment | release-blocker |
| Sign-in / Sign-up | release-blocker |
| Dashboard root | release-blocker (per-widget boundaries required) |
| First-run onboarding | release-blocker |
| List / Feed / Inbox | fix-this-sprint |
| Search results | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | fix-this-sprint |

## Examples

**Anti-pattern (fails):**

```tsx
const { data } = useUser();
return <h1>Welcome, {data.name}</h1>; // crashes on null/error
```

**Applied (passes):**

```tsx
const { data, isError, refetch } = useUser();
if (isError) return <ErrorCard onRetry={refetch} />;
if (!data) return <SkeletonCard />;
return <h1>Welcome, {data.name}</h1>;
```

## Defer-to (when this is another tool's job)

- Sentry / observability tools for capturing the error itself; this rule covers what the user sees.
- A monitoring rule should verify error rates ≤ threshold; this rule only verifies the UI handles the error.

## Suppression

```tsx
{/* ux-audit-ignore:states-no-error-state, wrapped by parent ErrorBoundary in app/(dashboard)/error.tsx */}
<RevenueWidget />
```
