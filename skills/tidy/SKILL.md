---
name: tidy
description: Reviews a local diff, branch diff, or PR with file:line findings in confirmed and plausible tiers, and in apply mode lands the fixes and diff-scoped simplifications. Use when asked to "review my changes", "code review", "tidy this", "simplify my diff", "deslop this", "structural review", or "security audit". For the PR itself use pr-creator; for CI and review threads use pr-babysitter; for UI defects use ui-design; for repo architecture use codebase-architecture.
---

# Tidy

Review the diff, then fix it when asked. One pass produces the report; the same pass, in apply mode, lands the fixes along with the simplifications a clean diff still hides.

- **IS:** review of a local diff, branch diff, PR, or named security scope, returning severity-tiered findings with `file:line` evidence; in apply mode, the smallest complete fixes for those findings plus diff-scoped simplification.
- **IS NOT:** creating PRs (`pr-creator`), CI failures and review threads (`pr-babysitter`), user-facing UX, accessibility, or rendered quality (`ui-design` Audit mode), library or CLI ergonomics (`dx-audit`), architecture briefs and repo-wide guardrails (`codebase-architecture`), reviewing plans (`planning`).

## Report or apply

**Report** is the default: "review my changes", "code review", a mode phrase below, or a PR number. Done is the report in the format under Output, carrying the range reviewed, each baseline command's last line, and the references read. The working tree stays as it was. Do not edit a file in report mode, even for a one-character fix; the moment the tree changes the user loses the read-only report they asked for.

**Apply** when the user says "tidy", "simplify", "fix", "apply the findings", or asks for the changes to be made. Done is the confirmed findings and supported simplifications in the working tree, the affected checks passing or their failures shown to be baseline, and a summary of what changed, what was left and why, and the check results. Apply mode edits any file the diff touches or a fix requires, and runs the repository's documented lint, type, and test commands without asking: they run locally against the working tree, and landing the changes is what was asked for. It does not commit, push, open PRs, add or upgrade dependencies, run migrations, or write outside the working tree. A report from earlier in the session is input, not authority: apply what current evidence supports and say why anything was not applied.

## Harness precedence

Claude Code bundles `/code-review` (correctness plus cleanups, with `--fix`) and `/security-review`. A typed slash command runs the bundled skill; this one runs when named or when a mode phrase matches, and adds the Structural and Deslop modes, a whole-repo Security audit, the plausible tier the bundled commands filter out, `REVIEW.md` support, and the same report on any harness with git and the file tools. Findings from a bundled review already run this session enter the verdict step as candidates rather than being re-derived.

## Mode dispatch

Pick one lens from the user's wording. `references/severity-rubric.md` loads in every mode; the table adds the mode's own rubric.

| Mode | Triggers | Adds | Scope |
|------|----------|------|-------|
| **Standard** (default) | `/tidy`, "review my changes", "code review", "tidy this" | nothing | Local or branch diff |
| **Structural** | "structural review", "thermo-nuclear review", "deep code quality audit", "harsh maintainability review", "code judo" | `references/structural-quality-rubric.md` | Local or branch diff |
| **Deslop** | "deslop this", "clean up AI code", "remove slop", "review for AI patterns" | `references/ai-slop-patterns.md` | Local or branch diff |
| **Security audit** | "security audit", "find vulnerabilities", "deepsec", "threat model", "audit for security" | `references/security-checklist.md` | Named subsystem or whole repo, regardless of diff |

Conditional loads, in any mode:

- `references/context-errors.md` when the diff was agent-written, or adds, changes, or removes a module, system boundary, guard, or fallback.
- `references/security-checklist.md` for auth, input handling, external APIs, uploads, dependency or lockfile changes, or environment config.
- `references/performance-checklist.md` for fetching, rendering, images, dependencies, or bundle-affecting imports.
- `agents/openai.yaml` only for the optional second-opinion pass in step 3. Otherwise it is launcher metadata for external runners and never loads.

## Workflow

