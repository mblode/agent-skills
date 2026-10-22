# Flow: Where Changes Wait

How to find the stage that limits merged-and-deployed changes per hour, from per-PR timestamps. Everything here is read-only.

## Contents

- Stages
- WAIT and WORK
- Running ci-flow.sh
- Naming the constraint
- Little's law check
- Health metrics
- Cost per merged change
- Fewer than about 20 merged PRs
- Re-measure: the constraint moves

## Stages

Each merged PR passes eight milestones. A stage is named for the milestone that ends it.

| Stage | Ends when | Label |
|---|---|---|
| ready | marked ready for review; equals open when the PR was never a draft | WORK |
| head green | the last non-skipped check on the final head commit finishes, with every check passing | WORK |
| approved | the first APPROVED review | WAIT |
| enqueued | the last add to the merge queue | WAIT |
| merged | the merge | WAIT |
| main verdict | the last finished push run on the merge commit; cancelled runs give no verdict | WORK |
| deployed | the first successful deployment to the environment created at or after the merge | WAIT |

Milestones are ordered by when they happened, and each stage gets the time since the one before it. Review and CI often overlap; whichever finished last gets the tail, so the stages add up to the lead time and nothing is counted twice. A pre-merge milestone dated after the merge (a check that ran post-merge, a late approval) is treated as missing.

The deployed time is an approximation: it assumes a later deploy contains every earlier merge. A rollback or a deploy of an older SHA breaks that assumption; check deploy SHAs before trusting a short deploy stage.

## WAIT and WORK

WORK means something is being done to the change: the author drafting, CI on the head, CI on main. WAIT means the change is ready for the next step and sits until a person or a slot takes it: review, someone pressing merge or enqueue, the queue, the deploy slot. Review and queue time are always WAIT, even when a queue is running CI, because the PR's own checks already passed.

Two labels need judgement:

- **head green** also absorbs author rework between pushes. Pushes per PR above about 2 means rework and failed first attempts, not pipeline duration.
- **deployed** includes the rollout itself. At merge rate it is mostly the deploy queue, so it is labelled WAIT; with one short deploy per merge, read it as WORK.

Shortening WORK while a WAIT stage dominates moves nothing: the change still waits for the same reviewer. Cutting CI duration when CI is not the constraint is a cost lever, not a throughput lever.

## Running ci-flow.sh

```bash
scripts/ci-flow.sh --repo owner/name
scripts/ci-flow.sh --since 2026-01-05 --workflow ci.yml --environment production
scripts/ci-flow.sh --json > flow.json
```

Defaults: the last 14 days, the repository default branch, at most 200 PRs. One GraphQL search page per 25 PRs (a few points of the hourly budget) plus up to 10 pages of push runs. Pass `--workflow` so the main verdict is the CI workflow, not a cache warmer that fails on every push; the red breakdown on the main-verdict line shows which workflow made each verdict red. Without `--environment` the deployed stage is n/a.

| Output line | What it says |
|---|---|
| PRs merged N (sampled n) | When n < N, minutes per week scale the sample up to N. Raise `--limit` for an exact count. |
| bot-authored | Share by author type. Agents pushing with a user token count as humans. |
| pushes per PR | Commit count, a proxy: squash and force pushes undercount. Multiply by workflows per push for PR runs. |
| merge queue, ejections | Removals other than the successful merge. Ejections above about 1 in 10 enqueued PRs means queue churn: measure p from `merge_group` runs. |
| main verdict | Coverage below n means coalesced main runs (no verdict for that SHA) or all runs cancelled. |
| stage table | PRs measured, median, p90, minutes per week, share of all stage minutes. n/a means not measured. |
| LITTLE | The flow check below. |
| CONSTRAINT | The stage with the most minutes per week. |

`--json` adds per-PR rows with every milestone and stage; sort them by the constraint stage to see which PRs carry it.

## Naming the Constraint

The constraint is the stage with the most minutes per week, not the highest median: a stage with a moderate median across every PR outweighs a rare long one. Compare p90 with the median before acting. A p90 many times the median means a few stuck PRs; read those rows first, because the fix may be closing them rather than changing the process.

