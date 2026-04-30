---
title: Async tree without an error boundary
slug: async-no-error-boundary
category: async
defaultTier: release-blocker
surfaces: dashboard, list, checkout, sign-in, error-state, modal
react-apis: error.tsx, global-error.tsx, ErrorBoundary, react-error-boundary
related: async-no-suspense-boundary, states-no-error-state, microcopy-leaked-error-message
---

## Async tree without an error boundary

A thrown error inside a server component or a client async tree without an ancestor error boundary unmounts the entire route. The user sees a blank page or Next.js's default error screen with a stack trace in dev. In production they see nothing — just a broken app. Every route segment and every independently-fetching widget needs its own error boundary so one failure doesn't take the page down.

## What goes wrong

A widget fetch returns 500. Without an error boundary, the error bubbles up past the page, past the layout, and unmounts everything to the nearest boundary — usually the root. The user, who was halfway through checkout, now sees a blank screen with no recovery path.

## Detection

**Surfaces:** dashboard, list, checkout, sign-in, error-state, modal — anything that fetches data or runs server actions.

**Static signals:**
1. List App Router segments: `fd -t f '(page|layout).tsx' app/ src/app/`.
2. For each segment, check for a sibling `error.tsx`.
3. Find client components using `useQuery`, `fetch`, `useSWR`, or server actions; confirm an `<ErrorBoundary>` ancestor exists.
4. Flag any segment with awaits but no `error.tsx`, and any client async tree with no boundary.

**Concrete commands:**
```bash
# Route segments lacking error.tsx
fd -t f 'page.tsx' app/ src/app/ | while read p; do
  dir=$(dirname "$p")
  [ ! -f "$dir/error.tsx" ] && echo "$dir: no error.tsx"
done

# Root-level global-error.tsx
fd -t f 'global-error.tsx' app/ src/app/ || echo 'missing global-error.tsx'

# Client components with fetches but no ErrorBoundary import
rg "useQuery|useSWR|'use client'" --type=tsx -l | xargs rg -L 'ErrorBoundary'
```

**False-positive guards:**
- Skip leaf segments inherited from a parent that defines `error.tsx` (App Router cascades).
- Skip components inside Storybook (`*.stories.tsx`).
- Skip files annotated `// ux-audit-ignore:async-no-error-boundary`.

## Fix

Add an `error.tsx` per route segment with a `reset()` button. For client trees, wrap in `react-error-boundary`'s `<ErrorBoundary>`.

```tsx
// app/dashboard/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert">
      <h2>Couldn&apos;t load your dashboard</h2>
      <p>We&apos;ve logged this. Try again?</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

```tsx
// client-side widget boundary
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) => (
    <WidgetError onRetry={resetErrorBoundary} />
  )}
>
  <BillingWidget />
</ErrorBoundary>;
```

Docs:
- Next.js error.tsx: https://nextjs.org/docs/app/api-reference/file-conventions/error
- Next.js global-error.tsx: https://nextjs.org/docs/app/building-your-application/routing/error-handling
- react-error-boundary: https://github.com/bvaughn/react-error-boundary

## Default tier and overrides

**Defaults to:** `release-blocker`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | release-blocker |
| Checkout | release-blocker |
| Dashboard widget (per-widget) | release-blocker |
| Marketing landing | fix-this-sprint |
| Internal admin | fix-this-sprint |

## Examples

**Anti-pattern (fails):**
```
app/
  dashboard/
    page.tsx     // awaits fetchBilling()
    layout.tsx
    // no error.tsx
```

**Applied (passes):**
```
app/
  dashboard/
    page.tsx
    layout.tsx
    error.tsx    // catches segment errors with reset()
  global-error.tsx  // catches root layout errors
```

## Defer-to (when this is another tool's job)

- Sentry / Vercel Observability for error capture and alerting.
- Vercel Agent for surfacing failing routes in PR review.
- Lighthouse cannot detect this — it's a runtime concern.

## Suppression

```tsx
{/* ux-audit-ignore:async-no-error-boundary — covered by parent layout error.tsx */}
<Widget />
```