1. **Discover target.** Staged and unstaged changes first (`git diff --stat`, `git diff --staged --stat`); if clean, the branch diff against `git merge-base HEAD origin/<default>`. For a PR, `gh pr diff <n>` with the branch checked out. Record the range or ref pair; it goes in the report.
2. **Gather context.** Open the mode references and the conditional loads with the file tools. A filename in this skill is a pointer, not loaded content; if a required read fails, report the coverage gap rather than claiming the rubric was applied. Capture intent from the user's words, the commit messages, and the PR description. Load scoped `AGENTS.md` / `CLAUDE.md` and a root `REVIEW.md` where one exists: both override this skill's defaults when they conflict, so a pattern they mandate is not a finding. Reuse checks already run on this revision; when a candidate needs execution, run the documented command and preserve its exit status.
3. **Review.** Apply the loaded rubric and the high-signal criteria; shard large diffs. Five passes, because each finds what the others cannot:
   - **Claims.** Map each claim in the description or commit messages to a hunk, and each hunk to a claim. A claim with no hunk is a finding. A hunk with no claim goes under the readiness summary as an unstated change.
   - **Added lines.** Read every hunk, then the enclosing function. A bug on an unchanged line of a touched function is in scope: this diff re-exposed it.
   - **Removed lines.** For every deleted or replaced line, name the invariant it enforced, then find where the new code re-establishes it. If you cannot, that is the finding: a removed guard, a dropped error path, a narrowed validation, a deleted test that covered a real case.
   - **Call sites.** For each changed function, grep its callers for a new precondition, changed return shape, new exception, or ordering dependency; then check its callees.
   - **Outside the diff.** For each new module, guard, or fallback, open what the diff did not: the directory's existing exports, sibling implementations, every writer of the guarded value. A reimplemented helper, a change filed in the wrong system, and a fallback for a state nothing produces all read as clean code until you look at the file the diff never opened. `references/context-errors.md` carries the searches and the evidence each finding needs.

   Optional: where a different-model CLI is installed (`codex exec`, `droid exec`, or equivalent), run it read-only with `agents/openai.yaml`'s `default_prompt`, then verdict its findings like your own. Its agreement is not corroboration; both instances read the same diff with the same missing context.
4. **Verdict.** Every candidate is confirmed (you can name the triggering input or state and the wrong output; quote the line), plausible (the mechanism is real, the trigger uncertain; say what would confirm it), or refuted (factually wrong or already guarded; quote the line that proves it). Plausible is the default: concurrency races, nil on a rare but reachable path, falsy-zero read as missing, an off-by-one on an unexcluded boundary, a regex that lost its anchor are all realistic. Refute only what the code disproves. Drop duplicates, mis-attributions, and pre-existing issues outside any touched function.
5. **Report or apply.** Report per Output, structural blockers under `Must fix before push`, plausible findings marked. In apply mode, continue below.

## Apply

Merge findings by root cause. Correctness fixes first, then ownership fixes, then simplification of what remains. Alongside the confirmed findings, sweep the diff on five angles:

| Angle | Question | Evidence for a change |
|---|---|---|
| Reuse | Does this code need to exist, or does a repository helper, stdlib, platform feature, or installed dependency cover it? | The existing contract and call site, including the boundary cases it handles |
| Quality | Does this add a second owner of state, an unused extension point, or unnecessary compatibility? | Actual consumers and state ownership, not line count |
| Efficiency | Does this add repeated work on a real hot path? | Call frequency, duplicate reads, unbounded retention |
| Ownership | Is a caller patch compensating for a shared mechanism, or placed outside the subsystem that owns this behaviour? | Writers, callers, and adjacent implementations; the deeper fix must be smaller than the special case |
| Test value | Can the test fail for a reason someone would act on? | A named regression, reachable branch, or public contract; literal diff mirrors and mock echoes add none |

Constraints:

- **Guard deletion requires system evidence.** Before removing a fallback, retry, lock, or validation, identify the writers, reachable states, staleness tolerance, and recovery owner. If its state cannot be ruled out, keep it and report the uncertainty.
- **No whole-file rollback of unrelated edits.** Scope formatters; `git restore <path>` discards the user's earlier edits in the same file.
- **No abstraction quota.** Fewer lines is not a win if it hides different lifecycles or drops behaviour. An existing owning subsystem beats a preferred generic pattern.
- **Tests follow risk.** Add or update a regression check when the edit changes behaviour that can independently regress; not for copy, a literal config change, or framework behaviour covered elsewhere.
- **Stop on evidence.** Once affected checks pass, repeat only for new changes or unresolved concerns. A second pass that keeps adding guards to the same spot means the mechanism, not the guard, is the problem: put the simpler shape to the person who owns the system.

Run the checks the changes affect plus repository-required gates, preserving exit codes and distinguishing baseline failures, then write the summary described under Report or apply.

