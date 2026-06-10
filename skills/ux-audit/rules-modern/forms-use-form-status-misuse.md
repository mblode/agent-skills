---
title: useFormStatus called in same component as form (silent bug)
slug: forms-use-form-status-misuse
category: forms
defaultTier: release-blocker
surfaces: sign-in, sign-up, checkout, onboarding, form
react-apis: useFormStatus
related: forms-no-disable-while-submitting
---

## useFormStatus called in same component as form

`useFormStatus` returns the status of the **parent** `<form>`. Calling it in the same component that renders `<form>` returns `{ pending: false }` permanently: the hook has no parent form to inspect. It compiles, runs, never warns, and silently breaks every feature that depends on it (disabled submit, pending label, optimistic UI gating). Detecting this requires reading the component tree, not the React error console.

## What goes wrong

A developer reads the `useFormStatus` docs, copies the example, and writes:

```tsx
export function CheckoutForm() {
  const { pending } = useFormStatus(); // ❌ always false
  return (
    <form action={placeOrder}>
      <button disabled={pending}>Place order</button>
    </form>
  );
}
```

The button never disables. Double-click bug ships to production. There is no console warning, no TypeScript error, no test failure unless the test asserts `disabled` during pending. This is the most common useFormStatus mistake, and the React docs explicitly call it out as a caveat.

## Detection

**Surfaces:** every `<form>` that calls `useFormStatus`.

**Static signals:**
1. Find every file that imports `useFormStatus`.
2. For each, check whether the component calling `useFormStatus()` also renders a `<form>` element directly in its JSX return.
3. If yes → fail. The hook must be in a child component.
4. Acceptable shape: parent renders `<form>...<SubmitButton /></form>`, and `SubmitButton` is the component that calls `useFormStatus`.

**Concrete commands:**
```bash
# Files importing useFormStatus
rg -l 'useFormStatus' --type=tsx src/

# Of those, files where the SAME component returns a <form>
rg -l 'useFormStatus' --type=tsx src/ | while read f; do
  if rg -q '<form' "$f" && rg -q 'useFormStatus\(\)' "$f"; then
    # Heuristic: same file contains both. Read the file to confirm
    # the call site is in the component returning <form>.
    echo "$f: useFormStatus and <form> co-located: read to verify"
  fi
done

# Confirm by reading the call site context
rg -B 2 -A 8 'useFormStatus\(\)' --type=tsx src/
```

The grep is a starting heuristic; the audit must `Read` the file to confirm the hook is in the same component as the `<form>` element. A correctly factored file will have two component declarations: one with `<form>`, one with the hook.

**False-positive guards:**
- Skip files with `// ux-audit-ignore:forms-use-form-status-misuse`.
- Two components in one file is fine if `useFormStatus` is in the one that does NOT render `<form>`.
- Skip Storybook fixtures.

## Fix

Extract a child component:

```tsx
// before: silent bug
"use client";
import { useFormStatus } from "react-dom";

export function ContactForm() {
  const { pending } = useFormStatus(); // always false
  return (
    <form action={sendMessage}>
      <input name="message" />
      <button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

// after
"use client";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus(); // reads parent <form> state
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send"}
    </button>
  );
}

export function ContactForm() {
  return (
    <form action={sendMessage}>
      <input name="message" />
      <SubmitButton />
    </form>
  );
}
```

Docs:
- React: https://react.dev/reference/react-dom/hooks/useFormStatus#caveats, see "useFormStatus will not return status information for a `<form>` rendered in the same component."

## Default tier and overrides

**Defaults to:** `release-blocker`

This is a silent runtime bug that disables the entire purpose of `useFormStatus`. It blocks merge regardless of surface: whether the form is sign-in, checkout, or a comment box, the developer's intent has been silently broken.

**Surface overrides:**
| Surface | Tier |
|---|---|
| All | release-blocker |

## Examples

**Anti-pattern (fails):**

```tsx
export function NewsletterForm() {
  const { pending } = useFormStatus();
  return (
    <form action={subscribe}>
      <input name="email" />
      <button disabled={pending}>Subscribe</button>
    </form>
  );
}
```

**Applied (passes):**

```tsx
function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Subscribe</button>;
}

export function NewsletterForm() {
  return (
    <form action={subscribe}>
      <input name="email" />
      <Submit />
    </form>
  );
}
```

## Defer-to (when this is another tool's job)

- A future ESLint plugin (`eslint-plugin-react-hooks` may eventually add this rule) would catch this at write time. Until then, this audit rule is the only static check.

## Suppression

Suppression is rarely justified: this is almost always a real bug. If suppressed, document why:

```tsx
{/* ux-audit-ignore:forms-use-form-status-misuse, useFormStatus is a no-op here, kept for parity with sibling code */}
```
