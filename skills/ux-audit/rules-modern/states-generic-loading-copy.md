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

"Loading…" is the lowest-effort fallback string. It tells the user nothing about what is happening, how long it might take, or whether they should wait. Replacing it with one specific sentence — "Confirming your order — 2 to 3 seconds" — costs nothing at runtime, dramatically improves perceived progress, and gives the user a reason to wait. This is a polish-tier rule; it ships often and it ships everywhere.

## What goes wrong

A checkout "Place order" click triggers a 4-second server roundtrip. The button label changes to "Loading…" The user has no idea whether the payment is being charged, whether the cart is being validated, or whether the page is broken. Some users panic-click. Or: a Next.js `loading.tsx` file at the route level renders `<p>Loading…</p>` and that's all the user sees during a 1.5-second route transition.

## Detection

**Surfaces:** every loading state, every Suspense fallback, every pending button label.

**Static signals:**
1. Find loading copy strings: literal `Loading`, `Loading...`, `Loading…`, `Please wait`, `Wait...`.
2. Match the regex `^Loading\.{0,3}$` (case-insensitive) on string literals inside JSX, Suspense `fallback` props, button labels, and `loading.tsx` content.
3. Each match is a candidate. Severity scales with surface: a `loading.tsx` for a route is more visible than a 200 ms inline pending label.

**Concrete commands:**
```bash
# Generic Loading copy in JSX
rg -i '"Loading\.{0,3}"|>Loading\.{0,3}<|`Loading\.{0,3}`' --type=tsx --type=jsx src/ app/

# Pending button labels
rg 'pending\s*\?\s*"Loading' --type=tsx src/

# Suspense fallback with generic copy
rg 'fallback=\{<\w*>Loading' --type=tsx src/

# loading.tsx contents
find app -name 'loading.tsx' -o -name 'loading.jsx' | xargs rg -l 'Loading\.{0,3}'

# Catch "Please wait" and friends
rg -i '"please wait"|>please wait<' --type=tsx src/
```

**False-positive guards:**
- Skip files with `// ux-audit-ignore:states-generic-loading-copy`.
- Skip Storybook fixtures and test files.
- Skip i18n key references (`t("loading")`); follow up by inspecting the locale file separately.
- Skip JSDoc / comment strings.
- Skip components where the loading state is sub-200 ms typical (no time to read anything; a generic word is fine).

## Fix

Write one sentence describing what is happening, ideally with a soft time estimate when known:

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
<Suspense fallback={<p>Confirming your order — 2 to 3 seconds…</p>}>
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

Pattern: name the action (verb + object), optionally give a soft estimate. Avoid promises ("Just a second!") — under-promise.

A rough scale:

| Operation | Generic | Better |
|---|---|---|
| Sign-in submit | "Loading…" | "Signing you in…" |
| Place order | "Loading…" | "Confirming your order — 2 to 3 seconds…" |
| File upload | "Loading…" | "Uploading 3 of 12 — about 8 seconds left" |
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

This is rarely a release-blocker — but on critical paths, vague copy correlates with abandonment, so the bump to fix-this-sprint is justified.

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

- Copywriting review tools / brand-voice linters — they own the exact phrasing. This rule only flags the absence of any specific copy.
- i18n key audits — if the key is `t("loading")` everywhere, the fix is in the locale file and the routing of keys, not the JSX.

## Suppression

```tsx
{/* ux-audit-ignore:states-generic-loading-copy — sub-200ms inline state, generic word OK */}
{pending && <Spinner aria-label="Loading" />}
```
