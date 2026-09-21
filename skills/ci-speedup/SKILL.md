---
name: ci-speedup
description: Cuts the wait from push to green by measuring a pipeline's critical path from run timestamps, then splitting, sharding, trimming setup and sharing test module state, with a before/after ledger. Use when asked to "speed up CI", "CI is slow", "why does a PR take 15 minutes", "CI is the bottleneck", or when agents merge faster than checks finish. For a red build use pr-babysitter; for a new package's pipeline use scaffold-cli.
compatibility: Reads run and job timings through the GitHub CLI or a GitHub MCP server; other CI hosts need their equivalent API. Local re-timing needs the repo's toolchain installed.
---

# CI Speedup

Make the wait from push to green shorter, measured, and written down.

- **IS:** measuring a pipeline's critical path from run and job timestamps, choosing the levers that shorten it, changing the workflow and test configuration, and recording before and after numbers with the trend that says when the next round is due.
- **IS NOT:** getting a red build green (`pr-babysitter`), writing a pipeline for a package that has none (`scaffold-cli`), or general repository hygiene.

## What Changes the Number

Wall-clock time is the slowest chain of dependent jobs, not the sum of jobs. The number that matters is push to green for one pull request, as a median and a p90 over recent runs; around five minutes is where an agent loop stops waiting on checks, and past that the bottleneck moves to deploy and review. Every lever is judged by how much it takes off that chain; a lever that saves runner minutes off the critical path is a cost saving, not a speedup, and the ledger records it as one.

Three ratios decide what to do next:

- **Setup tax.** Checkout, runtime install, dependency install, and service boot, per job. A job that spends 110 seconds getting ready and 60 seconds working is a batching candidate; one that spends 110 seconds getting ready and 400 working is a sharding candidate. Sharding n ways adds n minus one more setups, so cut setup before adding shards.
- **Import versus test.** Vitest prints how long files took to import, set up their environment, and run. When import plus environment exceeds the tests themselves, a shared module registry or a lighter environment moves the number; more shards only spread the waste.
- **Gate versus work.** Change detection, matrix computation, cache saves, and other work whose only output is a decision or a side effect sit on the chain. Anything they do beyond deciding is paid by every job behind them.

## Reference Files

| File | Read when |
|------|-----------|
| `references/measuring.md` | Step 1: pulling run, job, and step timings; percentiles over many runs; the critical path; reading test-runner duration lines; the baseline table |
| `references/levers.md` | Step 2: the lever catalogue by class, what each needs to be true, expected gain, and how each one has failed |
| `references/ledger.md` | Step 5: the ledger, its trend table, and the instruction-file lines that keep the layout and the test defaults from regressing |
| `scripts/ci-timings.sh` | Step 1: one run's jobs, steps and critical path, or `--runs N` for median and p90 per job; `--help` gives the forms |

`evals/evals.json` holds scenarios and the recorded with-versus-without comparison for changing this skill; it never loads during a task.

## Workflow

Copy this checklist to track progress:

```text
CI speedup progress:
- [ ] Step 1: Baseline (median and p90 over recent runs, per-step table for the longest job, critical path)
- [ ] Step 2: Choose levers by gain on the critical path, with a predicted chain
- [ ] Step 3: Change the pipeline; re-time locally what can be re-timed
- [ ] Step 4: Push, read the branch's own runs as the after-measurement, iterate
- [ ] Step 5: Ledger with trend, instruction-file lines, and the queue of what is left
```

The finished state is a merged or mergeable pipeline change, a ledger whose after column comes from runs on the branch, and instruction-file lines for the layout and the test defaults. Reading runs, re-timing locally, and pushing to the working branch are the loop and need no check-in; spending money (paid runners, more parallel jobs on a metered plan) and merging are the user's.

### Step 1: Baseline from timestamps

Use the run and job API, never memory or the workflow file, for how long things take. `scripts/ci-timings.sh --runs 20 --workflow ci.yml --branch main` gives median and p90 per job; the single-run form on one default-branch run (with the deploy stage) and one pull request gives the steps and the chain. Where the CLI is unavailable, `references/measuring.md` has the API path. Name the critical path in a sentence: which jobs, in what order, and the minutes from run start to the last job's end.

Pull the log of the slowest test step and record the runner's own breakdown (files, duration, import, environment, tests). Classify every minute on the critical path as toolchain, gating, setup, or execution before proposing anything.

### Step 2: Choose levers

Read `references/levers.md` and pick the levers whose gain lands on the chain from Step 1. Write the expected new chain and its minutes; a plan without a predicted number cannot be checked. Prefer levers whose safety the suite itself proves (a sharded run either passes or does not) over levers that need judgement per file.

