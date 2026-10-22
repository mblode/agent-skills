# The Merge Path

Why the default is no merge queue, when to flip to one, and how to size one.

## Contents

- Decision procedure
- Batching and speculation math
- Calibration points
- Merging on exact-head evidence
- Queue mechanics by host
- Queue design: re-prove only merge-breakable checks
- Conflicts and repair
- Minimal merge policy
- Gotchas

## Decision Procedure

The default is no merge queue, at any volume. Recommend it unless a flip condition holds, and name the condition when one does.

1. **Default: merge on evidence, verify after merge.**
   - Merge on evidence for the exact head (below): no lock, no update-branch.
   - Run the full suite post-merge on main, runs coalesced, so each run is a batch of every commit since the last one.
   - Auto-revert deterministic failures only, and hand each re-land to an agent as a new task carrying the evidence; the author's context is gone by the time main goes red.
   - Deploy only verified commits.
   - Irreversible classes (destructive migrations, infrastructure, secrets) keep a pre-merge guard and a human merge.
   - On GitHub this is the build in `github-build.md`.

   It holds at both ends: at low λ each post-merge batch is one commit and attribution is free; at high λ nothing serialises. Anthropic runs this shape at 30,000+ merges a day (Anthropic, 2026).
2. **Never** turn on "Require branches to be up to date before merging" (a serial queue with worse ergonomics: every merge sends every other PR back to rerun) or "require green main before merging" (a ceiling of 1440/T merges a day: 48 at T = 30).
3. **Flip to a merge queue when one of these holds:**
   - Expected red time exceeds the red budget. Red minutes per merging hour ≈ λ·p_mb·t_red, where t_red = detect + attribute + revert minutes; R is that times merging hours per week. At λ = 20/h, p_mb = 2% and t_red = 40, main is red about 16 minutes of every merging hour, about 11 hours over a 40-hour week. Shorten t_red first (faster `main-verify`, parallel bisection); flip only if it cannot get under budget.
   - Every main commit ships, and no gate can restrict deploys to verified commits.
   - Breakages are mostly nondeterministic, so they cannot be auto-reverted.
   - Main cannot be reverted cheaply, for example because merging publishes a package or applies a migration.
4. **Sizing a queue once one is chosen.** Start from utilisation u = λ·T/60. A serial queue is a single server with a fixed service time, so for u < 1 the average wait before a PR's own run starts is u/(2(1-u))·T: 0.5T at u = 0.5, 2T at 0.8, 4.5T at 0.9; at u ≥ 1 it grows without bound. Below u = 0.5, batch 1 to 4 that re-proves only merge-breakable checks. At 0.5 and above, measure p from `merge_group` runs first, after quarantining flakes, counting success and failure only (the queue cancels runs when it rebuilds, and cancelled is no verdict):

   ```bash
   gh run list --workflow ci.yml --event merge_group --limit 300 --json conclusion --jq \
     '[.[] | select(.conclusion == "success" or .conclusion == "failure")]
      | (map(select(.conclusion == "failure")) | length) / length'
   ```

   With no queue yet, the post-merge failure rate on main stands in for p. Size B and D from the math below, and keep the queue while λ ≤ 60·D·B/T with headroom and runner-minutes per merged change stay within budget. When p passes about 10%, or ejection churn pushes runner-minutes over budget, batching buys little: return to the default and fix t_red instead.

Worked case, for a repository that must keep a queue: 40 agents, T = 25. The serial ceiling is 60/25 = 2.4 merges an hour, 57 a day. If agents open 10 an hour, u = 4.2 and no batch-1 queue keeps up. Size by need, not by the cost optimum: capacity 60·D·B/T must exceed λ with headroom, so B = 4 and D = 2 give 60·2·4/25 ≈ 19 an hour. With p = 2% after deflaking, q = 1 - 0.98^4 ≈ 8% and q·D ≈ 0.16, comfortably under 1. The cost-optimal B ≈ 17 is a ceiling, not a target: it gives q ≈ 29% and takes over an hour and a half to fill at 10 an hour.

## Batching and Speculation Math

**Batching.** A batch of B runs once; when it fails, bisection costs about 2·log2(B) more runs, because a queue splits the failed batch and tests both halves. Post-merge bisection over a range with known good and bad ends tests one commit per step, so it costs log2(B). Runs per PR ≈ 1/B + 2p·log2(B), minimised near B ≈ 0.35/p.

