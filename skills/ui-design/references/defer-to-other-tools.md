# Defer to Other Tools

ui-design's value is the gap between "lint passes and axe is clean" and "the product still feels broken." It does not duplicate what other tools handle well. When a finding falls into another tool's territory, link out.

## Deferring is not the same as dispatching

Two different moves live in this file, and conflating them is how an audit ends by telling the user to go run the tools that would have confirmed it.

**Dispatch** goes to `ui-verification`, which is not another vendor's product but the skill that owns a browser session. It runs axe against the rendered page in both themes, measures hit areas and layout shift, walks focus, injects 500s, and hands back a measurement keyed to the rule id that raised the candidate. Where a running app exists, an audit dispatches rather than defers, and the finding arrives with `32x32px at 360px width` instead of `h-8 on line 42`. Its `references/rule-coverage.md` maps every rule in this corpus to the probe that decides it.

**Defer** is the table below: budgets, baselines, field data, and write-time linting, none of which a one-off run should pretend to own.

The tools in that table stay named exactly as they are. The change is which of them the audit can invoke rather than recommend: axe-core and a rendered-viewport measurement, yes; Lighthouse budgets, Chromatic baselines, and RUM, no.

## Coverage map

| Concern | Defer to | Why |
|---|---|---|
| LCP, CLS, INP, FCP, TTFB measurement | **Lighthouse** + **web-vitals** library + **Vercel Agent** | Field + lab measurement; ui-design reads source and inspects a rendered viewport, it does not measure field performance |
| WCAG 2.x rule violations | **axe-core** (runtime, dispatched to `ui-verification`) + **eslint-plugin-jsx-a11y** (lint) | Authoritative WCAG rule list with structured violations |
| `alt` text, `aria-*` attribute presence | **eslint-plugin-jsx-a11y** | Catches at write time |
| Color contrast ratios | **axe-core** per theme (dispatched to `ui-verification`) + **Storybook a11y addon** | Computed contrast per element, and it differs between light and dark |
| Visual regression (pixel-level) | **Chromatic** / **Percy** / **Playwright snapshots** | Per-component visual diffs |
| Bundle size budgets | **size-limit** / **bundle-analyzer** / **next/bundle-analyzer** | Continuous budget tracking |
| Dependency vulnerabilities | **npm audit** / **Dependabot** / **Snyk** | CVE matching |
| Generic bug review | **CodeRabbit** / **Vercel Agent** | LLM PR review of whole diff |
| TypeScript errors | **tsc** | Type system |
| ESLint rules | **eslint** | Lint at write time |
| End-to-end flow correctness | **Playwright** / **Cypress** | Runtime browser execution |
| Real-user RUM data | **Vercel Speed Insights** / **Sentry** / **Datadog RUM** | Field measurement |

## What ui-design catches that none of the above catch

The high-leverage gaps; ui-design's reason to exist:

| Gap | Tools that miss it | ui-design rule |
|---|---|---|
| Component has empty state but no CTA | All | `states-no-empty-state` (action-required variant) |
| Form clears values on validation error | All | `forms-lost-data-on-error` |
| `useFormStatus` called in same component as `<form>` | None: runtime bug | `forms-use-form-status-misuse` |
| Modal closes without restoring focus | axe checks landmarks, not focus return | `focus-not-restored` |
| Optimistic UI doesn't roll back on failure | All | `async-optimistic-without-rollback` |
| Loading placeholder has different height than loaded content (CLS) | Lighthouse measures CLS but not the cause | `states-layout-shift` |
| Error message says "invalid" / "error occurred" / "please try again" | All | `microcopy-vague-error` / `microcopy-leaked-error-message` |
| `useOptimistic` not wrapped in `startTransition` | None: silent runtime bug | `async-optimistic-without-rollback` |
| Out-of-order async responses overwrite newer data | None | `async-out-of-order-responses` |
| Submit button doesn't disable while pending | All | `forms-no-disable-while-submitting` |
| Hover-only affordance on touch device | jsx-a11y catches some patterns | `mobile-hover-only-affordance` |
| Color-only state (red/green without icon) | Partial via axe | `a11y-color-only-meaning` |

## Linking out

When a finding overlaps another tool, the rule's `Fix` section links out:

```markdown
**Fix:** Add a skeleton with `min-height` matching loaded state to prevent CLS.
**Also run:** `lighthouse --only-categories=performance` to confirm CLS budget; Lighthouse measures the metric, ui-design catches the static cause.
```

The audit summary always lists deferred categories explicitly:

```text
Verified in the browser (ui-verification):
  WCAG rule violations:  axe-core, both themes
  Hit targets, focus:    measured at 360px

Defer-to (not audited here):
  Performance budgets:   Run Lighthouse CI
  Bundle size:           Run size-limit
  Field performance:     Speed Insights / Sentry
  Visual regression:     Run Chromatic
```

The first block is empty when no app was running, and saying so is the point: a report that lists only the defer block has told the reader nothing about whether the findings are real.

This sets expectations and prevents the "why didn't ui-design catch X" complaint when X is another tool's job.
