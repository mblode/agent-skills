---
name: ux-audit
description: Feature-level UX audit for React/Next.js code. Catches what Lighthouse, axe, ESLint, and Storybook miss — state coverage gaps (missing loading/empty/error), form data loss on validation, broken focus management, optimistic UI without rollback, skeleton-induced layout shift, vague microcopy, and 25+ other modern frontend UX bugs. Diff-aware (audits changed files only) and produces a 3-tier ship-readiness verdict (release-blocker / fix-this-sprint / backlog) grouped by surface, with concrete fixes using modern React 19 APIs (useActionState, useFormStatus, useOptimistic, useTransition, Suspense). Use before merging a frontend PR, before shipping a feature, or when asked "is this checkout/onboarding/dashboard ready?", "review this PR for UX bugs", "audit this component", "what would break in production?", "is this ready to ship?"
---

# UX Audit

Static UX-quality reviewer for React/Next.js code. Operates at the **feature level** (a checkout flow, an onboarding flow, a dashboard) — not the principle level. Answers one question for a frontend dev with a PR open: "**which of these will hurt users in production, and which are nice-to-haves?**"

## What this skill IS

- A diff-aware reviewer that audits changed files in a PR
- A feature-level checklist runner: detects "this is a sign-in flow" / "this is a checkout" / "this is a modal" and runs the right playbook
- A ship-readiness verdict generator: every finding gets `release-blocker | fix-this-sprint | backlog`
- A concrete-fix advisor that uses modern React 19 APIs (`useActionState`, `useFormStatus`, `useOptimistic`, `useTransition`, `<Suspense>`, error boundaries)

## What this skill IS NOT

Defer to the right tool. **Do not duplicate** what these already do well:

| Concern | Use this tool instead | Why |
|---|---|---|
| Core Web Vitals (LCP, CLS, INP) | Lighthouse + web-vitals + Vercel Agent | Field + lab measurement, not static |
| WCAG rule violations | axe-core / jsx-a11y | Authoritative rule list, structured violations |
| a11y prevention at write time | eslint-plugin-jsx-a11y | Lint catches before runtime |
| Visual regression | Chromatic / Percy | Pixel-level diffs |
| Bundle size budget | size-limit / bundle-analyzer | Continuous budget tracking |
| Generic bug review | CodeRabbit / Vercel Agent | LLM bug review of the whole diff |

When a finding overlaps any of the above, link out — don't restate.

See `references/defer-to-other-tools.md` for the full inventory.

## Audit Workflow

Copy and track this checklist:

```text
UX Audit progress:
- [ ] Step 1: Determine scope (PR diff via `git diff --name-only main` OR explicit file/folder)
- [ ] Step 2: Detect features in scope (sign-in / checkout / form / modal / list / dashboard / etc.)
- [ ] Step 3: For each feature, run its playbook from references/feature-playbooks.md
- [ ] Step 4: For each check, load the matching rule (rules-modern/ for state/form/focus bugs; rules/ for Laws of UX)
- [ ] Step 5: Assign each finding a ship tier per references/ship-readiness.md
- [ ] Step 6: Group findings by surface, render with the chosen output adapter
- [ ] Step 7: Verify the audit-self-check before reporting
```

