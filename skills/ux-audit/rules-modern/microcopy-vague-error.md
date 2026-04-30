---
title: Vague error message — no cause, no recovery
slug: microcopy-vague-error
category: microcopy
defaultTier: fix-this-sprint
surfaces: sign-in, sign-up, checkout, form, search, toast, error-state
react-apis: useActionState, useFormStatus
related: microcopy-leaked-error-message, microcopy-no-action-on-empty, states-no-error-state, decision-postels-law
---

## Vague error message — no cause, no recovery

When something fails, users need two things in the copy: **what went wrong** and **what to do next**. Strings like "Error occurred", "Something went wrong", "Invalid", "Please try again", and "Oops" tell the user neither. They are placeholder text that shipped. Modern React stacks make this worse — `useActionState` and Server Actions invite developers to `return { error: 'Invalid' }` from the server and never come back to refine it.

## What goes wrong

The user submits a sign-up form. The server rejects it because the email is already registered. The screen renders "Invalid" in red below the email field. The user has no idea whether it's a typo, a server bug, or that they already have an account. They reload the page and lose their work. The actionable version — "Email already in use — sign in instead" with a link — would have rescued them in one click.

## Detection

**Surfaces:** sign-in / sign-up, checkout, form, search, toast/banner, error/404/500.

**This is a candidate-finding rule.** Regex matches surface candidates. The agent reads the surrounding JSX and decides whether the string is genuinely vague in context, or whether it's deliberately generic for a known reason (e.g. security through obscurity on auth, or it's actually a developer log).

**Static signals:**
1. Grep candidate strings across JSX/TS string literals.
2. For each match, Read 10 lines of surrounding code to confirm it renders to the user (not console.log, not test fixtures, not Sentry tags).
3. For each confirmed UI string, judge whether the surface allows a more specific message.

**Concrete commands:**
```bash
# Candidate matches — every hit needs context review.
rg -n -i 'error occurred|something went wrong|please try again|oops' \
  --type=tsx --type=ts src/

# "Invalid" is noisier — narrow to JSX text or error fields.
rg -n '"Invalid"|>Invalid<|error: ?"Invalid"' --type=tsx --type=ts src/
```

**False-positive guards:**
- **Auth security exception:** "Wrong email or password" / "Incorrect credentials" is intentionally vague to avoid leaking account existence. Pass the rule when the surface is sign-in and the message is exactly this pattern. Document the choice with a comment.
- Skip console.error / Sentry.captureException / logger.warn calls — these aren't user-facing.
- Skip test files (`*.test.tsx`, `*.spec.tsx`), Storybook fixtures (`*.stories.tsx`), and MSW handlers.
- Skip files with `// ux-audit-ignore:microcopy-vague-error` near the match.

**Agent-judgment limit:** This rule is heavier on judgment than detection. The regex is a candidate generator, not a verdict. If you can't read enough context to decide, mark the finding `unknown` with a reason rather than guess.

## Fix

Rewrite to **cause + recovery**. Cause is what failed; recovery is the next action.

```tsx
// before
{state.error && <p className="text-red-600">{state.error}</p>}
// state.error is "Invalid" from a Server Action

// after — server returns a code, client maps to specific copy + CTA
const ERRORS: Record<string, { message: string; action?: ReactNode }> = {
  EMAIL_TAKEN: {
    message: 'Email already in use.',
    action: <Link href="/signin">Sign in instead</Link>,
  },
  PASSWORD_TOO_SHORT: { message: 'Password needs at least 12 characters.' },
  RATE_LIMITED: { message: 'Too many attempts. Try again in 5 minutes.' },
};

{state.errorCode && (
  <div role="alert" className="text-red-600">
    {ERRORS[state.errorCode]?.message ?? 'Something failed on our end. Try again.'}
    {ERRORS[state.errorCode]?.action}
  </div>
)}
```

Reference:
- NN/g — Error Message Guidelines: https://www.nngroup.com/articles/error-message-guidelines/
- NN/g — How to Write a Good Error Message: https://www.nngroup.com/articles/error-message-guidelines/
- React: https://react.dev/reference/react/useActionState

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Checkout (payment errors) | release-blocker |
| Sign-up (account creation) | release-blocker |
| Sign-in | fix-this-sprint (with auth-vagueness exception above) |
| Marketing landing | backlog |
| Internal admin | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
// 1. Generic
<p>Error occurred. Please try again.</p>

// 2. Placeholder that shipped
<p>Something went wrong</p>

// 3. Useless validation
<span className="error">Invalid</span>

// 4. Friendly but empty
<Toast>Oops! Try again 🙃</Toast>
```

**Applied (passes):**

```tsx
// 1. Specific + recoverable
<p>Couldn't reach the payment provider. Your card was not charged.
   <button onClick={retry}>Try again</button>
</p>

// 2. Cause + next step
<p>Email already in use — <Link href="/signin">sign in instead</Link>.</p>

// 3. Field-level cause
<span>Phone number must include country code (e.g. +1).</span>

// 4. Save-state preserved
<Toast>Couldn't save — your changes are still here.
  <button onClick={retry}>Try again</button>
</Toast>
```

## Defer-to (when this is another tool's job)

- **Copywriting tone / brand voice review** — content-design tooling, not UX audit.
- **i18n string completeness** — i18n linter (e.g. `i18next-parser`).
- **WCAG: error association with field** — axe / jsx-a11y `aria-describedby` checks.

## Suppression

```tsx
{/* ux-audit-ignore:microcopy-vague-error — security: do not reveal whether email exists */}
<p>Wrong email or password.</p>
```
