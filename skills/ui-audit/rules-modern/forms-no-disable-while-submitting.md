---
title: Submit button not disabled while pending
slug: forms-no-disable-while-submitting
category: forms
defaultTier: release-blocker
surfaces: sign-in, sign-up, checkout, onboarding, form
react-apis: useFormStatus, useActionState
related: forms-use-form-status-misuse, forms-lost-data-on-error
---

## Submit button not disabled while pending

A double-clickable submit button creates duplicate accounts, double-charges cards, and posts the same comment twice. React 19's `useFormStatus` makes the fix mechanical: a child component reads `pending` from the surrounding `<form>`, disables itself, and swaps its label. Unprotected forms are release blockers on any monetary or account-creation surface.

## Contents
[What goes wrong](#what-goes-wrong) · [Detection](#detection) · [Fix](#fix) · [Tiers](#default-tier-and-overrides) · [Examples](#examples) · [Defer-to](#defer-to-when-this-is-another-tools-job) · [Suppression](#suppression)

## What goes wrong

Slow network, button stays enabled, user clicks again: two POSTs fire before the first response and the server creates two orders, charging twice. Or three rapid clicks on an un-debounced sign-up during a 4-second hand-off log two errors and one success.

## Detection

**Surfaces:** every `<form>` that submits.

**Static signals:**
1. Find every `<form>` in scope.
2. Find its submit `<button type="submit">` (or default-typed button inside the form).
3. The button (or its parent) must reference one of: `useFormStatus().pending`, `isPending` from `useActionState`, `isSubmitting`, or an explicit `disabled={pending}` prop.
4. If none present, fail.

**Concrete commands:**
```bash
# Forms in scope
rg -l '<form' --type=ts src/

# For each form file, look for any pending-aware mechanism
rg -l '<form' --type=ts src/ | while read f; do
  rg -L 'useFormStatus|isPending|isSubmitting|disabled=\{.*pending' "$f" \
    && echo "$f: form without pending-aware submit"
done

# Submit buttons that hard-code disabled=false or no disabled at all
rg '<button[^>]*type=["\']submit' --type=ts src/
```

**False-positive guards:**
- Skip `// ui-audit-ignore:forms-no-disable-while-submitting` and Storybook fixtures.
- Skip search forms where idempotent re-submission is intentional (covered by `async-out-of-order-responses`).
- Skip filter / facet forms that are GET-style and idempotent.

## Fix

Use `useFormStatus` in a child `SubmitButton`. The hook **must** live in a child of `<form>`, not the component that renders `<form>` (see `forms-use-form-status-misuse`):

```tsx
// before
"use client";
export function CheckoutForm() {
  return (
    <form action={placeOrder}>
      {/* fields */}
      <button type="submit">Place order</button>
    </form>
  );
}

// after
"use client";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? "Placing order…" : "Place order"}
    </button>
  );
}

export function CheckoutForm() {
  return (
    <form action={placeOrder}>
      {/* fields */}
      <SubmitButton />
    </form>
  );
}
```

If you already use `useActionState`, read `isPending` directly:

```tsx
const [state, action, isPending] = useActionState(placeOrderAction, initial);
return (
  <form action={action}>
    {/* fields */}
    <button type="submit" disabled={isPending}>
      {isPending ? "Placing order…" : "Place order"}
    </button>
  </form>
);
```

**Backend layer (warn-tier):** disabling the button is necessary but not sufficient; a slow network or a retry can still fire a second request. True safety lives on the backend: pass an `Idempotency-Key` so a repeat never creates a second order or charge.

```ts
// server action
const key = formData.get('idempotency-key') as string;
await processOrder({ idempotencyKey: key, ... });
```

Docs:
- React: https://react.dev/reference/react-dom/hooks/useFormStatus
- React: https://react.dev/reference/react/useActionState
- Stripe Idempotency Keys: https://stripe.com/docs/api/idempotent_requests

## Default tier and overrides

**Defaults to:** `release-blocker`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Checkout / Payment | release-blocker |
| Sign-up | release-blocker |
| Sign-in | release-blocker |
| Comment / message send | fix-this-sprint |
| Newsletter signup | fix-this-sprint |
| Internal admin | fix-this-sprint |
| Search / filter | N/A (idempotent) |

Double-submit on a payment is real money lost; one of the few rules that defaults to release-blocker without further reasoning.

## Examples

**Anti-pattern (fails):**

```tsx
<form action={placeOrder}>
  <input name="card" />
  <button type="submit">Place order</button> {/* always enabled */}
</form>
```

**Applied (passes):**

```tsx
<form action={placeOrder}>
  <input name="card" />
  <SubmitButton />
</form>
```

## Defer-to (when this is another tool's job)

- Idempotency keys at the API layer are the durable fix; UI-level disable is the second line of defense. Both belong on payment surfaces.
- React Hook Form's `formState.isSubmitting` for codebases not yet on React 19.

## Suppression

```tsx
{/* ui-audit-ignore:forms-no-disable-while-submitting, search form, idempotent */}
<form action={searchAction}>
```
