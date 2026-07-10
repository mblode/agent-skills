---
name: tidy
description: >-
  Fans out four concurrent review agents over the current diff, then APPLIES
  fixes directly to the working tree and verifies the build. Mutates code; it
  does not produce a report. Covers reuse (duplicate logic, hand-rolled
  stdlib, reinvented platform features), quality (hacky
  patterns, React/TypeScript hygiene, over-memoisation, exhaustive-deps,
  `any`, dead code, `CLAUDE.md`/`AGENTS.md` violations), efficiency
  (unnecessary work, missed concurrency, hot-path bloat), and test discipline
  (bug fixes without a repro test, useless tests to delete, missing tests only
  when they prevent a named failure). Use when the user says "tidy this up",
  "simplify", "clean up this diff", "polish my changes", "check for
  duplication", or "any reuse opportunities?", i.e. when the intent is to have
  the changes made automatically. For a read-only report that lists findings
  without touching files, use `pr-reviewer` instead.
---

# tidy

- **IS:** a fix-in-place cleanup pass. Four concurrent review agents read the current diff, the orchestrator merges their findings, edits the working tree, and proves the build is still green. `git status` shows more changes after than before.
- **IS NOT:** a findings report (use `pr-reviewer`: read-only, severity-tiered, never edits a file), a bug hunt, an architecture refactor, or a license to touch files outside the diff.

## Contents

- Workflow checklist
- Phase 1: Scope and baseline
- Phase 2: Fan out four review agents
- Phase 3: Merge findings and apply fixes
- Phase 4: Verify and report
- Gotchas
- Related skills

## Workflow checklist

Copy this to track progress:

```text
Tidy progress:
- [ ] Phase 1: Scope the diff, load instruction files, capture lint/type-check/test baseline
- [ ] Phase 2: Launch all four agents in one message (read-only, fixed return format)
- [ ] Phase 3: Merge findings, resolve conflicts, apply fixes in precedence order
- [ ] Phase 4: Re-run checks, revert out-of-diff churn, report with command evidence
```

## Phase 1: Scope and baseline

1. Run `git diff` (plus `git diff --staged` when changes are staged) to capture the diff. No git changes: review the files you edited earlier in this session or the files the user named.
2. Read `CLAUDE.md`/`AGENTS.md` in the project root and in any nested package or MFE directory whose code is in the diff. Conventions there (design system, styling tokens, data-fetching patterns, naming) override this skill's defaults when they conflict; extract the rules that cover the changed paths.
3. Run the project's lint, type-check, and test commands (read `package.json` scripts; `yarn lint`, `yarn type-check`, `yarn test` are typical) and record pre-existing failures. Without this baseline you cannot tell a regression you introduced from a failure that was already there.

## Phase 2: Fan out four review agents

Launch all four agents concurrently in a single message using the Agent tool. Each agent prompt must include:

- The full diff from Phase 1
- The in-scope instruction-file rules
- A read-only constraint: the agent returns findings and never edits files. Every edit happens in Phase 3 through the orchestrator, so two agents can never rewrite the same hunk.
- The return format: one finding per bullet as `file:line`, issue, proposed fix; or an explicit "no findings" statement when the diff is clean

### Agent 1: Reuse

1. **Search for existing utilities and helpers** that could replace newly written code. Look for similar patterns elsewhere in the codebase; common locations are utility directories, shared modules, and files adjacent to the changed ones.
2. **Flag any new function that duplicates existing functionality.** Name the existing function to use instead.
3. **Flag any inline logic that could use an existing in-repo utility**: hand-rolled string manipulation, manual path handling, custom environment checks, ad-hoc type guards, and similar patterns are common candidates.
4. **Flag hand-rolled implementations of stdlib functionality.** Name the stdlib function to use instead.
5. **Flag code or dependencies doing what the platform already does**: `<input type="date">` over a picker lib, CSS over JS, `Intl` over a formatting lib, a DB constraint over app-level checks.
6. **Flag any new dependency added in this diff** for something the stdlib, the platform, or an already-installed dependency covers.

### Agent 2: Quality