1. **Scope.** Default to `git diff --name-only main` if in a git repo with uncommitted changes; otherwise audit the explicit scope the user passes. Don't audit the whole codebase by default — noise floor is too high.
2. **Detect features.** Match on element semantics + filenames + route paths. A `<form>` with email + password = sign-in. A `<form>` with a multi-step indicator = onboarding. A `role="dialog"` = modal. See `references/feature-playbooks.md` for detection heuristics per feature.
3. **Run playbook.** Each feature has 5-7 ordered checks. Don't skip checks even when you expect them to pass; each pass goes into the audit-self-check.
4. **Load rules.** Two layers:
   - **`rules-modern/`** (Layer 2) — modern frontend UX failure modes (state coverage, form preservation, focus mgmt, optimistic rollback, CLS, microcopy). This is where most findings come from.
   - **`rules/`** (Layer 3) — Laws of UX (Hick's, Fitts's, Miller's, etc.). Used for cognitive/perceptual reasoning when Layer 2 doesn't apply.
5. **Ship tier.** Every finding gets one of three tiers (see `references/ship-readiness.md`):
   - `release-blocker` — fix before merge (data loss, broken auth, missing critical-path error state, dark patterns, focus traps that don't restore)
   - `fix-this-sprint` — merge but log issue (sub-44 px target on touch, missing skeleton, vague error, missing empty CTA)
   - `backlog` — track, ship (dark-mode untested, RTL not verified, microcopy nits)
6. **Group + render.** Group by surface (component file or page). Render with one of the three adapters in `references/output-adapters.md`.
7. **Self-check.** Verify the audit was actually run (rules executed > rules planned, file:line cited on every finding, fix snippet on every finding).

## Three audit layers

```
Layer 1 — Feature playbooks  (the entry point)
  references/feature-playbooks.md
  12 features × 5-7 ordered checks → pulls rules from Layers 2 and 3

Layer 2 — Modern frontend failure modes  (the high-leverage layer)
  rules-modern/<category>-<slug>.md
  33 rules covering state coverage, form preservation, focus mgmt,
  async/optimistic, CLS pairings, microcopy, dark mode, i18n, mobile.
  Detection recipes use React 19 APIs.

Layer 3 — Laws of UX  (the cognitive/perceptual reserve)
  rules/<prefix>-<slug>.md
  30 rules for Hick's, Fitts's, Miller's, etc. Invoked when feature
  playbooks need cognitive load / decision / perception reasoning.
  Usually 1-2 of these per audit; not all 30.
```

## Diff-aware mode

Default scope is the PR diff. Detect with:

```bash
git diff --name-only main -- '*.tsx' '*.jsx' '*.ts' '*.js' '*.css' '*.module.css'
```

Audit only those files. Surface the base branch in the output: `Auditing: 8 files changed vs main`.

For a quick local check (single component): `git diff --name-only HEAD -- src/Component.tsx`.

For a full sweep: explicit `--full src/` (rare; only when introducing the skill to a codebase).

## Ship-readiness verdict

Every audit emits a top-level verdict before per-finding details:

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

Verdict tiers:
- ✅ **READY** — 0 release-blockers, ≤3 fix-this-sprint
- ⚠️ **READY WITH FOLLOW-UP** — 0 release-blockers, ≥4 fix-this-sprint
- ❌ **NOT READY** — ≥1 release-blocker
- 🚫 **INCOMPLETE** — audit-self-check failed (re-run)

## Output adapters

Three formats, all rendered from the same JSON. Pick based on context.

| Adapter | When | Format |
|---|---|---|
| Terminal table | Local dev, fast scan | Tight 5-col table grouped by surface |
| PR comment | GitHub / Vercel review | Markdown with `suggestion` blocks for inline diffs |
| CI JSON | Pipelines, dashboards | Strict JSON per `references/output-schema.md` |

See `references/output-adapters.md` for verbatim templates and field mappings.

## Skip protocol

A finding can be intentionally suppressed with an inline comment:

```tsx
{/* ux-audit-ignore:focus-not-restored — intentional: parent owns focus */}
<Dialog open={open} onClose={onClose}>
```

Slug must match the rule slug. Suppressions are reported in the audit summary so reviewers can verify intent.

## Reference Files

| File | Read when |
|------|-----------|
| `references/feature-playbooks.md` | Step 2-3 — detecting features and selecting their playbooks |
| `references/modern-failure-modes.md` | Index of all 33 modern rules grouped by category |
| `references/states-coverage.md` | Validating loading/empty/error/disabled coverage per component type |
| `references/ship-readiness.md` | Step 5 — assigning each finding a ship tier with examples |
| `references/output-adapters.md` | Step 6 — formatting findings for terminal / PR comment / JSON |
| `references/defer-to-other-tools.md` | Recognizing concerns to delegate (CWV, WCAG, bundle, etc.) |
| `references/output-schema.md` | Strict JSON schema for findings + verdict |
| `references/observational-rubrics.md` | Layer 3 rubric rules (1-5 scoring with anchors) |
| `rules-modern/<category>-<slug>.md` | Step 4 — running a Layer 2 modern frontend check |
| `rules-modern/_sections.md` | Category index for the modern rule layer |
| `rules/<prefix>-<slug>.md` | Step 4 — running a Layer 3 Laws of UX check |
| `rules/_sections.md` | Category index for the Laws of UX rule layer |

## Gotchas

- **Don't audit the whole codebase by default.** Diff-aware mode is the default; full sweeps are explicit.
- **Don't duplicate other tools.** If a finding is "LCP > 4s," that's Lighthouse — link, don't restate. If it's "missing alt text," that's axe — link, don't restate.
- **Don't skip the feature-detection step.** Running every rule against every file produces noise; running the right playbook per feature produces signal.
- **Don't assign every finding `release-blocker`.** Reserve that tier for genuine ship-blockers (data loss, broken critical path, dark patterns). Inflation kills the signal.
- **Don't suggest fixes without modern React APIs when applicable.** "Add a loading state" is weak; "Wrap in `<Suspense fallback={<Skeleton />}>` and use `useTransition` for the trigger" is actionable.
- **Don't render markdown without a JSON pass first.** Even when the user wants markdown, build the JSON document first to keep findings auditable across runs.
- **Don't pile on Laws of UX findings.** Layer 3 is reserve. If a finding has both a Layer-2 framing ("missing error state") and a Layer-3 framing ("Postel's Law violation"), use Layer 2 — it's more specific and actionable.
- **Don't quote the source verbatim.** Every rule paraphrases; lawsofux.com uses CC BY-NC-SA which would contaminate the skill.
- **Don't fabricate detections.** If you can't grep the file or see the JSX, mark the finding `unknown` with a reason. Never claim a finding without evidence.

## Audit-self-check

Self-flag the audit as `INCOMPLETE` if any of these are true:

- Fewer rules ran than the playbook's planned count
- More than 30% of rules returned `unknown` (insufficient evidence)
- No `file:line` cited on any fail/warn finding
- No `reproduceSteps` or `fix` snippet provided
- Median apparent time-per-rule was implausibly short (no Read or Grep tool calls between findings)
- Every finding ended up in the same tier (suspect: blanket-assignment without judgment)
