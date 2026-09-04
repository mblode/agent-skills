---
name: pr-reviewer
description: Reviews a diff or security scope read-only using evidence-tiered findings, structural and context-error rubrics, and repository review policy. Use when asked to "review my changes", "structural review", "review for AI patterns", or "security audit". For applying fixes use tidy; for UI defects use ui-design.
---

# Local Review

- **IS:** read-only review of a local diff, branch diff, or PR. Returns severity-tiered findings; leaves the working tree unchanged.
- **IS NOT:** fixing code (`tidy`), creating PRs (`pr-creator`), monitoring CI or review threads (`pr-babysitter`), frontend UX, accessibility, or rendered-quality review (`ui-design` Audit mode), library or CLI ergonomics (`dx-audit`), architecture briefs (`codebase-architecture`), reviewing plans (`planning`).

Only report issues you can defend with `file:line` evidence.

**When to run:** on the requested diff, including a failing one. Existing check results at the same revision are usable evidence; run a focused check when it can settle a finding, and report coverage limits.

**Then hand off.** `tidy` runs next in the usual flow, hunting complexity and applying what it finds, including this report's confirmed findings. So write the report to be consumed: every `Fix:` line has to be something a person could commit. Do not apply anything yourself, even a one-character fix; the moment this skill edits a file the user loses the read-only report they asked for.

## Harness precedence

Claude Code bundles `/code-review` (correctness plus cleanups, with effort levels, `--fix`, and `--comment`) and `/security-review` (security on the current diff). A typed slash command runs the bundled skill, not this one; this skill runs when named or when a mode phrase below matches. It does not replace them. It adds Structural and Deslop modes, a whole-repo Security audit, a plausible tier the bundled commands filter out, `REVIEW.md` support (which the local `/code-review` does not read), and the same report on any harness, with git and the file tools alone. Do not run both on one diff unprompted; where a bundled review already ran this session, its findings enter the verdict step as candidates rather than being re-derived. Never reach for `--fix` or `tidy` mid-review to "confirm" a finding; that edits the tree the report is about.

## Mode dispatch

Pick one mode from the user's wording; load only its references:

| Mode | Triggers | Load | Scope |
|------|----------|------|-------|
| **Standard** (default) | `/pr-reviewer`, "review my changes", "code review" | `references/severity-rubric.md` | Local or branch diff |
| **Structural** | "thermo-nuclear review", "structural review", "deep code quality audit", "harsh maintainability review", "code judo" | `references/structural-quality-rubric.md` plus severity | Local or branch diff |
| **Deslop** | "deslop this", "clean up AI code", "remove slop", "review for AI patterns" | `references/ai-slop-patterns.md` plus severity | Local or branch diff |
| **Security audit** | "security audit", "find vulnerabilities", "deepsec", "threat model", "audit for security" | `references/security-checklist.md` | Named subsystem or whole repo, regardless of diff |

Conditional loads:

- `references/context-errors.md` when the diff was agent-written, or when it adds a module, a system boundary, a guard, or a fallback. Covers the two mistakes that are invisible inside the diff: code that duplicates or bypasses something already in the repo, and code guarding a state this system never produces.
- `references/security-checklist.md` for auth, input handling, external APIs, uploads, dependency or lockfile changes, or environment config.
- `references/performance-checklist.md` for fetching, rendering, images, dependencies, or bundle-affecting imports.
- `agents/openai.yaml` only when a different-model CLI is installed and you are running the optional second-opinion pass below.

## Workflow

```text
Review progress:
- [ ] Dispatch mode and load references
- [ ] Discover target; record the exact range
- [ ] Gather context: intent, instruction files, REVIEW.md, quiet baseline checks
- [ ] Review: claims, added lines, removed lines, call sites, outside the diff; shard if needed
- [ ] Verdict each candidate: confirmed, plausible, or refuted
- [ ] Report, with the range, commands, and references as evidence
```