1. **Redundant state**: state that duplicates existing state, cached values that could be derived, observers/effects that could be direct calls
2. **Parameter sprawl**: adding new parameters to a function instead of generalizing or restructuring existing ones
3. **Copy-paste with slight variation**: near-duplicate code blocks that should be unified with a shared abstraction
4. **Leaky abstractions**: exposing internal details that should be encapsulated, or breaking existing abstraction boundaries
5. **Stringly-typed code**: raw strings where constants, string unions, or branded types already exist in the codebase
6. **Unnecessary JSX nesting**: wrapper Boxes/elements that add no layout value; check whether inner component props (flexShrink, alignItems, etc.) already provide the needed behavior
7. **Unnecessary comments**: comments explaining WHAT the code does (well-named identifiers already do that), narrating the change, or referencing the task/caller get deleted; keep only non-obvious WHY (hidden constraints, subtle invariants, workarounds)
8. **Unused imports and dead code**: imports not referenced in the file; commented-out JSX/logic; stray `console.log`, `debugger`, and `alert` statements. Move TODO comments to the summary with a note on what they're blocking rather than deleting them silently
9. **`any` types**: replace with the actual type, or `unknown` where the type is genuinely unknown. Never widen just to silence an error
10. **React hook dependency arrays**: `useEffect`, `useCallback`, `useMemo` deps must be exhaustive. Flag any newly added `// eslint-disable-next-line react-hooks/exhaustive-deps`
11. **Over-memoisation**: remove `useCallback`/`useMemo` that adds no value: wrapping a `setState` updater (the updater form is already stable), memoising with Apollo query objects as deps (busts on every refetch), or computing a value used only in the same component. Keep `useCallback` only when the reference is passed to a child that would otherwise re-render, and `useMemo` only when the computation is demonstrably expensive
12. **List keys**: stable, unique keys on rendered lists. Never `index` unless the list is static and non-reorderable
13. **Hooks called conditionally**: hooks must never be called after an early return or inside a branch
14. **`useEffect` for derived state**: compute values directly from existing state/props instead
15. **Pattern compliance with `CLAUDE.md`/`AGENTS.md`**: imports from deprecated component packages, old styling tokens, long relative paths where path aliases exist, queries/mutations not following the established custom-hook pattern, naming inconsistent with surrounding files
16. **Magic numbers/strings**: extract to a named constant if used more than once or the value has no obvious meaning
17. **Unrequested compatibility**: old/new dual paths, legacy aliases, or deprecated re-exports added in this diff when nothing depends on the old path. Delete it unless a real consumer is named
18. **Speculative flexibility**: interfaces with one implementation, factories for one product, config for a value that never changes, layers with one caller, or parameters nothing passes, added in this diff. Inline or delete until a second consumer exists

### Agent 3: Efficiency

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate network/API calls, N+1 patterns
2. **Missed concurrency**: independent operations run sequentially when they could run in parallel
3. **Hot-path bloat**: new blocking work added to startup or per-request/per-render hot paths
4. **Recurring no-op updates**: state/store updates inside polling loops, intervals, or event handlers that fire unconditionally need a change-detection guard so downstream consumers aren't notified when nothing changed. Also: if a wrapper function takes an updater/reducer callback, verify it honors same-reference returns (or whatever the "no change" signal is); otherwise callers' early-return no-ops are silently defeated
5. **Unnecessary existence checks**: pre-checking file/resource existence before operating (TOCTOU anti-pattern); operate directly and handle the error
6. **Memory**: unbounded data structures, missing cleanup, event listener leaks
7. **Overly broad operations**: reading entire files when only a portion is needed, loading all items when filtering for one

### Agent 4: Test discipline

The bar for every finding: a test earns its place only if it can fail for a reason someone would act on. Each proposed test must name, in one sentence, the failure it prevents; a proposal without that sentence is not a finding. Tests earn their place by proving behaviour that regresses independently of the edit: filtering, derivation, validation, permissions, region/runtime gating, data transformation, generation contracts, a class-wide invariant. A changed config row, flag default, route entry, label, or copy string earns no test; the owning diff and the behaviour that surfaced the issue verify it. Never flag a new component or hook merely for lacking a co-located test file.

