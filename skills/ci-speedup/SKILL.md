---
name: ci-speedup
description: 'Speeds up CI and the merge path: finds where changes wait between push and deploy, then fixes the critical path, check placement, merge queue or post-merge checks with auto-revert, flaky tests, and deploy rate. Use when "CI is slow", "speed up CI", "do we need a merge queue", "main keeps going red", "flaky tests block merges", agents open PRs faster than they merge, or building a self-healing merge loop.'
compatibility: Reads PR, run, job and deployment history through the GitHub CLI and jq (or a GitHub MCP server); other hosts need their equivalent API. Local re-timing needs the repo's toolchain.
---

# CI Speedup

Find the stage where changes wait between push and deploy, fix that stage with numbers, and write down what changed and when to look again.

- **IS:** measuring where changes wait from push to deploy; a pipeline's critical path; check placement per lane and the required-check set; merge queue sizing or the post-merge design; main-health detection, attribution and revert; the agentic merge loop that reverts, re-lands and repairs without a human; flake policy; deploy throughput; cost per merged change; the ledger.
- **IS NOT:**
  - one PR's red build, conflict or single rerun (`pr-babysitter`)
  - package releases (`autoship`)
  - which checks exist, enforcing a rule, hook wiring, protected paths, or the sandbox rules for an unattended agent job (`codebase-architecture`); this skill owns the merge controller that dispatches those jobs and decides revert, merge and deploy
  - pruning tests (`test-audit`)
  - reviewing a workflow diff (`tidy`)
  - repositories with no pipeline yet (`scaffold-cli`, `scaffold-nextjs`)
  - how many agents to run, or writing the repository's merge-risk policy (this skill reads that policy; it does not author it)

## The Model

The objective is **X = changes merged and deployed per hour**, held inside three budgets and one hard limit:

| Symbol | Budget |
|---|---|
| R | main-red minutes per week |
| C | runner-minutes per merged change: PR runs × pushes, queue runs including discarded speculation, the main run, reruns, and per-push review bots |
| F | p90 time from push to a verdict the author can act on; an agent's context decays while it waits |

Irreversible damage (destructive migrations, infrastructure, leaked secrets) stays at zero whatever it costs X.

Symbols used across every file: λ = arrival rate (merges/hour); T = merge-path CI minutes; p = failure rate on the merged tree, flakes included; p_mb = merge-breakage rate given the head was green; B = batch size; D = speculation depth.

**Finding the constraint.** Pull per-PR timestamps for open, ready, head green, approved, enqueued, merged, main verdict and deployed. Label each stage WAIT or WORK; review and queue time are wait. The constraint is the stage with the most queued minutes per week, and Little's law (WIP = λ × lead time) checks the arithmetic. Exploit it, subordinate the other stages to it, then elevate it, and re-measure after every fix because the constraint moves. Cutting CI duration when CI is not the constraint is a cost lever, not a throughput lever.

**Pipeline duration.** When the pipeline is the constraint, its wall-clock is the slowest chain of dependent jobs, not their sum. A lever that saves runner minutes off that chain lowers C, not F, and the ledger records it as a cost saving.

**Lanes and placement.** Every check runs in one lane: author pre-push, PR gate (exact head), merge path (the merged tree, or nothing), post-merge main (coalesced runs; drives auto-revert), pre-deploy (the exact artifact) or nightly (never a merge verdict). Place each check by asking, in order: irreversible if it ships (block before merge, human tier); merge-breakable, meaning its result can change when merged with other PRs (run it on the merged tree; otherwise at the PR head only); deterministic (only these may drive auto-revert); and what it adds to T against what it catches. The classification table and the YAML are in `references/lanes.md`.

**The default architecture: no merge queue.** PRs merge on evidence for their exact head; main verifies itself after merge in coalesced runs, so each run is a batch; deterministic failures are bisected and reverted by code, and the re-land, conflict and flake repairs go to agents as new tasks; deploys follow the newest verified commit; humans own the high-risk tier, the kill switch and a sampled audit. This is the shape Anthropic runs at 30,000+ merges a day, and it holds at low volume too, where each batch is one commit. Never answer with "require branches up to date" or "require green main before merging": both serialise merges. Flip to a merge queue only when the red budget cannot be met, deploys cannot be limited to verified commits, breakages are mostly nondeterministic, or main cannot be reverted; the flip conditions and the queue math are in `references/merge-path.md`, and the GitHub implementation is in `assets/github/` with `references/github-build.md`.

