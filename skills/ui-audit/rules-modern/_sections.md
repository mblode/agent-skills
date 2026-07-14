# Sections: Modern Failure Modes (Layer 2)

Defines the 7 categories of modern frontend UX failure modes; each rule file uses one category prefix. This is the canonical Layer 2 index; per-rule default tiers live in each rule file's frontmatter.

---

## 1. Forms (forms)

**Default tier:** mostly release-blocker
**Why critical:** form-handling bugs are the most common ship-blockers. React 19's `useActionState`, `useFormStatus`, `useOptimistic` address them only if used correctly. Common bugs: form clears on validation error, double-submit, `useFormStatus` misuse (always-false bug), no normalization.

## 2. States (states)

**Default tier:** release-blocker for critical paths, fix-this-sprint elsewhere
**Why critical:** missing or broken states is the single highest-impact production UX bug. Every data-fetching component needs `loading`, `empty`, `error`, `success`, and (if paginated) `partial`. Most common bug: "happy path only."

## 3. Async (async)

**Default tier:** mostly release-blocker
**Why critical:** async operations introduce race conditions, optimistic-UI-without-rollback, missing Suspense / error boundaries, and double-submit. Silent until they aren't.

## 4. Focus / Keyboard (focus)

**Default tier:** mostly release-blocker for traps; fix-this-sprint for dynamic content
**Why critical:** focus management is invisible to mouse users and breaks the experience entirely for keyboard / screen-reader users. axe checks landmarks but not "where did focus go after this action."

## 5. Mobile / Touch (mobile)

**Default tier:** mostly fix-this-sprint
**Why critical:** patterns that work on desktop but fail on touch (sub-44 px targets, hover-only affordances). Lighthouse catches some via tap-target audits; ui-audit adds the affordance and viewport patterns.

## 6. Dark mode / i18n (dark-i18n)

**Default tier:** mostly backlog
**Why critical:** patterns that pass desk-checks but fail with non-Latin text, RTL, or in dark theme. Color-only validation is the only release-blocker in this category (a11y).

## 7. Microcopy (microcopy)

**Default tier:** mostly fix-this-sprint; release-blocker for leaked errors
**Why critical:** microcopy quality is a major UX gap no tool catches semantically. Vague errors, leaked exception text (PII or stack traces), and generic loading copy hurt trust and can leak security-sensitive info.

---

## Rule index

```
forms-lost-data-on-error            forms-no-autosave            forms-no-normalize
forms-no-disable-while-submitting   forms-use-form-status-misuse

states-no-skeleton                  states-no-empty-state        states-no-error-state
states-layout-shift

async-no-suspense-boundary          async-no-error-boundary
async-optimistic-without-rollback   async-out-of-order-responses

focus-broken-focus-trap             focus-not-restored
focus-on-dynamic-content

mobile-hover-only-affordance        mobile-viewport-scaling

dark-i18n-untested                  dark-i18n-color-only-state
dark-i18n-string-overflow           dark-i18n-rtl-untested
dark-i18n-locale-formatting         dark-i18n-plural-rules
dark-i18n-language-switcher

microcopy-vague-error               microcopy-generic-loading
microcopy-leaked-error-message
```

Total: 28 rules. (Keyboard target size and skip-link/heading-order are covered by the rendered-quality layer: `rules-surface/interaction-target-size` and `rules-surface/a11y-skip-link-heading-order`.)