| p | B=1 | B=2 | B=4 | B=8 | B=16 | best B | runs/PR at best |
|---|---|---|---|---|---|---|---|
| 1% | 1.00 | 0.52 | 0.29 | 0.19 | 0.14 | 35 | 0.13 |
| 2% | 1.00 | 0.54 | 0.33 | 0.25 | 0.22 | 17 | 0.22 |
| 5% | 1.00 | 0.60 | 0.45 | 0.43 | 0.46* | 7 | 0.42 |
| 10% | 1.00 | 0.70 | 0.65 | 0.73* | 0.86* | 3 to 4 | 0.65 |
| 20% | 1.00 | 0.90 | 1.05* | 1.33* | 1.66* | 2 | 0.90 |

Cells marked * have B·p above 0.5, where most batches fail and the approximation is rough; read them as "worse than the best B", not as exact figures. The table prices runner cost, not latency: a batch waits to fill and a failed batch adds bisection rounds. In one simulation, going from batch 1 to 16 cut CI time per PR by 77.5% and raised time to merge by 55%, from 42 to 65 minutes (Trunk, 2025).

Flakes count in p. At a 1% real merge-break rate, a further 1% flake per full run doubles p, halves the best B, and every flake during bisection can eject an innocent PR that then re-queues and pays the run again.

**Speculation.** Building D batches in parallel, each on top of the ones ahead, gives throughput ≈ D·B/T per minute (60·D·B/T per hour). A failure at the head discards up to D - 1 builds behind it. With batch failure rate q = 1 - (1 - p)^B, keep q·D well under 1; past that nearly every window holds a failure and extra depth buys discards, not merges.

## Calibration Points

| Regime | What they run |
|---|---|
| About 2,500 PRs a month, low p | GitHub's own merge queue, groups of 30 or more deploying safely, time to ship down 33%, throughput favoured over fairness (GitHub, 2024) |
| 30,000+ changes a day | No proper merge queue: post-merge and pre-deploy automated testing, agents fixing conflicts, automated bisect and revert (Anthropic, 2026) |
| Large monorepo, many conflicting changes | A speculation tree with predicted build times and small changes bypassing large conflicting ones: CI resources down 53%, CPU down 44%, p95 wait down 37% (Uber, 2025) |
| Simulated batching | Batch 1 to 16: CI time per PR down 77.5%, time to merge up 55% (Trunk, 2025) |

## Merging on Exact-Head Evidence

The PR gate's verdict belongs to one head SHA. Merge only that SHA, so a push that lands between the check and the merge is never merged on old evidence:

```bash
sha=$(gh pr view "$pr" --json headRefOid --jq .headRefOid)
gh pr checks "$pr" --required        # non-zero unless every required check passed
gh pr merge "$pr" --squash --match-head-commit "$sha"
```

A new head voids the evidence and waits for its own run. Nothing takes a lock and nothing updates the branch; merge-breakage is caught post-merge, and the deploy path ships only commits whose post-merge run passed.

## Queue Mechanics by Host

- **GitHub merge queue.** Settings: merge method; build concurrency, 1 to 100 groups in flight (this is D); minimum and maximum group size, 1 to 100 (B); wait time to reach the minimum group; "only merge non-failing pull requests"; status check timeout. Groups build on temporary `gh-readonly-queue/<base>/...` branches. Workflows must trigger on `merge_group`, and the required check must have the same name on `pull_request` and `merge_group` runs. A failing PR is removed and the groups behind it are rebuilt without it; moving a PR to the top rebuilds every group in flight (GitHub docs).
- **GitLab merge trains.** Up to 20 merge requests' pipelines run in parallel, each on the merged result of those ahead. A failure removes that merge request and restarts the pipelines behind it; "merge immediately" restarts the train (GitLab docs).
- **Zuul.** Speculative gating that is equivalent to testing serially, with a serial worst case when everything fails. A window caps how many changes are tested at once, growing on success and shrinking on failure (Zuul docs).

Branch lookups for queue runs use the temporary branch, not `main`; a timing query filtered to `--branch main` drops every `merge_group` run.

## Queue Design: Re-prove Only Merge-Breakable Checks

