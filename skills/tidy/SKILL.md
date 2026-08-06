---
name: tidy
description: >-
  APPLIES fixes directly to the working tree and verifies the build, rather
  than reporting them. Runs five angles over the current diff: reuse
  (duplicate logic, hand-rolled stdlib, platform features), quality
  (React/TypeScript hygiene, over-memoisation, exhaustive-deps, `any`,
  `CLAUDE.md`/`AGENTS.md` violations), efficiency (unnecessary work,
  missed concurrency, hot-path bloat), altitude (bandaid fixes special-cased
  onto shared code), and test discipline (repro test per bug fix, useless
  tests deleted, new tests only when they prevent a named failure). Also the
  apply half of a review: hand it a `pr-reviewer` report and it applies the
  confirmed findings first, then covers what the report missed. Use when the
  user says "tidy this up", "simplify", "clean up this diff", "polish my
  changes", "apply the review findings", "fix what the review found", or "any
  reuse opportunities?". For a read-only report instead, use `pr-reviewer`;
  for the PR's title, description, or commits, use `pr-creator`.
---

# tidy

- **IS:** the apply half of review. It takes fixes that are already decided, from an incoming review report or from its own five angles, edits the working tree, and proves the build is still green. `git status` shows more changes after than before.
- **IS NOT:** a findings report (use `pr-reviewer`: read-only, severity-tiered, never edits a file), an architecture refactor, or a license to touch files outside the diff. It does not hunt for bugs on its own, and it does apply bug fixes a review already confirmed. The line is that tidy applies decisions; it does not make them.

Self-contained by design: every phase runs on any harness that loads a skill, with or without a subagent tool, and never depends on a host's built-in review command.

**When to run:** after the feature works and the tests pass, before opening the PR. Not mid-implementation, where it polishes code the next commit deletes. It reads the whole diff, so cost scales with diff size; on a large one, narrow it to a path.

**After a review.** `pr-reviewer` then `tidy` is the common pair, and the second half is cheaper when it knows about the first. A review that already ran is an input, not something to reproduce: Phase 1 reads it, Phase 2 skips the ground it covered, Phase 3 applies its confirmed findings before anything else.

## Contents

- Workflow checklist
- Phase 1: Scope, baseline, and any incoming review
- Phase 2: Run five review angles
- Phase 3: Merge findings and apply fixes
- Phase 4: Verify and report
- Gotchas
- Related skills

## Workflow checklist

Copy this to track progress:

```text
Tidy progress:
- [ ] Phase 1: Scope the diff, read any incoming review, load instruction files, capture lint/type-check/test baseline
- [ ] Phase 2: Run the angles the review did not cover (read-only, fixed return format), concurrently where possible
- [ ] Phase 3: Merge findings, resolve conflicts, apply fixes in precedence order
- [ ] Phase 4: Re-run checks, revert out-of-diff churn, report with command evidence
```

## Phase 1: Scope, baseline, and any incoming review

1. Run `git diff` (plus `git diff --staged` when changes are staged) to capture the diff. No git changes: review the files you edited earlier in this session or the files the user named.
2. **Look for a review that already ran** over this diff: a `pr-reviewer` report earlier in the session, a host review command's findings, or PR comments the user pasted. Take its confirmed findings as decided work with the fix already written; they need no re-derivation and no second opinion. Treat findings it marked plausible as candidates instead: verify each against the code before applying, and drop it with a reason if the trigger is not real. If no review ran, skip to step 3 and the angles carry the whole load.
3. Read `CLAUDE.md`/`AGENTS.md` in the project root and in any nested package or MFE directory whose code is in the diff. Conventions there (design system, styling tokens, data-fetching patterns, naming) override this skill's defaults when they conflict; extract the rules that cover the changed paths.
4. Run the project's lint, type-check, and test commands (read `package.json` scripts; `yarn lint`, `yarn type-check`, `yarn test` are typical) and record pre-existing failures. Without this baseline you cannot tell a regression you introduced from a failure that was already there.

## Phase 2: Run five review angles

Two ways to run them, same five angles and same output either way:

