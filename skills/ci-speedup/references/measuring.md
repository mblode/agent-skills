# Measuring the Pipeline

How to get real numbers out of GitHub Actions and turn them into a critical path, and how to read an after-run before crediting a lever. Everything here is read-only.

## Contents

- Where the numbers are
- Pulling timings
- Which runs count
- Queue time
- Percentiles and trend
- Three ratios
- Computing the critical path
- Reading test-runner output
- Baseline table
- Verifying the after-measurement
- Other hosts

## Where the Numbers Are

GitHub records `created_at` and `run_started_at` on the run, `run_attempt` on the run and each job, and `created_at`, `started_at` and `completed_at` on each job and step. The workflow file says what runs; only the timestamps say what it cost, and a step that looks heavy in the YAML is often a cache hit measured in seconds.

## Pulling Timings

`gh api` has no `--repo` flag; it fills `{owner}/{repo}` from the checkout or from `GH_REPO`. The script's `--repo owner/name` sets `GH_REPO` for you.

```bash
export GH_REPO=owner/name   # only outside the checkout
gh run list --workflow ci.yml --branch main --status success --limit 3 --json databaseId,displayTitle,createdAt
scripts/ci-timings.sh <run-id>
```

The single-run form prints each job with its queue wait and duration, every step over two seconds, and the chain of jobs that ends last. Through a GitHub MCP server, `github:actions_list` (`list_workflow_runs`, then `list_workflow_jobs`) returns the same objects: save one run's jobs and pass `--jobs-json <file>`, or save one file per run and pass `--runs-dir <dir>`.

One run is a sample; hosted runners vary by a minute on the same shard between pushes. Baseline and after both want median and p90 over recent runs, one event at a time:

```bash
scripts/ci-timings.sh --runs 20 --workflow ci.yml --event push --branch main
scripts/ci-timings.sh --runs 20 --workflow ci.yml --event pull_request
scripts/ci-timings.sh --runs 20 --workflow ci.yml --event merge_group
```

Events differ in shape. A default-branch push usually carries a deploy stage, so its critical path is longer and different. A `pull_request` run is what an author waits on. A `merge_group` run is the merge path when a merge queue is on, and it often runs a different job set. Never pass `--branch main` with `--event merge_group`: queue runs run on `gh-readonly-queue/main/...` branches, so the filter returns nothing and the merge path looks free. `--since YYYY-MM-DD` bounds the window, so a baseline and an after-run cover comparable weeks.

## Which Runs Count

`--runs` takes every completed run and fetches jobs from every attempt (`filter=all`). Median and p90 then include failed and cancelled jobs, which is what people actually waited for. `--success-only` restores the older success-only view; use it only to compare against a baseline that was taken that way, and say so in the ledger.

Read four counts next to the durations:

- **Failure share per job.** A job that fails often is a reliability problem before it is a speed problem; its reruns sit on the chain.
- **Rerun share.** Rows from `run_attempt > 1`. A run that went green on attempt 2 cost both attempts in runner minutes and the author waited through both. A rising rerun share is a flake signal; record it rather than averaging it away.
- **Cancelled share.** Cancelled is no verdict, and a cancelled job's duration is truncated. When it is high, superseded runs dominate the sample: read p90 with and without `--success-only` before quoting either.
- **Other conclusions.** `action_required` (a fork waiting for approval) and `startup_failure` produce runs with no jobs; they never measure the pipeline.

## Queue Time

Job `created_at` to `started_at` is queue wait: runner capacity, not test speed. The script prints it per job and adds a run-level `RUN QUEUE` row (first job created to first job started).

- Wait between a job's `needs` finishing and the job starting is gating time on the chain, paid once per dependency edge.
- A large or rising p90 queue wait on hosted runners points at a concurrency limit on the plan; on self-hosted or larger runners it points at pool size. The fix is capacity or fewer jobs, never a faster test.
- Time a pull request spends waiting in a merge queue before its group starts shows up in no run timestamp. It is a pull-request measure, not a pipeline one.

## Percentiles and Trend

Median is what a developer usually waits, p90 is what they remember. Alongside them record the test file count and its growth, because a pipeline fast at 500 files is slow at 900. Minutes per hundred files, tracked per measurement, says when the next round is due before anyone complains.

