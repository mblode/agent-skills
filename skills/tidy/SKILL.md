---
name: tidy
description: >-
  Hunts complexity in the current diff and APPLIES the simplifications
  directly to the working tree, then verifies the build. Five angles: reuse
  (duplicate logic, hand-rolled stdlib, platform features), quality
  (React/TypeScript hygiene, over-memoisation, exhaustive-deps, `any`,
  `CLAUDE.md`/`AGENTS.md` violations), efficiency (unnecessary work,
  missed concurrency, hot-path bloat), altitude (bandaid fixes special-cased
  onto shared code), and test discipline (repro test per bug fix, useless
  tests deleted, new tests only when they prevent a named failure). Hand it a
  `pr-reviewer` report and it applies those confirmed findings too. Use when
  the user says "tidy this up", "simplify", "clean up this diff", "polish my
  changes", "make this simpler", "apply the review findings", or "any reuse
  opportunities?". For a read-only report instead, use `pr-reviewer`; for the
  PR's title, description, or commits, use `pr-creator`.
---

# tidy

- **IS:** a hunt for complexity, then the fix. Five angles read the current diff looking for what is duplicated, overbuilt, wasteful, bolted on at the wrong depth, or untested; the orchestrator merges the findings, edits the working tree, and proves the build is still green. `git status` shows more changes after than before.
- **IS NOT:** a findings report (use `pr-reviewer`: read-only, severity-tiered, never edits a file), an architecture refactor, or a license to touch files outside the diff.

It hunts complexity, not correctness. A concurrency race or a missing idempotency key is `pr-reviewer`'s ground; duplicated logic, a layer with one caller, and a special case bolted onto shared code are this skill's, and it finds them itself rather than waiting to be handed a list.

Self-contained by design: every phase runs on any harness that loads a skill, with or without a subagent tool, and never depends on a host's built-in review command.

**When to run:** after the feature works and the tests pass, before opening the PR. Not mid-implementation, where it polishes code the next commit deletes. It reads the whole diff, so cost scales with diff size; on a large one, narrow it to a path.

