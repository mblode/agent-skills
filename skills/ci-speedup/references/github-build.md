# Building the Loop on GitHub

The reference implementation of the merge loop on GitHub Actions, shaped after the system Anthropic runs at 30,000+ merges a day (Anthropic, 2026): no merge queue, testing after merge and before deploy, automated bisect and revert, Claude repairing conflicts, read-only agents watching the system, narrow review agents that must prove their findings, risk tiers and a sampled human audit. The templates are in `assets/github/` and copy into a repository's `.github/` as they are.

## Contents

- Anthropic's design, mapped to GitHub
- What gets installed
- Setup order
- How the controller keeps state
- Cost and checkout speed
- Verifying an install
- Gotchas

## Anthropic's Design, Mapped to GitHub

| Anthropic | GitHub build |
|---|---|
| No merge queue; changes merge on their own evidence | Ruleset: one required check `gate`, "up to date" off, squash only, linear history. Authors enable auto-merge (`gh pr merge --auto --squash`), which merges the head whose checks passed. No merge queue |
| Post-merge automated testing | `main-verify.yml` on every push to main, in a concurrency group without `cancel-in-progress`: pushes that land mid-run collapse into one pending run, so each run verifies every commit since the last one |
| Automated bisect and revert | `merge-loop.yml`: classify the failed jobs, walk back to the last run where that check passed, run the check on every commit in the range at once, revert the first red commit with a green parent through a PR on auto-merge |
| Re-land after revert | When a revert PR merges, an `agent-task` re-applies the change on main, fixes it, and opens a new PR |
| Claude fixes merge conflicts | Each merge triggers a scan of auto-merge PRs that GitHub marks conflicting; an `agent-task` merges main into each and resolves it |
| Pre-deploy automated testing | `deploy.yml` runs on each green `main-verify` and builds, smoke-tests and releases that exact commit; superseded pending deploys drop, so a backlog deploys the newest verified commit |
| Claude "superfans" watching components | `superfan.yml`: an hourly read-only agent that compares loop health with the previous week and writes to one issue |
| Narrow review agents that write a proof; new reviewers run in shadow | The `review` job in `pr.yml`, outside `gate` until its findings hold up |
| Humans review intent; per-directory permissions | `CODEOWNERS` lists only high-risk paths and the ruleset requires code-owner review. Approvals required: 0, so routine changes and the loop's own PRs merge without a person. Anthropic has a human read every change for intent; to match that, set `required_approving_review_count` to 1 and accept that every revert waits for a click |
| Risk tiers with strict human approval | `risk.high_paths` in `merge-loop.json`: the controller escalates instead of reverting a high-risk culprit, and re-lands touching those paths never auto-merge |
| Human audit of a risk-weighted sample | `audit-sample.yml`: weekly, merges with no human approval sampled by lines changed, filed as one issue |
| Checkouts in seconds | Controller jobs use sparse checkouts of `.github`, checks use depth 1, history jobs use blobless clones; see Cost and checkout speed |

## What Gets Installed

`assets/github/` maps file-for-file onto `.github/`:

| File | Does |
|---|---|
| `merge-loop.json` | The one config: checks (command, PR command, `deterministic`), deploy commands, high-risk paths, paths agents may not touch, test-file patterns, rate limits, bot logins for the audit, who to escalate to |
| `merge-loop/loop.sh` | The controller. Every decision and every write, gated by the rung; `loop.sh help` lists the commands |
| `workflows/pr.yml` | PR gate: one `check (<name>)` job per config check, the guard on the loop's agent PRs, the shadow review, and `gate` |
| `workflows/main-verify.yml` | Post-merge verification, coalesced |
| `workflows/merge-loop.yml` | Attribute, bisect, act; re-land dispatch after a revert merges; conflict scan after each merge |
| `workflows/agent-task.yml` | One agent task (reland, conflict, flake) in two jobs: the agent with a read-only token, then a publish job that checks the change and pushes with the App token |
| `workflows/deploy.yml` | Deploy verified commits only |
| `workflows/superfan.yml`, `workflows/audit-sample.yml` | Watching and sampling |
| `actions/setup/action.yml` | The toolchain every job uses; replace with the repository's |
| `ruleset.json`, `CODEOWNERS` | Branch rules and the human tier |

The job name `check (<name>)` and the step name `check` are the controller's contract: a failure in any other step is infrastructure, which earns one fresh `main-verify` run of main and never a revert. Keep both names when adapting the workflows.

## Setup Order

1. Measure first: `ci-flow.sh` and `ci-health.sh` give the baseline the ledger needs, and `ci-health.sh --flake-runs` decides which checks are `deterministic`. A check that ever passed and failed on the same SHA is not.
2. Copy `assets/github/*` into `.github/`. Edit `merge-loop.json` (one entry per check), `actions/setup/action.yml`, `CODEOWNERS` and the deploy commands. Delete the old CI workflows the new ones replace, in the same PR.
3. The user's call, each: create a GitHub App with Contents, Pull requests and Issues read and write, install it on the repository, and store `MERGE_LOOP_CLIENT_ID` as a variable and `MERGE_LOOP_PRIVATE_KEY` and `ANTHROPIC_API_KEY` as secrets. Then the repository settings:

   ```bash
   gh repo edit --enable-auto-merge --enable-squash-merge --enable-merge-commit=false \
     --enable-rebase-merge=false --delete-branch-on-merge
   gh api "repos/$REPO/rulesets" --method POST --input .github/ruleset.json
   ```

   Remove any older branch protection that requires branches to be up to date or uses the merge queue; both serialise merges.
