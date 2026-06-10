---
title: Form data lost on validation error
slug: forms-lost-data-on-error
category: forms
defaultTier: fix-this-sprint
surfaces: sign-in, sign-up, checkout, onboarding, form
react-apis: useActionState, useFormStatus, server actions
related: forms-no-disable-while-submitting, forms-use-form-status-misuse, forms-no-normalize
---

## Form data lost on validation error

When a form fails server validation, the user's typed values must survive the round-trip. Clearing fields on error is one of the highest-cost UX bugs in production: users abandon checkout, retype passwords incorrectly, and lose multi-paragraph inputs. React 19's `useActionState` makes preservation the default, but only if the action returns `state.fields` and the inputs use `defaultValue`.

## What goes wrong

User submits a sign-in form. Server returns "Invalid password." The email field is blank again. User retypes the email (sometimes wrong this time) and the password manager autofills the wrong account. Or: a checkout shipping-address form clears all 8 fields when the server rejects a ZIP code mismatch.

Two common code shapes cause this:

1. `useState` per field plus `setEmail("")` (or implicit `e.currentTarget.reset()`) inside the error branch.
2. A form action that returns only `{ error }` without echoing the submitted fields.

## Detection

**Surfaces:** sign-in, sign-up, checkout, onboarding, multi-step form.

**Static signals:**
1. `rg '<form' --type=tsx -l`: list all form-bearing files in scope.
2. For each, check whether the action handler returns user input. Search for `useActionState` and read the action's return shape: it must include `fields` (or per-field values) on the error path.
3. Search for explicit clear patterns: `\.reset\(\)`, `setEmail\(""\)`, `setPassword\(""\)`, `setForm\(initialState\)` inside `catch` or error branches.
4. Inputs must use `defaultValue={state.fields?.email}` (uncontrolled with seeded default) OR `value={state.fields?.email}` if controlled.
5. Count: forms with no `state.fields` echo AND no controlled-input preservation = fail.

**Concrete commands:**
```bash
# Find forms in scope
rg '<form' --type=tsx -l src/

# Find action handlers that don't echo input on error
rg -A 20 'useActionState' --type=tsx src/ | rg -B 2 'return \{ error' | rg -L 'fields'

# Find suspicious clears in catch blocks
rg -B 2 -A 5 'catch' --type=tsx src/ | rg 'reset\(\)|set\w+\(""\)|set\w+\(null\)'

# Find inputs that aren't seeded with prior value
rg '<input' --type=tsx src/ | rg -v 'defaultValue|value='
```

**False-positive guards:**
- Skip files containing `// ux-audit-ignore:forms-lost-data-on-error`.
- Skip Storybook fixtures (`*.stories.tsx`).
- Skip forms inside `*.test.tsx` files.
- Skip password-only fields where clearing is intentional (look for `type="password"` AND a comment like `intentional clear`).

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

Data loss on critical paths (payment, account creation, multi-step flows) is a release blocker: the cost of the bug compounds across millions of submissions.

## Examples

**Anti-pattern (fails):**

```tsx
const [form, setForm] = useState({ email: "", password: "" });
async function onSubmit(e) {
  e.preventDefault();
  const res = await fetch("/api/signin", { ... });
  if (!res.ok) {
    e.currentTarget.reset(); // wipes both fields
    setError("Try again");
  }
}
```

**Applied (passes):**

```tsx
const [state, action] = useActionState(signInAction, { fields: {} });
return (
  <form action={action}>
    <input name="email" defaultValue={state.fields?.email} />
    <input name="password" type="password" />
  </form>
);
```

## Defer-to (when this is another tool's job)

- jsx-a11y for `aria-invalid` enforcement at lint time.
- React Hook Form / Zod resolvers for client-side preservation if the team is not on React 19 yet.

## Suppression

```tsx
{/* ux-audit-ignore:forms-lost-data-on-error, password reset form intentionally clears for security */}
<form action={resetAction}>
```
