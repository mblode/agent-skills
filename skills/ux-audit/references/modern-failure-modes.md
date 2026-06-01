# Modern Failure Modes — Index

Layer 2 of the audit: 33 modern frontend UX failure modes that no other tool catches statically. Each rule lives at `rules-modern/<category>-<slug>.md` and follows the format in `rules-modern/_template.md`.

These rules are ordered by impact (frequency × severity), informed by 2025-2026 production failure-mode research and senior-vs-junior code-review catches.

## Table of contents

- [Forms (5 rules)](#forms-5-rules)
- [States (5 rules)](#states-5-rules)
- [Async (5 rules)](#async-5-rules)
- [Focus / Keyboard (4 rules)](#focus--keyboard-4-rules)
- [Mobile / Touch (3 rules)](#mobile--touch-3-rules)
- [Dark mode / i18n (7 rules)](#dark-mode--i18n-7-rules)
- [Microcopy (4 rules)](#microcopy-4-rules)

---

## Forms (5 rules)

Form-handling bugs are the most common ship-blockers. Modern React 19 introduces `useActionState`, `useFormStatus`, and `useOptimistic` to address most of them — but only if used correctly.

| Rule | Default tier | What it catches |
|---|---|---|
| `forms-lost-data-on-error` | release-blocker | Form clears entered values when validation fails server-side |
| `forms-no-autosave` | fix-this-sprint | Multi-step or long forms lose state on reload / nav-away |
| `forms-no-normalize` | fix-this-sprint | Inputs reject valid values (uppercase email, phone with spaces) |
| `forms-no-disable-while-submitting` | release-blocker | Submit can be clicked twice during pending → duplicate records |
| `forms-use-form-status-misuse` | release-blocker | `useFormStatus()` called in same component as `<form>` (always returns `false`) |

## States (5 rules)

The single highest-leverage layer: most production UX bugs are missing or broken states.

| Rule | Default tier | What it catches |
|---|---|---|
| `states-no-skeleton` | fix-this-sprint | Async fetch has loading branch but no skeleton (centered spinner instead) |
| `states-no-empty-state` | fix-this-sprint | Empty branch with no helpful next-step CTA |
| `states-no-error-state` | release-blocker (critical paths) / fix-this-sprint (else) | Async fetch with no error UI — silent fail |
| `states-layout-shift` | fix-this-sprint | Skeleton or loading state has different dimensions than loaded → CLS |
| `states-generic-loading-copy` | backlog | "Loading..." used instead of context-specific copy |

## Async (5 rules)

Async operations: error boundaries, Suspense, optimistic UI rollback, race conditions, double-submit.

| Rule | Default tier | What it catches |
|---|---|---|
| `async-no-suspense-boundary` | fix-this-sprint | Server-component or streaming async without `<Suspense>` |
| `async-no-error-boundary` | release-blocker | Async render path with no error boundary — single failure crashes the route |
| `async-optimistic-without-rollback` | release-blocker | `useOptimistic` used without rollback path on server reject |
| `async-out-of-order-responses` | release-blocker (search) / fix-this-sprint | Fast typing in search/filter → stale response overwrites newer |
| `async-double-submit` | release-blocker | Click handler not idempotent; double-submit creates duplicate records |

## Focus / Keyboard (4 rules)

Focus management is invisible to mouse users and breaks the experience for keyboard / screen-reader users. axe-core checks landmarks but not focus flow.

| Rule | Default tier | What it catches |
|---|---|---|
| `focus-broken-focus-trap` | release-blocker | Modal doesn't trap Tab / doesn't dismiss on Esc |
| `focus-not-restored` | release-blocker | Modal closes but focus lands on `<body>` instead of trigger |
| `focus-no-skip-link` | backlog | No "skip to main content" link for keyboard users |
| `focus-on-dynamic-content` | fix-this-sprint | Page or major section change without focus management or `aria-live` |

## Mobile / Touch (3 rules)

Patterns that work on desktop but fail on touch. Lighthouse catches some via tap-target audits; ux-audit adds the affordance + viewport patterns.

| Rule | Default tier | What it catches |
|---|---|---|
| `mobile-subpar-target-size` | fix-this-sprint | Interactive element <44 px on touch surfaces |
| `mobile-hover-only-affordance` | fix-this-sprint | Critical info / action only visible on hover; touch users miss it |
| `mobile-viewport-scaling` | backlog | Missing `viewport` meta or wrong `100vh` (use `100dvh`); safe-area-insets not handled |

## Dark mode / i18n (7 rules)

Patterns that pass desk-checks but fail with non-Latin text, other locales, or in dark theme.

| Rule | Default tier | What it catches |
|---|---|---|
| `dark-i18n-untested` | backlog | Component has light styles only; no dark variant or visual regression |
| `dark-i18n-color-only-state` | fix-this-sprint | Validation/state expressed only via color (red/green) without icon or text |
| `dark-i18n-string-overflow` | backlog | Hardcoded width assumptions break with long German / RTL Arabic / CJK |
| `dark-i18n-rtl-untested` | backlog | No RTL story / `dir="rtl"` test |
| `dark-i18n-locale-formatting` | backlog | Dates / numbers / currency hand-formatted to one locale (and SSR hydration mismatch) |
| `dark-i18n-plural-rules` | backlog | Two-form `item`/`items` ternary instead of `Intl.PluralRules` / ICU plural |
| `dark-i18n-language-switcher` | backlog | Switcher uses flags or non-endonym labels; missing per-option `lang` |

## Microcopy (4 rules)

Microcopy quality is a major UX gap no tool catches semantically. Vague errors, leaked exception text, and generic loading copy hurt user trust.

| Rule | Default tier | What it catches |
|---|---|---|
| `microcopy-vague-error` | fix-this-sprint | Error message is "Invalid", "Something went wrong", "Please try again" |
| `microcopy-generic-loading` | backlog | Loading text is "Loading..." instead of context-specific |
| `microcopy-leaked-error-message` | release-blocker | Raw `error.message` shown to user (stack trace, SQL error, payment-provider raw) |
| `microcopy-no-action-on-empty` | fix-this-sprint | Empty state has copy ("No invoices yet") but no actionable CTA |

---

## How rules combine in playbooks

Each feature playbook in `references/feature-playbooks.md` pulls 5-7 of these rules in an ordered sequence, plus 1-2 Layer-3 Laws of UX rules where cognitive/perceptual reasoning adds value. The combined sequence catches most of the "the product still feels broken" bugs.

When a finding fires both a Layer-2 rule and a Layer-3 rule, prefer Layer 2 — it has a more concrete fix and a more specific surface match.
