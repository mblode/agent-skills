# Ledger and Guardrails

What to leave behind so the next person, or the next agent, can see what the pipeline costs and why it is shaped this way.

## The Ledger

One markdown file in the repository's docs. Length follows the work: a single-lever change is a table and three sentences.

```markdown
# CI pipeline

Measured <date>, runs <ids>. Wall-clock is push to last job complete.

## Before

| Path | Minutes |
|------|---------|
| Pull request: test | 10:30 |
| Main: test -> deploy | 15:50 |

Test job: npm ci 81s, lint 36s, check-types 54s, tests 407s (manage-frontend 395s: import 192s, environment 134s, tests 36s).

## Changes

- Split the serial test job into static checks and test shards.
- Excluded seven Supabase containers the E2E suite never talks to.

## After

| Path | Minutes | Run |
|------|---------|-----|
| Pull request: e2e | 6:10 | <run id> |
| Main: e2e -> deploy | 10:50 | <run id> |

Runner minutes per run: 18 before, 27 after.

## Trend

| Week | Test files | Median PR minutes | p90 | Minutes per 100 files |
|------|-----------|-------------------|-----|------------------------|
| 2026-09-21 | 528 | 6:29 | 7:13 | 1:14 |

Tests grow by about N files a week; at that rate and this cost per file the
median crosses <threshold> around <date>. Re-measure when it does.

## Not taken yet

- `isolate: false` for the frontend suite: 21 files use fake timers; needs a second Vitest project. Expected gain 2 minutes off the web shards.
```

The after column comes from a run on the branch, never from the Step 2 prediction; when they disagree, the ledger says why. Give median and p90 over the last ten or twenty runs (`scripts/ci-timings.sh --runs 20 --workflow ci.yml --branch main`); the same shard has measured 2:26 and 3:30 on consecutive pushes.

Attribute per lever. Nine weeks of savings reports from an internal fleet attributed savings per repository, wrote off nine repositories that got slower as "pipeline growth", and reverted nothing. Land one lever per push where the chain allows, or read a run per lever, so the after column names what paid. A negative after column is a revert decision, not a caveat: the ledger states revert or keep, and why, before the next lever lands.

The pull request body carries one verdict (confirmed, not confirmed, inconclusive) with observed and projected in one sentence: `Observed saving: 39 seconds. Projected saving: 42 seconds.` Not confirmed and inconclusive name the next action.

The trend table makes the ledger a standing practice: Linear indexes machine time per test and test count from a fixed week and projects when the suite outgrows the pipeline again. One row per measurement, and a sentence saying when the next round is due.

## Instruction-File Lines

The layout regresses when nobody knows the rule it encodes. Add to the repository's AGENTS.md or equivalent, next to the command section:

- Where a new workspace's tests run, and when one earns its own shard.
- What a new shard costs (the setup tax figure), and the runner's duration line to read before adding one.
- Which service containers the E2E job excludes and what brings one back (a suite that starts using PostgREST re-adds `postgrest`).
- How a new test lands in the fast path by default: the shared-registry project, the node environment for DOM-free files, or whatever the suite's opt-in is. Agents write most new tests, so this is where the default lives.

Two or three lines. The ledger holds the detail; the instruction file holds the rule.

## Workflow Comments

A guard that exists because of an incident keeps the incident next to it: date, run id or PR, what went wrong. "Do not enable cancel-in-progress on main" without the story is removed by the next cleanup; the comment naming the two interrupted rollouts is not.
