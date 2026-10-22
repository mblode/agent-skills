# Ledger and Guardrails

What to leave behind so the next person, or the next agent, can see what the pipeline costs and why it is shaped this way.

## Contents

- The Ledger
- Merge-Path Decision Record
- Instruction-File Lines
- Workflow Comments

## The Ledger

One markdown file in the repository's docs. Length follows the work: a single-lever change is a table and three sentences. Every number in the templates below is illustrative.

```markdown
# CI pipeline

Measured <date>, runs <ids>. Wall-clock is push to last job complete.

## Before

| Path | Minutes |
|------|---------|
| Pull request: test | 12:00 |
| Main: test -> deploy | 18:00 |

Test job: pnpm install 90s, lint 40s, check-types 60s, tests 420s (web 400s: import 200s, environment 140s, tests 40s).

## Changes

- Split the serial test job into static checks and test shards.
- Stopped booting the local services the E2E suite never talks to.

## After

| Path | Minutes | Run |
|------|---------|-----|
| Pull request: e2e | 6:00 | <run id> |
| Main: e2e -> deploy | 11:00 | <run id> |

Runner minutes per run: 20 before, 28 after.

## Trend

| Week | Test files | Median PR minutes | p90 | Minutes per 100 files |
|------|-----------|-------------------|-----|------------------------|
| 2026-01-05 | 500 | 6:00 | 7:00 | 1:12 |

| Week | Cycle-time p90 | Main-red min/week | Cost per merged change | First-pass rate |
|------|----------------|-------------------|------------------------|-----------------|
| 2026-01-05 | 6h | 90 | 40 runner-min | 70% |

Tests grow by about N files a week; at that rate and this cost per file the
median crosses <threshold> around <date>. Re-measure when it does.

## Not taken yet

- `isolate: false` for the frontend suite: <N> files use fake timers; needs a second Vitest project. Expected gain <minutes> off the web shards.
```

The after column comes from a run on the branch, never from the Step 2 prediction; when they disagree, the ledger says why. Give median and p90 over the last ten or twenty runs (`scripts/ci-timings.sh --runs 20 --workflow ci.yml --branch main`); one shard's duration moves from push to push, so a single run proves nothing.

Attribute per lever. Savings reported per repository hide the lever that made a pipeline slower: the regression gets written off as "pipeline growth" and nothing is reverted. Land one lever per push where the chain allows, or read a run per lever, so the after column names what paid. A negative after column is a revert decision, not a caveat: the ledger states revert or keep, and why, before the next lever lands.

The pull request body carries one verdict (confirmed, not confirmed, inconclusive) with observed and projected in one sentence: `Observed saving: 40 seconds. Projected saving: 45 seconds.` Not confirmed and inconclusive name the next action.

The trend table makes the ledger a standing practice: Linear indexes machine time per test and test count from a fixed week and projects when the suite outgrows the pipeline again. One row per measurement, and a sentence saying when the next round is due. The flow table sits beside it because pipeline minutes can fall while cycle time rises: a faster pipeline that moved the constraint to review or deploy shows up there, not in the first table.

## Merge-Path Decision Record

Any change to the merge path (queue on or off, batch size, speculation depth, post-merge checks, auto-revert) gets a short record in the same file. The next person to touch the queue reads why it is shaped this way and what would change it.

```markdown
## Merge path: <choice>, decided <date>

Inputs (measured <from> to <to>, runs <ids or query>):
- λ: 12 merges/hour at peak, 4 average
- T: 14 min merge-path CI
- u = λ·T/60: 2.8 at peak
- p: 3% on merge_group runs, after quarantining 4 flaky tests
- p_mb: 0.5% of green heads broke on the merged tree
- Budgets: R ≤ 120 main-red min/week; C ≤ 60 runner-min per merged change

Choice: no global queue; merge on exact-head evidence; full suite post-merge
with deterministic auto-revert. Considered: queue with B = 8, D = 3 (rejected:
speculative runs put C over budget).

Predicted:
- X: 4.3 (the serial ceiling, 60/T) to 12 merges/hour at peak (every arrival)
- R: about 50 main-red min/week
- C: 60 to 38 runner-min per merged change

Flip conditions:
- R exceeds 120 min/week for two weeks: back to a queue.
- Breakages turn mostly nondeterministic: back to a queue.
- Any deploy path stops checking for a verified commit: back to a queue.

Re-measure: <date>, or sooner if λ doubles.
```

Every input has a measurement window and a source; an input that was assumed says so. Predictions are numbers, so the re-measure can mark each one confirmed or not. The after-numbers land as a new trend row, and a flip condition that fired becomes a new record, not an edit to this one.

## Instruction-File Lines

The layout regresses when nobody knows the rule it encodes. Add to the repository's AGENTS.md or equivalent, next to the command section:

- Where a new workspace's tests run, and when one earns its own shard.
- What a new shard costs (the setup tax figure), and the runner's duration line to read before adding one.
- Which service containers the E2E job excludes and what brings one back (a suite that starts using PostgREST re-adds `postgrest`).
- How a new test lands in the fast path by default: the shared-registry project, the node environment for DOM-free files, or whatever the suite's opt-in is. Agents write most new tests, so this is where the default lives.

Two or three lines. The ledger holds the detail; the instruction file holds the rule.

## Workflow Comments

A guard that exists because of an incident keeps the incident next to it: date, run id or PR, what went wrong. "Do not enable cancel-in-progress on main" without the story is removed by the next cleanup; the comment naming the two interrupted rollouts is not.
