---
title: Show Inline Errors and Focus the First Invalid Field
impact: HIGH
impactDescription: reduces abandonment during correction
tags: forms, validation, errors
---

## Show Inline Errors and Focus the First Invalid Field

On submit, reveal all relevant errors and move focus to the first failing field.

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
