---
title: Form data lost on validation error
id: forms-lost-data-on-error
category: forms
defaultTier: fix-this-sprint
detect: static
related: forms-no-disable-while-submitting, forms-use-form-status-misuse
---

## Form data lost on validation error

When a form fails server validation, typed values must survive the round-trip. Clearing fields on error is one of the highest-cost UX bugs in production: users abandon checkout, retype passwords wrong, lose multi-paragraph inputs. React 19's `useActionState` makes preservation the default, but only if the action returns `state.fields` and inputs use `defaultValue`.

## What goes wrong

User submits sign-in; server returns "Invalid password"; the email field is blank again. User retypes the email (sometimes wrong) and the password manager autofills the wrong account. Or: a checkout shipping-address form clears all 8 fields when the server rejects a ZIP mismatch.

Two code shapes cause this:

1. `useState` per field plus `setEmail("")` (or implicit `e.currentTarget.reset()`) inside the error branch.
2. A form action that returns only `{ error }` without echoing the submitted fields.

## Detection

**Surfaces:** sign-in, sign-up, checkout, onboarding, multi-step form.

**Static signals:**
1. `rg '<form' --type=ts -l`: list form files in scope.
2. Per form, read the action's return shape (`useActionState`): it must include `fields` (or per-field values) on the error path.
3. Find explicit clears: `\.reset\(\)`, `setEmail\(""\)`, `setPassword\(""\)`, `setForm\(initialState\)` inside `catch` or error branches.
4. Inputs must use `defaultValue={state.fields?.email}` (uncontrolled, seeded) OR `value={state.fields?.email}` (controlled).
5. Fail: no `state.fields` echo AND no controlled-input preservation.

**Concrete commands:**
```bash
# Find forms in scope
rg '<form' --type=ts -l src/

# Find action handlers that don't echo input on error
rg -l 'useActionState' --type=ts src/ | while read f; do
  rg -A 20 'useActionState' "$f" | rg -q 'return \{ error' \
    && ! rg -q 'fields' "$f" \
    && echo "$f: action error path does not preserve submitted fields"
done

# Find suspicious clears in catch blocks
rg -B 2 -A 5 'catch' --type=ts src/ | rg 'reset\(\)|set\w+\(""\)|set\w+\(null\)'

# Find inputs that aren't seeded with prior value
rg '<input' --type=ts src/ | rg -v 'defaultValue|value='
```

**False-positive guards:**
- Skip files containing `// ui-audit-ignore:forms-lost-data-on-error`.
- Skip Storybook fixtures (`*.stories.tsx`) and `*.test.tsx` forms.
- Skip password-only fields where clearing is intentional (`type="password"` plus an `intentional clear` comment).

## Fix

Use `useActionState` and echo `fields` from the server action:

```tsx
// before
"use client";
import { useState } from "react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn({ email, password });
    if (!res.ok) {
      setError(res.error);
      setEmail("");      // ❌ user's email is gone
      setPassword("");   // ❌ password manager will try to refill
    }
  }
  return <form onSubmit={onSubmit}>...</form>;
}

// after
"use client";
import { useActionState } from "react";
import { signInAction } from "./actions";

export function SignInForm() {
  const [state, action, isPending] = useActionState(signInAction, {
    error: null,
    fields: { email: "" },
  });
  return (
    <form action={action}>
      <input
        name="email"
        type="email"
        defaultValue={state.fields?.email ?? ""}
        aria-invalid={state.fieldErrors?.email ? "true" : undefined}
      />
      <input name="password" type="password" />
      {state.error && <p role="alert">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}

// actions.ts
"use server";
export async function signInAction(_prev: State, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const res = await auth.signIn({ email, password });
  if (!res.ok) {
    return { error: res.error, fields: { email } }; // password is NOT echoed
  }
  redirect("/");
}
```

Docs:
- React: https://react.dev/reference/react/useActionState
- React server actions: https://react.dev/reference/rsc/server-functions

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | release-blocker |
| Checkout | release-blocker |
| Onboarding | release-blocker |
| Internal admin tools | backlog |
| Marketing landing form | backlog |

Data loss on critical paths (payment, account creation, multi-step) is a release blocker: the cost compounds across millions of submissions.

## Defer-to (when this is another tool's job)

- jsx-a11y enforces `aria-invalid` at lint time.
- React Hook Form / Zod resolvers handle client-side preservation where the form is not driven by a React action.

## Suppression

```tsx
{/* ui-audit-ignore:forms-lost-data-on-error, password reset form intentionally clears for security */}
<form action={resetAction}>
```