- **With a subagent tool** (Claude Code's Agent tool or equivalent): launch all five concurrently in a single message. Each prompt carries the full diff, the in-scope instruction-file rules, and a read-only constraint. Fastest path, and the default where it exists.
- **Without one** (most harnesses): work the five yourself in sequence in this context, one focused pass per angle, collecting findings as you go. Do not blend them into a single read; the angles catch different things precisely because each pass has one question.

Either way, nothing is edited until Phase 3, and the orchestrator makes every edit. That is what keeps two angles from rewriting the same hunk.

**Skip what the incoming review already covered.** A review that swept the diff for reuse and structural quality has done Angle 1 and most of Angle 4; running them again buys a second opinion nobody asked for. Skip an angle only when the report shows it actually looked there, and name each skipped angle in the Phase 4 summary so the user can see the coverage. Angles 2 and 5 almost never get skipped: `pr-reviewer` explicitly drops style preferences and reports missing tests without deleting useless ones, so that ground stays uncovered.

The return format for each angle: one finding per bullet as `file:line`, issue, proposed fix; or an explicit "no findings" statement when the diff is clean on that angle.

### Angle 1: Reuse

1. **Search for existing utilities and helpers** that could replace newly written code. Look for similar patterns elsewhere in the codebase; common locations are utility directories, shared modules, and files adjacent to the changed ones.
2. **Flag any new function that duplicates existing functionality.** Name the existing function to use instead. Near-duplicate blocks inside the diff count too: two copies of the same logic with one value changed want one function with a parameter.
3. **Flag any inline logic that could use an existing in-repo utility**: hand-rolled string manipulation, manual path handling, custom environment checks, ad-hoc type guards, and similar patterns are common candidates.
4. **Flag hand-rolled implementations of stdlib functionality.** Name the stdlib function to use instead.
5. **Flag code or dependencies doing what the platform already does**: `<input type="date">` over a picker lib, CSS over JS, `Intl` over a formatting lib, a DB constraint over app-level checks.
6. **Flag any new dependency added in this diff** for something the stdlib, the platform, or an already-installed dependency covers.

### Angle 2: Quality

Lint already catches unused imports, unreachable code, and hooks called conditionally, and Phase 1 ran it. This angle is for what lint cannot see.

1. **Redundant state**: state that duplicates existing state, cached values that could be derived, observers/effects that could be direct calls
2. **Parameter sprawl**: adding new parameters to a function instead of generalizing or restructuring existing ones
3. **Leaky abstractions**: exposing internal details that should be encapsulated, or breaking existing abstraction boundaries
4. **Stringly-typed code**: raw strings where constants, string unions, or branded types already exist in the codebase
5. **Unnecessary JSX nesting**: wrapper Boxes/elements that add no layout value; check whether inner component props (flexShrink, alignItems, etc.) already provide the needed behavior
6. **Unnecessary comments**: comments explaining WHAT the code does (well-named identifiers already do that), narrating the change, or referencing the task/caller get deleted; keep only non-obvious WHY (hidden constraints, subtle invariants, workarounds)
7. **Debug residue**: commented-out JSX or logic, stray `console.log`, `debugger`, and `alert`. Move TODO comments to the summary with a note on what they're blocking rather than deleting them silently
8. **`any` types**: replace with the actual type, or `unknown` where the type is genuinely unknown. Never widen just to silence an error
9. **React hook dependency arrays**: `useEffect`, `useCallback`, `useMemo` deps must be exhaustive. Flag any newly added `// eslint-disable-next-line react-hooks/exhaustive-deps`
10. **Over-memoisation**: remove `useCallback`/`useMemo` that adds no value: wrapping a `setState` updater (the updater form is already stable), memoising with Apollo query objects as deps (busts on every refetch), or computing a value used only in the same component. Keep `useCallback` only when the reference is passed to a child that would otherwise re-render, and `useMemo` only when the computation is demonstrably expensive
11. **List keys**: stable, unique keys on rendered lists. Never `index` unless the list is static and non-reorderable
12. **`useEffect` for derived state**: compute values directly from existing state/props instead
13. **Pattern compliance with `CLAUDE.md`/`AGENTS.md`**: imports from deprecated component packages, old styling tokens, long relative paths where path aliases exist, queries/mutations not following the established custom-hook pattern, naming inconsistent with surrounding files
14. **Magic numbers/strings**: extract to a named constant if used more than once or the value has no obvious meaning
15. **Unrequested compatibility**: old/new dual paths, legacy aliases, or deprecated re-exports added in this diff when nothing depends on the old path. Delete it unless a real consumer is named
16. **Speculative flexibility**: interfaces with one implementation, factories for one product, config for a value that never changes, layers with one caller, or parameters nothing passes, added in this diff. Inline or delete until a second consumer exists. Where the speculative layer exists to absorb a special case, that is an Angle 4 finding, and the deeper fix wins

### Angle 3: Efficiency

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate network/API calls, N+1 patterns
2. **Missed concurrency**: independent operations run sequentially when they could run in parallel
3. **Hot-path bloat**: new blocking work added to startup or per-request/per-render hot paths
4. **Recurring no-op updates**: state/store updates inside polling loops, intervals, or event handlers that fire unconditionally need a change-detection guard so downstream consumers aren't notified when nothing changed. Also: if a wrapper function takes an updater/reducer callback, verify it honors same-reference returns (or whatever the "no change" signal is); otherwise callers' early-return no-ops are silently defeated
5. **Unnecessary existence checks**: pre-checking file/resource existence before operating (TOCTOU anti-pattern); operate directly and handle the error
6. **Memory**: unbounded data structures, missing cleanup, event listener leaks. Also long-lived objects built from a closure: the captured scope stays alive for the object's lifetime, so a handler that closes over a large response holds it forever. Pass the fields it needs instead
7. **Overly broad operations**: reading entire files when only a portion is needed, loading all items when filtering for one

### Angle 4: Altitude

One question: is each change made at the right depth, or bolted on above it? The signal is a special case layered onto shared infrastructure. When a fix reads as "except for this case", the mechanism underneath is usually the thing that should have changed.

1. **Special case on a shared path**: a branch keyed to one caller, route, tenant, feature flag, or file type added inside code that serves all of them. Name the general rule the branch is an instance of, and whether the shared mechanism can express it
2. **Fix at the call site instead of the source**: the same guard, coercion, or normalisation added at one caller when the function it calls could return the right shape for every caller. Check the other call sites for the bug still sitting there
3. **Symptom fix**: a value corrected after the fact (clamping, re-sorting, patching a field back in) rather than produced correctly. Trace back to where it was built wrong
4. **Fix that only holds for the reported input**: a condition tuned to the example in the ticket. Ask what the neighbouring input does

Altitude findings are the ones most worth raising and least worth forcing. Where lifting the fix means redesigning the shared mechanism, that is a summary note for the user, not an edit this pass makes. Apply it only when the deeper fix is smaller than the special case it replaces.

### Angle 5: Test discipline

The bar for every finding: a test earns its place only if it can fail for a reason someone would act on. Each proposed test must name, in one sentence, the failure it prevents; a proposal without that sentence is not a finding. Tests earn their place by proving behaviour that regresses independently of the edit: filtering, derivation, validation, permissions, region/runtime gating, data transformation, generation contracts, a class-wide invariant. A changed config row, flag default, route entry, label, or copy string earns no test; the owning diff and the behaviour that surfaced the issue verify it. Never flag a new component or hook merely for lacking a co-located test file.

1. **Bug fix without a repro test**: the diff fixes a bug but no test fails on the pre-fix code. The one missing-test finding that is always flagged. The repro belongs at the seam that failed (route, API, browser flow, integration point); a unit test on a helper invented during the fix is not regression coverage unless that helper owns the failing behaviour.
2. **Stale assertions**: existing tests covering changed code that no longer reflect the updated behaviour
3. **Missing tests that clear the bar**: new branching logic, a contract others depend on, or a refactor-surviving invariant in the diff with no test. State the failure each proposed test prevents
4. **Useless tests added in this diff, flagged for deletion**: render-only tests (presence checks with no interaction or branch), mock-echo assertions (asserting a mock was called or returned its mocked value), change-detector snapshots, framework re-tests, happy-path triplication of the same branch, diff-mirror tests (the assertion repeats a literal copied from the diff: a config row, flag default, route entry, label, or copy string; a second ledger, not behaviour coverage), export-for-testability tests (a helper extracted or exported solely so a test can name it), fake-integration tests (an in-memory emulator of behaviour that lives in the real system: schema, validators, indexes, permissions; it cannot catch the bug class it claims to cover). Name the pattern each matches. A config-adjacent test stays only if it proves a rule across a class of cases; one whose name contains a single item id and whose assertion repeats the value just changed goes.

## Phase 3: Merge findings and apply fixes

Collect the incoming review's findings and all five angles' findings, then merge before editing anything:

1. **Dedupe**: collapse findings that point at the same lines or share one root cause into a single fix. Where an angle rediscovers something the incoming review already confirmed, keep the review's version: it carries the severity and the reasoning the user has already read.
2. **Drop false positives**: if a finding is wrong or not worth the churn, skip it and record the reason for the summary. Do not argue with the finding or apply it halfway. A confirmed finding from the incoming review is not dropped on your own judgement; if you believe it is wrong, apply nothing there and say so, because the user read that report and expects those lines to change.
3. **Order by precedence**: confirmed review findings first, since they are the reason the pass was run and the rest is polish; then altitude, since lifting a fix can delete the code the other angles were about to clean; then reuse swaps and deletions (Angle 1 plus dead-code findings), then quality rewrites (Angle 2), then efficiency (Angle 3), then test-assertion updates last so they target the final shape of the code. Polishing a block another finding deletes is wasted work.
4. **Resolve conflicts**: when two findings propose incompatible rewrites of the same lines, prefer the one that deletes more code. If neither clearly wins, apply neither and present both options in the summary instead of guessing.

Apply each fix directly, re-reading the target region first; earlier fixes shift line numbers.

Scope rules:

- Only edit files inside the diff. Reading an adjacent file to understand a pattern is fine; rewriting it is not.
- No new abstractions, no architecture refactors, no fixes to pre-existing issues outside the diff. An altitude finding that needs the shared mechanism redesigned goes in the summary, not the working tree.
- Tests are never silently written: proposed missing tests are surfaced in the summary with the one-sentence failure each prevents, for the user to decide on. Useless tests added in this diff (Angle 5, category 4) get deleted like any other quality fix. Stale assertions in existing tests covering changed code do get fixed.

## Phase 4: Verify and report

1. Re-run the exact lint, type-check, and test commands from Phase 1. Any failure not in the baseline was introduced by your fixes; resolve it before finishing. Leave pre-existing failures alone and list them in the summary.
2. If a lint/format autofix reformatted files outside the diff, `git restore <path>` each one. Run `git status` and confirm only in-diff files changed before finishing.
3. Report in this shape. If the code was already clean, say so explicitly under Applied. "Looks good" without command output is not a valid exit.

```markdown
## Tidy

**Applied**
- `path/to/file.ts:line` <what changed> (<source: review, or angle name>)

**Skipped**
- `path/to/file.ts:line` <finding> (<why: false positive, not worth the churn, two incompatible fixes>)

**For you to decide**
- Test gaps, each with the one-sentence failure it prevents
- Altitude findings whose real fix is a separate change
- TODOs found in the diff, with what each is blocking

**Coverage**
- Angles run: <list>. Skipped: <angle> (<covered by the incoming review>)

**Checks**
- `<command>`: <result> (baseline: <result>)
```

## Gotchas

- Launching subagents one at a time when the harness supports concurrency: five serial runs roughly quintuple wall-clock time for no extra signal. One message, all five.
- Collapsing the five angles into a single read on a harness with no subagent tool: one pass looking for everything finds the first thing. Five narrow passes is the point, and it is still cheaper than the diff was to write.
- A formatter autofix (`yarn lint --fix` or equivalent) reformatting unrelated files: the diff fills with churn the reviewer must wade through. `git restore` every out-of-diff path before finishing.
- Widening a type to `any` to silence an error a fix introduced: that hides the breakage instead of resolving it. Find the real type.
- Fixing pre-existing failures because they are "right there": scope creep turns a cleanup pass into an unreviewable mixed change. Surface them in the summary instead.
- Angle 5 padding the summary with test proposals: coverage looks like rigor, so review passes over-propose tests. Every proposal without a named failure it prevents gets dropped in the Phase 3 false-positive pass.
- Rewriting a shared mechanism because Angle 4 found a special case: the altitude finding was right and the fix is a separate PR. This pass reports it and moves on.
- Re-reviewing a diff a review just swept, then reporting the same findings back in different words. The user paid for that analysis once. Phase 1 reads the report; Phase 2 covers what it missed.
- Quietly not applying a confirmed review finding because you disagree with it. The user read that report and is expecting those lines to change. Apply it, or say plainly that you did not and why.

## Related skills

- `pr-reviewer`: the decide half of the same job. Read-only, severity-tiered, never edits a file, and hunts bugs this skill does not. Running it first is the common path: its report becomes this skill's Phase 1 input and its confirmed findings get applied before anything else. Route there when the user wants to see findings before deciding what to fix.
- `pr-creator`: creates the PR after tidy finishes and the build is green.
- `codebase-architecture` (Harden mode): repo-wide guardrails (dead code, duplication, file size) wired into hooks and CI. What keeps each tidy pass small instead of a sweep.
