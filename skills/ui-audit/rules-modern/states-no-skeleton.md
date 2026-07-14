---
title: Async data renders a spinner instead of a skeleton
slug: states-no-skeleton
category: states
defaultTier: fix-this-sprint
surfaces: list, dashboard, search, form, loading-state
react-apis: Suspense, loading.tsx, Skeleton
related: states-layout-shift, microcopy-generic-loading
---

## Async data renders a spinner instead of a skeleton

A centered spinner gives no preview, occupies different space than the loaded layout, and triggers Cumulative Layout Shift on arrival. A skeleton (low-fidelity outline matching the loaded content's shape and size) fixes all three: primes the user, reserves space, feels faster at the same latency.

## Contents
[What goes wrong](#what-goes-wrong) · [Detection](#detection) · [Fix](#fix) · [Tiers](#default-tier-and-overrides) · [Examples](#examples) · [Defer-to](#defer-to-when-this-is-another-tools-job) · [Suppression](#suppression)

## What goes wrong

A dashboard shows a centered spinner (0x0 layout) where six cards will appear. 800ms later they pop in and shove the footer down: nothing anchors the eye, perceived latency beats real, Lighthouse flags CLS.

## Detection

**Surfaces:** list, feed, inbox, table, dashboard widget, search results, async-loaded form, page-level loading.

**Static signals:**
1. Find async-data branches: `if (isLoading|isPending|loading)` returning JSX, plus `<Suspense fallback={...}>`.
2. Loading branch fails if it returns `null`; a `<Spinner>` / `<CircularProgress>` / `<Loader>` not in a layout box matching the loaded layout; or `<div className="loading">Loading…</div>` (also fires `microcopy-generic-loading`).
3. Passes if it returns a `<Skeleton>` (or repeated skeleton rows) sized to the loaded layout.
4. Next.js `loading.tsx`: same rule, no centered spinner.

**Concrete commands:**
```bash
# Files with loading branches
rg -l 'isLoading|isPending|loading.tsx' --type=ts src/ app/

# Of those, files lacking any Skeleton component
rg -l 'isLoading|isPending' --type=ts src/ | while read f; do
  rg -L 'Skeleton|aria-busy="true"' "$f" \
    && echo "$f: loading branch without skeleton"
done

# loading.tsx files in app dir
find app -name 'loading.tsx' -o -name 'loading.jsx'

# Spinner-only fallbacks in Suspense
rg 'Suspense fallback=\{<Spinner' --type=ts src/
```

**False-positive guards:**
- Skip tiny data (a single inline value); use `aria-busy` instead.
- Skip `// ui-audit-ignore:states-no-skeleton` and Storybook fixtures.
- Skip image-only galleries rendering `<img>` with `width`/`height` and a placeholder; covered by `states-layout-shift`.

## Fix

Replace the spinner with a layout-matching skeleton, ideally via `<Suspense>`:

```tsx
// before
"use client";
export function InvoiceList() {
  const { data, isLoading } = useInvoices();
  if (isLoading) return <Spinner />;
  return (
    <ul>{data.map((i) => <InvoiceRow key={i.id} {...i} />)}</ul>
  );
}

// after: skeleton matches loaded shape
function InvoiceListSkeleton() {
  return (
    <ul aria-busy="true" aria-live="polite">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="h-14 rounded-md bg-muted animate-pulse" />
      ))}
    </ul>
  );
}

export function InvoiceList() {
  const { data, isLoading } = useInvoices();
  if (isLoading) return <InvoiceListSkeleton />;
  return <ul>{data.map((i) => <InvoiceRow key={i.id} {...i} />)}</ul>;
}

// or: server component with Suspense
export default function Page() {
  return (
    <Suspense fallback={<InvoiceListSkeleton />}>
      <InvoiceList />
    </Suspense>
  );
}

// or: Next.js route loading
// app/invoices/loading.tsx
export default function Loading() {
  return <InvoiceListSkeleton />;
}
```

Each skeleton row's height should match the loaded row's to avoid CLS (see `states-layout-shift`).

Docs:
- React: https://react.dev/reference/react/Suspense
- Next.js: https://nextjs.org/docs/app/api-reference/file-conventions/loading

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Dashboard (above-the-fold) | fix-this-sprint |
| List / Feed / Inbox | fix-this-sprint |
| Search results | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
if (isLoading) return <div className="flex justify-center"><Spinner /></div>;
```

**Applied (passes):**

```tsx
if (isLoading) return <InvoiceListSkeleton />;
```

## Defer-to (when this is another tool's job)

- Lighthouse measures the resulting CLS; link its report, don't restate the metric.
- Component libraries (shadcn/ui, Radix, MUI) ship `<Skeleton>`; prefer their primitives over hand-rolled.

## Suppression

```tsx
{/* ui-audit-ignore:states-no-skeleton, inline spinner sized to context, no layout shift */}
{isPending && <Spinner className="h-4 w-4" />}
```
