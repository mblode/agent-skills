---
title: Async tree without an error boundary
id: async-no-error-boundary
category: async
defaultTier: release-blocker
detect: static
related: async-no-suspense-boundary, states-no-error-state, microcopy-leaked-error-message
---

## Async tree without an error boundary

A thrown error in a server component or client async tree with no ancestor error boundary unmounts the whole route: a blank page in production, a stack trace in dev. Every route segment and every independently-fetching widget needs its own boundary so one failure does not take the page down.

## What goes wrong

A widget fetch returns 500. With no boundary, the error bubbles past page and layout and unmounts everything to the nearest boundary (usually root). A user mid-checkout now sees a blank screen with no recovery path.

## Detection

**Surfaces:** dashboard, list, checkout, sign-in, error-state, modal (anything that fetches data or runs server actions).

**Static signals:**
1. List App Router segments: `find app src/app -type f \( -name 'page.tsx' -o -name 'layout.tsx' \) 2>/dev/null`.
2. Check each segment for a sibling `error.tsx`.
3. Find client components using `useQuery`, `fetch`, `useSWR`, or server actions; confirm an `<ErrorBoundary>` ancestor.
4. Flag segments with awaits but no `error.tsx`, and any client async tree with no boundary.

**Concrete commands:**
```bash
# Route segments lacking error.tsx
find app src/app -type f -name 'page.tsx' 2>/dev/null | while read p; do
  dir=$(dirname "$p")
  [ ! -f "$dir/error.tsx" ] && echo "$dir: no error.tsx"
done

# Root-level global-error.tsx
find app src/app -type f -name 'global-error.tsx' 2>/dev/null | grep -q . || echo 'missing global-error.tsx'

# Client components with fetches but no ErrorBoundary import
rg "useQuery|useSWR|'use client'" --type=ts -l | while read f; do
  rg -q 'ErrorBoundary' "$f" || echo "$f: client async tree without local ErrorBoundary"
done
```

**False-positive guards:**
- Skip leaf segments inherited from a parent that defines `error.tsx` (App Router cascades).
- Skip components inside Storybook (`*.stories.tsx`).
- Skip files annotated `// ui-audit-ignore:async-no-error-boundary`.

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
- Next.js global-error.tsx: https://nextjs.org/docs/app/getting-started/error-handling
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

## Defer-to (when this is another tool's job)

- Sentry / Vercel Observability for error capture and alerting.
- Vercel Agent for surfacing failing routes in PR review.
- Lighthouse cannot detect this; it's a runtime concern.

## Suppression

```tsx
{/* ui-audit-ignore:async-no-error-boundary, covered by parent layout error.tsx */}
<Widget />
```
