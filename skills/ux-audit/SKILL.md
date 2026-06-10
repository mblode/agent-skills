---
name: ux-audit
description: Feature-level UX audit for React/Next.js code, diff-aware by default. Catches what Lighthouse, axe, ESLint, and Storybook miss: state-coverage gaps (missing loading/empty/error), form data loss on validation, double-submit, broken focus management, optimistic UI without rollback, stale async responses, skeleton-induced layout shift, and vague microcopy. 33 modern failure-mode rules plus 30 Laws of UX rules across 12 feature playbooks. Produces a 3-tier ship-readiness verdict (release-blocker / fix-this-sprint / backlog) grouped by surface, with concrete fixes using React 19 APIs (useActionState, useFormStatus, useOptimistic, useTransition, Suspense). Use before merging a frontend PR or when asked "review this PR for UX bugs", "audit this component", "is this checkout/onboarding/dashboard ready?", "what would break in production?", "is this ready to ship?". For agentic-app patterns and trust design, use ax-audit; for page-level audits of rendered UI quality and accessibility, use ui-audit.
---

# UX Audit

Static UX-quality reviewer for React/Next.js code. Operates at the **feature level** (a checkout flow, an onboarding flow, a dashboard) and answers one question for a dev with a PR open: "**which of these will hurt users in production, and which are nice-to-haves?**"

- **IS:** a diff-aware static reviewer of React/Next.js source: detects which feature each changed file implements, runs that feature's playbook, and emits a 3-tier ship verdict with `file:line` evidence and React 19 fix snippets.
- **IS NOT:** an agentic-app pattern review (tool parity, trust cues, approval gates → use `ax-audit`), a page-level rendered-UI quality/accessibility audit (→ use `ui-audit`), or a re-implementation of Lighthouse/axe/Chromatic (→ see "Defer to other tools").

## Contents