The PR head already passed everything. In the queue, run only checks whose result can change on a merged tree (typecheck, build, tests on shared code, wiring, schema compatibility, image build) and skip the rest by event:

```yaml
lint:
  if: github.event_name != 'merge_group'   # PR-only: reads its own diff
typecheck:
  needs: changes                           # runs on pull_request and merge_group
```

`ci-ok` treats the skipped PR-only jobs as passed, so the same required name reports on both events. Each check removed from the queue run shortens T directly, which raises the serial ceiling and the speculation throughput together.

## Conflicts and Repair

**Make generated files merge.** Emit generated output one entry per line in sorted order, with no whole-file hash, timestamp or count in a header, so two PRs adding different entries merge cleanly instead of conflicting on every pair.

**One heal command.** Merge main, resolve conflicts that are only in generated files by regenerating, re-verify, commit. Any other conflict aborts with a distinct exit code so the caller knows to hand it to a coding agent.

```bash
#!/usr/bin/env bash
set -euo pipefail
git fetch --quiet origin main
git merge --no-edit origin/main && exit 0
conflicts=$(git diff --name-only --diff-filter=U)
if printf '%s\n' "$conflicts" | grep -qvE '^(src/generated/|pnpm-lock\.yaml$)'; then
  git merge --abort; exit 3                     # source conflict: not ours to heal
fi
printf '%s\n' "$conflicts" | xargs git checkout --theirs --
pnpm install --lockfile-only && pnpm codegen
git add -- $conflicts src/generated
pnpm typecheck && git commit --no-edit
```

**Repair and re-queue bounds.** A bot that repairs ejected PRs and re-queues them stops at 2 attempts per head and 5 per PR, counted from marker comments it leaves on the PR, so state survives restarts. It honours an opt-out label and acts only on same-repo branches. GitHub re-queues through auto-merge only after the new head passes its own checks.

**Scan ready PRs on each main push.** `git merge-tree` finds conflicts without a checkout (git 2.38 or later):

```bash
gh pr list --state open --json number,headRefName,isDraft,isCrossRepository --jq \
  '.[] | select((.isDraft or .isCrossRepository) | not) | "\(.number) \(.headRefName)"' |
git fetch --quiet origin main
while read -r n ref; do
  git fetch --quiet origin "$ref"
  out=$(git merge-tree --write-tree --name-only --no-messages origin/main FETCH_HEAD) && continue
  printf '%s %s\n' "$n" "$(printf '%s\n' "$out" | tail -n +2 | tr '\n' ' ')"
done
```

Generated-only conflicts go to the heal command; source conflicts go to a coding agent under a cap, or become a comment on the PR.

## Minimal Merge Policy

The merge path reads the repository's risk policy; it does not write it. What it needs from one:

- **Risk comes from what the change touches**: paths and diff signals (destructive SQL, a new dependency or environment variable, credentials, a deleted test, a lockfile-only or off-registry change, a very large diff) plus the task's own words. Never from the agent's confidence.
- **Read the policy at the base commit** (`git show origin/main:<policy file>`), so a PR cannot loosen its own bar.
- **CI config, lint config and agent instructions are always human tier.** An agent that can edit its own gate has no gate.
- **Low-risk changes merge automatically on green checks**; risk-tiered changes get a human. Keep some code under strict human approval and send a risk-weighted sample of automated approvals to human audit (Anthropic, 2026).

## Gotchas

- A workflow with no `merge_group` trigger: required checks never report in the queue, every group sits until the status check timeout, and every PR is ejected.
- A required check named differently on `merge_group` runs: the queue waits for a name that never reports.
- Jumping the queue rebuilds every group in flight; at depth D one jump costs up to D full runs.
- Batching on an unquarantined suite: about 1% flake per full run doubles p at a 1% real break rate, halves the useful batch, and ejects innocent PRs during bisection.
- `pull_request` workflows do not run on conflicted PRs, so a conflict bot triggered by them never sees the PRs it exists for. Scan from the main push.
- "Require branches to be up to date" alongside agents: every merge invalidates every open PR's run, and runner-minutes grow with the square of open PRs.
- `gh pr merge` without `--match-head-commit`: a push that lands after the check merges an unchecked head.
- Timing or failure-rate queries filtered to `--branch main`: `merge_group` runs live on `gh-readonly-queue/` branches and vanish from the numbers.
