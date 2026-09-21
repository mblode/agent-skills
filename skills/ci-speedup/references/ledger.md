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
- Native TypeScript compiler for check-types: `baseUrl` in two tsconfigs is unsupported. Expected gain 40s, off the critical path today.
```

The after column comes from a run on the branch, never from the prediction in Step 2. When they disagree, the ledger says so and says why. Give median and p90 over the last ten or twenty runs where the history exists (`scripts/ci-timings.sh --runs 20 --workflow ci.yml --branch main`); a single run is a sample, and the same shard has measured 2:26 and 3:30 on consecutive pushes.

The trend table is what makes the ledger a standing practice rather than a one-off: Linear indexes machine time per test and test count from a fixed week and projects when the suite outgrows the pipeline again (at 2,000 new tests a week, theirs would have doubled without the work). One row per measurement, and a sentence saying when the next round is due.

## Instruction-File Lines

The layout regresses when nobody knows the rule it encodes. Add to the repository's AGENTS.md or equivalent, next to the existing command section:

- Where a new workspace's tests run (which shard picks it up automatically, and when a workspace earns its own).
- What a new shard costs (the setup tax figure) so the next split is a decision, not a reflex.
- Which service containers the E2E job excludes and the condition under which one comes back (a suite that starts using PostgREST re-adds `postgrest`).
- The runner's own duration line as the thing to read before adding a shard.
- How a new test is written so it lands in the fast path by default: the shared-registry project, the node environment for DOM-free files, or whatever the suite's opt-in is. Agents write most new tests, so the instruction file is where the default lives; Linear updated their agent skills for exactly this.

Two or three lines. The ledger holds the detail; the instruction file holds the rule.

## Workflow Comments

A guard that exists because of an incident keeps the incident next to it: the date, the run id or PR, and what went wrong. A comment saying "do not enable cancel-in-progress on main" without the story is removed by the next cleanup; one that names the two interrupted rollouts is not.
