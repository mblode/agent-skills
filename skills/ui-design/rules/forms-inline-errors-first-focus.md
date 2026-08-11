---
title: Show Inline Errors and Focus the First Invalid Field
id: forms-inline-errors-first-focus
category: forms
defaultTier: fix-this-sprint
detect: static
---

## Show Inline Errors and Focus the First Invalid Field

On submit, reveal all relevant errors and move focus to the first failing field. Errors the user has to hunt for are the point where they abandon the form.

## Detection

List the files containing a `<form>`, then keep only the ones that never move focus.

```bash
rg -lP '<form\b' -g '*.tsx' -g '*.jsx' src/ \
  | xargs -r rg --files-without-match -P '\.focus\(\)|autoFocus|shouldFocusError'
```

A form that leans on native constraint validation (`required` inputs, no `noValidate`) also matches, and there the browser focuses the first invalid field itself. Distinguish by the submit handler: if it calls `preventDefault` and validates in JS, focus is the code's job.

**Incorrect (generic top error only):**

```tsx
{hasError && <p>Form invalid</p>}
```

**Correct (field-level message and focus management):**

```tsx
{errors.email && <p id="email-error">Enter a valid email address</p>}
<input aria-invalid={Boolean(errors.email)} aria-describedby="email-error" />

if (errors.email) {
  emailRef.current?.focus()
}
```
