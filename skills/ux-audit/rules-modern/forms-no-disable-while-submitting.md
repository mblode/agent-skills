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

A double-clickable submit button creates duplicate accounts, double-charges credit cards, and posts the same comment twice. React 19's `useFormStatus` makes the fix mechanical: a child component reads `pending` from the surrounding `<form>` and disables itself + swaps its label. Forms without this protection are release blockers on any monetary or account-creation surface.

## What goes wrong

User clicks "Place order." Network is slow. Button stays enabled-looking. User clicks again. Two POSTs go out before the first response. Server creates two orders, charges twice. Or: sign-up form with no debouncing — the user clicks "Create account" three times during a 4-second hand-off; backend creates one account but logs two errors and one success.

## Detection

**Surfaces:** every `<form>` that submits.

**Static signals:**
1. Find every `<form>` element in scope.
2. For each, find the submit `<button type="submit">` (or default-typed button inside the form).
3. The button (or its parent component) must reference one of: `useFormStatus().pending`, `isPending` from `useActionState`, `isSubmitting`, an explicit `disabled={pending}` prop.
4. If none present, fail.

**Concrete commands:**
```bash
# Forms in scope
rg -l '<form' --type=tsx src/

# For each form file, look for any pending-aware mechanism
rg -l '<form' --type=tsx src/ | while read f; do
  rg -L 'useFormStatus|isPending|isSubmitting|disabled=\{.*pending' "$f" \
    && echo "$f: form without pending-aware submit"
done

# Submit buttons that hard-code disabled=false or no disabled at all
rg '<button[^>]*type=["\']submit' --type=tsx src/
```

**False-positive guards:**
- Skip files with `// ux-audit-ignore:forms-no-disable-while-submitting`.
- Skip Storybook fixtures.
- Skip search forms where idempotent re-submission is intentional (covered by `async-out-of-order-responses`).
- Skip filter / facet forms that are GET-style and idempotent.

## Fix

Use `useFormStatus` in a child `SubmitButton`. The hook **must** live in a child of `<form>`, not the same component that renders `<form>` (see `forms-use-form-status-misuse`):

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

If you already use `useActionState`, you can read `isPending` directly:

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

Docs:
- React: https://react.dev/reference/react-dom/hooks/useFormStatus
- React: https://react.dev/reference/react/useActionState

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

Double-submit on a payment is real money lost; this is one of the few rules that defaults to release-blocker without further reasoning.

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

- Idempotency keys at the API layer are the durable fix; UI-level disable is the second line of defense. Both should exist on payment surfaces.
- React Hook Form's `formState.isSubmitting` for codebases that haven't migrated to React 19.

## Suppression

```tsx
{/* ux-audit-ignore:forms-no-disable-while-submitting — search form, idempotent */}
<form action={searchAction}>
```