## High-signal criteria

Raise anything that matches one of these and let the verdict step decide; do not pre-filter on confidence, or the filter runs twice and the second pass never sees what the first dropped.

- Compile, type, import, or syntax failure; a call to a symbol the installed dependency version does not export (check `node_modules/<pkg>` or the lockfile version's docs).
- Caught error discarded: an empty `catch`, one that logs then falls into the success path, `.catch(() => {})` on a promise whose failure changes what the caller should do.
- Concrete exploit path with the vulnerability class and affected `file:line`.
- Missing necessary tests: render-only checks for interactive behaviour, or a bug fix without a failing repro at the seam that failed.
- Scaffolding whose consumer is absent or unreachable, cited with the search that found none, and marked plausible where a consumer could be generated, reached by convention, or live outside this repo. An empty search is not proof: dynamic imports, file-name conventions, generated code, and other repos reach code no static search finds.
- A guard, fallback, retry, or freshness mechanism covering a state the deployment never produces, reported only with the writer set, the consumer's tolerance, or the restart policy named.
- New lint, type-check, or test failures versus baseline.
- Scoped instruction-file or `REVIEW.md` violation, with the rule quoted.
- Retried or at-least-once write with no idempotency key; a database commit plus an external publish with no outbox; a webhook trusted without verifying the signature over the raw bytes; floats for money; timestamps as unstructured strings; a multi-step flow with an irreversible effect and no compensation path; a sensitive mutation with no audit trail.

Structural checks fire in every mode, Standard included: a fix bolted on above the level it belongs at (a special case keyed to one caller inside code that serves all of them; a guard at one call site when the callee could return the right shape for every caller); speculative abstraction without a current requirement; a file pushed past ~1000 lines when the new behaviour has a local boundary (a configured `max-lines` wins); feature-specific conditionals in shared paths; a bespoke helper duplicating a canonical utility or reimplementing stdlib; a new dependency for what is already installed; logic in the wrong layer. `references/structural-quality-rubric.md` deepens each for Structural mode.

Do not report style preferences, unrelated pre-existing issues, risks without a repro or exploit path, broad rewrites outside the diff's intent, linter-only noise, or explicitly silenced violations.

## Output

Every finding carries `file:line`, a one-line impact, and a committable fix. A plausible finding adds `Plausible: <what would confirm it>`. A finding resting on something outside the diff adds `Context:` naming that artifact. A `Fix:` phrased as "consider refactoring" cannot be applied; write the change. Length follows the findings: a clean diff gets `None.` twice and the readiness block.

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
  Plausible: <what would confirm it>

### Ready for handoff
- Reviewed: <range or ref pair>, <N> files
- Baseline: `<command>` -> <last line>
- Mode: <selected mode>
- Reference evidence: `<path opened>` -> "<short excerpt>"
- Missing reference coverage: <failed reads, or None>
- Unstated changes: <hunks no claim covers, or None>
- <readiness verdict>
```

For a PR handoff posted through `pr-babysitter` or `gh`, use the same finding shape under `## PR handoff summary` and prefix `minor` items with `Nit:`. In apply mode, follow the report with what was applied, what was left and why, and the check results.

## Gotchas

- `git diff @{u}` fails with "no upstream configured" on a fresh branch, and a diff against `main` on a stale checkout includes everyone else's commits. Diff against `git merge-base HEAD origin/<default>` and state the range.
- Line numbers counted off `git diff` hunk headers land off by the hunk offset. Take the number from `grep -n` or the file; a reviewer who cannot find the cited line discards the rest of the report.
- Skipping the baseline makes pre-existing failures look like regressions, and a full `npm test` dumps hundreds of lines re-sent every turn. Run the quiet form and quote the last line.
- One broken helper reported once per call site reads as three problems and gets three patches while the helper stays broken. Report it once and list the call sites under it.
- An `@path` line in `REVIEW.md` is literal text to Claude Code Review, which does not expand imports there. Read the file the same way, or the two reports disagree and the author trusts neither.

## Related skills

- `pr-creator`: creates or updates the PR after review; commits and PR creation stay there.
- `pr-babysitter`: monitors CI and inbound review comments, and posts the PR handoff format.
- `ui-design` Audit mode: UI-level slop, layout, and rendered quality; Deslop mode here covers code-level slop only.

Maintenance only: `evals/evals.json` holds the regression scenarios and routing prompts for anyone changing this skill; it never loads during a user task.
