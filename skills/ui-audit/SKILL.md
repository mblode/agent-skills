---
name: ui-audit
description: >-
  Audits built frontends for product-impacting defects in React/Next.js code
  and rendered web surfaces. Catches state coverage gaps, form data loss,
  double-submit, broken focus, optimistic UI without rollback, stale async,
  accessibility markup gaps, keyboard failures, layout resilience, performance
  setup, motion hazards, surface typography, and microcopy. 95 rules across
  behavior, rendered-quality, and Laws of UX layers; returns a 3-tier ship
  verdict with concrete fixes. Use when reviewing a frontend PR or when asked
  "review this PR for UX bugs", "audit this component", "check my UI", "is this
  accessible", "polish this page", "design QA this", or "is this ready to
  ship". For deciding what should exist use product-design; for agentic apps
  use ax-audit; for deep typography use typography-audit; for motion use
  ui-animation.
---

# UI Audit

Audits the **built frontend** for quality and correctness. Operates at the **feature level** (a checkout flow, an onboarding flow, a dashboard) and answers one question for a dev with a PR open: "**which of these will hurt users in production, and which are nice-to-haves?**" It reasons about both the code behavior (from the React/Next source) and the rendered quality (accessibility, layout, performance, type, motion).

- **IS:** a diff-aware reviewer of a built frontend that detects which feature each changed file implements, runs that feature's playbook across behavior, rendered-quality, and Laws of UX rules, and emits a 3-tier ship verdict with `file:line` evidence and concrete fixes.
- **IS NOT:** the product decision of what *should* exist (the right interaction, action naming, which states should be reachable → use `product-design`), an agentic-app pattern review (tool parity, trust cues, approval gates → use `ax-audit`), a deep typography or motion-implementation pass (→ use `typography-audit` or `ui-animation`), or a re-implementation of Lighthouse/axe/Chromatic (→ see "Defer to other tools").

## product-design or ui-audit?

The dispatch signal is the artifact, not the topic. Both care about states and interaction; they act at different moments.

| You have... | The question is | Use |
|---|---|---|
| A brief, spec, mockup, intent, or a UI you are deciding *about* | What should exist: the right interaction, the action's name, which states *should* be reachable | `product-design` |
| Code, a diff, or a running UI you are deciding *on* | Is the built result right: does the code cover the states, is it accessible, does it render and behave correctly, is it ready to ship | `ui-audit` |

One artifact often needs both in sequence: `product-design` decides the states that must exist, `ui-audit` verifies the built code and rendered result implement them.

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
UI Audit progress:
- [ ] Step 1: Determine scope (PR diff via `git diff --name-only main` OR explicit file/folder)
- [ ] Step 2: Detect features in scope (sign-in / checkout / form / modal / list / dashboard / ...)
- [ ] Step 3: For each feature, run its playbook from references/feature-playbooks.md in order
- [ ] Step 4: For each check, load the named rule file (rules-modern/, rules-surface/, or rules/) and run its detection
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

Four layers, each with its own loading condition. Load rule files individually, on demand:

| Layer | Location | Load when | Size |
|---|---|---|---|
| 1: Feature playbooks | `references/feature-playbooks.md` | Always, at Step 2, since it is the entry point that names which Layer 2/3/4 rules to run | 12 playbooks |
| 2: Modern failure modes (behavior) | `rules-modern/<category>-<slug>.md` | A playbook check names the rule, or a changed file matches the rule's category (forms, states, async, focus, mobile, dark-i18n, microcopy) | 31 rules |
| 3: Rendered quality (surface) | `rules-surface/<prefix>-<slug>.md` | A playbook check names the rule, or a surface needs a rendered-quality check (a11y, interaction, forms, type, nav, layout, perf, motion, copy) | 34 rules |
| 4: Laws of UX | `rules/<prefix>-<slug>.md` | A playbook explicitly names a Laws rule, or a finding needs cognitive/perceptual reasoning no Layer 2/3 rule covers | 30 rules (20 programmatic, 10 rubric) |

Layer-specific notes:

