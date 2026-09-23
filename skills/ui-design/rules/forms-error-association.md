---
title: Associate and Announce Form Errors
id: forms-error-association
category: forms
defaultTier: release-blocker
detect: static
---

## Associate and Announce Form Errors

Tie each error to its input via `aria-describedby`, mark the field `aria-invalid`, and announce it through a live region (`role="alert"`). A message only visually near the field is invisible to screen readers. Complements `forms-inline-errors-first-focus`, which covers placement and focus.

## Detection

List the files that render a conditional error message, then keep only the ones that never mention `aria-describedby`.

```bash
rg -lP '\{\s*[\w.?]*[Ee]rror[\w.?]*\s*&&' -g '*.tsx' -g '*.jsx' src/ \
  | xargs -r rg --files-without-match -P 'aria-describedby'
```

A shared field wrapper (`<FormField>`, `<FormMessage>`, a react-hook-form `<Controller>`) can wire the association internally, leaving no literal attribute at the call site. Open the wrapper once: if it sets `aria-describedby`, `aria-invalid`, and `role="alert"`, its consumers are clean.

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
