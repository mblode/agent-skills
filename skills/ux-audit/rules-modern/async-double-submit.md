---
title: Double-submit possible (no pending guard)
slug: async-double-submit
category: async
defaultTier: release-blocker
surfaces: sign-in, sign-up, checkout, form, modal
react-apis: useFormStatus, useActionState, button disabled, idempotency keys
related: forms-no-disable-while-submitting, async-optimistic-without-rollback, states-no-error-state
---

## Double-submit possible (no pending guard)

If a submit handler can fire twice (because the button doesn't disable, the form doesn't gate on `pending`, or the network is slow and the user clicks again) you get duplicate orders, duplicate signups, double-charged cards, and duplicate emails. Frontend guarding (disabled button) is necessary but not sufficient; idempotency on the backend is what makes this truly safe. Both belong in the fix.

## What goes wrong

User clicks "Place order." Network is slow. After 800ms with no visible feedback they click again. The backend creates two orders. The user sees only one in their email and disputes the second charge. Or: signup creates two users, the second one orphaned.

## Detection

**Surfaces:** sign-in, sign-up (highest), checkout, any form with a server-mutation submit.

**Static signals:**
1. `rg '<form' --type=tsx -l`: every form file.
2. For each, confirm the submit button is disabled while the action runs. Three accepted patterns:
   - Child component using `useFormStatus().pending` to drive `disabled` (App Router server actions).
   - `useActionState` returning `isPending` and the form gates on it.
   - A query library mutation with `isPending` driving `disabled`.
3. Flag forms whose button is enabled during submit.
4. **Bonus check (warn, not fail):** look for an `Idempotency-Key` header or `idempotencyKey` field in the request; true safety lives on the backend.

**Concrete commands:**
```bash
# Forms missing pending state
rg '<form' --type=tsx -l | while read f; do
  rg -L 'useFormStatus|isPending|isSubmitting|pending' "$f" && echo "$f: form without pending guard"
done

# Buttons in forms not disabled by pending
rg -A 5 '<button[^>]*type=["'"'"']submit' --type=tsx | rg -L 'disabled='

# Idempotency hints
rg 'Idempotency-Key|idempotencyKey' --type=tsx
```

**False-positive guards:**
- Skip search forms (idempotent GETs are not a double-submit risk).
- Skip if `useFormStatus` is correctly used in a child `<SubmitButton>` (very common).
- Skip files annotated `// ux-audit-ignore:async-double-submit`.

## Fix

Use `useFormStatus` from a child component (it must read the parent `<form>`'s status; same-component usage returns `pending: false`).

```tsx
// before: submit fires twice on slow net
'use client';
function CheckoutForm({ action }: { action: (fd: FormData) => Promise<void> }) {
  return (
    <form action={action}>
      <input name="card" />
      <button type="submit">Place order</button>
    </form>
  );
}

// after: disabled button + child useFormStatus + label change
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Placing order…' : 'Place order'}
    </button>
  );
}

export function CheckoutForm({ action }: { action: (fd: FormData) => Promise<void> }) {
  return (
    <form action={action}>
      <input name="card" />
      <SubmitButton />
    </form>
  );
}
```

**Backend layer (warn-tier finding):** add an `Idempotency-Key` so a retry never creates a second order.

```ts
// server action
const key = formData.get('idempotency-key') as string;
await processOrder({ idempotencyKey: key, ... });
```

Docs:
- React useFormStatus: https://react.dev/reference/react-dom/hooks/useFormStatus
- React useActionState: https://react.dev/reference/react/useActionState
- Stripe Idempotency Keys: https://stripe.com/docs/api/idempotent_requests

## Default tier and overrides

**Defaults to:** `release-blocker`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-up | release-blocker (duplicate accounts) |
| Checkout | release-blocker (double-charge) |
| Sign-in | release-blocker (rate-limit lockout) |
| Comment / message form | fix-this-sprint |
| Internal admin | fix-this-sprint |

## Examples

**Anti-pattern (fails):**
```tsx
<form action={placeOrder}>
  <button type="submit">Place order</button>
</form>
```

**Applied (passes):**
```tsx
<form action={placeOrder}>
  <input type="hidden" name="idempotency-key" value={crypto.randomUUID()} />
  <SubmitButton />
</form>
```

## Defer-to (when this is another tool's job)

- Backend / API layer for true idempotency (Stripe, Paddle, Polar all expose idempotency keys).
- Vercel Agent / CodeRabbit for missing-disabled detection across diff.
- ESLint plugin enforcing `useFormStatus` patterns in form children.

## Suppression

```tsx
{/* ux-audit-ignore:async-double-submit, backend dedupes on idempotency-key */}
```
