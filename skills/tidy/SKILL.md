---
name: tidy
description: Reviews a local diff, branch diff, or PR with evidence-tiered findings, and on request applies the fixes and diff-scoped simplifications (reuse, ownership, efficiency, test value). Report-only by default. Use when asked to "review my changes", "code review", "tidy this", "simplify my diff", "apply the review findings", "structural review", "review for AI patterns", or "security audit". For UI defects use ui-design; for repository architecture use codebase-architecture.
---

# Tidy

Review the diff, then fix it when asked. One pass finds the findings; the same pass, in apply mode, lands them along with the simplifications a clean diff still hides.

- **IS:** review of a local diff, branch diff, PR, or named security scope, returning severity-tiered findings with `file:line` evidence; and, in apply mode, the smallest complete fixes for those findings plus diff-scoped simplification.
- **IS NOT:** creating PRs (`pr-creator`), monitoring CI or review threads (`pr-babysitter`), frontend UX, accessibility, or rendered-quality review (`ui-design` Audit mode), library or CLI ergonomics (`dx-audit`), architecture briefs and repo-wide guardrails (`codebase-architecture`), reviewing plans (`planning`).

## Report or apply

**Report** is the default: the working tree stays unchanged and the user gets the findings. "Review my changes", "code review", a mode phrase below, or a PR number all mean report. Do not edit a file in report mode, even for a one-character fix; the moment the tree changes the user loses the read-only report they asked for.

**Apply** when the user says "tidy", "simplify", "fix", "apply the findings", or asks for the changes to be made. Run the same review, then apply confirmed findings and the simplifications under "Apply" below, and run the affected checks. A report from earlier in the session is input: apply what current evidence supports, and say why anything was not applied.

## Harness precedence

Claude Code bundles `/code-review` (correctness plus cleanups, with `--fix`) and `/security-review`. A typed slash command runs the bundled skill; this one runs when named or when a mode phrase matches. It adds Structural and Deslop modes, a whole-repo Security audit, the plausible tier the bundled commands filter out, `REVIEW.md` support, and the same report on any harness with git and the file tools alone. Where a bundled review already ran this session, its findings enter the verdict step as candidates rather than being re-derived.

## Mode dispatch

Pick one lens from the user's wording; load only its references:

| Mode | Triggers | Load | Scope |
|------|----------|------|-------|
| **Standard** (default) | `/tidy`, "review my changes", "code review", "tidy this" | `references/severity-rubric.md` | Local or branch diff |
| **Structural** | "structural review", "deep code quality audit", "harsh maintainability review", "code judo" | `references/structural-quality-rubric.md` plus severity | Local or branch diff |
| **Deslop** | "deslop this", "clean up AI code", "remove slop", "review for AI patterns" | `references/ai-slop-patterns.md` plus severity | Local or branch diff |
| **Security audit** | "security audit", "find vulnerabilities", "threat model", "audit for security" | `references/security-checklist.md` | Named subsystem or whole repo, regardless of diff |

Conditional loads:

- `references/context-errors.md` when the diff was agent-written, or when it adds, changes, or removes a module, system boundary, guard, or fallback. It covers the two mistakes invisible inside the diff: code that duplicates or bypasses something already in the repo, and code guarding a state this system never produces.
- `references/security-checklist.md` for auth, input handling, external APIs, uploads, dependency or lockfile changes, or environment config.
- `references/performance-checklist.md` for fetching, rendering, images, dependencies, or bundle-affecting imports.
- `agents/openai.yaml` only when a different-model CLI is installed and you run the optional second-opinion pass.

## Workflow

```text
Review progress:
- [ ] Discover target; record the exact range
- [ ] Dispatch mode; open its references and applicable conditional references
- [ ] Gather context: intent, instruction files, REVIEW.md, quiet baseline checks
- [ ] Review: claims, added lines, removed lines, call sites, outside the diff; shard if needed
- [ ] Verdict each candidate: confirmed, plausible, or refuted
- [ ] Report, or apply and run the affected checks
```

1. **Discover target.** Staged and unstaged changes first (`git diff --stat`, `git diff --staged --stat`); if clean, the branch diff against its merge base with the default branch (`git merge-base HEAD origin/<default>`). For a PR, `gh pr diff <n>` with the branch checked out. Write down the range or ref pair; it goes in the report.
2. **Gather context.** Open the mode references with the file tools, then apply the conditional loads to added and removed lines. A filename in this skill is a pointer, not loaded content; if a required read fails, report the coverage gap rather than claiming the rubric was applied. Capture intent from the user's words, the commit messages, and the PR description. Load scoped `AGENTS.md` / `CLAUDE.md` and a root `REVIEW.md` where one exists: both override this skill's defaults when they conflict, so a pattern they mandate is not a finding. Reuse checks already run on this revision; when a candidate needs execution, run the documented command and preserve its exit status.
3. **Review.** Apply the loaded rubric and the high-signal criteria; shard large diffs. Five passes, because each finds what the others cannot:
   - **Claims.** Map each claim in the description or commit messages to a hunk, and each hunk to a claim. A claim with no hunk is a finding. A hunk with no claim goes under the readiness summary as an unstated change.
   - **Added lines.** Read every hunk, then the enclosing function. A bug on an unchanged line of a touched function is in scope: this diff re-exposed it.
   - **Removed lines.** For every deleted or replaced line, name the invariant it enforced, then find where the new code re-establishes it. If you cannot, that is the finding: a removed guard, a dropped error path, a narrowed validation, a deleted test that covered a real case.
   - **Call sites.** For each changed function, grep its callers for a new precondition, changed return shape, new exception, or ordering dependency; then check its callees.
   - **Outside the diff.** For each new module, guard, or fallback, open what the diff did not: the directory's existing exports, sibling implementations, every writer of the guarded value. A reimplemented helper, a change filed in the wrong system, and a fallback for a state nothing produces all read as clean code until you look at the file the diff never opened. `references/context-errors.md` carries the searches and the evidence each finding needs.

   Optional: where a different-model CLI is installed (`codex exec`, `droid exec`, or equivalent), run it read-only with `agents/openai.yaml`'s `default_prompt` for a second opinion, then verdict its findings like your own. Its agreement is not corroboration; both instances read the same diff with the same missing context.
