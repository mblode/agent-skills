---
title: Leaked raw error message in UI
slug: microcopy-leaked-error-message
category: microcopy
defaultTier: release-blocker
surfaces: checkout, sign-in, sign-up, form, error-state, toast, dashboard
react-apis: useActionState, error-boundary, Suspense
related: microcopy-vague-error, states-no-error-state, async-no-error-boundary
---

## Leaked raw error message in UI

Rendering `error.message`, `e.stack`, or a stringified error directly into JSX exposes implementation details to users, and frequently to attackers. SQL fragments, ORM stack traces, AWS error codes, payment-provider raw responses, and internal endpoint paths routinely appear in production UIs because the dev wrote `<p>{error.message}</p>` and never came back. This is a **release-blocker security and trust issue**: it leaks stack info, embarrasses the brand, and confuses users with text written for engineers.

## What goes wrong

A checkout fails because Stripe returns `card_declined: insufficient_funds`. The catch block does `setError(e.message)` and the UI shows the user `StripeError: Your card has insufficient funds. Request ID req_AbC123 at /v1/payment_intents`. The user sees "Request ID" and assumes a bug; support gets a screenshot ticket; the user abandons checkout. The fix is to log the raw error server-side and show the user "Card was declined, try another card or contact your bank."

## Detection

**Surfaces:** every surface that catches errors. Checkout, sign-in, sign-up, form, error/404/500 page, toast, dashboard.

**This is a candidate-finding rule.** Regex finds renders of error properties; the agent confirms each is user-facing (not a logger, not a dev-only `<ErrorOverlay>`).

**Static signals:**
1. Grep error-property renders inside JSX.
2. For each match, Read context to confirm: is this in JSX returned to the user, or is it `console.error` / `Sentry.captureException` / `logger.error`?
3. Check whether the error is sanitized through a known-codes map before rendering.

**Concrete commands:**
```bash
# error.message / e.message / err.message rendered into JSX.
rg -n '\{(error|err|e)\.(message|stack)\}' --type=tsx --type=ts src/
rg -n '\{String\((error|err|e)\)\}' --type=tsx --type=ts src/
rg -n '\{JSON\.stringify\((error|err|e)\)\}' --type=tsx --type=ts src/

# String-concatenated error objects.
rg -n "'.*' \+ (error|err|e)\.message" --type=tsx --type=ts src/

# Common provider-raw-response leaks.
rg -n -i 'stripeError|paypalError|awsError|errorCode.*amazonaws' --type=tsx --type=ts src/

# SQL fragments leaking through (ORM error passthroughs).
rg -n -i 'SELECT \*|UPDATE .* SET|duplicate key|relation .* does not exist' --type=tsx --type=ts src/
```

**False-positive guards:**
- **Logging-only is fine.** `Sentry.captureException(error)`, `console.error(error)`, `logger.error({ err })` are correct; these never reach the user.
- Skip dev-only overlays: Next.js `error.tsx` in dev shows raw stacks via the framework; only fail when raw error renders to **production** UI.
- Skip `<ErrorBoundary fallback={...}>` if the fallback uses sanitized text and the raw error is only passed to `componentDidCatch` for logging.
- Skip files with `// ux-audit-ignore:microcopy-leaked-error-message`.

**Agent-judgment limit:** Distinguishing "shown in UI" from "logged" requires reading the surrounding code. The regex finds candidates; the agent confirms by tracing where the value is used. If unclear, mark `unknown` with the file and line.

## Fix

Catch the error, log the full thing server-side, surface a sanitized user-friendly message keyed off `error.code` or HTTP status. Always provide a fallback for unmapped errors.

```tsx
// before: leaks raw provider message
try {
  await placeOrder(formData);
} catch (e) {
  setError(e.message); // -> "StripeError: card_declined ... req_AbC123"
}

// after: known-codes map + safe fallback + server log
const PAYMENT_ERRORS: Record<string, string> = {
  card_declined: 'Card was declined. Try another card or contact your bank.',
  insufficient_funds: 'Card has insufficient funds. Try another card.',
  expired_card: 'Card has expired. Update or use another card.',
  processing_error: 'Couldn\'t process payment. Try again in a moment.',
};

try {
  await placeOrder(formData);
} catch (e) {
  // Server-side: full structured log with request id, user id, raw error.
  logger.error({ err: e, userId, action: 'placeOrder' });
  // Client-side: sanitized.
  const code = (e as { code?: string }).code;
  setError(
    PAYMENT_ERRORS[code ?? ''] ??
      "Something went wrong on our end, we've been notified. Try again.",
  );
}
```

For Server Actions: log full error server-side, return a structured `{ ok: false, errorCode }`: never raw `e.message`.

Reference:
- OWASP, Improper Error Handling: https://owasp.org/www-community/Improper_Error_Handling
- NN/g, Error Message Guidelines: https://www.nngroup.com/articles/error-message-guidelines/
- React, Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

## Default tier and overrides

**Defaults to:** `release-blocker`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Checkout / payment | release-blocker |
| Sign-in / Sign-up | release-blocker |
| Public marketing | release-blocker (brand + trust) |
| Internal admin tools (employees only) | fix-this-sprint |
| Local dev overlay | not applicable |

This rule **does not** drop below `fix-this-sprint` because even on internal tools, leaked SQL or stack traces is a security smell.

## Examples

**Anti-pattern (fails):**

```tsx
// 1. Direct passthrough
catch (e) { return <p className="error">{e.message}</p>; }

// 2. Stack trace in UI
{error && <pre>{error.stack}</pre>}

// 3. Stringified error object
<Toast>{JSON.stringify(error)}</Toast>

// 4. Concatenated, still leaks
<p>{`Failed: ${err.message}`}</p>

// 5. Provider raw
<p>{stripeError.raw.message}</p>
```

**Applied (passes):**

```tsx
// 1. Mapped + safe fallback
<p role="alert">{PAYMENT_ERRORS[code] ?? "Something went wrong on our end, we've been notified. Try again."}</p>

// 2. Logger gets full detail; UI gets a code only
catch (e) { Sentry.captureException(e); setError({ code: 'GENERIC' }); }

// 3. Error boundary with sanitized fallback
<ErrorBoundary fallback={<RecoverScreen />} onError={(e) => Sentry.captureException(e)}>
  <Checkout />
</ErrorBoundary>
```

## Defer-to (when this is another tool's job)

- **Server-side error logging completeness**: APM tooling (Sentry, Datadog).
- **PII redaction in logs**: log scrubber config, not UX audit.
- **Generic XSS / injection**: security review / SAST tools.

## Suppression

Suppression is **strongly discouraged** for this rule. If you must:

```tsx
{/* ux-audit-ignore:microcopy-leaked-error-message, internal tool, errors include user-controlled query strings only */}
<pre>{error.message}</pre>
```

Reviewers should treat any suppression as a deliberate security trade-off and require sign-off.