**After a review.** `pr-reviewer` then `tidy` is the common pair. A report that already exists is extra input, never a smaller sweep: run all five angles regardless, and apply the report's confirmed findings alongside your own. Two passes looking for different things is the point of running both, and the correctness fixes a review confirmed would otherwise be left for the user to hand-apply.

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
- [ ] Phase 2: Run all five angles (read-only, fixed return format), concurrently where possible
- [ ] Phase 3: Merge findings, resolve conflicts, apply fixes in precedence order
- [ ] Phase 4: Re-run checks, revert out-of-diff churn, report with command evidence
```

## Phase 1: Scope, baseline, and any incoming review

1. Run `git diff` (plus `git diff --staged` when changes are staged) to capture the diff. No git changes: review the files you edited earlier in this session or the files the user named.
2. **Look for a review that already ran** over this diff: a `pr-reviewer` report earlier in the session, a host review command's findings, or PR comments the user pasted. Its confirmed findings are decided work with the fix already written, so they go straight into Phase 3 without re-derivation. Findings it marked plausible are candidates: verify each against the code before applying, and drop it with a reason if the trigger is not real. This is a head start, not a substitute; the angles still run in full. If no review ran, go to step 3.
3. Read `CLAUDE.md`/`AGENTS.md` in the project root and in any nested package or MFE directory whose code is in the diff. Conventions there (design system, styling tokens, data-fetching patterns, naming) override this skill's defaults when they conflict; extract the rules that cover the changed paths.
4. Run the project's lint, type-check, and test commands (read `package.json` scripts; `yarn lint`, `yarn type-check`, `yarn test` are typical) and record pre-existing failures. Without this baseline you cannot tell a regression you introduced from a failure that was already there.

## Phase 2: Run five review angles

Two ways to run them, same five angles and same output either way:

- **With a subagent tool** (Claude Code's Agent tool or equivalent): launch all five concurrently in a single message. Each prompt carries the full diff, the in-scope instruction-file rules, and a read-only constraint. Fastest path, and the default where it exists.
- **Without one** (most harnesses): work the five yourself in sequence in this context, one focused pass per angle, collecting findings as you go. Do not blend them into a single read; the angles catch different things precisely because each pass has one question.

Either way, nothing is edited until Phase 3, and the orchestrator makes every edit. That is what keeps two angles from rewriting the same hunk.

**All five run every time**, including after a review. A review reports what it can defend as a defect and drops the rest; these angles hunt what it is built to leave alone, so an angle that overlaps a report still turns up findings the report did not carry. Where an angle lands on something already in the report, Phase 3's dedupe collapses it. Skipping an angle because someone else looked nearby trades a certain loss for a speculative saving.

The return format for each angle: one finding per bullet as `file:line`, issue, proposed fix; or an explicit "no findings" statement when the diff is clean on that angle.

### Angle 1: Reuse

Take each block of new code down this ladder and stop at the first rung that holds. The rung it stops on is the finding: everything below it is code that did not need to be written.

1. **Does it need to exist at all?** Nothing calls it, nothing needs it yet, or the requirement it serves is speculative. Delete it.
2. **Is it already in this codebase?** Search utility directories, shared modules, and the files adjacent to the changed ones. Name the existing function to use instead, with its path and one live call site: a helper that exists but nothing calls is a dead path, and swapping onto it trades new code for a worse kind of new code. Near-duplicate blocks inside the diff count too: two copies of the same logic with one value changed want one function with a parameter.
3. **Does the stdlib do it?** Hand-rolled string manipulation, date maths, path handling, ad-hoc type guards. Name the stdlib function.
4. **Does a native platform feature cover it?** `<input type="date">` over a picker lib, CSS over JS, `Intl` over a formatting lib, a DB constraint over an app-level check.
5. **Does an already-installed dependency solve it?** Check `package.json` before accepting anything new. Flag any dependency this diff adds for something the rungs above already cover.
6. **Can it be one line?** If so, one line.

Two guards, because a shorter diff is not automatically the better one:

- **The ladder runs after you understand the code, not instead of it.** Trace what the block actually does before proposing the rung above it. A smaller change in the wrong place is not a simplification, it is a second bug.
- **Where two options are the same size, take the more correct one.** Simpler means less code, not the flimsier algorithm. A one-liner that mishandles an empty input is not a win over three lines that do not.

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

One question: is each change made at the right place, or bolted on above the mechanism (items 1 to 4) or outside the system that owns it (item 5)? The signal for the first four is a special case layered onto shared infrastructure. When a fix reads as "except for this case", the mechanism underneath is usually the thing that should have changed.

1. **Special case on a shared path**: a branch keyed to one caller, route, tenant, feature flag, or file type added inside code that serves all of them. Name the general rule the branch is an instance of, and whether the shared mechanism can express it
2. **Fix at the call site instead of the source**: the same guard, coercion, or normalisation added at one caller when the function it calls could return the right shape for every caller. Grep every caller of the function the diff touches. One guard inside the shared function is a smaller diff than one per caller, and fixing only the path the ticket named leaves the sibling callers broken
3. **Symptom fix**: a value corrected after the fact (clamping, re-sorting, patching a field back in) rather than produced correctly. Trace back to where it was built wrong
4. **Fix that only holds for the reported input**: a condition tuned to the example in the ticket. Ask what the neighbouring input does
5. **Wrong home**: the change works and landed outside the system that owns this class of behaviour. Validation in a route handler where a validator layer exists, a permission check inline where a policy module exists, a formatting rule in a component where a shared formatter exists. Find where the last two or three changes of the same class landed (`git log -S` on a distinctive symbol, or grep the sibling cases) and name the sibling. Two siblings living somewhere else make the third one's location the finding; one is a coincidence

Altitude findings are the ones most worth raising and least worth forcing. Where lifting the fix means redesigning the shared mechanism, that is a summary note for the user, not an edit this pass makes. Apply it only when the deeper fix is smaller than the special case it replaces. A wrong-home finding follows the same rule: move the change when the owning system already has the entry point for it, and note it for the user when it needs a new one.

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
3. **Order by precedence**: confirmed review findings first, since a correctness fix changes what the right shape even is; then altitude, since lifting a fix can delete the code the other angles were about to clean; then reuse swaps and deletions (Angle 1 plus dead-code findings), then quality rewrites (Angle 2), then efficiency (Angle 3), then test-assertion updates last so they target the final shape of the code. Simplifying a block another finding deletes is wasted work.
4. **Resolve conflicts**: when two findings propose incompatible rewrites of the same lines, prefer the one that deletes more code, and where they delete about the same amount, the more boring one. If neither clearly wins, apply neither and present both options in the summary instead of guessing. Deleting more is the tie-break, not the goal: a rewrite that sheds lines by dropping a case the old code handled is a regression wearing a smaller diff.

Apply each fix directly, re-reading the target region first; earlier fixes shift line numbers.

Scope rules:

- Only edit files inside the diff. Reading an adjacent file to understand a pattern is fine; rewriting it is not.
- No new abstractions, no architecture refactors, no fixes to pre-existing issues outside the diff. An altitude finding that needs the shared mechanism redesigned goes in the summary, not the working tree.
- Deleting a guard is the one simplification that can introduce a bug, so it carries a higher bar than the rest. Remove a check, fallback, retry, or lock only after naming why this system never reaches the state it covers: every writer of the value, the consumer's real staleness tolerance, the supervisor that already restarts on failure, the single writer on the path. Where the reason cannot be named, the guard stays and the finding goes under "For you to decide" with the state spelled out. This is the inverse of every other angle, where the smaller diff wins ties.
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
- Simplifications applied that cut a real corner, each naming the ceiling it now has and what to do when the code outgrows it
- TODOs found in the diff, with what each is blocking

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
- Narrowing the sweep because a review already ran. The two look for different things, so a skipped angle is a real loss and the saving is imaginary. Run all five; dedupe at Phase 3.
- Repeating a report's finding back in different words as if it were new. That is a dedupe failure, not a coverage win. Where an angle rediscovers something the report confirmed, it is one finding.
- Deleting a guard because it looked paranoid, without grepping the writers first. Excess defence and necessary defence are the same code; only the system tells them apart, and this pass edits the working tree, so a wrong call here ships a bug rather than a noisy report.
- A fix that draws a new finding in the lines the previous round just changed. Two rounds bouncing off each other converge on more code, not less, because a pass built to find defects never proposes deleting one. When the same spot keeps producing findings, stop editing it and put the simpler shape in "For you to decide" with the risk named.
- Quietly not applying a confirmed review finding because you disagree with it. The user read that report and is expecting those lines to change. Apply it, or say plainly that you did not and why.

## Related skills

- `pr-reviewer`: the other hunt. It looks for correctness, security, and structural defects it can defend, and reports without editing; this skill looks for complexity and fixes it. Running it first is the common path, and its confirmed findings get applied here alongside this skill's own. Route there when the user wants to see findings before anything changes.
- `pr-creator`: creates the PR after tidy finishes and the build is green.
- `codebase-architecture` (Harden mode): repo-wide guardrails (dead code, duplication, file size) wired into hooks and CI. What keeps each tidy pass small instead of a sweep.
