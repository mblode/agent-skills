---
title: Postel's Law
impact: HIGH
kind: programmatic
prefix: decision
tags: input, validation, error-messages, robustness
related: decision-teslers-law, interaction-aesthetic-usability, cognitive-cognitive-load
---

## Postel's Law

Be liberal in what you accept, conservative in what you send (Jon Postel, RFC 760, 1980). On input, tolerate the messy ways real people type: uppercase emails, phone numbers with spaces or dashes, dates in any reasonable format, leading/trailing whitespace. Normalize on the way in.

On output, be precise. Error messages should be specific, actionable, and unambiguous. The asymmetry is the point: forgive input, but tell the user clearly what happened and what to do next.

## Check

**Surfaces:** form, error-state

**Procedure:**
1. Find input elements with a `pattern=` attribute, or `type="email" | "tel" | "url"`.
2. Check pattern strictness: `pattern="\d{10}"` rejects valid `(415) 555-1234`; case-locked email regex rejects `User@Example.com`.
3. Find error messages near inputs (`role="alert"`, `aria-invalid`, `<FormError>`). The bare strings `"invalid"`, `"error"`, `"please try again"`, or error codes alone are vague.
4. Check for `trim()`, `toLowerCase()`, or normalize calls on `onBlur` / `onChange` for the matching input.

**Concrete commands:**
```bash
rg 'pattern="' src/
rg '"(invalid|error|please try|something went wrong)"' src/
rg '\.trim\(\)|toLowerCase\(\)|normalize' src/forms/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | no rigid patterns AND specific errors AND normalization on blur |: |
| warn | one rigid pattern OR one vague error message | MEDIUM |
| fail | multiple rigid patterns OR multiple vague errors ("invalid", "error occurred", error codes only) | HIGH |

## Fix

**If fail:** Replace rigid `pattern=` with format-tolerant validation (libphonenumber for phones, `trim().toLowerCase()` for emails). Rewrite each vague error to name the cause and the next action: `"That email is already registered. Sign in or reset your password."`

**If warn:** Add `onBlur` normalization for the affected field, or rewrite the single vague error string to be specific and actionable.

## Examples

**Anti-pattern (rigid input, vague output):**

```tsx
<input
  type="email"
  pattern="[a-z]+@[a-z]+\.[a-z]+"
  onChange={(e) => {
    if (e.target.value !== e.target.value.toLowerCase()) {
      setError("Invalid input");
    }
  }}
/>

<input
  type="tel"
  pattern="\d{10}"
  // Rejects "(415) 555-1234", "415-555-1234", "+1 415 555 1234"
/>
```

**Applied (forgiving input, precise output):**

```tsx
<input
  type="email"
  autoComplete="email"
  onBlur={(e) => {
    const normalized = e.target.value.trim().toLowerCase();
    e.target.value = normalized;
  }}
/>

<input
  type="tel"
  autoComplete="tel"
  onChange={(e) => {
    const digits = e.target.value.replace(/[^\d+]/g, "");
    setPhone(formatE164(digits));
  }}
/>

{error && (
  <p role="alert">
    That email is already registered.{" "}
    <a href="/login">Sign in instead</a> or{" "}
    <a href="/reset">reset your password</a>.
  </p>
)}
```

Reference: https://lawsofux.com/postels-law/
