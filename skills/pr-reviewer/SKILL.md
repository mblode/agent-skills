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
  accessibility, layout, state coverage, or rendered quality use ui-design
  Audit mode; for library, CLI, or SDK developer experience use dx-audit;
  for folder structure
  and module boundaries outside a diff use codebase-architecture; for plans use
  planning.
---

# Local Review

- **IS:** read-only review of a local diff, branch diff, or PR. Returns severity-tiered findings; leaves the working tree unchanged.
- **IS NOT:** fixing code (`tidy`), creating PRs (`pr-creator`), monitoring CI or review threads (`pr-babysitter`), frontend PR UX/accessibility/rendered-quality review (`ui-design` Audit mode), architecture briefs (`codebase-architecture`), reviewing plans (`planning`).

Only report issues you can defend with `file:line` evidence.

Self-contained by design: every step runs on any harness that loads a skill, using git and the file tools alone. Nothing here requires a host's built-in review command, a subagent tool, or a second model.

**When to run:** on a diff that compiles and whose tests pass, before commit, push, or handoff. Cost scales with diff size, so shard a large one rather than skimming all of it.

**Then hand off.** `tidy` runs next in the usual flow, hunting complexity and applying what it finds, including this report's confirmed findings. So write the report to be consumed: every `Fix:` line has to be something a person could commit. Do not apply anything yourself, even a one-character fix; the moment this skill edits a file the user loses the read-only report they asked for.

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
- `agents/openai.yaml` only when a different-model CLI is installed and you are running the optional second-opinion pass below.

## Workflow

```text
Review progress:
- [ ] Dispatch mode and load references
- [ ] Discover target
- [ ] Gather context and baseline checks
- [ ] Review: added lines, removed lines, call sites, shard if needed
- [ ] Verdict each candidate: confirmed, plausible, or refuted
- [ ] Report
```

1. **Discover target.** Review staged/unstaged changes first; if clean, review the branch diff. For a PR, use the same criteria and the PR handoff format.
2. **Gather context.** Capture intent. Load scoped `AGENTS.md` / `CLAUDE.md`; conventions there override this skill's defaults when they conflict, so a pattern they mandate is not a finding. Run documented lint, type-check, and tests where they exist; record baseline failures.
3. **Review.** Apply the loaded rubric and high-signal criteria; shard large diffs. Three passes over the diff, because each finds what the others structurally cannot:
   - **Added lines.** Read every hunk, then the enclosing function. A bug on an unchanged line of a touched function is in scope: this diff re-exposed it.
   - **Removed lines.** For every line the diff deletes or replaces, name the invariant it enforced, then find where the new code re-establishes it. If you cannot, that is the finding: a removed guard, a dropped error path, a narrowed validation, a deleted test that covered a real case. Deletions read as progress and get skimmed, which is exactly why this pass earns its cost.
   - **Call sites.** For each changed function, grep its callers and check for a new precondition, a changed return shape, a new exception, or an ordering dependency. Then check its callees: does another change in the same diff make one of its own calls unsafe?

   Optional and skippable: where a different-model CLI is already installed (`codex exec`, `droid exec`, or equivalent), run it read-only with `agents/openai.yaml`'s `default_prompt` for a second opinion, then verdict its findings like your own. No such CLI is not a blocker; the review is complete without it.
4. **Verdict.** Re-check exact lines and give every candidate one of three verdicts. Report confirmed and plausible; drop refuted.
   - **Confirmed:** you can name the inputs or state that trigger it and the resulting wrong output. Quote the line.
   - **Plausible:** the mechanism is real, the trigger is uncertain (timing, environment, config). Say what would confirm it.
   - **Refuted:** factually wrong, or already guarded. Quote the line that proves it.

   Plausible is the default. Do not refute something for being "speculative" when the state is realistic: concurrency races, nil or undefined on a rare but reachable path (error handler, cold cache, absent optional field), falsy-zero read as missing, off-by-one on a boundary the code does not exclude, retry storms and partial failures, a regex or allowlist that lost its anchor. Refute only what you can disprove from the code: the line does not say that, a type or constant makes it impossible, the diff already handles it, or it is style with no observable effect. Also drop duplicates, mis-attributions, and pre-existing issues. Diff modes require changed lines; Security audit requires real in-scope code.
5. **Report.** Use `references/severity-rubric.md`; structural blockers go under `Must fix before push`. Mark plausible findings as such so the reader knows which ones need a repro before acting.

## High-signal criteria

Report only when certain:

- Compile, type, import, or syntax failure.
- Clear runtime bug, state error, or data-handling regression.
- Concrete exploit path, named vulnerability class, and affected `file:line`.
- Measurable performance regression.
- Missing necessary tests: render-only checks for interactive behavior, or bug fixes without a failing repro test at the seam that failed (route, API, integration point, not a helper invented during the fix).
- Test setup that requires helper tracing to understand assertions.
- Scaffolding whose consumer is absent or unreachable: a test for a module that does not exist, a generated surface nothing imports, a CI check on a contract nothing emits. Cite the artifact's line and the search that found no consumer, and mark it plausible where the consumer could be generated at build time, reached by framework convention, or live outside this repo.
- New lint, type-check, or test failures versus baseline.
- Scoped instruction-file violation, with the rule quoted.
- Retried or at-least-once write with no idempotency key or dedupe barrier, so a duplicate delivery applies twice.
- Database commit plus an external publish (queue, webhook, email) without an outbox or transactional guarantee (dual-write): one side can fail independently.
- External input (webhook/callback) trusted blindly: signature not verified over the raw bytes, or state overwritten directly from the payload instead of confirming against the source.
- Floats or other lossy types used for money or precision-sensitive values, or money serialized as a bare JSON number rather than a string or integer minor-units.
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

Every finding carries `file:line`, a one-line impact, and a committable fix. A plausible finding adds one more line, `Plausible: <what would confirm it>`; a confirmed one omits it. Keep `Fix:` genuinely committable: it is what `tidy` applies, and a fix phrased as "consider refactoring this" cannot be applied by anyone.

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
- Line numbers counted off `git diff` hunk headers land in the report off by the hunk offset, and a reviewer who cannot find the cited line discards the rest of it too.
- One broken helper reported once per call site reads as three problems and gets three separate patches, while the helper itself stays broken.
- External-engine output is advisory. Re-validate everything against the actual diff.
- Skipping the baseline makes pre-existing failures look like regressions.
- Refuting a real bug for being "speculative" costs more than a wrong finding does. The reader can dismiss a plausible finding in a sentence; nobody can dismiss the one you deleted.
- Reading only the added lines. A diff that removes a guard shows up as green in the review and red in production.
- A search returning nothing is not proof that nothing consumes an artifact. Dynamic imports, framework file-name conventions, generated code, and other repos all reach code no static search finds, and one wrongly declared dead file costs the whole report its credibility.

## Related skills

- `tidy`: the complexity hunt, and it applies what it finds. It runs its own five-angle sweep over the same diff for duplication, overbuilt code, and wrong-altitude fixes, and applies this report's confirmed findings alongside them. The usual sequence is this skill, then that one.
- `pr-creator`: creates or updates the PR after review.
- `pr-babysitter`: monitors CI and inbound review comments.
- `ui-design` Audit mode: frontend PR review for user-facing UX, accessibility, layout, state coverage, and rendered quality.
- `codebase-architecture`: forward-looking architecture briefs, deepening opportunities, and repo-wide guardrails outside a diff review.
- `planning`: builds and reviews plans before implementation.
