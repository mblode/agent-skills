# Defer to Other Tools

ui-design's value is the gap between "lint passes and axe is clean" and "the product still feels broken." It does not duplicate what other tools handle well. When a finding falls into another tool's territory, link out.

## Coverage map

| Concern | Defer to | Why |
|---|---|---|
| LCP, CLS, INP, FCP, TTFB measurement | **Lighthouse** + **web-vitals** library + **Vercel Agent** | Field + lab measurement; ui-design reads source and inspects a rendered viewport, it does not measure field performance |
| WCAG 2.x rule violations | **axe-core** (runtime) + **eslint-plugin-jsx-a11y** (lint) | Authoritative WCAG rule list with structured violations |
| `alt` text, `aria-*` attribute presence | **eslint-plugin-jsx-a11y** | Catches at write time |
| Color contrast ratios | **axe-core** + **Storybook a11y addon** | Computed contrast per element |
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
Defer-to (not audited here):
  Performance (CWV):     Run Lighthouse
  Bundle size:           Run size-limit
  WCAG rule violations:  Run axe-core / eslint-plugin-jsx-a11y
  Visual regression:     Run Chromatic
```

This sets expectations and prevents the "why didn't ui-design catch X" complaint when X is another tool's job.