## Three Ratios

These decide which lever family applies, before any lever is chosen:

- **Setup tax.** Checkout, runtime, dependencies, and service boot, per job. Setup larger than the job's own work makes it a batching candidate; work several times its setup makes it a sharding candidate. Each shard adds a setup, so cut setup before adding shards.
- **Import versus test.** When Vitest's import plus environment figures exceed its tests figure, the suite pays to boot the module graph per file. A shared registry or a lighter environment moves that; more shards only spread it.
- **Gate versus work.** Change detection, matrix computation, cache saves and runner allocation sit on the chain. Anything they do beyond deciding is paid by every job behind them.

## Computing the Critical Path

1. For each job, note `needs` from the workflow file and the job's start and end.
2. From the job that finished last, walk back through the `needs` that ended latest. That sequence is the critical path.
3. Sum the gaps: runner allocation between dependencies finishing and a job starting is dead time in the gating class.
4. Every other job is off the path. Shortening it changes cost, not wall-clock, until it becomes the longest.

Write the path as one line with minutes: `changes (0:10) -> test (12:00) -> deploy (5:50) = 18:00 from run start`. The script walks back by finish order, not by `needs`; confirm its chain against the workflow file.

## Reading Test-Runner Output

Vitest prints one summary per invocation:

```text
Test Files  180 passed (180)
  Duration  312.40s (transform 25.10s, setup 800ms, import 150.20s, tests 30.50s, environment 110.30s)
```

The parenthesised figures are summed across workers, so compare them with each other, not with the total. `import` is module graph loading per file, `environment` is jsdom or happy-dom setup per file, `tests` is the assertions. When import plus environment is several times tests, the lever is a shared module registry or a node environment for DOM-free files, not more machines.

Jest and Playwright do not break time down this way; time a single spec file alone against the whole run to estimate per-file overhead. When several workspaces run under one task runner in one job, pull every workspace's summary line: the job's wall time is the slowest workspace under contention, and the others hide inside it.

## Baseline Table

One table per measured run, in the ledger and the pull request description (numbers illustrative):

| Job | Step | Seconds | Class |
|-----|------|---------|-------|
| test | pnpm install | 70 | setup |
| test | check-types | 50 | toolchain |
| test | turbo run test | 400 | execution |
| e2e | start local services | 160 | setup |

Classes: toolchain (compilers, linters, type checkers), gating (change detection, matrix computation, runner allocation, queue wait), setup (checkout, installs, caches, service boot, database schema), execution (the tests and builds the pipeline exists to run). The class decides which lever family applies.

## Verifying the After-Measurement

The branch's own runs are the after-measurement, read with the same command, event and window as the baseline. A shorter chain is necessary, not sufficient.

- **No step starts later than it did.** Put the after-run's step start offsets next to the baseline's. A chain that shortened while one step moved later has regressed something; find it first.
- **Parallelism is proved by overlap.** Steps that now run concurrently must have intersecting intervals in the after-run; a step that merely got faster did not parallelize. The saving is the sum of their baseline durations minus the group's wall-clock. Manual approvals and environment waits have no interval and are excluded.
- **The lever fired, per the log.** Read a line that appears on a cold run as well as a warm one (the cache action's own banner, or a task runner's hit count, not "cache restored"), so a first-run miss reads as a miss and not as the lever being absent.
- **Measured against predicted.** Within about 20 percent of the prediction confirms; shards get 30 because they vary by file count. Outside that band the lever is inconclusive until explained, and the ledger says which.
- **One lever per measurement.** Land one lever per push where the chain allows, or read one run per lever, so the after-run names which lever paid. A saving measured across several levers at once cannot be split afterwards, and a lever that made things worse hides inside the total.
- **Same failure and rerun share.** A p90 that fell because failures or cancellations fell is a reliability change, not a speed lever. Compare the counts before crediting the duration.

## Other Hosts

Buildkite exposes `started_at` and `finished_at` per job on a build, with the same interval reading; block steps and waiting steps have no interval and sit outside the chain. Map the jobs to the GitHub job shape for `scripts/ci-timings.sh --jobs-json <file>`, or compute the chain by hand. GitLab exposes `queued_duration` and `duration` per job; the same reading applies.
