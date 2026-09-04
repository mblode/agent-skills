# Rule Coverage

Which probe decides which `ui-design` rule. Read this when an audit hands over a list of rule ids: take the probe each id maps to, run those, and pass the rest through untouched.

## Table of contents

- [Roles](#roles)
- [Coverage table](#coverage-table)
- [One-line runtime confirmations](#one-line-runtime-confirmations)
- [What no probe decides](#what-no-probe-decides)
- [What stays with other tools](#what-stays-with-other-tools)

## Roles

| Role | Meaning |
|---|---|
| **primary** | The browser is where the defect lives. The static check produces candidates at best, and the probe is the verdict |
| **confirming** | The static check decides it well. The probe adds computed evidence, catches what the source read could not see, or checks the rendered result of a correct-looking source |
| **capture-only** | No probe decides it. The run supplies rendered captures so a human, or the audit's own judgement, can |

A primary rule that the probe could not run for stays `unknown`. A confirming rule whose probe could not run keeps its static result, and the report says the confirmation did not happen.

## Coverage table

| Rule id | Probe | Role |
|---|---|---|
| `a11y-color-only-meaning` | axe-scan | confirming |
| `a11y-data-table-semantics` | axe-scan | confirming |
| `a11y-document-language` | axe-scan | confirming |
| `a11y-icon-controls-labeled` | axe-scan | confirming |
| `a11y-image-alt-text` | axe-scan | confirming |
| `a11y-media-captions` | axe-scan | confirming |
| `a11y-semantic-html-first` | axe-scan | confirming |
| `a11y-skip-link-heading-order` | axe-scan, focus-walk | confirming |
| `async-no-error-boundary` | failure-injection | primary |
| `async-no-suspense-boundary` | web-vitals | confirming |
| `async-optimistic-without-rollback` | failure-injection | primary |
| `async-out-of-order-responses` | failure-injection | primary |
| `dark-i18n-rtl-untested` | theme-locale-matrix | primary |
| `dark-i18n-untested` | theme-locale-matrix, axe-scan | primary |
| `focus-broken-focus-trap` | focus-walk | primary |
| `focus-not-restored` | focus-walk | primary |
| `focus-on-dynamic-content` | focus-walk | primary |
| `forms-dont-block-paste-ime` | focus-walk | confirming |
| `forms-error-association` | failure-injection, axe-scan | primary |
| `forms-inline-errors-first-focus` | failure-injection, focus-walk | primary |
| `forms-labels-and-autocomplete` | axe-scan | confirming |
| `forms-lost-data-on-error` | failure-injection | primary |
| `forms-mobile-input-font-size` | viewport-stress | primary |
| `forms-no-disable-while-submitting` | failure-injection | primary |
| `forms-use-form-status-misuse` | failure-injection | confirming |
| `interaction-focus-visible` | focus-walk | primary |
| `interaction-keyboard-operable` | focus-walk | primary |
| `interaction-target-size` | target-size | primary |
| `layout-long-content-safety` | viewport-stress | primary |
| `microcopy-leaked-error-message` | failure-injection | primary |
| `microcopy-vague-error` | failure-injection | primary |
| `mobile-hover-only-affordance` | target-size | primary |
| `mobile-viewport-scaling` | viewport-stress | primary |
| `nav-live-region-feedback` | failure-injection, axe-scan | confirming |
| `nav-semantic-links` | focus-walk, axe-scan | confirming |
| `perf-image-dimensions-and-priority` | layout-shift, web-vitals | primary |
| `perf-lazy-load-offscreen` | console-network | confirming |
| `perf-virtualize-large-lists` | see below | confirming |
| `slop-affordance-mismatch` | theme-locale-matrix | capture-only |
| `slop-decoration-no-role` | theme-locale-matrix | capture-only |
| `slop-faux-product-chrome` | theme-locale-matrix | capture-only |
| `slop-near-duplicate-scale` | theme-locale-matrix | capture-only |
| `slop-token-drift` | theme-locale-matrix | capture-only |
| `slop-unverifiable-proof` | theme-locale-matrix | capture-only |
| `states-layout-shift` | layout-shift | primary |
| `states-no-empty-state` | failure-injection | primary |
| `states-no-error-state` | failure-injection | primary |
| `type-readable-scale` | viewport-stress | primary |

Every rule in `ui-design/rules/` has a row. When a rule is added or removed there, this table changes with it; a rule with no row is a rule the browser cannot help with, and that is a decision to record here rather than an omission.

The two rules the audit corpus already marks `detect: rendered`, `states-layout-shift` and `layout-long-content-safety`, are both primary here. That is the point of the mapping: a rule whose own file says it needs the browser had, until now, no browser to be run in.

## One-line runtime confirmations

Three rules are settled by a single evaluate call rather than a probe file. Run them alongside whichever probe is already on the route:

- **`perf-virtualize-large-lists`**: count the rendered rows against the payload length. A thousand records and a thousand DOM nodes is the defect; a thousand records and forty nodes is a working virtualiser.
- **`perf-lazy-load-offscreen`**: record image and iframe requests issued before any scroll. An asset below the fold fetched at load is the finding, and `probes/console-network.md` already holds the request log.
- **`forms-use-form-status-misuse`**: hold the submit response open. The bug is a pending state that never appears because the status hook is always false in the component that owns the form, and holding the response is what makes its absence visible.

## What no probe decides

The six `slop-` rules are aesthetic judgements against a threshold, and a measurement cannot make them. What the browser adds is the evidence they should have been judged on in the first place: `ui-design`'s Deslop scope already requires rendering at desktop and mobile before editing, because compounding slop is a visual property and reading JSX is the wrong evidence for it. This skill supplies those captures. It does not score them.

The same holds for the parts of a design no rule encodes: hierarchy, restraint, whether the dark theme looks intentional or merely inverted. Captures go in the report; the judgement stays where it was.

## What stays with other tools

Verifying in a browser does not absorb the defer table. These stay out:

| Concern | Owner | Why it is not a probe |
|---|---|---|
| Performance budgets and scoring | Lighthouse CI | A single lab run is attribution, not a budget. `probes/web-vitals.md` says so in its own opening |
| Field performance | RUM (Speed Insights, Sentry, Datadog) | No lab run is field data |
| Pixel regression against a baseline | Chromatic, Percy | Requires a stored baseline and a review workflow this skill does not own |
| Cross-browser behaviour | The project's own test matrix | These probes run one engine. Say which |
| End-to-end flow correctness | Playwright or Cypress tests in the repo | A probe is a one-off measurement, not a regression suite. Where a finding deserves a permanent guard, the deliverable is a test, and writing it is the repo's job |
| Bundle size, dependency CVEs, type errors, lint | size-limit, Dependabot, tsc, eslint | Unchanged by having a browser |

The line worth holding: this skill runs probes and throws the browser away. If a check should run on every commit, it belongs in the repo's test suite, and the right outcome of a reproduced finding is often a fix plus a test, not a standing probe.
