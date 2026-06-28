---
title: Associate and Announce Form Errors
impact: CRITICAL
impactDescription: makes validation failures reachable by assistive tech
tags: forms, validation, accessibility, aria
---

## Associate and Announce Form Errors

An error message must be programmatically tied to its input via `aria-describedby`, the field marked `aria-invalid`, and the error announced through a live region (`role="alert"`). A message that is only visually near the field is invisible to screen readers. Complements `forms-inline-errors-first-focus`, which covers placement and focus.

**Incorrect (orphan error text, no announcement):**

```tsx
<input name="email" />
<span className="error">Enter a valid email</span>
```

**Correct (associated, marked invalid, announced):**

```tsx
<input
  name="email"
  aria-invalid={Boolean(error)}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <span id="email-error" role="alert">Enter a valid email</span>}
```
