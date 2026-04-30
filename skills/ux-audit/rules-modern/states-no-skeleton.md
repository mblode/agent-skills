---
title: Async data renders a spinner instead of a skeleton
slug: states-no-skeleton
category: states
defaultTier: fix-this-sprint
surfaces: list, dashboard, search, form, loading-state
react-apis: Suspense, loading.tsx, Skeleton
related: states-layout-shift, states-generic-loading-copy
---

## Async data renders a spinner instead of a skeleton

A centered spinner over an empty area gives the user no preview of what's coming, occupies different space than the loaded layout, and triggers Cumulative Layout Shift when the data arrives. A skeleton — a low-fidelity outline matching the loaded content's shape and size — solves all three: it primes the user, reserves space, and feels faster even at the same actual latency.

## What goes wrong

Dashboard route loads. User sees a centered spinner where six cards will eventually appear. Spinner takes 0×0 layout space; the page is otherwise blank. 800 ms later, six cards pop in and shove the footer down. The user's eye has nothing to anchor to during the wait, the perceived latency is worse than the real latency, and Lighthouse reports a CLS regression.

## Detection

**Surfaces:** list, feed, inbox, table, dashboard widget, search results, async-loaded form, page-level loading.

**Static signals:**
1. Find async-data branches: `if (isLoading|isPending|loading)` returning JSX, plus `<Suspense fallback={...}>` props.
2. Inspect the loading branch. Fail if it returns:
   - `null`
   - A `<Spinner>` / `<CircularProgress>` / `<Loader>` not inside a layout box that matches the loaded layout
   - `<div className="loading">Loading…</div>` (also fires `states-generic-loading-copy`)
3. Pass if it returns a `<Skeleton>` (or repeated skeleton rows) sized to match the loaded layout.
4. Next.js: `loading.tsx` should not return a centered spinner — same rule applies.

**Concrete commands:**
```bash
# Files with loading branches
rg -l 'isLoading|isPending|loading.tsx' --type=tsx src/ app/

# Of those, files lacking any Skeleton component
rg -l 'isLoading|isPending' --type=tsx src/ | while read f; do
  rg -L 'Skeleton|aria-busy="true"' "$f" \
    && echo "$f: loading branch without skeleton"
done

# loading.tsx files in app dir
find app -name 'loading.tsx' -o -name 'loading.jsx'

# Spinner-only fallbacks in Suspense
rg 'Suspense fallback=\{<Spinner' --type=tsx src/
```

**False-positive guards:**
- Skip components where the data is small enough that a skeleton makes no sense (a single inline value); use `aria-busy` instead.
- Skip files with `// ux-audit-ignore:states-no-skeleton`.
- Skip Storybook fixtures.
- Skip image-only galleries that render `<img>` directly with `width`/`height` and a placeholder — covered by `states-layout-shift`.

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

// after — skeleton matches loaded shape
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

// or — server component with Suspense
export default function Page() {
  return (
    <Suspense fallback={<InvoiceListSkeleton />}>
      <InvoiceList />
    </Suspense>
  );
}

// or — Next.js route loading
// app/invoices/loading.tsx
export default function Loading() {
  return <InvoiceListSkeleton />;
}
```

Each skeleton row's height should match the loaded row's height to avoid CLS (see `states-layout-shift`).

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

- Lighthouse measures the resulting CLS — link to its report rather than restating the metric.
- Component libraries (shadcn/ui, Radix, MUI) ship `<Skeleton>`; prefer their primitives over hand-rolled.

## Suppression

```tsx
{/* ux-audit-ignore:states-no-skeleton — inline spinner sized to context, no layout shift */}
{isPending && <Spinner className="h-4 w-4" />}
```
