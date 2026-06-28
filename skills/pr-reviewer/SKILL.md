---
name: pr-reviewer
description: >-
  Reviews the current local diff or branch and returns a read-only,
  severity-tiered findings report. It never edits files. Four modes: standard
  bug and compliance review, structural quality, AI slop detection, and
  whole-codebase security audit. Use when asked to run /pr-reviewer, "review my
  changes", or "code review" before commit, push, or handoff.
  "Thermo-nuclear review", "structural review", "deep code quality audit",
  "harsh maintainability review", and "code judo" load the strict structural
  quality rubric. "Deslop this", "clean up AI code", "remove slop", and
  "review for AI patterns" load the AI slop catalog. "Security audit", "find
  vulnerabilities", "deepsec", "threat model", and "audit for security" sweep
  the whole codebase instead of the diff. To apply fixes automatically use
  simplify; to create the PR use pr-creator; to watch CI or handle inbound
  review comments use pr-babysitter; to review a plan document use planning.
---

# Local Review

- **IS:** a read-only review of the current local diff or branch that ends in a severity-tiered findings report. The working tree is identical before and after.
- **IS NOT:** applying fixes (use `simplify` where installed), creating the PR (use `pr-creator`), monitoring CI or resolving inbound review threads (use `pr-babysitter`), or reviewing plan documents (use `planning`).

Run as an explicit self-review step before commit, push, or handoff, not as a replacement for native PR review tools. Every flagged issue should be something a senior engineer would catch.

## Mode dispatch

Pick exactly one mode from the user's wording before reading anything else. Each mode loads only its own reference: loading every rubric on every run buries the high-signal bar under hundreds of lines of unused criteria.

| Mode | Dispatch when the user says | Load | Scope |
|------|-----------------------------|------|-------|
| **Standard** (default) | `/pr-reviewer`, "review my changes", "code review", or no mode keyword | `references/severity-rubric.md` | Local diff, or branch vs base |
| **Structural** | "thermo-nuclear review", "structural review", "deep code quality audit", "harsh maintainability review", "code judo" | `references/structural-quality-rubric.md` plus the severity rubric | Local diff, or branch vs base |
| **Deslop** | "deslop this", "clean up AI code", "remove slop", "review for AI patterns" | `references/ai-slop-patterns.md` plus the severity rubric | Local diff, or branch vs base |
| **Security audit** | "security audit", "find vulnerabilities", "deepsec", "threat model", "audit for security" | `references/security-checklist.md` (threat-model lens and vulnerability-class sweep) | Named subsystem, or whole repo if unscoped; diff status is irrelevant |

Security audit mode overrides the default diff scope: review code as it stands, walking by vulnerability class rather than by file. Everything else is unchanged: report-only, the same three tiers, and the same bar (each finding names the vulnerability class, the path/line, and a plausible exploit path; never "could be risky").

Conditional loads in any mode:

- `references/security-checklist.md` when the diff touches auth, input handling, external APIs, file uploads, or environment configuration
- `references/performance-checklist.md` when the diff touches data fetching, rendering, images, dependencies, or bundle-affecting imports
- `references/comment-examples.md` before writing the report, if you need a formatting refresher
- `agents/openai.yaml` only when dispatching the optional second-opinion pass to an external engine (workflow step 3); its `default_prompt` is the instruction to pass to that engine

## Workflow

Copy this checklist to track progress:

```text
Review progress:
- [ ] Dispatch mode and load its reference
- [ ] Discover the review target
- [ ] Gather context and scoped instruction files
- [ ] Run the review (shard large diffs; optional second opinion)
- [ ] Validate findings against exact lines
- [ ] Produce the report
```

1. **Discover the review target**
   - Staged or unstaged changes exist: review those.
   - Working tree clean: review the current branch diff against its base.
   - User points at an existing PR: apply the same criteria, but output the PR handoff summary instead of the local report.
   - Record the current branch and changed files so the report is grounded in the session.
2. **Gather context**
   - Capture the change intent from the session, recent commits, or the user's request.
   - Load instruction files (`AGENTS.md` / `CLAUDE.md`) scoped to the changed paths, including any in nested package or MFE directories whose code is in the diff. Apply only in-scope rules.
   - Run the project's lint, type-check, and test commands (from `package.json` scripts or equivalent) and record pre-existing failures, so regressions caused by the change are distinguishable. Include this baseline in the report.
3. **Run the review**
   - Apply the loaded mode reference plus the High signal only criteria below.
   - Large diffs: shard by subsystem, consolidate into one final report.
   - Optional, non-trivial diffs only: if a different-model review CLI is already installed (`codex exec`, `droid exec`), run it read-only as a second opinion, passing the `default_prompt` from `agents/openai.yaml`. This hedges against Claude reviewing Claude-authored code. Skip silently if none is installed; never add one as a dependency.
   - External-engine output is advisory: validate every finding against the actual diff and drop anything this skill would not flag on its own.
