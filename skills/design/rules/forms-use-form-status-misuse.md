---
title: useFormStatus called in same component as form (silent bug)
id: forms-use-form-status-misuse
category: forms
defaultTier: release-blocker
detect: static
related: forms-no-disable-while-submitting
---

## useFormStatus called in same component as form (silent bug)

`useFormStatus` returns the **parent** `<form>`'s status. Called in the same component that renders the `<form>`, it returns `{ pending: false }` forever (no parent form to inspect). It compiles, runs, never warns, and silently breaks everything depending on it (disabled submit, pending label, optimistic UI gating). Detecting it means reading the component tree, not the console.

## What goes wrong

A developer copies the docs example:

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

The button never disables; a double-click bug ships. No console warning, no TypeScript error, no test failure unless a test asserts `disabled` during pending. This is the most common `useFormStatus` mistake, called out as a caveat in the React docs.

## Detection

**Surfaces:** every `<form>` that calls `useFormStatus`.

**Static signals:**
1. Find every file importing `useFormStatus`.
2. Check whether the component calling `useFormStatus()` also renders a `<form>` directly in its JSX.
3. If yes, fail: the hook must live in a child component.
4. Acceptable shape: parent renders `<form>...<SubmitButton /></form>` where `SubmitButton` calls `useFormStatus`.

**Concrete commands:**
```bash
# Files importing useFormStatus
rg -l 'useFormStatus' --type=ts src/

# Of those, files where the SAME component returns a <form>
rg -l 'useFormStatus' --type=ts src/ | while read f; do
  if rg -q '<form' "$f" && rg -q 'useFormStatus\(\)' "$f"; then
    # Heuristic: same file contains both. Read the file to confirm
    # the call site is in the component returning <form>.
    echo "$f: useFormStatus and <form> co-located: read to verify"
  fi
done

# Confirm by reading the call site context
rg -B 2 -A 8 'useFormStatus\(\)' --type=ts src/
```

The grep is a heuristic; `Read` the file to confirm the hook is in the same component as `<form>`. A correctly factored file has two components: one with `<form>`, one with the hook.

**False-positive guards:**
- Skip files with `// ui-audit-ignore:forms-use-form-status-misuse`.
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
      <button type="submit" disabled={pending} aria-busy={pending}>
        Send{pending && <Spinner aria-hidden="true" />}
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
    <button type="submit" disabled={pending} aria-busy={pending}>
      Send{pending && <Spinner aria-hidden="true" />}
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

A silent runtime bug that nullifies `useFormStatus` entirely. Blocks merge regardless of surface (sign-in, checkout, or comment box): the developer's intent is silently broken.

**Surface overrides:**
| Surface | Tier |
|---|---|
| All | release-blocker |

## Defer-to (when this is another tool's job)

- `eslint-plugin-react-hooks` may add a rule that catches this at write time; absent that, this audit is the only static check.

## Suppression

Rarely justified (almost always a real bug). If suppressed, document why:

```tsx
{/* ui-audit-ignore:forms-use-form-status-misuse, useFormStatus is a no-op here, kept for parity with sibling code */}
```
