# Main Health

How to detect a red main branch, attribute it to a commit, revert it safely and hand the re-land to an agent. Main-red minutes per week is R, the budget this file defends.

## Contents

- Classify before you count
- Detect
- Attribute: walk back per check
- Bisect when the range is wider than one commit
- Auto-revert: deterministic checks only
- Revert guards
- Re-land
- Dry-run a revert bot on past episodes
- Measure R
- Gotchas

## Classify Before You Count

A red mark on a commit is not a verdict. Classify every failing check before it opens an episode, blames a commit or triggers a revert.

| Signal | What it is | Action |
|---|---|---|
| Actions conclusion `cancelled`; a commit status whose description says canceled | No verdict. Commit statuses have no cancelled state, so an external CI reports a cancelled build as `failure` and says so only in the description; the commit's rolled-up check state shows it red too | Skip it. Read the conclusion or the description, never the red mark |
| Exit -1 (runner or agent lost), 125 (container runtime failed), 128 (git or checkout failed), 137 (killed, usually out of memory) | Infrastructure | Retry. Never revert, never blame the commit |
| `startup_failure`, billing or spending-limit annotation, job with no steps run | Could not start | Not red code. Fix the account or the workflow file |
| `schedule` run (nightly) | Runs on whatever main is at that hour | Not a merge verdict. It never opens an episode or attributes a commit |
| `failure` on a check with recorded flakes | Possibly red code | Attribute with flake-aware bisection; never auto-revert |
| `failure` on a deterministic check | Red code | Attribute, then revert under the guards |

Count only the last two rows as red. Everything else is a gap in the evidence, and the attribution walk steps over it.

## Detect

Detection needs a finished run on as many main commits as possible.

- Main runs coalesce: a newer push queues behind the running one, and a started main run is never cancelled. A cancelled main run is a commit with no verdict, which widens every later attribution range.
- Read push runs on main only. `merge_group`, `pull_request` and `schedule` runs answer different questions.
- `scripts/ci-health.sh --since <date>` lists red episodes per workflow (first failure after a green, until the next green), the cancelled runs inside each, and whether the last green commit is the first red commit's direct parent.
- Alert on the episode, not on each failing run. One breakage on a busy branch produces a red run per later push.

## Attribute: Walk Back per Check

Attribute each failing check separately. Two checks red on the same tip can have two different culprits.

1. Start at the first commit where check C finished red.
2. Walk first-parent history (`git rev-list --first-parent <red-sha>`) back to C's last FINISHED run.
3. Skip commits where C was cancelled, failed on infrastructure, or never reported (path-filtered or coalesced away).
4. If that last finished run was red, main was already red on C. This is not a new breakage: do not revert and do not open a second hand-off.
5. If it was green and it is the direct parent of the first red commit (compare API `ahead_by == 1`), that commit is the culprit.
6. If it was green but further back, report the range (`git log --first-parent <good>..<red>`) and bisect. Never revert the tip of a range: the tip is usually innocent, it just carried the first finished run.

## Bisect When the Range Is Wider Than One Commit

Coalesced main runs leave commits with no verdict, so ranges are normal at merge rate. Re-run check C on the midpoint commit: locally in a worktree for a deterministic check, or by pushing a throwaway branch at that SHA where the workflow triggers on it.

Plain bisection trusts every result, so one flaky pass sends it down the wrong half. Flake-aware bisection keeps a probability for each candidate commit, re-runs where the result tells it most, and stops at a confidence threshold. Over 13.6K breakages it found the culprit in 97.5% of the ranges that held one, against 96.1% for plain bisection that runs each test once, and about 40% of breakages had no culprit at all: the failure was a flake (Google, 2023). A bisection that names no commit is a valid answer; route it to flake handling instead of forcing a revert.

Chromium's LUCI Bisection is the public precedent for doing this at scale: it finds culprits for compile and test failures, opens the revert automatically, lets the revert skip presubmit, and puts a dispute link in the revert so the author can push back.

## Auto-Revert: Deterministic Checks Only

A check may drive auto-revert only if the same tree gives the same result every time. Keep an explicit allowlist:

- Allowed: typecheck, compile and build, lint, dead-code scan, import-cycle check, dependency-injection wiring check, generated-file drift.
- Never: unit, integration and e2e tests, evals, performance budgets, anything that touches the network or a shared service.

The trigger condition is narrow: check C failed on commit X, C passed on X's direct parent, and C is on the allowlist. A bisection result qualifies once C has been re-run red on X and green on X's parent, which is the same evidence. Everything else gets a report and an agent hand-off, not a revert.

## Revert Guards

Every guard runs immediately before each write, against fresh reads, not against state cached at detection time.

- Never revert a revert, a merge commit, a fix-forward (a commit that names the failing check or the previous culprit) or a PR that opted out with a label.
- Never reopen a closed revert PR. A human closed it on purpose.
- Open nothing if any later commit already has C green: someone fixed forward.
- Auto-merge the revert only while the main tip is still red on C. Re-read the tip right before merging.
- Reverts that touch risky paths (migrations, infrastructure, CI config, deploy config) open as PRs for a human to merge.
- Close stale revert PRs once main is green on C without them.
- The kill switch ships off. Until someone turns it on, the bot logs what it would have reverted and writes nothing.

## Re-Land

Every attributed breakage, reverted or not, becomes exactly one re-land task for an agent, keyed on (check, culprit SHA), carrying the culprit evidence and the revert PR or the guard that fired. When main was already red on that check at the previous finished run, the breakage already has an owner and no new task opens.

## Dry-Run a Revert Bot on Past Episodes

Before the kill switch goes on, replay history.

1. `scripts/ci-health.sh --since <90 days ago> --json > episodes.json` for the episodes, first-bad and last-good SHAs, and parent flags.
2. For each episode, run the bot in dry-run against the state as it was at the episode's start: only runs that had finished by then. A bot that reads the present sees the fix and looks better than it is.
3. Compare what it would have done with what actually ended the episode (the human revert or the fix-forward commit). Count culprits matched, innocent commits reverted, ranges correctly left to bisection, and reverts that would have landed after main was already green.
4. Ship only with zero innocent reverts in the replay. One innocent revert in production costs more trust than every correct one earns.

## Measure R

R is main-red minutes per week: the union of red time across workflows, from the first failing run finishing to the next green run finishing. `ci-health.sh` prints it per week. Split each episode into detect (bad commit merged to first red run finished), attribute (red to culprit known) and revert (culprit known to green). The largest of the three is where the next fix goes. Track R per week in the ledger next to revert count and innocent-revert count; a falling R with rising innocent reverts is a worse system, not a better one.

## Gotchas

- Opening the revert PR without re-reading the tip: the revert landed after a fix-forward had already turned main green, and broke the fix.
- Treating the first red commit as the culprit when its parent's run had been cancelled: attribution blamed the tip of a range for a breakage two commits earlier.
- Counting cancelled runs as failures: every coalesced or superseded run becomes a red episode, R inflates, and the wrong PR gets blamed.
- Retrying a red deterministic check: it fails again, and the retry only delays detection.
- Auto-reverting on an e2e failure: a flake reverts an innocent PR, the re-land passes unchanged, and the flake stays hidden.
- Nightly red read as a merge verdict: the nightly ran on a tree no PR was ever tested against, so blaming the last merge is a guess.