4. **Validate findings**
   - Re-check the exact lines before reporting. Keep only high-confidence issues; drop speculative or duplicate items.
   - Expect three vetting failure classes: by-design behavior misread as a bug (e.g. code honoring a documented convention flagged as an error), mis-attributed evidence (real issue, wrong file or line), and duplicates across shards or external engines. Check each finding against all three before it reaches the report.
   - Confirm each finding maps to a changed line in the latest diff (security audit mode: to real code in scope).
   - Collapse findings that share one root cause into a single item listing all affected locations.
5. **Produce the report**
   - Use the output format below, with severities from `references/severity-rubric.md`.
   - Structural-rubric findings use the same tiers: presumptive blockers map to `Must fix before push`, other structural issues to `Should fix soon`.

## High signal only

Flag only when certain:

- Code will fail to compile (syntax, types, imports)
- Code will produce incorrect behavior (clear logic or state errors)
- Concrete security risk with a direct exploit path
- Measurable performance regression
- Changed behavior clearly missing a necessary test: a new component or hook with no co-located test file, or a test whose every assertion is a render-only presence check (`expect(getByText(...)).toBeInTheDocument()`) with no interaction or branch coverage
- Bug fix without a failing test that reproduces it first (Prove-It Pattern: the test fails before the fix and passes after)
- Test setup over-abstracted until individual tests are unreadable without tracing helpers (prefer DAMP, Descriptive And Meaningful Phrases, over DRY in test code)
- Lint, type check, or tests fail as a result of the change (vs the step-2 baseline)
- Unambiguous instruction-file violation (quote the rule, verify its scope covers the changed path)
- Speculative abstraction: config systems, extension points, or wrappers not justified by a current requirement (three similar call sites beat a premature abstraction)
- Avoidable complexity: a simpler approach achieves the same result with less state, fewer branches, or fewer moving parts
- AI-generated patterns: over-commenting, unnecessary wrapping, type bypasses, premature abstraction (load `references/ai-slop-patterns.md` for the catalog)
- Diff pushes a file past ~1000 lines when the new code could be a focused module
- Ad-hoc conditionals or feature-specific branches inserted into unrelated shared code paths
- Bespoke helper duplicating an existing canonical utility
- Logic placed in the wrong layer when a clear canonical home exists

Never flag:

- Style, quality, or subjective preferences
- Pre-existing issues unrelated to the change
- Potential issues dependent on unknown inputs, or speculative risks with no concrete exploit or repro path
- Broad rewrites or architectural changes beyond the diff's intent
- Linter-only issues likely caught automatically
- Explicitly silenced violations

## Output format

Default local output:

```markdown
## Local review

### Must fix before push
- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <one to two sentences with concrete impact>
  Fix: <committable fix or clear implementation guidance>

### Should fix soon
- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <one to two sentences with concrete impact>
  Fix: <committable fix or clear implementation guidance>

### Ready for handoff
- <brief readiness summary, including the lint/type-check/test baseline from step 2>
```

If no issues: write `None.` under the first two tiers and state what was checked under `Ready for handoff`.

If the user explicitly points at an existing PR, adapt the same validated findings into a concise handoff summary:

```markdown
## PR handoff summary

- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <one to two sentences with concrete impact>
  Fix: <committable fix or clear implementation guidance>
```

## Gotchas

- Asking for a PR number when local changes exist: the default target is the working tree; a PR-first habit reviews stale code and misses uncommitted bugs. Review the local diff first.
- Loading every rubric regardless of mode: a standard review run through the structural rubric flags subjective maintainability items the user never asked for, and the report loses its high-confidence guarantee. Load only the dispatched mode's reference.
- Editing files mid-review: this skill guarantees an untouched working tree. If you catch yourself fixing, stop and tell the user to run `simplify`.
- "This might cause issues" phrasing: a finding without `file:line` and a concrete failure gets ignored. Write "`x` is undefined at `src/foo.ts:45`, causing `ReferenceError` at runtime."
- "Consider refactoring" phrasing: either quote the violated instruction-file rule with its scoped path, or drop the finding.
- Multiple findings for one root cause: the reader fixes one and assumes the rest are separate bugs. Emit one finding linking all affected locations.
- Pasting external-engine output verbatim: unvalidated advisory findings break the high-confidence contract. Re-validate each against changed lines first.
- Skipping the lint/test baseline in step 2: pre-existing failures get reported as regressions and the whole report loses credibility.

## Related skills

- `simplify` (where installed): applies fixes in-place and verifies the build. Both skills cover reuse, quality, and efficiency; the difference is report-only vs fix-in-place.
- `pr-creator`: creates the PR after the review passes.
- `pr-babysitter`: monitors CI and triages inbound review comments after the PR exists.
- `planning`: builds and stress-tests plan documents before implementation; this skill reviews code, not plans.