1. **Discover target.** Staged and unstaged changes first (`git diff --stat`, `git diff --staged --stat`); if clean, the branch diff against its merge base with the default branch (`git merge-base HEAD origin/<default>`). For a PR, `gh pr diff <n>` with the branch checked out for context; same criteria, PR handoff format. Write down the range or ref pair you reviewed; it goes in the report.
2. **Gather context.** Capture intent from the user's words, the commit messages, and the PR description. Load scoped `AGENTS.md` / `CLAUDE.md`, and a root `REVIEW.md` where one exists: both override this skill's defaults when they conflict, so a pattern they mandate is not a finding. `REVIEW.md` is the file Claude Code Review reads for severity calibration, skip paths, nit caps, and repo-specific checks; apply it the same way here. Reuse checks already run on this revision. When a candidate needs execution, run the relevant documented command and preserve its exit status; piping into `tail` without `pipefail` can hide failure.
3. **Review.** Apply the loaded rubric and high-signal criteria; shard large diffs. Five passes, because each finds what the others structurally cannot:
   - **Claims.** Map each claim in the description or commit messages to a hunk, and each hunk to a claim. A claim with no hunk is a finding: the description says a change shipped and the diff does not contain it, the most common description-to-code mismatch in agent-authored PRs, and the one that most often gets them rejected. A hunk with no claim is not a finding on its own; list it under the readiness summary as an unstated change so the reader can decide.
   - **Added lines.** Read every hunk, then the enclosing function. A bug on an unchanged line of a touched function is in scope: this diff re-exposed it.
   - **Removed lines.** For every line the diff deletes or replaces, name the invariant it enforced, then find where the new code re-establishes it. If you cannot, that is the finding: a removed guard, a dropped error path, a narrowed validation, a deleted test that covered a real case. Deletions read as progress and get skimmed, which is exactly why this pass earns its cost.
   - **Call sites.** For each changed function, grep its callers and check for a new precondition, a changed return shape, a new exception, or an ordering dependency. Then check its callees: does another change in the same diff make one of its own calls unsafe?
   - **Outside the diff.** The passes above judge the diff against itself, so a change that is wrong only relative to the codebase leaves no trace in any of them. For each new module, guard, or fallback, open what the diff did not: the directory's existing exports, the sibling implementations of the same class of behavior, and every writer of the value being guarded. A reimplementation of an existing helper, a change filed in the wrong system, and a fallback for a state nothing produces all read as clean code until you look at the file the diff never opened. `references/context-errors.md` carries the searches and the evidence each finding needs.

   Optional and skippable: where a different-model CLI is already installed (`codex exec`, `droid exec`, or equivalent), run it read-only with `agents/openai.yaml`'s `default_prompt` for a second opinion, then verdict its findings like your own. No such CLI is not a blocker; the review is complete without it.
4. **Verdict.** Give every candidate one of three verdicts. Report confirmed and plausible; drop refuted.
   - **Confirmed:** you can name the inputs or state that trigger it and the resulting wrong output. Quote the line.
   - **Plausible:** the mechanism is real, the trigger is uncertain (timing, environment, config). Say what would confirm it.
   - **Refuted:** factually wrong, or already guarded. Quote the line that proves it.

   Plausible is the default. Do not refute something for being "speculative" when the state is realistic: concurrency races, nil or undefined on a rare but reachable path (error handler, cold cache, absent optional field), falsy-zero read as missing, off-by-one on a boundary the code does not exclude, retry storms and partial failures, a regex or allowlist that lost its anchor. Refute only what you can disprove from the code: the line does not say that, a type or constant makes it impossible, the diff already handles it, or it is style with no observable effect. Also drop duplicates, mis-attributions, and pre-existing issues outside any touched function. Diff modes require changed lines; Security audit requires real in-scope code.
5. **Report.** Use `references/severity-rubric.md`; structural blockers go under `Must fix before push`. Mark plausible findings as such so the reader knows which ones need a repro before acting. The readiness summary carries the evidence: the range reviewed, each baseline command with its last line, the references loaded, and any unstated hunks from the claims pass.

## High-signal criteria

These are the classes worth surfacing. Raise anything that matches one and let the verdict step decide confirmed, plausible, or refuted; do not pre-filter on confidence here, or the filter runs twice and the second pass never sees what the first one dropped.

