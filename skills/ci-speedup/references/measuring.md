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

GitHub records three clocks per run: `run_started_at` on the run, `started_at` and `completed_at` on each job, and the same pair on each step. Job `created_at` to `started_at` is queue time, which is a runner-capacity problem rather than a workflow problem and is worth noting separately.

The workflow file says what runs; only the timestamps say what it cost. A step that looks heavy in the YAML (a Docker build, a browser install) is often a cache hit measured in seconds, and a step that looks trivial (`npm ci`) is often the second-largest item in the job.

## Pulling Timings

With the GitHub CLI:

```bash
gh run list --workflow ci.yml --branch main --status success --limit 3 --json databaseId,displayTitle,createdAt,updatedAt
scripts/ci-timings.sh <run-id>
```

The script prints each job with its queue wait and duration, every step over two seconds, and the chain of jobs that ends last. Pass `--repo owner/name` when not inside the checkout.

Through a GitHub MCP server, `github:actions_list` (method `list_workflow_runs`, then `list_workflow_jobs`) returns the same job and step objects the script reads; compute the durations from the timestamps by hand or save the JSON and feed it to the script with `--jobs-json <file>`.

One run is a sample. Hosted runners vary by a minute on the same shard between consecutive pushes, so the baseline and the after both want median and p90 over the recent history:

```bash
scripts/ci-timings.sh --runs 20 --workflow ci.yml --branch main
```

That prints median, p90 and spread per job name and for the whole run. Use the single-run form to read steps and the chain; use this form for the numbers that go in the ledger.

Take runs on the default branch and on a pull request separately. The default-branch run usually carries a deploy stage that pull requests skip, so its critical path is longer and different.

## Percentiles and Trend

Report the median for what a developer usually waits and the p90 for what they remember. Alongside them, record the count of test files (or tests) and the rate they grow, because a pipeline that is fast today at 500 files is the pipeline that is slow at 900. Minutes per hundred files, tracked per measurement, is the number that says when the next round is due before anyone complains. The ledger reference has the table.

## Computing the Critical Path

1. For each job, note `needs` from the workflow file and the job's start and end.
2. Starting from the job that finished last, walk back through the `needs` that ended latest. That sequence is the critical path.
3. Sum the gaps: runner allocation between a job's dependencies finishing and its own start shows up as dead time and belongs in the gating class.
4. Every other job is off the path. Shortening it changes cost, not wall-clock, until it becomes the longest.

Write the path as one line with minutes, for example: `changes (0:10) -> test (10:30) -> deploy (4:40) = 15:50 from run start`.

## Reading Test-Runner Output

Vitest prints one summary per invocation:

```text
Test Files  222 passed (222)
  Duration  395.15s (transform 32.32s, setup 970ms, import 192.16s, tests 36.17s, environment 134.41s)
```

The parenthesised figures are summed across workers, so they exceed the wall-clock `Duration`; compare them with each other, not with the total. `import` is module graph loading per test file, `environment` is jsdom or happy-dom setup per file, and `tests` is the assertions. When import plus environment is several times tests, the suite is paying per-file boot cost, and the lever is a shared module registry or a node environment for files that never touch the DOM, not more machines.

Jest's `--verbose` and Playwright's reporter do not break time down this way; for those, time a single spec file alone against the whole run to estimate per-file overhead.

When several workspaces run under one task runner in one job, pull every workspace's summary line. The job's wall time equals the slowest workspace under contention, and the others are hidden inside it.

## Baseline Table

One table per measured run, in the ledger and in the pull request description:

| Job | Step | Seconds | Class |
|-----|------|---------|-------|
| test | npm ci | 81 | setup |
| test | lint | 36 | toolchain |
| test | check-types | 54 | toolchain |
| test | turbo run test | 407 | execution |
| e2e | supabase start | 167 | setup |
| e2e | playwright | 143 | execution |

Classes: toolchain (compilers, linters, type checkers), gating (change detection, matrix computation, runner allocation), setup (checkout, installs, caches, service boot, database schema), execution (the tests and builds the pipeline exists to run). The class decides which lever family applies.

## Verifying the After-Measurement

Read in Step 4, before a lever is credited in the ledger. A shorter chain is necessary, not sufficient.

- **No step starts later than it did.** Put the after-run's step start offsets next to the baseline's. A chain that shortened while one step moved later has regressed something, and that regression is found before the lever is credited.
- **Parallelism is proved by overlap.** Steps that now run concurrently must have intersecting start and end intervals in the after-run; a step that merely got faster did not parallelize. The saving is the sum of their baseline durations minus the group's wall-clock. Manual approvals and environment waits have no interval and are excluded.
- **The lever fired, per the log.** Read a line that appears on a cold run as well as a warm one (the cache action's own banner, not "cache restored"), so that a miss on the first run reads as a miss and not as the lever being absent.
- **Measured against predicted.** Within about 20 percent of the Step 2 prediction confirms; shards get 30 because they vary by file count between runs. Outside that band the lever is inconclusive until the gap is explained, and the ledger says which.

## Other Hosts

Buildkite exposes `started_at` and `finished_at` per job on a build, with the same interval reading as above; block steps and steps in a waiting state have no interval and sit outside the chain. Map the jobs to the GitHub job shape and feed the JSON to `scripts/ci-timings.sh --jobs-json <file>`, or compute the chain by hand from the timestamps.
