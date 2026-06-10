---
title: Async server component without Suspense boundary
slug: async-no-suspense-boundary
category: async
defaultTier: fix-this-sprint
surfaces: dashboard, list, search, loading-state, checkout, onboarding
react-apis: <Suspense>, server components, loading.tsx, streaming
related: states-no-skeleton, states-layout-shift, async-no-error-boundary
---

## Async server component without Suspense boundary

In Next.js App Router and React 19, an async server component without an enclosing `<Suspense>` boundary blocks the entire route from streaming. Users wait for the slowest fetch before seeing anything: no shell, no skeleton, no progressive paint. The right primitive to unblock the rest of the page is `<Suspense fallback={...}>` placed around the slow async tree.

## What goes wrong

Page renders four widgets. One widget calls a slow third-party API. With no Suspense boundary, the whole route hangs on that single fetch. TTFB explodes, the user sees a blank screen, and the rest of the page never paints until the slowest dependency resolves.

## Detection

**Surfaces:** dashboard, list, search, loading-state, checkout, onboarding (anywhere server-fetched data renders).

**Static signals:**
1. Find async server components: `rg '^export (default )?async function' --type=tsx app/ src/app/`.
2. For each match, walk up the file tree to confirm whether the parent renders the component inside `<Suspense>`.
3. Confirm the route segment lacks a `loading.tsx` (Next.js auto-wraps the segment in Suspense when present).
4. Flag if neither `<Suspense>` ancestor nor sibling `loading.tsx` exists.

**Concrete commands:**
```bash
# Async server components in the App Router
rg '^export (default )?async function' --type=tsx app/ src/app/ -l

# Files that import Suspense
rg "from 'react'" --type=tsx -l | xargs rg -l 'Suspense'

# Routes missing loading.tsx
fd -t f 'page.tsx' app/ src/app/ | while read p; do
  dir=$(dirname "$p")
  [ ! -f "$dir/loading.tsx" ] && echo "$dir: no loading.tsx"
done
```

**False-positive guards:**
- Skip if a `loading.tsx` exists at any ancestor segment; Next.js wraps the segment in Suspense automatically.
- Skip if the component is a leaf and renders inline static markup (no awaits).
- Skip files annotated `// ux-audit-ignore:async-no-suspense-boundary`.

## Fix

Wrap the slow async tree in `<Suspense>` with a skeleton fallback that matches the loaded layout (CLS-safe).

```tsx
// before: entire dashboard waits for SlowWidget
export default async function DashboardPage() {
  return (
    <main>
      <FastWidget />
      <SlowWidget /> {/* awaits a 3s API */}
      <AnotherWidget />
    </main>
  );
}

// after: SlowWidget streams in; rest of the page paints immediately
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <main>
      <FastWidget />
      <Suspense fallback={<SlowWidgetSkeleton />}>
        <SlowWidget />
      </Suspense>
      <AnotherWidget />
    </main>
  );
}
```

Docs:
- React: https://react.dev/reference/react/Suspense
- Next.js streaming: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- Next.js loading.tsx: https://nextjs.org/docs/app/api-reference/file-conventions/loading

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Dashboard with >2 widgets | release-blocker |
| Checkout / Sign-in | release-blocker (TTFB on critical path) |
| Marketing landing | fix-this-sprint |
| Internal admin | backlog |

## Examples

**Anti-pattern (fails):**
```tsx
// app/dashboard/page.tsx: no Suspense, no loading.tsx
export default async function Page() {
  const billing = await fetchBilling();      // slow
  const usage = await fetchUsage();          // slow
  return <Dashboard billing={billing} usage={usage} />;
}
```

**Applied (passes):**
```tsx
// app/dashboard/page.tsx
export default function Page() {
  return (
    <>
      <Suspense fallback={<BillingSkeleton />}>
        <BillingWidget />
      </Suspense>
      <Suspense fallback={<UsageSkeleton />}>
        <UsageWidget />
      </Suspense>
    </>
  );
}
```

## Defer-to (when this is another tool's job)

- Lighthouse for measured TTFB / LCP regressions.
- Vercel Speed Insights for field measurement of streaming impact.
- ESLint plugin `eslint-plugin-react-server-components` for write-time checks.

## Suppression

```tsx
{/* ux-audit-ignore:async-no-suspense-boundary, leaf is sync, no await */}
<StaticWidget />
```
