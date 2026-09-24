# Pruning Campaign

A campaign prunes one subsystem's whole test surface toward a stated target: a package, a plugin, or one core area. The gate, junk patterns, retention bar, and evidence fields in SKILL.md apply to every lane. This file adds the order of work. Each step ends on its completion criterion; do not start the next one early.

## Contents

- 1. Baseline
- 2. Lanes
- 3. Ledger per lane
- 4. Layer plan per lane
- 5. Cutover
- 6. Preservation review
- 7. Product defects
- 8. Reconcile and hand off
- Keeping going

## 1. Baseline

At a pinned commit, record:

- test declaration count and test plus support line count for the scope
- line and branch coverage, total and per production file (`coverage.md`)
- every test file's pass or fail state, with baseline failures in their own list

The target and budget are fixed here, in writing, before any deletion: "remove 20% of declarations in `packages/api`, line and branch coverage within 2 points, no per-file drop over 5 points on a file with a retained contract". Suite wall time is worth recording too, because it is often the number the user cares about.

Done when every in-scope test file has a recorded result and the target and budget are written in the ledger.

## 2. Lanes

Split the surface into lanes along production owner boundaries, not file prefixes: accounts, commands, dispatch, inbound, outbound, persistence, transport, shared harness, live or QA scenarios. Include the subsystem's cases in shared core suites and its harness tests.

Done when every test file the subsystem owns belongs to exactly one lane.

## 3. Ledger per lane

Where the host supports subagents, give each lane to its own read-only agent; otherwise work lanes one at a time. Read every test in full, including parameter tables, plus the production owners, their entry points, callers, and history. Every test declaration gets one mark and one evidence line. A table-driven test is one declaration unless its rows need different marks.

- `R` retain: name the contract and the bug it catches. A retained test that only moves file stays `R` with the move noted.
- `F` fix: retain the contract but repair the assertion, such as a negative that passes when only one of several items is missing.
- `C` consolidate: name the keeper that absorbs the assertion first (a sibling table case, a stronger boundary suite, the shared owner in another package).
- `D` delete: name the proof that remains, or why no contract exists.

Rank `D` and `C` by value, lowest first, so the cutover can stop at the target without taking the borderline cases.

Done when every declaration in the lane has a mark and an evidence line.

## 4. Layer plan per lane

The per-test ledger is input, not the edit list. A second read-only pass looks for the redundant layer: several suites replaying one shared helper through a mock, around a stronger suite that exercises it for real. Name the keeper suite for each contract, preferring the real boundary with a fake network or store over a mocked collaborator. Correct ledger errors this pass finds.

Done when each lane plan names its retired files, its keeper per contract, the assertions to carry into keepers, and the test-only production seams unlocked.

## 5. Cutover

Edit lane by lane, lowest-value deletions first. Serialize edits to shared harnesses and fixtures through one owner so parallel lanes do not collide. With each lane, remove the test-only production seams it unlocks: injection parameters, getters, reset exports, indirection layers. Update CI routing, test inventories, and any shrink-only size baselines. After each lane, re-measure coverage and record the running total against the target and budget.

Done when every lane plan is applied, each lane's keepers pass, and the running total meets the target or the budget is spent.

## 6. Preservation review

Before claiming completion, have an independent reviewer per boundary group (a fresh subagent or session, not the one that did the deleting) compare deleted coverage against the keepers. They look for contracts that lost their only proof, and for new or carried assertions that cannot fail, such as a rejection row production never reaches.

For each restored contract, make one deliberate mutation of the production owner, confirm the keeper goes red, then restore the source byte for byte (`git diff` empty for that file).

Done when every reported gap is restored or rejected with source evidence, and every restored contract has a caught mutation.

## 7. Product defects

A baseline failure that survives into a keeper is a bug report. Fix it at its owner in a separate commit and prove it through the real user flow, with a control run that reverts the fix and shows the old behavior. Record unrelated product discrepancies as follow-ups rather than fixing them in the campaign.

Done when each repaired defect has a failing control and a passing candidate on the same harness.

## 8. Reconcile and hand off

Campaigns outlive many default-branch commits. Merge the default branch rather than rebasing a long campaign. When the default branch modified a file the campaign deleted, keep the deletion and port the new contract into the keeper; confirm every regression test added upstream still has a home. Rerun the whole subsystem suite and coverage on the merged head.

Review tooling often truncates a diff this large; put the ledger summary in the PR description so reviewers can check it without the full file list.

Hand off with the SKILL.md report, plus:

- baseline and final declaration, line, and coverage numbers, production counted separately
- lanes, retired layers, and keepers
- preservation gaps found and their mutations
- product defects with control and candidate proof
- durable test-ownership rules for the subsystem's `AGENTS.md`, drawn from mistakes this campaign actually found

## Keeping going

The failure this file exists to prevent is stopping after the obvious deletions. When a lane runs dry before the target:

- re-run step 4 on the next lane: the redundant layer is where the volume is, not individual tests
- look for whole files whose every declaration is `C` or `D`
- look for test-only seams whose removal takes their tests with them
- check whether snapshot and fixture files are larger than the tests that load them

Stop short of the target only when the ledger shows each remaining candidate guards a named contract. Report the gap as a number with that evidence, not as "the rest looked useful".
