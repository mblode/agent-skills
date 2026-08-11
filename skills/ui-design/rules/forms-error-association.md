---
title: Associate and Announce Form Errors
impact: CRITICAL
impactDescription: makes validation failures reachable by assistive tech
tags: forms, validation, accessibility, aria
---

## Associate and Announce Form Errors

Tie each error to its input via `aria-describedby`, mark the field `aria-invalid`, and announce it through a live region (`role="alert"`). A message only visually near the field is invisible to screen readers. Complements `forms-inline-errors-first-focus`, which covers placement and focus.

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
