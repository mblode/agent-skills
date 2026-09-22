# Measuring the Pipeline

How to get real numbers out of GitHub Actions and turn them into a critical path. Everything here is read-only.

## Contents

- Where the numbers are
- Pulling timings
- Percentiles and trend
- Computing the critical path
- Reading test-runner output
- Baseline table
- Verifying the after-measurement
- Other hosts

## Where the Numbers Are

GitHub records `run_started_at` on the run and `started_at` and `completed_at` on each job and step. Job `created_at` to `started_at` is queue time, a runner-capacity problem; note it separately. The workflow file says what runs; only the timestamps say what it cost, and a step that looks heavy in the YAML is often a cache hit measured in seconds.

## Pulling Timings

```bash
gh run list --workflow ci.yml --branch main --status success --limit 3 --json databaseId,displayTitle,createdAt,updatedAt
scripts/ci-timings.sh <run-id>
```

The script prints each job with its queue wait and duration, every step over two seconds, and the chain of jobs that ends last. Pass `--repo owner/name` outside the checkout. Through a GitHub MCP server, `github:actions_list` (`list_workflow_runs`, then `list_workflow_jobs`) returns the same objects; save the JSON and pass `--jobs-json <file>`.

One run is a sample; hosted runners vary by a minute on the same shard between pushes. The baseline and the after both want median and p90:

```bash
scripts/ci-timings.sh --runs 20 --workflow ci.yml --branch main
```

Take default-branch and pull-request runs separately: the default branch usually carries a deploy stage, so its critical path is longer and different.

## Percentiles and Trend

Median is what a developer usually waits, p90 is what they remember. Alongside them record the test file count and its growth, because a pipeline fast at 500 files is slow at 900. Minutes per hundred files, tracked per measurement, says when the next round is due before anyone complains.

## Computing the Critical Path

1. For each job, note `needs` from the workflow file and the job's start and end.
2. From the job that finished last, walk back through the `needs` that ended latest. That sequence is the critical path.
3. Sum the gaps: runner allocation between dependencies finishing and a job starting is dead time in the gating class.
4. Every other job is off the path. Shortening it changes cost, not wall-clock, until it becomes the longest.

Write the path as one line with minutes: `changes (0:10) -> test (10:30) -> deploy (4:40) = 15:50 from run start`.

## Reading Test-Runner Output

Vitest prints one summary per invocation:

```text
Test Files  222 passed (222)
  Duration  395.15s (transform 32.32s, setup 970ms, import 192.16s, tests 36.17s, environment 134.41s)
```

The parenthesised figures are summed across workers, so compare them with each other, not with the total. `import` is module graph loading per file, `environment` is jsdom or happy-dom setup per file, `tests` is the assertions. When import plus environment is several times tests, the lever is a shared module registry or a node environment for DOM-free files, not more machines.

Jest and Playwright do not break time down this way; time a single spec file alone against the whole run to estimate per-file overhead. When several workspaces run under one task runner in one job, pull every workspace's summary line: the job's wall time is the slowest workspace under contention, and the others hide inside it.

## Baseline Table

One table per measured run, in the ledger and the pull request description:

| Job | Step | Seconds | Class |
|-----|------|---------|-------|
| test | npm ci | 81 | setup |
| test | check-types | 54 | toolchain |
| test | turbo run test | 407 | execution |
| e2e | supabase start | 167 | setup |

Classes: toolchain (compilers, linters, type checkers), gating (change detection, matrix computation, runner allocation), setup (checkout, installs, caches, service boot, database schema), execution (the tests and builds the pipeline exists to run). The class decides which lever family applies.

## Verifying the After-Measurement

Applied in CI speed Step 4, before a lever is credited. A shorter chain is necessary, not sufficient.

- **No step starts later than it did.** Put the after-run's step start offsets next to the baseline's. A chain that shortened while one step moved later has regressed something; find it first.
- **Parallelism is proved by overlap.** Steps that now run concurrently must have intersecting intervals in the after-run; a step that merely got faster did not parallelize. The saving is the sum of their baseline durations minus the group's wall-clock. Manual approvals and environment waits have no interval and are excluded.
- **The lever fired, per the log.** Read a line that appears on a cold run as well as a warm one (the cache action's own banner, not "cache restored"), so a first-run miss reads as a miss and not as the lever being absent.
- **Measured against predicted.** Within about 20 percent of the Step 2 prediction confirms; shards get 30 because they vary by file count. Outside that band the lever is inconclusive until explained, and the ledger says which.

## Other Hosts

Buildkite exposes `started_at` and `finished_at` per job on a build, with the same interval reading; block steps and waiting steps have no interval and sit outside the chain. Map the jobs to the GitHub job shape for `scripts/ci-timings.sh --jobs-json <file>`, or compute the chain by hand.
