# Feature Playbooks

Detect each feature from element + filename + route, then run its checks in order. All checks name a file in `rules/`; the category index is `rules/_sections.md`.

**Also run the matching category checks.** Beyond the checks below, run the `rules/` category fitting each surface: any form runs `forms-*` + `a11y-*` (labels, accessible names, error association; contrast ratios stay with axe); any list/dashboard runs `a11y-semantic-html-first`, `nav-semantic-links`, `interaction-keyboard-operable`, `interaction-focus-visible`; any media or image runs `a11y-image-alt-text`, `perf-image-dimensions-and-priority`; any user-facing surface runs `mobile-*`. Motion has no rules here: an animated surface with a timing, easing, or gesture problem is a finding that names `ui-animation`. Category map: `rules/_sections.md`.

## Table of contents

- [Feature detection](#feature-detection)
- [Sign-in / Sign-up](#sign-in--sign-up)
- [Checkout](#checkout)
- [Onboarding](#onboarding)
- [Search](#search)
- [Form (multi-step or long single page)](#form-multi-step-or-long-single-page)
- [List / Feed / Inbox](#list--feed--inbox)
- [Dashboard](#dashboard)
- [Modal / Dialog / Sheet](#modal--dialog--sheet)
- [Toast / Notification / Banner](#toast--notification--banner)
- [Empty state](#empty-state)
- [Error / 404 / 500 state](#error--404--500-state)
- [Loading state](#loading-state)

## Feature detection

Match on element semantics + filenames + route paths:

| Feature | Detect by |
|---|---|
| sign-in / sign-up | `<form>` with `<input type="email">` or `password`, OR route `/login`, `/signin`, `/signup`, `/register` |
| checkout | route `/checkout`, `/cart`, `/order`, `/billing`; OR component name `*Checkout*` `*Payment*` |
| onboarding | route `/onboarding`, `/welcome`, `/getting-started`; OR multi-step `<form>` with progress indicator |
| search | `<input type="search">` OR `role="combobox"` OR component `*Search*` `*Combobox*` |
| form | `<form>` with ≥3 fields not matching above features |
| list / feed | `<ul>`/`<ol>` of ≥5 children OR `role="list"` OR `*List*` `*Feed*` `*Inbox*` |
| dashboard | route `/dashboard`, `/home`, `/admin`; ≥4 distinct cards/widgets |
| modal | `role="dialog"`, `role="alertdialog"`, OR component `*Modal*` `*Dialog*` `*Sheet*` `*Drawer*` `*Popover*` |
| toast | `role="status"`, `role="alert"` (transient), `aria-live`, OR `*Toast*` `*Notification*` `*Snackbar*` |
| empty state | conditional render keyed on `items.length === 0`, `isEmpty`, OR text matching `/no .* yet|empty/i` |
| error state | route `/error`, `/404`, `/500`; OR `error.tsx`/`not-found.tsx` (Next.js); OR `role="alert"` with persistent error |
| loading state | conditional on `isLoading|isPending|<Skeleton>|<Spinner>`; OR Next.js `loading.tsx` |

---

## Sign-in / Sign-up

User need: enter the product without losing data or being locked out.

Checks:

1. **`forms-no-disable-while-submitting`**: submit `disabled` while pending, else double-submits create duplicate accounts. Bumps to **release-blocker** for sign-up.
2. **`forms-lost-data-on-error`**: wrong password must not clear the email field; password manager must still autofill. **release-blocker.**
3. **`microcopy-vague-error`**: "Wrong email or password" is fine for security; "Error 401" / "Invalid" is not. **fix-this-sprint.**
4. **`focus-not-restored`**: if "Forgot password?" opens a modal/route, focus returns on close. **fix-this-sprint.**
5. **`states-no-error-state`**: server-down shows a recoverable message with retry, not a blank page. **release-blocker.**

## Checkout

User need: complete payment without losing data, confident the right thing was bought.

Checks:

1. **`forms-lost-data-on-error`**: card/shipping/billing fields persist across all server-side validation errors. **release-blocker.**
2. **`forms-no-disable-while-submitting`**: "Place order" disables + shows pending, else double-charge. **release-blocker.**
3. **`async-optimistic-without-rollback`**: an optimistic cart update the server rejects must roll back to server state. **release-blocker.**
4. **`states-no-error-state`**: payment failures show specific cause + retry, not a generic toast. **release-blocker.**
5. **`microcopy-leaked-error-message`**: never surface raw `error.message` from a payment provider. **release-blocker.**
6. **`states-layout-shift`**: card form, address autocomplete, and order summary must not jump as fields validate. **fix-this-sprint.**

## Onboarding

User need: feel oriented and make progress; not give up.

Checks:

1. **`states-no-empty-state`**: first-run dashboard shows next-step guidance, not "no data." **release-blocker.**
2. **`forms-lost-data-on-error`**: back button preserves entered values. **release-blocker.**
3. **`focus-on-dynamic-content`**: when the next step renders, focus moves to its heading. **fix-this-sprint.**

## Search

User need: find the thing or know it isn't there.

Checks:

1. **`async-out-of-order-responses`**: fast typing must not show stale results from earlier queries. Use `useDeferredValue` or AbortController. **release-blocker.**
2. **`states-no-empty-state`**: zero results offer "did you mean" or "broaden filters" CTA. **fix-this-sprint.**
3. **`states-layout-shift`**: typing pause must not flash empty or collapse the list. **fix-this-sprint.**
4. **`microcopy-vague-error`**: search service down → "Search is temporarily unavailable, here's [recent items]" not "Error". **fix-this-sprint.**
5. **`focus-on-dynamic-content`**: `aria-live="polite"` on result count for screen readers. **fix-this-sprint.**

## Form (multi-step or long single page)

User need: enter data once, not lose it, fix errors easily.

Checks:

1. **`forms-lost-data-on-error`**: `useActionState` with `state.fields` preserved across validation. **release-blocker.**
2. **`forms-no-disable-while-submitting`**: submit disabled during `pending`. **release-blocker.**
3. **`forms-use-form-status-misuse`**: `useFormStatus` must be in a child of `<form>`, not the same component. **release-blocker** (silent runtime bug).
4. **`microcopy-vague-error`**: "Email already in use, sign in instead" beats "Invalid". **fix-this-sprint.**
5. **`states-layout-shift`**: async-loaded form (e.g. user profile) reserves field layout while loading. **fix-this-sprint.**

## List / Feed / Inbox

User need: scan, find, navigate.

Checks:

1. **`states-layout-shift`**: loading rows reserve item height (CLS-safe). **fix-this-sprint.**
2. **`states-no-empty-state`**: empty list has CTA to populate it. **fix-this-sprint.**
3. **`states-no-error-state`**: fetch failure has retry + cause. **fix-this-sprint.**
4. **`focus-on-dynamic-content`**: keyboard arrow navigation works; focus visible on row. **fix-this-sprint.**
5. **`interaction-target-size`**: row tap targets ≥44 px on mobile. **fix-this-sprint.**

## Dashboard

User need: at-a-glance status, drill into details.

Checks:

1. **`states-layout-shift`**: widgets reserve their space; no CLS. **fix-this-sprint.**
2. **`states-no-error-state`**: per-widget error fallback with retry; one widget failing doesn't break the dashboard. **release-blocker.**
3. **`async-no-error-boundary`**: wrap each widget in an error boundary. **release-blocker.**

## Modal / Dialog / Sheet

User need: focus on one thing, then return where they were.

Checks:

1. **`focus-broken-focus-trap`**: Tab cycles inside modal; Esc closes. **release-blocker.**
2. **`focus-not-restored`**: focus returns to trigger button on close. **release-blocker.**
3. **`states-no-error-state`**: async actions inside modal (save, delete) show success/error before closing. **fix-this-sprint.**
4. **`interaction-target-size`**: close button ≥44 px on mobile. **fix-this-sprint.**
5. **`states-layout-shift`**: modal content height stable across loading/loaded states. **backlog.**

## Toast / Notification / Banner

User need: see the message before it disappears, recover from errors.

Checks:

1. **`microcopy-vague-error`** + **`microcopy-leaked-error-message`**: actionable + non-leaky. **fix-this-sprint.**
2. **`nav-live-region-feedback`**: `role="alert"` for urgent (errors), `role="status"`/`aria-live="polite"` for info. **fix-this-sprint.**
3. **`interaction-target-size`**: dismiss button + action button ≥44 px. **backlog.**

## Empty state

User need: understand why nothing is here, what to do next.

Checks:

1. **`states-no-empty-state`** action variant: has a CTA, not just "no items." **fix-this-sprint** (or **release-blocker** on a critical onboarding path).
2. **`microcopy-vague-error`**: empty copy is context-specific, not "No data." **fix-this-sprint.**

## Error / 404 / 500 state

User need: understand what failed, recover or escape.

Checks:

1. **`states-no-error-state`** root variant: Next.js `error.tsx` exists at app/route level. **release-blocker.**
2. **`states-no-error-state`**: error page has retry + alternative path (home, contact support). **fix-this-sprint.**
3. **`microcopy-vague-error`** + **`microcopy-leaked-error-message`**: explains what went wrong without leaking stack traces. **release-blocker** for leaks.
4. **`focus-on-dynamic-content`**: focus moves to the error heading; screen reader announces. **fix-this-sprint.**
5. **`async-no-error-boundary`**: root layout wraps in an error boundary. **release-blocker.**

## Loading state

User need: see progress, not blank, not jumping.

Checks:

1. **`states-layout-shift`**: loading placeholder has `min-height` matching loaded content. **fix-this-sprint.**
2. **`async-no-suspense-boundary`**: server components / async streaming wrapped in `<Suspense fallback={...}>`. **fix-this-sprint.**
