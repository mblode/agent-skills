---
title: Generic loading copy, "Loading…" with no context
slug: microcopy-generic-loading
category: microcopy
defaultTier: backlog
surfaces: loading-state, search, onboarding, dashboard, list, modal
react-apis: Suspense, useFormStatus, useTransition
related: states-no-skeleton, states-layout-shift, microcopy-vague-error, interaction-doherty-threshold
---

## Generic loading copy: "Loading…" with no context

"Loading…" is the placeholder you write while wiring up state and intend to come back to. It tells the user nothing about *what* is loading or *how long* to expect. A context-specific string ("Confirming your order, 2 to 3 seconds", "Searching invoices…") sets expectations, reduces perceived wait, and prevents the user from assuming the page is stuck. This is a low-stakes polish rule (not a release-blocker) but it compounds on critical paths.

## What goes wrong

A user clicks "Place order" and sees "Loading…" for four seconds. They don't know if the payment went through, if the page is hung, or if they should refresh (which would double-charge them). The same screen with "Confirming your order, please don't refresh" would have answered all three questions.

## Detection

**Surfaces:** loading state / skeleton, search, onboarding, dashboard, list, modal.

**This is a candidate-finding rule.** Regex matches "Loading" / "Please wait"; the agent decides whether each instance is a placeholder that should be specific, or an intentionally generic shell (e.g. a generic `<PageSkeleton>` component reused across surfaces, which is fine).

**Static signals:**
1. Grep for the exact placeholder phrases as JSX text.
2. For each match, Read context to determine the surface (is this a checkout? a search? a generic shell?).
3. Judge whether the surface allows a more specific string.

**Concrete commands:**
```bash
# JSX text matches: agent reviews each.
rg -n '>Loading\.{0,3}<' --type=tsx --type=ts src/
rg -n '>Please wait\.?<' --type=tsx --type=ts src/

# Variable-ish placeholders worth checking.
rg -n "'Loading'|\"Loading\"|'Please wait'|\"Please wait\"" --type=tsx --type=ts src/
```

Regex spec: `/^Loading\.{0,3}$/i` and `/^Please wait\.?$/i` against the JSX text content.

**False-positive guards:**
- Skip generic skeleton shells used on many surfaces (file name like `LoadingShell.tsx`, `<PageSkeleton>`, `<Suspense fallback={<Loading />}>`). The component name is the contract: its job is to be reusable.
- Skip a11y-only labels (`aria-label="Loading"`): screen-reader users do benefit from a generic "Loading" announcement. Field this as a separate concern.
- Skip Storybook fixtures, tests, MSW.
- Skip files with `// ux-audit-ignore:microcopy-generic-loading`.

**Agent-judgment limit:** "Loading" inside a reusable `<Spinner>` component is fine; "Loading" rendered directly in `CheckoutPage.tsx` is not. The agent decides which based on file and component name.

## Fix

Replace with the specific operation. Add a duration estimate if the operation takes >1 second predictably.

```tsx
// before
{isPending && <p>Loading…</p>}

// after: context-specific copy + duration
{isPending && <p aria-live="polite">Confirming your order, 2 to 3 seconds.</p>}

// after: search context
{deferredQuery !== query && <p>Searching invoices…</p>}

// after: combined with useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Saving your changes…' : 'Save'}
    </button>
  );
}
```

Reference:
- NN/g, Response Times: The 3 Important Limits: https://www.nngroup.com/articles/response-times-3-important-limits/
- NN/g, Progress Indicators: https://www.nngroup.com/articles/progress-indicators/
- React: https://react.dev/reference/react-dom/hooks/useFormStatus

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Checkout (payment processing) | fix-this-sprint |
| Onboarding step transitions | fix-this-sprint |
| Sign-in / Sign-up submit | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
// 1. Generic placeholder
{isLoading && <p>Loading…</p>}

// 2. Even worse on a critical path
<button disabled={pending}>{pending ? 'Please wait' : 'Place order'}</button>

// 3. Generic spinner, no copy
{isPending && <Spinner />}
```

**Applied (passes):**

```tsx
// 1. Specific operation
{isPending && <p>Confirming your order, please don't refresh.</p>}

// 2. Critical path with duration hint
<button disabled={pending}>
  {pending ? 'Charging your card, 2 to 3 seconds…' : 'Place order'}
</button>

// 3. Search with the actual query
{deferredQuery !== query && <p>Searching for "{query}"…</p>}

// 4. Onboarding step transition
{stepTransition && <p>Setting up your workspace, almost there.</p>}
```

## Defer-to (when this is another tool's job)

- **Perceived performance / actual TTFB / INP**: Lighthouse + web-vitals.
- **Skeleton CLS**: `states-layout-shift` rule.
- **Long-running progress (>10 s)**: needs a progress indicator, covered by feature playbook for loading state.

## Suppression

```tsx
{/* ux-audit-ignore:microcopy-generic-loading, generic shell reused across 12 routes */}
<Suspense fallback={<p>Loading…</p>}>
```