1. **Bug fix without a repro test**: the diff fixes a bug but no test fails on the pre-fix code. The one missing-test finding that is always flagged. The repro belongs at the seam that failed (route, API, browser flow, integration point); a unit test on a helper invented during the fix is not regression coverage unless that helper owns the failing behaviour.
2. **Stale assertions**: existing tests covering changed code that no longer reflect the updated behaviour
3. **Missing tests that clear the bar**: new branching logic, a contract others depend on, or a refactor-surviving invariant in the diff with no test. State the failure each proposed test prevents
4. **Useless tests added in this diff, flagged for deletion**: render-only tests (presence checks with no interaction or branch), mock-echo assertions (asserting a mock was called or returned its mocked value), change-detector snapshots, framework re-tests, happy-path triplication of the same branch, diff-mirror tests (the assertion repeats a literal copied from the diff: a config row, flag default, route entry, label, or copy string; a second ledger, not behaviour coverage), export-for-testability tests (a helper extracted or exported solely so a test can name it), fake-integration tests (an in-memory emulator of behaviour that lives in the real system: schema, validators, indexes, permissions; it cannot catch the bug class it claims to cover). Name the pattern each matches. A config-adjacent test stays only if it proves a rule across a class of cases; one whose name contains a single item id and whose assertion repeats the value just changed goes.

## Phase 3: Merge findings and apply fixes

Wait for all four agents to finish, then merge before editing anything:

1. **Dedupe**: collapse findings that point at the same lines or share one root cause into a single fix.
2. **Drop false positives**: if a finding is wrong or not worth the churn, skip it and record the reason for the summary. Do not argue with the finding or apply it halfway.
3. **Order by precedence**: reuse swaps and deletions first (Agent 1 plus dead-code findings), then quality rewrites (Agent 2), then efficiency (Agent 3), then test-assertion updates last so they target the final shape of the code. Polishing a block another finding deletes is wasted work.
4. **Resolve conflicts**: when two findings propose incompatible rewrites of the same lines, prefer the one that deletes more code. If neither clearly wins, apply neither and present both options in the summary instead of guessing.

Apply each fix directly, re-reading the target region first; earlier fixes shift line numbers.

Scope rules:

- Only edit files inside the diff. Reading an adjacent file to understand a pattern is fine; rewriting it is not.
- No new abstractions, no architecture refactors, no fixes to pre-existing issues outside the diff.
- Tests are never silently written: proposed missing tests are surfaced in the summary with the one-sentence failure each prevents, for the user to decide on. Useless tests added in this diff (Agent 4, category 4) get deleted like any other quality fix. Stale assertions in existing tests covering changed code do get fixed.

## Phase 4: Verify and report

1. Re-run the exact lint, type-check, and test commands from Phase 1. Any failure not in the baseline was introduced by your fixes; resolve it before finishing. Leave pre-existing failures alone and list them in the summary.
2. If a lint/format autofix reformatted files outside the diff, `git restore <path>` each one. Run `git status` and confirm only in-diff files changed before finishing.
3. Report: what was fixed per agent category, skipped findings with reasons, surfaced test gaps, and the final lint/type-check/test status quoted from command output against the Phase 1 baseline. If the code was already clean, say so explicitly. "Looks good" without command output is not a valid exit.

## Gotchas

- Letting subagents edit files: two agents rewriting the same hunk corrupts the working tree with interleaved edits. Agents return findings; only the orchestrator edits.
- Skipping the Phase 1 baseline: a pre-existing test failure gets misread as a regression, and the session burns down fixing code outside the diff.
- Launching agents sequentially: four serial agent runs roughly quadruple wall-clock time. All four launch in one message.
- Applying quality fixes before reuse deletions: you polish code the reuse swap then deletes. Follow the Phase 3 precedence order.
- A formatter autofix (`yarn lint --fix` or equivalent) reformatting unrelated files: the diff fills with churn the reviewer must wade through. `git restore` every out-of-diff path before finishing.
- Widening a type to `any` to silence an error a fix introduced: that hides the breakage instead of resolving it. Find the real type.
- Fixing pre-existing failures because they are "right there": scope creep turns a cleanup pass into an unreviewable mixed change. Surface them in the summary instead.
- Agent 4 padding the summary with test proposals: coverage looks like rigor, so review agents over-propose tests. Every proposal without a named failure it prevents gets dropped in the Phase 3 false-positive pass.
- A repro test anchored to a helper invented during the fix: it passes trivially and would never have caught the original failure. Anchor the repro at the seam that failed.
- Ending on "everything looks fine": without quoted lint/type-check/test output compared to the baseline, a broken build ships. Evidence or it did not pass.

## Related skills

- `pr-reviewer`: read-only, severity-tiered findings report that also hunts bugs; it never edits files. Both skills cover reuse, quality, and efficiency; the difference is report-only vs fix-in-place. Route there when the user wants to see findings before deciding what to fix.
- `pr-creator`: creates the PR after tidy finishes and the build is green.