- Compile, type, import, or syntax failure.
- Import or call of a symbol the installed dependency version does not export: an option, method, or module that reads as real and type-checks in JavaScript or under `any`. Check `node_modules/<pkg>` or the lockfile version's docs before trusting an unfamiliar call.
- Clear runtime bug, state error, or data-handling regression.
- Caught error discarded: an empty `catch`, one that logs and then falls through into the success path, or a `.catch(() => {})` on a promise whose failure changes what the caller should do. Say what the caller now sees instead of the failure. A catch whose fallback is deliberate and correct is not a finding.
- Concrete exploit path, named vulnerability class, and affected `file:line`.
- Measurable performance regression.
- Missing necessary tests: render-only checks for interactive behavior, or bug fixes without a failing repro test at the seam that failed (route, API, integration point, not a helper invented during the fix).
- Test setup that requires helper tracing to understand assertions.
- Scaffolding whose consumer is absent or unreachable: a test for a module that does not exist, a generated surface nothing imports, a CI check on a contract nothing emits. Cite the artifact's line and the search that found no consumer, and mark it plausible where the consumer could be generated at build time, reached by framework convention, or live outside this repo.
- Guard, fallback, retry, or freshness mechanism covering a state the deployment does not produce: a value re-validated at every use that nothing writes after boot, invalidation for a consumer that tolerates the staleness anyway, degradation in a process a supervisor already restarts. Report it only with the writer set, the consumer's tolerance, or the restart policy named; without that the guard stays, because acting on this one deletes it. Distinct from a check the type system already rules out, which is a slop pattern rather than a finding here.
- New lint, type-check, or test failures versus baseline.
- Scoped instruction-file or `REVIEW.md` violation, with the rule quoted.
- Retried or at-least-once write with no idempotency key or dedupe barrier, so a duplicate delivery applies twice.
- Database commit plus an external publish (queue, webhook, email) without an outbox or transactional guarantee (dual-write): one side can fail independently.
- External input (webhook/callback) trusted blindly: signature not verified over the raw bytes, or state overwritten directly from the payload instead of confirming against the source.
- Floats or other lossy types used for money or precision-sensitive values, or money serialized as a bare JSON number rather than a string or integer minor-units.
- Timestamps stored or transported as unstructured strings: a locale format, a bare `YYYY-MM-DD HH:MM` with no zone, or a hand-built string where the column or field takes an instant. Name the reader that gets it wrong, an ambiguous day/month or a local time compared against UTC. A string already in ISO 8601 with an offset is not a finding.
- Multi-step flow with an irreversible external effect and no compensation or resume path if a later step fails.
- Sensitive mutation (funds, permissions, config) with no audit trail of what changed, who changed it, and why.

Structural checks that fire in every mode, including Standard, which does not load the structural rubric. `references/structural-quality-rubric.md` deepens each one for Structural mode; these are the always-on floor:

- Wrong altitude: a fix bolted on above the level it belongs at. A special case keyed to one caller, route, tenant, or file type added inside code that serves all of them; a guard added at one call site when the callee could return the right shape for every caller; a value patched after the fact instead of produced correctly. Name the mechanism that should absorb it.
- Speculative abstraction or avoidable complexity without a current requirement, where a caller exists but the requirement does not.
- File pushed past ~1000 lines when the new behavior has a local module, component, or helper boundary. A project-configured `max-lines` wins over this number.
- Feature-specific conditionals added to unrelated shared paths.
- Bespoke helper duplicating a canonical utility.
- Hand-rolled reimplementation of stdlib or native platform behavior, with the replacement named.
- New dependency added for what the stdlib, the platform, or an already-installed dependency covers.
- Logic in the wrong layer when the canonical home is clear.

Do not report style preferences, unrelated pre-existing issues, risks without a repro or exploit path, broad rewrites outside the diff's intent, linter-only noise, or explicitly silenced violations.

## Output