## Reference Files

| File | Read when |
|------|-----------|
| `references/flow.md` | Step 1, or the user asks where PRs wait: stage definitions, WAIT vs WORK, Little's law, health metrics, cost per merged change, reading `ci-flow.sh` output |
| `references/measuring.md` | Pipeline duration is the constraint, or Step 5 is crediting an after-run: run, job and step timings, the three ratios, the critical path, `merge_group` runs, failure and rerun share, queue time, after-run rules |
| `references/levers.md` | Choosing duration levers: setup, execution, toolchain and image-build levers, what each needs to be true, and the traps |
| `references/lanes.md` | Placing a check; editing `on:`, `if:`, `needs:` or `concurrency:`; changing required checks; a gate that passes while checking nothing |
| `references/merge-path.md` | Whether a flip condition calls for a merge queue, queue sizing, a backed-up queue, ejections, conflicts, merge policy |
| `references/main-health.md` | Main is red, or designing detection, attribution, auto-revert or re-land |
| `references/merge-loop.md` | Designing the agentic merge system: what code decides versus what agents repair, post-merge batching, the agent task contract, the autonomy ladder, loop health, and the agent runtime (Claude in Actions, eve, Devin). Read with `main-health.md` and `bots.md` |
| `references/github-build.md` | Installing or adapting the loop on GitHub: Anthropic's design mapped to rulesets and workflows, setup order, how the controller keeps state, checkout cost, verifying an install |
| `assets/github/` | The templates `github-build.md` installs into `.github/`: `merge-loop.json`, the `loop.sh` controller, the Managed Agents agent and environment, and the `pr`, `main-verify`, `merge-loop`, `agent-task`, `deploy`, `superfan` and `audit-sample` workflows, with the ruleset and CODEOWNERS |
| `references/bots.md` | Building or changing any bot that writes: revert, repair, re-queue, re-land |
| `references/flakes.md` | Intermittent failures, retry or quarantine policy, and before batching or bisecting |
| `references/deploy.md` | Deploy is the constraint, or deploys trail merges |
| `references/ledger.md` | Step 6: the ledger, flow-metric trend, merge-path decision record, instruction-file lines |
| `scripts/ci-flow.sh` | Step 1: per-stage median, p90 and minutes per week for merged PRs with a CONSTRAINT line; `--since`, `--base`, `--workflow`, `--environment`, `--json` |
| `scripts/ci-timings.sh` | Step 2, pipeline: one run's jobs, steps and critical path, or `--runs N` for median, p90, failure, rerun and queue-wait per job; `--event merge_group` for queue runs |
| `scripts/ci-health.sh` | Step 2, main: red episodes on main with first-bad and last-good SHAs, red minutes per week, and flake candidates |

Every script is read-only, takes `--repo owner/name` (or `GH_REPO`), and prints its forms with `--help`. `evals/evals.json` holds scenarios and the with-versus-without comparison for changing this skill; it never loads during a task.

## Workflow

Copy this checklist to track progress:

```text
CI speedup progress:
- [ ] Step 1: Find the constraint (per-stage WAIT and WORK minutes per week)
- [ ] Step 2: Measure the constraint stage (pipeline, merge path, main, or deploy)
- [ ] Step 3: Decide with numbers (predicted X, R, C; one option; its flip condition)
- [ ] Step 4: Change it on a branch; re-time locally; dry-run every bot
- [ ] Step 5: After-measurement from the branch's own runs or a bot replay
- [ ] Step 6: Ledger, decision record, instruction-file lines, re-measure date
```

### Step 1: Find the constraint

Run `scripts/ci-flow.sh` against the default branch and name the constraint in a sentence: which stage, WAIT or WORK, minutes per week, and how it compares with the next stage. A scoped ask (one suite, one job) skips to Step 2's pipeline branch. With fewer than about 20 merged PRs in the window, reason from the workflow config and the volumes the user states, and label every number a projection.

### Step 2: Measure the constraint stage

