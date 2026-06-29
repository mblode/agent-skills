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

A submit handler that can fire twice (button doesn't disable, the form doesn't gate on `pending`, or a slow network invites a second click) produces duplicate orders, signups, charges, and emails. Frontend guarding (disabled button) is necessary but not sufficient; backend idempotency makes it truly safe. Both belong in the fix.

## Contents
[What goes wrong](#what-goes-wrong) · [Detection](#detection) · [Fix](#fix) · [Tiers](#default-tier-and-overrides) · [Examples](#examples) · [Defer-to](#defer-to-when-this-is-another-tools-job) · [Suppression](#suppression)

## What goes wrong

Slow network, no feedback after 800ms, user clicks "Place order" again: the backend creates two orders, the user sees one email and disputes the second charge. Or signup creates two users, the second orphaned.

## Detection

**Surfaces:** sign-in, sign-up (highest), checkout, any form with a server-mutation submit.

**Static signals:**
1. `rg '<form' --type=ts -l`: every form file.
2. Confirm the submit button is disabled while the action runs. Accepted: a child component using `useFormStatus().pending` to drive `disabled` (App Router server actions); `useActionState` returning `isPending` that the form gates on; a query-library mutation with `isPending` driving `disabled`.
3. Flag forms whose button is enabled during submit.
4. **Bonus (warn, not fail):** look for an `Idempotency-Key` header or `idempotencyKey` field; true safety lives on the backend.

**Concrete commands:**
```bash
# Forms missing pending state
rg '<form' --type=ts -l | while read f; do
  rg -L 'useFormStatus|isPending|isSubmitting|pending' "$f" && echo "$f: form without pending guard"
done

# Buttons in forms not disabled by pending
rg -l '<button[^>]*type=["'"'"']submit' --type=ts src/ | while read f; do
  rg -A 5 '<button[^>]*type=["'"'"']submit' "$f" | rg -q 'disabled=' \
    || echo "$f: submit button without disabled state"
done

# Idempotency hints
rg 'Idempotency-Key|idempotencyKey' --type=ts
```

**False-positive guards:**
- Skip search forms (idempotent GETs are not a double-submit risk).
- Skip if `useFormStatus` is correctly used in a child `<SubmitButton>` (common).
- Skip `// ui-audit-ignore:async-double-submit`.

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

**Backend layer (warn-tier):** add an `Idempotency-Key` so a retry never creates a second order.

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

- Backend / API layer for true idempotency (Stripe, Paddle, Polar expose idempotency keys).
- Vercel Agent / CodeRabbit for missing-disabled detection across a diff.
- ESLint plugin enforcing `useFormStatus` patterns in form children.

## Suppression

```tsx
{/* ui-audit-ignore:async-double-submit, backend dedupes on idempotency-key */}
```