- [Audit workflow](#audit-workflow)
- [Rule layers and dispatch](#rule-layers-and-dispatch)
- [Scope: diff-aware by default](#scope-diff-aware-by-default)
- [Ship-readiness verdict](#ship-readiness-verdict)
- [Output adapters](#output-adapters)
- [Suppressions](#suppressions)
- [Defer to other tools](#defer-to-other-tools)
- [Reference files](#reference-files)
- [Related skills](#related-skills)
- [Gotchas](#gotchas)
- [Audit self-check](#audit-self-check)

## Audit workflow

Copy and track this checklist:

```text
UX Audit progress:
- [ ] Step 1: Determine scope (PR diff via `git diff --name-only main` OR explicit file/folder)
- [ ] Step 2: Detect features in scope (sign-in / checkout / form / modal / list / dashboard / ...)
- [ ] Step 3: For each feature, run its playbook from references/feature-playbooks.md in order
- [ ] Step 4: For each check, load the named rule file (rules-modern/ or rules/) and run its detection
- [ ] Step 5: Assign each finding a ship tier per references/ship-readiness.md (surface can bump tiers)
- [ ] Step 6: Build the JSON document, then render with the chosen output adapter
- [ ] Step 7: Run the audit-self-check; report INCOMPLETE if it fails
```

Step notes:

1. **Scope.** Diff by default; never the whole codebase (see [Scope](#scope-diff-aware-by-default)).
2. **Detect features.** Match element semantics + filenames + route paths: a `<form>` with email + password is sign-in; `role="dialog"` is a modal; route `/checkout` is checkout. Detection table in `references/feature-playbooks.md`.
3. **Run playbooks.** Each feature has 5-7 ordered checks. Run every check even when you expect a pass; pass results feed the self-check's `rulesRun` count.
4. **Load rules.** Only the rule files the playbook names, never a whole folder (see [dispatch](#rule-layers-and-dispatch)).
5. **Tier.** Every finding gets `release-blocker | fix-this-sprint | backlog`; the surface context can bump the rule's default tier up or down (sign-in/checkout bump up; marketing/internal-admin bump down).
6. **Render.** JSON first, then the adapter: the JSON document is what keeps findings comparable across runs.
7. **Self-check.** Terminal evidence step; criteria at the bottom of this file.

## Rule layers and dispatch

Three layers, each with its own loading condition. Load rule files individually, on demand:

| Layer | Location | Load when | Size |
|---|---|---|---|
| 1: Feature playbooks | `references/feature-playbooks.md` | Always, at Step 2, since it is the entry point that names which Layer 2/3 rules to run | 12 playbooks |
| 2: Modern failure modes | `rules-modern/<category>-<slug>.md` | A playbook check names the rule, or a changed file matches the rule's category (forms, states, async, focus, mobile, dark-i18n, microcopy) | 33 rules |
| 3: Laws of UX | `rules/<prefix>-<slug>.md` | A playbook explicitly names a Laws rule, or a finding needs cognitive/perceptual reasoning no Layer 2 rule covers | 30 rules (20 programmatic, 10 rubric) |

Layer-specific notes:

- **Layer 2 is where most findings come from.** Category index: `rules-modern/_sections.md`; one-line summary of every rule with default tiers: `references/modern-failure-modes.md`. Each rule file contains detection greps, false-positive guards, surface-tier overrides, and a before/after fix.
- **Layer 3 is reserve.** Expect 1-2 Laws findings per audit, not 30. Category index: `rules/_sections.md`. The 10 rubric-kind rules score 1-5 against the anchor tables in `references/observational-rubrics.md`: emit the score plus the verbatim anchor text.
- **When both layers fire on the same issue, keep only the Layer 2 framing.** "Missing error state" (Layer 2) beats "Postel's Law violation" (Layer 3): it has a concrete fix and a specific surface match.

## Scope: diff-aware by default

```bash
git diff --name-only main -- '*.tsx' '*.jsx' '*.ts' '*.js' '*.css' '*.module.css'
```

Audit only those files, and surface the base in the output: `Auditing: 8 files changed vs main`.

- Single component: `git diff --name-only HEAD -- src/Component.tsx`
- Full sweep: only on explicit request (`--full src/`): e.g. when introducing the skill to a codebase. A default full sweep buries the 3 findings that matter under 60 that don't.

## Ship-readiness verdict

Every audit opens with a verdict block before per-finding detail:

```text
═══════════════════════════════════════════════════════════
SHIP VERDICT: ❌ NOT READY (1 release-blocker)

Surface count:           3 (CheckoutForm, PaymentStep, ConfirmStep)
Findings:                7
  Release blockers:      1   ⛔  Form data loss on validation (PaymentStep.tsx:42)
  Fix this sprint:       3   ⚠️
  Backlog:               3   📋

Defer-to (not audited here):
  Performance (CWV):     Run Lighthouse
  Bundle size:           Run size-limit
  WCAG violations:       Run axe-core
═══════════════════════════════════════════════════════════
```

Verdict computation: ✅ READY (0 blockers, ≤3 sprint) · ⚠️ READY WITH FOLLOW-UP (0 blockers, ≥4 sprint) · ❌ NOT READY (≥1 blocker) · 🚫 INCOMPLETE (self-check failed). Tier definitions, surface bump rules, and worked examples: `references/ship-readiness.md`.

## Output adapters

All three formats render from the same JSON document. Templates and field mappings: `references/output-adapters.md`; strict schema: `references/output-schema.md`.

| Adapter | When | Format |
|---|---|---|
| Terminal table | Local dev, agent chat | Tight table grouped by surface, tier-sorted |
| PR comment | GitHub / Vercel review | Markdown summary + inline comments with `suggestion` blocks |
| CI JSON | Pipelines, merge gates | Strict JSON; gate with `jq -e '.summary.releaseBlockers == 0'` |

## Suppressions

A finding is intentionally suppressed with an inline comment whose slug matches the rule:

```tsx
{/* ux-audit-ignore:focus-not-restored, intentional: parent owns focus */}
<Dialog open={open} onClose={onClose}>
```

Suppressed findings still appear in the audit summary (`summary.suppressed`) so reviewers can verify intent.

## Defer to other tools

ux-audit lives in the gap between "lint passes and axe is clean" and "the product still feels broken." When a finding belongs to another tool, link out, don't restate:

| Concern | Use instead |
|---|---|
| Core Web Vitals (LCP, CLS, INP) | Lighthouse + web-vitals |
| WCAG rule violations, alt text, contrast | axe-core / eslint-plugin-jsx-a11y |
| Visual regression | Chromatic / Percy |
| Bundle size budgets | size-limit / bundle-analyzer |
| Generic bug review | CodeRabbit / Vercel Agent |

Full coverage map plus the list of gaps only ux-audit catches: `references/defer-to-other-tools.md`.

## Reference files

| File | Read when |
|------|-----------|
| `references/feature-playbooks.md` | Steps 2-3: feature detection table + per-feature ordered checks |
| `references/modern-failure-modes.md` | Browsing Layer 2: all 33 rules with categories and default tiers |
| `references/states-coverage.md` | Validating loading/empty/error/disabled coverage; state-pair grep recipes |
| `references/ship-readiness.md` | Step 5: tier definitions, surface bump table, verdict logic |
| `references/output-adapters.md` | Step 6: verbatim terminal / PR-comment / JSON templates |
| `references/output-schema.md` | Step 6: strict JSON schema and validation rules |
| `references/observational-rubrics.md` | Scoring any of the 10 Layer 3 rubric-kind rules (1-5 anchors) |
| `references/defer-to-other-tools.md` | Deciding whether a concern is another tool's job |
| `rules-modern/_sections.md` | Layer 2 category index (7 categories, 33 rules) |
| `rules-modern/<category>-<slug>.md` | Step 4: running a named Layer 2 check |
| `rules/_sections.md` | Layer 3 category index (5 prefixes, 30 rules) |
| `rules/<prefix>-<slug>.md` | Step 4: running a named Layer 3 check |

## Related skills

- `ax-audit`, agentic-feature PRs (agent dashboards, tool-use UIs, trust patterns). Run both on an agentic feature: ax-audit for the agent layer, ux-audit for the traditional surfaces around it.
- `ui-audit`: page-level audit of rendered UI quality and accessibility; use it when the question is "polish this page", not "review this diff".
- `pr-reviewer`: correctness bugs and code quality in the same diff; ux-audit only covers user-facing behaviour.

## Gotchas

- **Don't audit the whole codebase by default.** Full sweeps need an explicit request; otherwise the noise floor hides the release-blockers.
- **Don't skip feature detection and run every rule on every file.** 63 rules × N files produces a wall of backlog nits; a playbook's 5-7 checks per feature produces signal.
- **Don't assign `release-blocker` liberally.** Reserve it for data loss, broken critical paths, and dark patterns. If every finding is a blocker, the verdict stops gating merges.
- **Don't prescribe fixes without the matching React 19 API.** "Add a loading state" is unactionable; "wrap in `<Suspense fallback={<InvoiceListSkeleton />}>`" gets applied.
- **Don't render markdown before the JSON document is complete.** The adapters are projections of the JSON; skipping it loses `defaultTier`/`assignedTier`/`tierReason` and makes runs incomparable.
- **Don't double-report a finding from both layers.** Layer 2 framing wins; emitting both inflates the finding count and splits the fix across two entries.
- **Don't quote lawsofux.com verbatim.** It is CC BY-NC-SA; every Layer 3 rule paraphrases. Quoting contaminates the output's license.
- **Don't fabricate detections.** No grep/Read evidence → `result: "unknown"` with a `reason`, never a `fail`. The self-check flags audits with >30% unknowns.

## Audit self-check

Self-flag the audit as `INCOMPLETE` if any of these are true:

- Fewer rules ran than the playbooks planned (`rulesRun < rulesPlanned`)
- More than 30% of executed rules returned `unknown`
- Any fail/warn finding lacks a `file:line` citation
- Any fail/warn finding lacks a `fix` (and, where mechanical, a `fixSnippet`)
- No Read or Grep tool calls between findings (the audit was guessed, not run)
- Every finding landed in the same tier (suspect blanket assignment)