- **Pipeline:** `scripts/ci-timings.sh --runs 20 --workflow ci.yml` for median and p90 per job, then the single-run form for the steps and the chain. Classify every minute on the critical path as toolchain, gating, setup or execution before proposing anything.
- **Merge path:** `merge_group` runs give T, p and ejections; arrivals from Step 1 give λ.
- **Main:** `scripts/ci-health.sh` gives red episodes, R, and which checks failed on the same SHA they passed on.
- **Deploy:** deployment timings against merge times, and how many merges each deploy carries.

### Step 3: Decide with numbers

State the predicted change in X, R and C, one recommended option, and the measurement that would flip it. When wall-clock falls and runner minutes rise, say by roughly how much and whether the repository pays for minutes.

### Step 4: Change it on a branch

Edit workflow, test and bot configuration in one branch, and re-time locally whatever can be measured without pushing. A change that makes a shard fail is a finding, not a reason to skip the shard. Dry-run every bot that writes by replaying the red episodes from Step 2 and listing what it would have reverted, repaired or re-queued. Building the merge loop: on GitHub, install `assets/github/` by the setup order in `references/github-build.md`, adapt `merge-loop.json` and the setup action to the repository, prove it on a throwaway repository first, ship it at rung 0, and promote only on replay numbers.

Keep the guards. Change detection, concurrency groups, merge checks and deploy gates usually exist because of a past incident; move them, never drop them, and keep the comment that cites the incident next to the guard.

### Step 5: Read the after-measurement

The branch's own runs are the after-measurement; apply the after-run rules in `references/measuring.md` before crediting a lever. When predicted and measured disagree, find out why before adding another lever. A change that waits on a repository setting the user owns gets its after-measurement on the re-measure date, and the ledger says so. Repeat Steps 2 to 5 until the constraint moves to another stage or the remaining options need a decision the user owns.

### Step 6: Ledger and decision record

Write the ledger from `references/ledger.md` into the repository's docs: before, changes, after with run ids, the flow-metric trend row, the decision record with its flip conditions, the queue of options not taken with what each waits on, and the re-measure date. Add the instruction-file lines that stop the layout regressing.

## Permissions and Done

Granted without a check-in, because each is read-only, branch-local or reversible: `gh` reads, running the scripts, local re-timing, pushing the working branch, and opening PRs, revert PRs included.

The user's call, because each spends money or changes what every other change must pass:

- spending: paid runners, higher queue concurrency or speculation depth on a metered plan
- repository settings: rulesets, required checks, enabling the merge queue
- creating the GitHub App, storing its key and the model key, creating the Managed Agents agent and environment, turning on Claude Code Review, and raising `MERGE_LOOP_RUNG` above 0
- merging anything to main

Done means a mergeable change, after-numbers from real runs or a bot replay, a decision record with its flip conditions, and a ledger row with a re-measure date.

## Gotchas

- Sharding a pipeline whose PRs go green in minutes and then wait hours for review or merge changes nothing in X. Measure open to deployed with `ci-flow.sh` before touching the pipeline.
- After a fix the constraint moves: re-timing only the stage just fixed reports a win while X stays flat. Re-run `ci-flow.sh` after every change.
- `cancel-in-progress: true` on main cancels a superseded run mid-rollout and leaves the merged commits with no verdict; on a PR it throws away your own measurement run when a later push lands. Cancel superseded runs on PRs only, and hold pushes until the measured run completes.
- `turbo run`, `pnpm -r run` and `lerna run` skip workspaces that lack the script, so a green root command proves nothing about them. Check the per-workspace output.
- A workflow step that calls a wrapper script: editing the workflow line changes nothing, because the wrapper owns the real command. Find where the command runs before re-timing.

## Related Skills

- `pr-babysitter` for one PR that is red, conflicted or needs a rerun, and for watching the PR this work opens.
- `autoship` for package releases and their CI.
- `codebase-architecture` for which checks should exist, enforcing a rule, hook wiring, protected paths, and the sandbox an unattended agent job runs in.
- `test-audit` when the suite is slow because it holds tests that prove nothing; pruning is its job, timing is this one's.
- `tidy` for reviewing the workflow diff this skill produces.
- `scaffold-cli` and `scaffold-nextjs` when the repository has no pipeline yet; this skill starts from timestamps a new repository lacks.