4. Run at rung 0 (the default) and read each `merge-loop` run's job summary: every decision it would have made, with the reason. Replay past red episodes locally, since attribution only reads history: `GH_REPO=owner/name bash .github/merge-loop/loop.sh attribute <run-id>` for each red `main-verify` run that `ci-health.sh` lists, then compare the culprits with what humans reverted.
5. Promote one rung at a time with `gh variable set MERGE_LOOP_RUNG --body 1`, on the evidence `merge-loop.md` lists per rung. `--body 0` is the kill switch.
6. Turn on the watchers: `gh variable set MERGE_LOOP_SUPERFAN --body on`, and the review agent with `MERGE_LOOP_REVIEW=on`. Add `review` to `gate`'s `needs` only once its findings stay real for a few weeks.
7. Add protection rules to the `production` environment for the human tier of deploys.

## How the Controller Keeps State

There is no database; GitHub holds the state and every key is visible:

- **Branch names are idempotency keys.** `merge-loop/revert-<check>-<sha12>`, `merge-loop/reland-<check>-<sha12>`, `merge-loop/flake-<check>-<sha12>`. The controller looks up PRs with that head in any state before writing, and the branch push is the lock: a second run racing on the same culprit loses the push and stops.
- **PR bodies carry lineage.** A `<!-- merge-loop {...} -->` marker records kind, check, culprit and the original PR, which is how a revert of a revert and a re-land that breaks again are recognised and stopped.
- **One open issue per check means a human owns it.** `merge-loop: <check>` is created on escalation, and while it is open the controller leaves that check alone. Closing the issue hands the check back.
- **Labels track per-PR repair.** `merge-loop:conflict` once a repair was dispatched, `merge-loop:escalated` once it failed; a scan skips any PR whose `agent-task` run is still going.
- **Nothing stalls silently.** A revert closed unmerged, a revert or flake PR open for over an hour, a branch pushed with no PR, and a revert that left the check red each open the check's issue.
- **The rung is a repository variable**, read on every run.

## Cost and Checkout Speed

Anthropic's biggest single win was making checkouts cheap. On GitHub:

- Jobs that only read config or call the API check out `.github` alone (`sparse-checkout: .github`); the controller reads ranges, jobs and files through the API, never by walking history locally.
- Check jobs use the default depth-1 checkout. Only jobs that revert or merge need history, and they use `filter: blob:none`, which fetches blobs on demand.
- Bisection runs the failing check on every commit in the range in parallel: wall-clock is one run instead of log2(B) sequential runs, cost is B runs instead of log2(B). `limits.bisect_max` caps it; above the cap the controller escalates.
- Every job has `timeout-minutes`; the agent job also has `max_budget_usd`.

## Verifying an Install

Prove the loop on a throwaway repository before the real one:

1. Install the templates with trivial checks (a `test.sh` that fails when two marker files both exist).
2. Open two PRs that each add one marker file, wait for both gates, and merge both. Each is green alone; main goes red at the second.
3. Expect, at rung 0: `main-verify` red on the second commit; `merge-loop` `attribute` naming check `test` with the range since the last green run; `bisect` over the range; the job summary deciding `revert` with the second commit as culprit.
4. At rung 1: a `merge-loop/revert-test-<sha12>` PR opens, passes `gate`, auto-merges; `main-verify` goes green; `deploy` runs for that commit and skips the red one; the original PR gets the re-land comment. Running `act` a second time reports the open revert and writes nothing.
5. Without an App yet, rungs 1 to 3 can be exercised from a laptop: `GH_REPO=... MERGE_LOOP_RUNG=1 LOOP_TOKEN=$(gh auth token) bash .github/merge-loop/loop.sh act final.json`, with `final.json` from `decide` over the run's downloaded artifacts.

## Gotchas

- Pushes and PRs made with `GITHUB_TOKEN` start no workflows, so a revert opened with it never runs `gate` and never auto-merges. Everything that pushes or opens a PR uses the App token; only `workflow_dispatch` and reads use `GITHUB_TOKEN`.
- A revert removes the tests the culprit added, so the guard that rejects removed tests must skip `merge-loop/revert-*` branches, as `pr.yml` does.
- Quarantining with `it.skip(` changes the line rather than deleting the case; a test-case pattern that only matches `it(` counts that as a removed test. The default `case_regex` allows modifiers.
- `grep -q` at the end of a pipe under `set -o pipefail` can exit before the writer finishes; the writer dies of SIGPIPE and the match reads as a failure. Redirect to `/dev/null` instead.
- GitHub reports `mergeable` as `UNKNOWN` until it has computed it after a push; the conflict scan skips those and the next merge's scan picks them up.
- A code owner who authors a PR does not have to approve it: with required approvals at 0, a high-risk PR from its own code owner merged on `gate` alone in the live test. The human tier holds only for PRs authored by agents or by people outside the owning team; confirm GitHub shows "Review required" on an agent's PR touching an owned path before relying on it.
- Two `gh pr merge` calls in quick succession can fail with "Merge already in progress" while the merge still happens. Re-read the PR state before treating it as a failure.
- The agent can rewrite every file its job wrote, including any metadata saved for later steps. `publish` takes only the git bundle from the agent job and rebuilds kind, check, culprit, PR and branch from the dispatch inputs, and `pr.yml` runs the guard from the base commit, so an agent PR cannot loosen its own check.
- Re-running an old `main-verify` run re-enters its concurrency group and cancels the pending run, and a re-run that finishes green after a newer deploy would ship an older commit. The controller dispatches a fresh run of main for infrastructure failures, and `deploy.yml` skips a commit that a newer verified run already contains.
- The concurrency group on `main-verify` cancels the superseded pending runs, so the run list shows cancelled runs on main. They are coalescing, not failures; the controller counts only success and failure.