| Constraint | Usual meaning | First move |
|---|---|---|
| approved | PRs green within minutes, then waiting on a person | review policy: who reviews, auto-approval for low-risk tiers, review capacity |
| enqueued or merged, no queue | green and approved, nobody pressed merge | auto-merge on green, merge on exact-head evidence |
| merged, with a queue | queue throughput | group size, concurrency, ejection rate |
| head green, pushes per PR ≤ 2 | pipeline duration | time the PR workflow with `scripts/ci-timings.sh` |
| head green, pushes per PR above 2 | first-pass failures | flakes, and failures an agent could catch before pushing |
| main verdict | post-merge CI duration | matters only when deploy or revert waits on it |
| deployed | serial deploys | supersede to the newest validated build |

Then work the constraint: exploit it (no green PR sits idle in front of it), subordinate the other stages to it (nothing upstream produces more than it clears), and only then elevate it (more reviewers, more deploy slots, a faster pipeline).

## Little's Law Check

WIP = λ × W. λ is merges per hour over the window; W is the **mean** open-to-merged hours (the law uses the mean, not the median). The script compares the expected WIP with the PRs open against the base right now.

- **Open ≈ expected.** The numbers agree; trust the stage minutes.
- **Open far above expected (2× or more).** Either abandoned PRs, or arrivals exceed merges and the backlog grows whatever the stage times say. Count PRs opened per hour in the same window: if that exceeds λ, the system is over capacity and the constraint's capacity, not its latency, is the problem. Stale PRs count as WIP to a reviewer scanning the list; close or label them.
- **Open far below expected.** A burst of old PRs merged inside the window (a cleanup) inflated W. Shorten the window or read the JSON rows without them.

## Health Metrics

Record these each time the flow is measured. Missing data is "n/a", never zero: a zero reads as perfect and hides that nothing was measured. A revert rate of 0 because reverts are not labelled is the same mistake.

| Metric | Definition |
|---|---|
| cycle time p90 | open to deployed, or open to merged with no deploy data |
| first-pass rate | share of PRs whose first head went green with no further push |
| revert rate | reverts merged per merged change |
| main-red minutes per week | sum of red episodes on main, from first failure after a green to the next green (R) |
| cost per merged change | runner-minutes, as below (C) |
| human touches per change | reviews, manual merges, manual reruns and manual conflict fixes, per merged change |

## Cost per Merged Change

Count runner-minutes (the sum of job durations), never wall clock: a 10-minute run on 8 parallel shards costs about 80 runner-minutes plus setup on every shard.

| Term | How to get it |
|---|---|
| PR runs × pushes | runner-minutes per PR run × pushes per PR from `ci-flow.sh` |
| queue runs | every `merge_group` run in the window, including groups discarded when a group ahead failed, divided by merges |
| main run | push runs on the base divided by merges; coalescing makes it less than 1 |
| reruns | runs with `run_attempt > 1`, in runner-minutes |
| review bots | runs per PR × cost per run |

An AI review set to run after every push costs pushes × per-run cost. For agent PRs, which push often, set it to run once after PR creation: one run instead of the pushes-per-PR p90.

Illustrative arithmetic, not a benchmark: a 40 runner-minute PR run × 3 pushes = 120; 1.3 queue runs × 40 = 52; 0.6 main runs × 60 = 36; reruns at 10% of PR runs = 12; a per-push review bot at 5 per run × 3 = 15. Total 235 runner-minutes per merged change, half of it from pushes. Cutting pushes per PR saves more here than shaving the pipeline.

## Fewer Than About 20 Merged PRs

Percentiles from a handful of PRs are noise: the p90 of 7 PRs is the maximum. The script prints a projection warning below 20 merges. Then:

1. Widen `--since` (60 or 90 days) if the repo has history and the process has not changed in that time.
2. Otherwise reason from configuration and stated volumes: required reviewers, branch protection, queue settings, one pipeline timed with `ci-timings.sh`, and the volume the user expects ("agents will open 200 PRs a day").
3. Project minutes per week per stage as expected arrivals × expected stage time. Label every such number "projection" in the answer and the ledger.
4. Set a date to replace projections with measurement, once 20 or more merges have landed.

## Re-measure: the Constraint Moves

After each fix lands, rerun with `--since` set to the day it merged, so the window does not straddle the change. The fixed stage drops and another becomes the constraint. A common sequence: review wait first (PRs green in minutes, then waiting hours for a person and merged in bursts), then serial deploys once merges speed up. Gains in a stage that is no longer the constraint do not raise X; stop working it. Record minutes per week per stage before and after, and the new CONSTRAINT line.