Every finding carries `file:line`, a one-line impact, and a committable fix. A plausible finding adds one more line, `Plausible: <what would confirm it>`; a confirmed one omits it. A finding that rests on something outside the diff (an existing module, a sibling change, the writers of a guarded value) adds a `Context:` line naming that artifact, so the reader can check the claim without re-running the search. Keep `Fix:` genuinely committable: it is what `tidy` applies, and a fix phrased as "consider refactoring this" cannot be applied by anyone. Length follows the findings, not the template: a clean diff gets `None.` twice and a short summary, never padding.

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
- Reviewed: <range or ref pair>, <N> files
- Baseline: `<command>` -> <last line>; `<command>` -> <last line>
- Loaded: <mode> mode, <references>
- Unstated changes: <hunks no claim covers, or None>
- <readiness verdict>
```

One confirmed finding and one plausible one, filled in:

```markdown
- [major] `src/profile/page.tsx:42` Missing null guard before dereferencing `profile`
  Why: `profile` can be `null` on the first render, so `profile.id` throws before the loading state completes.
  Fix: Guard `profile` before dereferencing, or move the access into the branch that handles loaded data.

- [major] `src/sync/queue.ts:88` Retry re-sends the mutation with no idempotency key
  Why: On a timeout the client retries, and the server has no way to recognise the second delivery as the same write, so the balance moves twice.
  Fix: Send a stable request id and dedupe on it server-side before applying.
  Plausible: reproduce by forcing a timeout after the server commits but before the response lands.
```

If no issues, write `None.` under the first two tiers and keep the readiness block: what was checked is the evidence that the review ran.

PR handoff format, for posting through `pr-babysitter` or `gh`; prefix `minor` items with `Nit:` so the author can tell polish from blockers:

```markdown
## PR handoff summary

- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <concrete impact>
  Fix: <committable fix>
```

## Gotchas

- `git diff @{u}` fails with "no upstream configured" on a fresh branch, and a diff against `main` on a stale checkout includes everyone else's commits. Diff against `git merge-base HEAD origin/<default>` and state the range; a review of the wrong range is confidently about nothing.
- Line numbers counted off `git diff` hunk headers land in the report off by the hunk offset. Take the number from `grep -n` or the file itself; a reviewer who cannot find the cited line discards the rest of the report too.
- Skipping the baseline makes pre-existing failures look like regressions, and a full `npm test` dumps hundreds of lines that get re-sent every turn after. Run the quiet form and quote the last line.
- One broken helper reported once per call site reads as three problems and gets three separate patches, while the helper itself stays broken. Report the helper once and list the call sites under it.
- A second engine agreeing with you is not corroboration. Both instances read the same diff with the same missing context, so both approve the helper that already exists elsewhere and both accept the same unnecessary guard. Its output is advisory; only the artifact outside the diff settles it.
- A round that produces a new finding in the lines the previous round just changed is the loop generating work, not converging on a defect. Judge it across rounds: guards accumulating while severity falls, and each pass leaving the diff longer, means the next useful move is putting the simpler shape to the person who owns the system rather than reviewing again.
- A search returning nothing is not proof that nothing consumes an artifact. Dynamic imports, framework file-name conventions, generated code, and other repos all reach code no static search finds, and one wrongly declared dead file costs the whole report its credibility.
- An `@path` line in `REVIEW.md` is literal text to Claude Code Review, which does not expand imports there. Read the file the same way; a rule you honor through the import is one the PR-time review never applies, so the two reports disagree and the author trusts neither.

## Related skills

- `tidy`: the complexity hunt, and it applies what it finds. It runs its own five-angle sweep over the same diff for duplication, overbuilt code, and wrong-altitude fixes, and applies this report's confirmed findings alongside them. The usual sequence is this skill, then that one.
- `pr-creator`: creates or updates the PR after review.
- `pr-babysitter`: monitors CI and inbound review comments, and is the path for posting this report's PR handoff format as comments.
- `ui-design` Audit mode: frontend PR review for user-facing UX, accessibility, layout, state coverage, and rendered quality, including UI-level slop; Deslop mode here covers code-level slop only.
- `dx-audit`: the developer-facing surface of a library, CLI, or SDK; route there when the complaint is about an export, command, error string, or config rather than a defect in the diff.
- `codebase-architecture`: forward-looking architecture briefs, deepening opportunities, and repo-wide guardrails outside a diff review.
- `planning`: builds and reviews plans before implementation.

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
