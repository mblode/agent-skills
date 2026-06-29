---
title: Generic "Loading…" copy where context-specific would help
slug: states-generic-loading-copy
category: states
defaultTier: backlog
surfaces: loading-state, checkout, onboarding, dashboard
react-apis: Suspense, loading.tsx
related: states-no-skeleton
---

## Generic "Loading…" copy where context-specific would help

"Loading…" tells the user nothing: not what's happening, how long, or whether to wait. One specific sentence ("Confirming your order, 2 to 3 seconds") costs nothing at runtime, improves perceived progress, and gives a reason to wait. Polish-tier rule that ships often and everywhere.

## What goes wrong

A checkout "Place order" click starts a 4-second roundtrip; the button reads "Loading…" The user can't tell if the card is being charged, the cart validated, or the page is broken, so some panic-click. Or: a route-level `loading.tsx` renders `<p>Loading…</p>` for the whole 1.5-second transition.

## Detection

**Surfaces:** every loading state, every Suspense fallback, every pending button label.

**Static signals:**
1. Find loading strings: `Loading`, `Loading...`, `Loading…`, `Please wait`, `Wait...`.
2. Match `^Loading\.{0,3}$` (case-insensitive) on string literals in JSX, Suspense `fallback` props, button labels, and `loading.tsx`.
3. Each match is a candidate; severity scales with surface (a route `loading.tsx` beats a 200 ms inline label).

**Concrete commands:**
```bash
# Generic Loading copy in JSX
rg -i '"Loading\.{0,3}"|>Loading\.{0,3}<|`Loading\.{0,3}`' --type=ts --type=js src/ app/

# Pending button labels
rg 'pending\s*\?\s*"Loading' --type=ts src/

# Suspense fallback with generic copy
rg 'fallback=\{<\w*>Loading' --type=ts src/

# loading.tsx contents
find app \( -name 'loading.tsx' -o -name 'loading.jsx' \) -type f -exec rg -l 'Loading\.{0,3}' {} +

# Catch "Please wait" and friends
rg -i '"please wait"|>please wait<' --type=ts src/
```

**False-positive guards:**
- Skip files with `// ui-audit-ignore:states-generic-loading-copy`.
- Skip Storybook fixtures and test files.
- Skip i18n key references (`t("loading")`); inspect the locale file separately instead.
- Skip JSDoc / comment strings.
- Skip sub-200 ms loading states (no time to read; a generic word is fine).

## Fix

Write one sentence describing what's happening, ideally with a soft time estimate when known:

```tsx
// before
<Suspense fallback={<p>Loading...</p>}>
  <OrderConfirmation />
</Suspense>

<button disabled={pending}>{pending ? "Loading..." : "Place order"}</button>

// app/checkout/loading.tsx
export default function Loading() {
  return <p>Loading...</p>;
}

// after
<Suspense fallback={<p>Confirming your order, 2 to 3 seconds…</p>}>
  <OrderConfirmation />
</Suspense>

<button disabled={pending} aria-busy={pending}>
  {pending ? "Charging your card…" : "Place order"}
</button>

// app/checkout/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <CheckoutSkeleton />
      <p className="mt-4 text-sm text-muted-foreground">
        Loading your cart and shipping options…
      </p>
    </div>
  );
}
```

Pattern: name the action (verb + object), optionally a soft estimate. Avoid promises ("Just a second!"); under-promise.

A rough scale:

| Operation | Generic | Better |
|---|---|---|
| Sign-in submit | "Loading…" | "Signing you in…" |
| Place order | "Loading…" | "Confirming your order: 2 to 3 seconds…" |
| File upload | "Loading…" | "Uploading 3 of 12: about 8 seconds left" |
| Search | "Loading…" | "Searching {query}…" or skeleton (no copy) |
| Route transition | "Loading…" | "Loading your dashboard…" |

Docs:
- Nielsen Norman on response time: https://www.nngroup.com/articles/response-times-3-important-limits/

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Checkout pending state | fix-this-sprint |
| Sign-in / Sign-up pending | fix-this-sprint |
| Onboarding step transition | fix-this-sprint |
| Long-running upload / export (>3 s) | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | backlog |

Rarely a release-blocker, but on critical paths vague copy correlates with abandonment, so the fix-this-sprint bump is justified.

## Examples

**Anti-pattern (fails):**

```tsx
{pending && <p>Loading...</p>}
```

**Applied (passes):**

```tsx
{pending && <p>Saving your changes…</p>}
```

## Defer-to (when this is another tool's job)

- Copywriting / brand-voice linters own the exact phrasing; this rule only flags the absence of specific copy.
- i18n key audits: if `t("loading")` is everywhere, the fix is in the locale file and key routing, not the JSX.

## Suppression

```tsx
{/* ui-audit-ignore:states-generic-loading-copy, sub-200ms inline state, generic word OK */}
{pending && <Spinner aria-label="Loading" />}
```
