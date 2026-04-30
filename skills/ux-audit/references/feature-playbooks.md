# Feature Playbooks

Each feature gets an ordered checklist. Detect the feature from element + filename + route, then run the checks in order. Each check pulls from `rules-modern/` (Layer 2 — modern failure modes) or `rules/` (Layer 3 — Laws of UX).

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
- [Loading state / skeleton](#loading-state--skeleton)

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

Checks (in order):

1. **`forms-no-disable-while-submitting`** — submit button must `disabled` during pending; otherwise double-submits create duplicate accounts. Surface bumps to **release-blocker** for sign-up.
2. **`forms-lost-data-on-error`** — wrong-password should not clear email field; password manager must still autofill correctly. **release-blocker.**
3. **`forms-no-normalize`** — accept emails with whitespace, mixed case, leading/trailing spaces; trim and lowercase server-side. Postel's Law applies (`rules/decision-postels-law.md`).
4. **`microcopy-vague-error`** — "Wrong email or password" is acceptable for security; "Error 401" / "Invalid" is not. **fix-this-sprint.**
5. **`focus-not-restored`** — if "Forgot password?" opens a modal/route, focus must return on close. **fix-this-sprint.**
6. **`states-no-error-state`** — server-down should show a recoverable message with retry, not a blank page. **release-blocker.**
7. **`memory-jakobs-law`** (Layer 3) — verify conventional layout: email then password, primary action below, "Forgot password?" near password.

## Checkout

User need: complete payment without losing data, with confidence the right thing was bought.

Checks:

1. **`forms-lost-data-on-error`** — card / shipping / billing fields must persist across all server-side validation errors. **release-blocker.**
2. **`forms-no-disable-while-submitting`** — "Place order" must disable + show pending; otherwise double-charge. **release-blocker.**
3. **`async-optimistic-without-rollback`** — if the cart updates optimistically and the server rejects, UI must roll back to actual server state. **release-blocker.**
4. **`states-no-error-state`** — payment failures show specific cause + retry, not a generic toast. **release-blocker.**
5. **`microcopy-leaked-error-message`** — never surface raw `error.message` from a payment provider. **release-blocker.**
6. **`states-layout-shift`** — card form, address autocomplete, and order summary must not jump as fields validate. **fix-this-sprint.**
7. **`memory-peak-end-rule`** (Layer 3) — order-confirmation page should be a deliberate moment, not a generic toast.
8. **`cognitive-cognitive-load`** (Layer 3) — fields chunked (shipping vs payment vs review), one primary CTA per step.

## Onboarding

User need: feel oriented and make progress; not give up.

Checks:

1. **`states-no-empty-state`** — first-run dashboard must show next-step guidance, not "no data." **release-blocker.**
2. **`memory-goal-gradient`** (Layer 3) — show progress (X of N steps complete); use endowed progress (start with 1 step done). **fix-this-sprint.**
3. **`memory-zeigarnik`** (Layer 3) — incomplete onboarding should remain visible across sessions ("Resume setup"). **fix-this-sprint.**
4. **`forms-lost-data-on-error`** — back-button must preserve entered values. **release-blocker.**
5. **`microcopy-generic-loading`** — "Setting up your workspace…" beats "Loading…". **backlog.**
6. **`focus-on-dynamic-content`** — when the next step renders, focus moves to the step heading. **fix-this-sprint.**
7. **`memory-peak-end-rule`** (Layer 3) — final completion screen has a deliberate "you're set" moment with a clear next action.

## Search

User need: find the thing or know it isn't there.

Checks:

1. **`async-out-of-order-responses`** — fast typing must not show stale results from earlier queries. Use `useDeferredValue` or AbortController. **release-blocker.**
2. **`states-no-empty-state`** — zero results must offer "did you mean" or "broaden filters" CTA. **fix-this-sprint.**
3. **`states-no-skeleton`** — typing pause should show skeleton list, not flash empty / collapse. **fix-this-sprint.**
4. **`microcopy-vague-error`** — search service down → "Search is temporarily unavailable, here's [recent items]" not "Error". **fix-this-sprint.**
5. **`focus-on-dynamic-content`** — `aria-live="polite"` on result count for screen readers. **fix-this-sprint.**
6. **`decision-hicks-law`** (Layer 3) — limit visible results-per-page or use facets when count > 50.
7. **`perception-von-restorff`** (Layer 3) — exactly one highlighted result (e.g. exact match) per page.

## Form (multi-step or long single page)

User need: enter data once, not lose it, fix errors easily.

Checks:

1. **`forms-lost-data-on-error`** — `useActionState` with `state.fields` preserved across validation. **release-blocker.**
2. **`forms-no-disable-while-submitting`** — submit disabled during `pending`. **release-blocker.**
3. **`forms-use-form-status-misuse`** — `useFormStatus` must be in a child of `<form>`, not the same component. **release-blocker** (silent runtime bug).
4. **`forms-no-normalize`** — emails, phones, URLs, currencies, dates trimmed/lowercased server-side; Postel's Law. **fix-this-sprint.**
5. **`microcopy-vague-error`** — "Email already in use — sign in instead" beats "Invalid". **fix-this-sprint.**
6. **`states-no-skeleton`** — async-loaded form (e.g. user profile) needs a skeleton matching field layout. **fix-this-sprint.**
7. **`cognitive-chunking`** (Layer 3) — group fields into fieldsets/sections.

## List / Feed / Inbox

User need: scan, find, navigate.

Checks:

1. **`states-no-skeleton`** — N skeleton rows matching item layout (CLS-safe). **fix-this-sprint.**
2. **`states-no-empty-state`** — empty list has CTA to populate it. **fix-this-sprint.**
3. **`states-no-error-state`** — fetch failure has retry + cause. **fix-this-sprint.**
4. **`focus-on-dynamic-content`** — keyboard arrow navigation works; focus visible on row. **fix-this-sprint.**
5. **`memory-serial-position`** (Layer 3) — primary actions (e.g. "Compose") at edge.
6. **`perception-similarity`** + **`perception-common-region`** (Layer 3) — same-role rows share styling; rows have clear boundaries.
7. **`mobile-subpar-target-size`** — row tap targets ≥44 px on mobile. **fix-this-sprint.**

## Dashboard

User need: at-a-glance status, drill into details.

Checks:

1. **`states-no-skeleton`** — each widget has its own skeleton; layout doesn't shift as widgets load. **fix-this-sprint.**
2. **`states-no-error-state`** — per-widget error fallback with retry; one widget failing doesn't break the dashboard. **release-blocker.**
3. **`states-layout-shift`** — widgets reserve their space; no CLS. **fix-this-sprint.**
4. **`async-no-error-boundary`** — wrap each widget in an error boundary. **release-blocker.**
5. **`cognitive-cognitive-load`** (Layer 3) — ≤7 focal areas above the fold.
6. **`perception-proximity`** + **`perception-similarity`** (Layer 3) — group related widgets, similar widgets styled alike.

## Modal / Dialog / Sheet

User need: focus on a thing, then return to where they were.

Checks:

1. **`focus-broken-focus-trap`** — Tab cycles inside modal; Esc closes. **release-blocker.**
2. **`focus-not-restored`** — focus returns to trigger button on close. **release-blocker.**
3. **`states-no-error-state`** — async actions inside modal (save, delete) show success/error before closing. **fix-this-sprint.**
4. **`memory-zeigarnik`** (Layer 3) — closing without saving shows a confirm if dirty. **release-blocker** for forms, **fix-this-sprint** otherwise.
5. **`mobile-subpar-target-size`** — close button ≥44 px on mobile. **fix-this-sprint.**
6. **`states-layout-shift`** — modal content height stable across loading/loaded states. **backlog.**
7. **`decision-hicks-law`** (Layer 3) — ≤3 actions in modal footer.

## Toast / Notification / Banner

User need: see the message before it disappears, recover from errors.

Checks:

1. **`microcopy-vague-error`** + **`microcopy-leaked-error-message`** — actionable + non-leaky. **fix-this-sprint.**
2. **Toast duration** — ≥5 s for ≥1 sentence; ≥8 s with action button; never disappears mid-action. (See `rules-modern/microcopy-generic-loading.md` for related microcopy patterns.)
3. **`aria-live` correctness** — `role="alert"` for urgent (errors), `role="status"`/`aria-live="polite"` for info. **fix-this-sprint.**
4. **`mobile-subpar-target-size`** — dismiss button + action button ≥44 px. **backlog.**
5. **`memory-peak-end-rule`** (Layer 3) — success toasts on critical paths should be more deliberate than a 2 s bounce.

## Empty state

User need: understand why nothing is here, what to do next.

Checks:

1. **`states-no-empty-state`** action variant — must have a CTA, not just "no items." **fix-this-sprint** (or **release-blocker** on a critical onboarding path).
2. **`microcopy-generic-loading`** + **`microcopy-vague-error`** — empty copy must be context-specific, not "No data." **fix-this-sprint.**
3. **`memory-zeigarnik`** (Layer 3) — if the empty state is a not-yet-set-up surface, suggest setup with progress.
4. **`memory-goal-gradient`** (Layer 3) — empty inbox after first user action shows "1 of 5 setup steps complete."
5. **`interaction-aesthetic-usability`** (Layer 3 rubric) — empty states are high-leverage for polish; score ≥4.

## Error / 404 / 500 state

User need: understand what failed, recover or escape.

Checks:

1. **`states-no-error-state`** root variant — Next.js `error.tsx` exists at app/route level. **release-blocker.**
2. **`states-no-error-state`** — error page has retry + alternative path (back to home, contact support). **fix-this-sprint.**
3. **`microcopy-vague-error`** + **`microcopy-leaked-error-message`** — explains what went wrong without leaking stack traces. **release-blocker** for leaks.
4. **`focus-on-dynamic-content`** — focus moves to the error heading; screen reader announces. **fix-this-sprint.**
5. **`memory-peak-end-rule`** (Layer 3) — error pages are emotional peaks; turn them into recoveries.
6. **`async-no-error-boundary`** — root layout wraps in an error boundary. **release-blocker.**

## Loading state / skeleton

User need: see progress, not blank, not jumping.

Checks:

1. **`states-no-skeleton`** — async data has a skeleton, not a centered spinner. **fix-this-sprint.**
2. **`states-layout-shift`** — skeleton has `min-height` matching loaded content. **fix-this-sprint.**
3. **`microcopy-generic-loading`** — context-specific text ("Confirming your order — 2 to 3 seconds") beats "Loading…" **backlog.**
4. **`async-no-suspense-boundary`** — server components / async streaming wrapped in `<Suspense fallback={...}>`. **fix-this-sprint.**
5. **`interaction-doherty-threshold`** (Layer 3) — perceived feedback ≤100 ms via optimistic UI when applicable.
6. **Long-running load** — operations >10 s show a progress indicator, not just a spinner.
