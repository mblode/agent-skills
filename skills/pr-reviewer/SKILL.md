---
name: pr-reviewer
description: >-
  Reviews the local diff or branch and returns a read-only, severity-tiered
  findings report. Modes cover standard bugs, structural quality, AI slop, and
  security audit. Use when asked to run /pr-reviewer, "review my changes",
  "code review", "thermo-nuclear review", "structural review", "deslop this",
  "clean up AI code", "security audit", "find vulnerabilities", or before
  commit, push, or handoff. For fixes use tidy; for PR creation use
  pr-creator; for CI or review comments use pr-babysitter; for frontend UX,
  accessibility, layout, state coverage, or rendered quality use ui-audit; for
  plans use planning.
---

# Local Review

- **IS:** read-only review of a local diff, branch diff, or PR. Returns severity-tiered findings; leaves the working tree unchanged.
- **IS NOT:** fixing code (`tidy`), creating PRs (`pr-creator`), monitoring CI or review threads (`pr-babysitter`), frontend PR UX/accessibility/rendered-quality review (`ui-audit`), architecture briefs (`define-architecture`), reviewing plans (`planning`).

Only report issues you can defend with `file:line` evidence.

## Mode dispatch

Pick one mode from the user's wording; load only its references:

| Mode | Triggers | Load | Scope |
|------|----------|------|-------|
| **Standard** (default) | `/pr-reviewer`, "review my changes", "code review" | `references/severity-rubric.md` | Local or branch diff |
| **Structural** | "thermo-nuclear review", "structural review", "deep code quality audit", "harsh maintainability review", "code judo" | `references/structural-quality-rubric.md` plus severity | Local or branch diff |
| **Deslop** | "deslop this", "clean up AI code", "remove slop", "review for AI patterns" | `references/ai-slop-patterns.md` plus severity | Local or branch diff |
| **Security audit** | "security audit", "find vulnerabilities", "deepsec", "threat model", "audit for security" | `references/security-checklist.md` | Named subsystem or whole repo, regardless of diff |

Conditional loads:

- `references/security-checklist.md` for auth, input handling, external APIs, uploads, or environment config.
- `references/performance-checklist.md` for fetching, rendering, images, dependencies, or bundle-affecting imports.
- `references/comment-examples.md` for output-format calibration.
- `agents/openai.yaml` only for the optional second-opinion pass below.

## Workflow

```text
Review progress:
- [ ] Dispatch mode and load references
- [ ] Discover target
- [ ] Gather context and baseline checks
- [ ] Review, shard if needed
- [ ] Validate exact lines
- [ ] Report
```

1. **Discover target.** Review staged/unstaged changes first; if clean, review the branch diff. For a PR, use the same criteria and the PR handoff format.
2. **Gather context.** Capture intent. Load scoped `AGENTS.md` / `CLAUDE.md`. Run documented lint, type-check, and tests where they exist; record baseline failures.
3. **Review.** Apply the loaded rubric and high-signal criteria; shard large diffs. Optional: run an installed different-model CLI (`codex exec`, `droid exec`) read-only with `agents/openai.yaml`'s `default_prompt`, then validate its findings.
4. **Validate.** Re-check exact lines. Drop speculative, duplicate, misread, mis-attributed, or pre-existing findings. Diff modes require changed lines; Security audit requires real in-scope code.
5. **Report.** Use `references/severity-rubric.md`; structural blockers go under `Must fix before push`.

## High-signal criteria

Report only when certain:

- Compile, type, import, or syntax failure.
- Clear runtime bug, state error, or data-handling regression.
- Concrete exploit path, named vulnerability class, and affected `file:line`.
- Measurable performance regression.
- Missing necessary tests: render-only checks for interactive behavior, or bug fixes without a failing repro test at the seam that failed (route, API, integration point, not a helper invented during the fix).
- Test setup that requires helper tracing to understand assertions.
- New lint, type-check, or test failures versus baseline.
- Scoped instruction-file violation, with the rule quoted.
- Speculative abstraction or avoidable complexity without a current requirement.
- AI-generated patterns from `references/ai-slop-patterns.md`.
- File pushed past ~1000 lines when the new behavior has a local module, component, or helper boundary.
- Feature-specific conditionals added to unrelated shared paths.
- Bespoke helper duplicating a canonical utility.
- Hand-rolled reimplementation of stdlib or native platform behavior, with the replacement named.
- New dependency added for what the stdlib, the platform, or an already-installed dependency covers.
- Logic in the wrong layer when the canonical home is clear.
- Retried or at-least-once write with no idempotency key or dedupe barrier, so a duplicate delivery applies twice.
- Database commit plus an external publish (queue, webhook, email) without an outbox or transactional guarantee (dual-write): one side can fail independently.
- External input (webhook/callback) trusted blindly: signature not verified over the raw bytes, or state overwritten directly from the payload instead of confirming against the source.
- Floats or other lossy types used for money or precision-sensitive values, or money serialized as a bare JSON number rather than a string or integer minor-units.
- Multi-step flow with an irreversible external effect and no compensation or resume path if a later step fails.
- Sensitive mutation (funds, permissions, config) with no audit trail of what changed, who changed it, and why.

Do not report style preferences, unrelated pre-existing issues, risks without a repro or exploit path, broad rewrites outside the diff's intent, linter-only noise, or explicitly silenced violations.

## Output

Default local report:

```markdown
## Local review

### Must fix before push
- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <concrete impact>
  Fix: <committable fix>

### Should fix soon
- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <concrete impact>
  Fix: <committable fix>

### Ready for handoff
- <readiness summary, including lint/type-check/test baseline>
```

If no issues, write `None.` under the first two tiers and state what was checked.

PR handoff format:

```markdown
## PR handoff summary

- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <concrete impact>
  Fix: <committable fix>
```

## Gotchas

- Local changes beat PR lookup; review the working tree first or you miss uncommitted bugs.
- Loading every rubric makes standard review noisy. Load only the selected mode.
- Editing mid-review breaks the contract. Route fixes to `tidy`.
- Findings without `file:line`, concrete impact, and a fix do not belong in the report.
- Merge duplicate findings that share one root cause.
- External-engine output is advisory. Re-validate everything against the actual diff.
- Skipping the baseline makes pre-existing failures look like regressions.

## Related skills

- `tidy`: applies fixes in place and verifies them.
- `pr-creator`: creates or updates the PR after review.
- `pr-babysitter`: monitors CI and inbound review comments.
- `ui-audit`: frontend PR review for user-facing UX, accessibility, layout, state coverage, and rendered quality.
- `define-architecture`: forward-looking architecture briefs and adoption opportunities outside a diff review.
- `planning`: builds and reviews plans before implementation.
