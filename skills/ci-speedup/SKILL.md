---
name: ci-speedup
description: Cuts CI wall-clock time by measuring the critical path from real run timestamps, classifying where minutes go (toolchain, gating, setup, execution), then reworking the pipeline with split and sharded jobs, trimmed setup and service boot, and shared test module state, recorded in a before/after ledger. Use when asked to "speed up CI", "CI is slow", "CI is the bottleneck", "why does a PR take 15 minutes to go green", or when agents merge faster than checks finish. For a red build use pr-babysitter; for a new package's pipeline use scaffold-cli.
compatibility: Reads run and job timings through the GitHub CLI or a GitHub MCP server; other CI hosts need their equivalent API. Local re-timing needs the repo's toolchain installed.
---

# CI Speedup

Make the wait from push to green shorter, measured, and written down.

- **IS:** measuring a pipeline's critical path from run and job timestamps, choosing the levers that shorten it, changing the workflow and test configuration, and recording before and after numbers.
- **IS NOT:** getting a red build green (`pr-babysitter`), writing a pipeline for a package that has none (`scaffold-cli`), or general repository hygiene.

## What Changes the Number

Wall-clock time is the slowest chain of dependent jobs, not the sum of jobs. Every lever is judged by how much it takes off that chain; a lever that saves runner minutes off the critical path is a cost saving, not a speedup, and the ledger records it as one.

Three ratios decide what to do next:

- **Setup tax.** Checkout, runtime install, dependency install, and service boot, per job. A job that spends 110 seconds getting ready and 60 seconds working is a batching candidate; one that spends 110 seconds getting ready and 400 working is a sharding candidate. Sharding n ways adds n minus one more setups, so cut setup before adding shards.
- **Import versus test.** Vitest and Jest print how long files took to import, set up their environment, and run. When import plus environment exceeds the tests themselves, a shared module registry (`isolate: false`) or a lighter environment moves the number; more shards only spread the waste.
- **Gate versus work.** Change detection, matrix computation, and other jobs whose only output is a decision sit at the head of the chain. Anything they do beyond deciding is paid by every job behind them.

## Reference Files

| File | Read when |
|------|-----------|
| `references/measuring.md` | Step 1: pulling run, job, and step timings; computing the critical path; reading test-runner duration lines; the baseline table format |
| `references/levers.md` | Step 2: the lever catalogue by class, what each needs to be true, expected gain, and how each one has failed |
| `references/ledger.md` | Step 5: the ledger and the instruction-file lines that keep the layout from regressing |
| `scripts/ci-timings.sh` | Step 1: prints per-job and per-step durations and the critical path for one GitHub Actions run; `--help` gives the options |

`evals/evals.json` holds scenarios for changing this skill and never loads during a task.

## Workflow

Copy this checklist to track progress:

```text
CI speedup progress:
- [ ] Step 1: Baseline from timestamps (three runs, per-step table, critical path)
- [ ] Step 2: Choose levers by gain on the critical path
- [ ] Step 3: Change the pipeline; re-time locally what can be re-timed
- [ ] Step 4: Push, read the PR's own run as the after-measurement, iterate
- [ ] Step 5: Ledger, instruction-file lines, and the queue of what is left
```

### Step 1: Baseline from timestamps

Use the run and job API, never memory or the workflow file, for how long things take. Take at least three completed runs: two on the default branch (one includes the deploy stage) and one pull request. Run `scripts/ci-timings.sh <run-id>` per run, or follow `references/measuring.md` when the CLI is unavailable. Produce one table of step durations for the longest job and name the critical path in a sentence: which jobs, in what order, and the minutes between run start and the last job's end.

Pull the log of the slowest test step and record the runner's own breakdown (files, duration, import, environment, tests). Classify every minute on the critical path as toolchain, gating, setup, or execution before proposing anything.

### Step 2: Choose levers

Read `references/levers.md` and pick the levers whose gain lands on the critical path measured in Step 1. Write the expected new chain and its minutes; a plan without a predicted number cannot be checked. Prefer levers whose safety the suite itself proves (a sharded run either passes or does not) over levers that need judgement per file.

Runner minutes are allowed to rise when wall-clock falls. Say by roughly how much, and say whether the repository pays for minutes.

### Step 3: Change the pipeline and re-time locally

Edit the workflow and test configuration in one branch. Whatever can be measured without pushing, measure: install the toolchain, run the suite with the current configuration and with the new one, and keep both timings. The repository's checks are the safety net: a change that makes a shard fail is a finding, not a reason to skip that shard.

Keep the pipeline's guards. Change detection, merge-DAG checks, concurrency groups, and deploy gates exist because of a past incident; move them, do not drop them. Comments in the workflow that cite an incident stay next to the guard they explain.

### Step 4: Push and read the after-measurement

The pull request's own run is the after-measurement. Read its jobs the same way as Step 1 and put the numbers next to the baseline. When the predicted chain and the measured one disagree, find out why before adding another lever. Repeat until the critical path stops moving or the remaining levers need a decision the user owns (a paid runner, a test rewrite).

### Step 5: Ledger and guardrails

Write the ledger from `references/ledger.md` into the repository's docs, add the instruction-file lines that keep the layout intact (where a new workspace's tests land, what a new shard costs, which service containers stay excluded and why), and end with the queue of levers not taken and what each waits on. The work is done when the ledger's after column comes from a real run on the branch, not from a prediction.

## Gotchas

- `cancel-in-progress: true` on the default branch cancels the deploy job of the run being superseded, mid-rollout. Cancel on pull requests only; pushes to the default branch queue.
- A queued default-branch run that gets replaced never runs its checks. Change detection that compares only against the previous commit then skips work that never passed; compare against the last commit that finished successfully.
- Running every workspace's tests in one job through a task runner with no remote cache is not caching, it is oversubscription: twenty test processes on four cores, each spawning its own workers. Read the per-workspace duration lines before blaming the tests.
- A `Duration` line where import plus environment is several times the tests figure says the suite is paying to boot the module graph per file. Sharding halves the bill without lowering it; `isolate: false` on the files that tolerate it does.
- Files that use fake timers, mutate globals without restoring them, or depend on module mocks leaking are the ones that break under a shared registry. Keep them isolated by project rather than turning the whole suite back on.
- A restored dependency cache can be slower than a fresh install. Time both on the runner before keeping the cache step; Linear measured restore at roughly four times the cost of install for their store.
- Local Supabase pulls a dozen images by default. `supabase start -x` with the containers the suite never talks to (studio, postgres-meta, edge-runtime, realtime, imgproxy, mailpit, postgrest when nothing uses PostgREST) removes most of the boot. Keep storage-api if the config declares buckets: the CLI seeds them after start.
- A job that another job `needs` and that was skipped by an `if` makes the dependent skip too. Where a deploy must still run when an optional job was skipped, gate on `always()` and the specific job results.
- Matrix jobs default to `fail-fast: true`; one failed shard then cancels the others and hides how many are red. Set `fail-fast: false` on test shards.
- Format checks with a `--check .` on the whole tree make docs-only commits ineligible for `paths-ignore`; only extensions the formatter never matches can be skipped.