Runner minutes are allowed to rise when wall-clock falls. Say by roughly how much, and say whether the repository pays for minutes.

### Step 3: Change the pipeline and re-time locally

Edit the workflow and test configuration in one branch. Whatever can be measured without pushing, measure: install the toolchain, run the suite with the current configuration and with the new one, and keep both timings. A change that makes a shard fail is a finding, not a reason to skip that shard.

Keep the pipeline's guards. Change detection, merge-DAG checks, concurrency groups, and deploy gates exist because of a past incident; move them, do not drop them. Comments in the workflow that cite an incident stay next to the guard they explain.

### Step 4: Push and read the after-measurement

The branch's own runs are the after-measurement. Read them the same way as Step 1 and put the numbers next to the baseline. When the predicted chain and the measured one disagree, find out why before adding another lever. Repeat until the critical path stops moving or the remaining levers need a decision the user owns.

### Step 5: Ledger and guardrails

Write the ledger from `references/ledger.md` into the repository's docs: before, changes, after with run ids, a trend row (test count, median, p90, minutes per hundred files) and the sentence saying when the next round is due, and the queue of levers not taken with what each waits on. Add the instruction-file lines for the layout and for how a new test is written so it lands in the fast path by default. The work is done when the ledger's after column comes from real runs on the branch, not from a prediction.

## Gotchas

- `cancel-in-progress: true` on the default branch cancels the deploy job of the run being superseded, mid-rollout. Cancel on pull requests only; pushes to the default branch queue.
- The same setting cancels your own measurement: a push to the pull request while its run is in flight throws that run away. Hold docs-only commits until the run you are measuring completes.
- A queued default-branch run that gets replaced never runs its checks. Change detection that compares only against the previous commit then skips work that never passed; compare against the last commit that finished successfully.
- Running every workspace's tests in one job through a task runner with no remote cache is not caching, it is oversubscription: twenty test processes on four cores, each spawning its own workers. A 0:47 suite took 3:04 there. Read the per-workspace duration lines before blaming the tests.
- A `Duration` line where import plus environment is several times the tests figure says the suite is paying to boot the module graph per file. Sharding halves the bill without lowering it; `isolate: false` on the files that tolerate it does.
- Under a shared registry the files that break are rarely the ones at fault. `vi.mock`, fake timers and `vi.stubGlobal` registered by one file outlive it, and the failures land in later files with no mocks of their own (31 of 222 failed, most of them victims). Isolate by the calls a file makes, not by which files went red.
- A restored dependency cache can be slower than a fresh install. Time both on the runner before keeping the cache step; Linear measured restore at roughly four times the cost of install for their store, and a 2.6 GB `node_modules` is not worth trying.
- Excluding containers from a service stack saves their image pulls, not the boot. Seven fewer Supabase containers took the step from 2:47 to 2:11; Postgres init and health waits were the rest. Predict a boot saving from the step's log, not the container count.
- Overlapping two IO-bound steps on a hosted runner returns less than their sum. A service boot run in the background beside `npm ci` cut the post-install wait from 2:11 to 0:34, but the install grew from 1:32 to 2:28 because pulls and package extraction share one network link and one disk.
- A background boot must resolve its project the same way the step that reads it does. `supabase start --workdir <dir>` booted a default project under another container name and the later `supabase status` found nothing. Run both from the same directory, and print what started in the wait step.
- Vitest and Playwright shard by file count, so two shards of one suite can differ by a minute of tests, and the same shard by a minute between runs. Read median and p90 before adding a third shard; splitting the long files rebalances, another shard does not.
- A job that another job `needs` and that was skipped by an `if` makes the dependent skip too. Where a deploy must still run when an optional job was skipped, gate on `always()` and the specific job results.
- Matrix jobs default to `fail-fast: true`; one failed shard then cancels the others and hides how many are red. Set `fail-fast: false` on test shards.
- Format checks with a `--check .` on the whole tree make docs-only commits ineligible for `paths-ignore`; only extensions the formatter never matches can be skipped.

## Related Skills

- `pr-babysitter` for a run that is red rather than slow, and for watching the pull request this work opens.
- `pr-creator` for the pull request itself; the ledger's before and after tables belong in its body.
- `agents-md` when the instruction-file lines from Step 5 grow into a wider AGENTS.md pass.
- `scaffold-cli` and `scaffold-nextjs` when the repository has no pipeline yet; this skill starts from timestamps, which a new repository does not have.