4. **Verdict.** Every candidate is confirmed (you can name the triggering input or state and the wrong output; quote the line), plausible (the mechanism is real, the trigger uncertain; say what would confirm it), or refuted (factually wrong or already guarded; quote the line that proves it). Plausible is the default: concurrency races, nil on a rare but reachable path, falsy-zero read as missing, an off-by-one on an unexcluded boundary, a regex that lost its anchor are all realistic. Refute only what the code disproves. Drop duplicates, mis-attributions, and pre-existing issues outside any touched function.
5. **Report or apply.** Report per the output format, structural blockers under `Must fix before push`, plausible findings marked. In apply mode, continue below.

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
- **No whole-file rollback of unrelated edits.** Scope formatters; `git restore <path>` can discard the user's earlier edits in the same file.
- **No abstraction quota.** Fewer lines is not a win if it hides different lifecycles or drops behaviour. An existing owning subsystem beats a preferred generic pattern.
- **Tests follow risk.** Add or update a regression check when the edit changes behaviour that can independently regress; not for copy, a literal config change, or framework behaviour covered elsewhere.
- **Stop on evidence.** Once affected checks pass, repeat only for new changes or unresolved concerns. A second pass that keeps adding guards to the same spot means the mechanism, not the guard, is the problem: put the simpler shape to the person who owns the system.

Run the checks the changes affect plus repository-required gates, preserving exit codes and distinguishing baseline failures. Report what changed and why, the check results, and any fix that needs a broader scope. Leave commits and PR creation to the user or `pr-creator`.

## High-signal criteria

Raise anything that matches one of these and let the verdict step decide; do not pre-filter on confidence.

- Compile, type, import, or syntax failure; a call to a symbol the installed dependency version does not export (check `node_modules/<pkg>` or the lockfile version's docs).
- Clear runtime bug, state error, or data-handling regression.
- Caught error discarded: an empty `catch`, one that logs then falls into the success path, `.catch(() => {})` on a promise whose failure changes what the caller should do.
- Concrete exploit path with the vulnerability class and affected `file:line`.
- Measurable performance regression.
- Missing necessary tests: render-only checks for interactive behaviour, or a bug fix without a failing repro at the seam that failed.
- Scaffolding whose consumer is absent or unreachable, cited with the search that found none, and marked plausible where a consumer could be generated, reached by convention, or live outside this repo.
- A guard, fallback, retry, or freshness mechanism covering a state the deployment never produces, reported only with the writer set, the consumer's tolerance, or the restart policy named.
- New lint, type-check, or test failures versus baseline.
- Scoped instruction-file or `REVIEW.md` violation, with the rule quoted.
- Retried or at-least-once write with no idempotency key; a database commit plus an external publish with no outbox; a webhook trusted without verifying the signature over the raw bytes; floats for money; timestamps as unstructured strings; a multi-step flow with an irreversible effect and no compensation path; a sensitive mutation with no audit trail.

Structural checks that fire in every mode: a fix bolted on above the level it belongs at (a special case keyed to one caller inside code that serves all of them; a guard at one call site when the callee could return the right shape for every caller); speculative abstraction without a current requirement; a file pushed past ~1000 lines when the new behaviour has a local boundary (a configured `max-lines` wins); feature-specific conditionals in shared paths; a bespoke helper duplicating a canonical utility or reimplementing stdlib; a new dependency for what is already installed; logic in the wrong layer. `references/structural-quality-rubric.md` deepens each for Structural mode.

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
- A search returning nothing is not proof nothing consumes an artifact: dynamic imports, file-name conventions, generated code, and other repos reach code no static search finds.
- An `@path` line in `REVIEW.md` is literal text to Claude Code Review, which does not expand imports there. Read the file the same way, or the two reports disagree and the author trusts neither.

## Related skills

- `pr-creator`: creates or updates the PR after review.
- `pr-babysitter`: monitors CI and inbound review comments, and posts the PR handoff format.
- `ui-design` Audit mode: user-facing UX, accessibility, layout, and rendered quality, including UI-level slop; Deslop mode here covers code-level slop only.
- `dx-audit`: the developer-facing surface of a library, CLI, or SDK.
- `codebase-architecture`: forward-looking briefs, deepening, and repo-wide guardrails outside a diff.
- `planning`: builds and reviews plans before implementation.

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