- **Layer 2 (behavior) reasons from the React/Next source:** state coverage, form data loss, async race conditions, focus management, optimistic-rollback, dark-mode/i18n. Category index: `rules-modern/_sections.md`; one-line summary with default tiers: `references/modern-failure-modes.md`. Each rule file contains detection greps, false-positive guards, surface-tier overrides, and a before/after fix.
- **Layer 3 (rendered quality) reasons from the rendered output:** accessibility markup, keyboard operability, layout resilience, performance, motion, surface typography, copy specificity. Category index and per-rule impact: `rules-surface/_sections.md`. A rule's own frontmatter impact wins over its category default (e.g. `perf-image-dimensions-and-priority` is CRITICAL inside the HIGH `perf-` category).
- **Layers 2 and 3 are complementary, not redundant:** for a form, Layer 2 catches data loss on validation while Layer 3 catches a missing label or 14px mobile input. Run both when a feature has both behavior and rendered surface in scope.
- **Layer 4 is reserve.** Expect 1-2 Laws findings per audit, not 30. Category index: `rules/_sections.md`. The 10 rubric-kind rules score 1-5 against the anchor tables in `references/observational-rubrics.md`: emit the score plus the verbatim anchor text.
- **When multiple layers fire on the same issue, keep the most concrete framing.** "Missing error state" (Layer 2) beats "Postel's Law violation" (Layer 4): it has a concrete fix and a specific surface match.

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
  Measured CWV (lab):    Run Lighthouse
  Bundle size:           Run size-limit
  Full WCAG conformance: Run axe-core
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
{/* ui-audit-ignore:focus-not-restored, intentional: parent owns focus */}
<Dialog open={open} onClose={onClose}>
```

Suppressed findings still appear in the audit summary (`summary.suppressed`) so reviewers can verify intent.

## Defer to other tools

ui-audit reasons statically about behavior and rendered quality; it does not measure runtime metrics or replace conformance scanners. It does surface-level a11y and performance checks (alt text, labels, contrast cues, image dimensions, font loading), but defers comprehensive measurement. When a finding belongs to another tool, link out, don't restate:

| Concern | Use instead |
|---|---|
| Measured Core Web Vitals (LCP, CLS, INP) | Lighthouse + web-vitals |
| Full WCAG conformance scan | axe-core / eslint-plugin-jsx-a11y |
| Visual regression | Chromatic / Percy |
| Bundle size budgets | size-limit / bundle-analyzer |
| Generic correctness bugs | CodeRabbit / Vercel Agent / `pr-reviewer` |

Full coverage map plus the list of gaps only ui-audit catches: `references/defer-to-other-tools.md`.

## Reference files

| File | Read when |
|------|-----------|
| `references/feature-playbooks.md` | Steps 2-3: feature detection table + per-feature ordered checks |
| `references/modern-failure-modes.md` | Browsing Layer 2: all 31 rules with categories and default tiers |
| `references/states-coverage.md` | Validating loading/empty/error/disabled coverage; state-pair grep recipes |
| `references/ship-readiness.md` | Step 5: tier definitions, surface bump table, verdict logic |
| `references/output-adapters.md` | Step 6: verbatim terminal / PR-comment / JSON templates |
| `references/output-schema.md` | Step 6: strict JSON schema and validation rules |
| `references/observational-rubrics.md` | Scoring any of the 10 Layer 4 rubric-kind rules (1-5 anchors) |
| `references/defer-to-other-tools.md` | Deciding whether a concern is another tool's job |
| `references/craft-checklist.md` | Optional polish sweep (hit targets, hover states, chrome hierarchy, optical alignment, concentric radii) when "polish" or pre-release sign-off is in scope |
| `references/typography-checklist.md` | Optional typography surface sweep (punctuation, measure, leading, OpenType basics, link styling, table numerals) when typography is named |
| `rules-modern/_sections.md` | Layer 2 category index (behavior failure modes) |
| `rules-modern/<category>-<slug>.md` | Step 4: running a named Layer 2 behavior check |
| `rules-surface/_sections.md` | Layer 3 category index (rendered-quality, 9 prefixes) |
| `rules-surface/<prefix>-<slug>.md` | Step 4: running a named Layer 3 rendered-quality check |
| `rules/_sections.md` | Layer 4 category index (Laws of UX, 5 prefixes) |
| `rules/<prefix>-<slug>.md` | Step 4: running a named Layer 4 Laws check |

## Related skills

- `product-design`: the product decision, not the build. This skill audits the built code and rendered result and returns line-level fixes; route to `product-design` when the question is "is this the right interaction or the right set of states", on a brief, spec, mockup, or intent.
- `ax-audit`: agentic-feature PRs (agent dashboards, tool-use UIs, trust patterns). Run both on an agentic feature: ax-audit for the agent layer, ui-audit for the traditional surfaces around it.
- `pr-reviewer`: correctness bugs and code quality in the same diff; ui-audit only covers user-facing quality and behavior.
- `typography-audit`: deep typography (pairing, OpenType systems, brand and display type); ui-audit's `type-` rules and typography sweep are the shallower surface check.
- `ui-animation`: motion implementation and review (springs, easing, gestures); ui-audit's `motion-` findings route here for the fix.

## Gotchas

- **Don't audit the whole codebase by default.** Full sweeps need an explicit request; otherwise the noise floor hides the release-blockers.
- **Don't skip feature detection and run every rule on every file.** 95 rules × N files produces a wall of backlog nits; a playbook's checks per feature produce signal. Load only the `rules-modern/`, `rules-surface/`, and `rules/` files the playbook names.
- **Don't assign `release-blocker` liberally.** Reserve it for data loss, broken critical paths, and dark patterns. If every finding is a blocker, the verdict stops gating merges.
- **Don't prescribe fixes without the matching React 19 API.** "Add a loading state" is unactionable; "wrap in `<Suspense fallback={<InvoiceListSkeleton />}>`" gets applied.
- **Don't render markdown before the JSON document is complete.** The adapters are projections of the JSON; skipping it loses `defaultTier`/`assignedTier`/`tierReason` and makes runs incomparable.
- **Don't double-report the same issue from multiple layers.** When behavior (Layer 2), surface (Layer 3), and Laws (Layer 4) all touch one issue, keep the most concrete framing only; emitting all inflates the count and splits the fix. Layers 2 and 3 catching *different* issues on one feature (data loss vs missing label) is expected, not a duplicate.
- **Don't report a rendered-quality rule at its category default when the rule frontmatter overrides it.** `perf-image-dimensions-and-priority` is CRITICAL (CLS) even though `perf-` is a HIGH category.
- **Don't quote lawsofux.com verbatim.** It is CC BY-NC-SA; every Layer 4 rule paraphrases. Quoting contaminates the output's license.
- **Don't fabricate detections.** No grep/Read evidence → `result: "unknown"` with a `reason`, never a `fail`. The self-check flags audits with >30% unknowns.

## Audit self-check

Self-flag the audit as `INCOMPLETE` if any of these are true:

- Fewer rules ran than the playbooks planned (`rulesRun < rulesPlanned`)
- More than 30% of executed rules returned `unknown`
- Any fail/warn finding lacks a `file:line` citation
- Any fail/warn finding lacks a `fix` (and, where mechanical, a `fixSnippet`)
- No Read or Grep tool calls between findings (the audit was guessed, not run)
- Every finding landed in the same tier (suspect blanket assignment)
