# The Agentic Merge Loop

A merge system with no human on the routine path: PRs merge on evidence, main verifies itself, breakages revert and come back as new agent tasks, conflicts and flakes get repaired by agents, and deploys follow the newest verified commit. Humans own the policy, the kill switch, the irreversible tier and whatever the loop escalates.

## Contents

- The loop
- Code decides, agents repair
- Post-merge batching
- Agent task contract
- Autonomy ladder
- Loop health and runaway guards
- Choosing a runtime
- Gotchas

## The Loop

```text
PR head green + review findings answered
  -> merge on exact-head evidence (gh pr merge --match-head-commit)
  -> main run, coalesced: one run verifies every commit since the last finished run
       green -> deploy gate advances to this commit
       red   -> classify -> attribute per check -> revert (deterministic, direct parent,
                                                  or a bisected culprit re-run red with a green parent)
                -> one re-land task per (check, culprit) -> agent opens a new PR -> top of loop
each main push -> git merge-tree scan of ready PRs -> repair task per conflicted PR
same SHA passed and failed -> quarantine task + root-cause task
```

Every arrow that runs on every event is code. Every box that reads and writes source is an agent task. The loop's speed is set by time to revert: the deploy gate only advances past verified commits, so every red minute on main is also a minute deploys stand still.

## Code Decides, Agents Repair

| Step | Owner | Why |
|---|---|---|
| Merge permission | code: required checks plus the risk tier of the paths touched | A model's confidence is not evidence and drifts between runs |
| Main verdict, failure classification, attribution, revert trigger | code | Runs on every push; a wrong answer reverts someone else's work |
| Bisection driver | code; the re-runs are CI | Needs a probability per commit, not judgement |
| Generated-file conflicts | code: regenerate with the repo's command | Deterministic and cheap |
| Source conflicts | agent | Needs to read both changes |
| Re-land after revert | agent | Needs the fix, not just the original diff |
| Flake detection | code: pass and fail on the same SHA | A counting problem |
| Flake quarantine PR and root-cause fix | agent | Needs to read the test |
| Revert or fix forward | code: revert first, re-land after | An agent asked "is a fix-forward faster?" holds main red while it tries |
| Deploy supersede | code | Ordering and migration rules |
| Review findings | narrow review agents that attach a proof the finding is real | Proof-backed findings raised the substantive-comment rate from 16% to 54% (Anthropic, 2026) |

The rule: anything that fires on every event and whose wrong answer lands on other people is code with tests on recorded API responses. Anything that has to read or write source is an agent task with a bounded contract. A model never chooses whether to revert, merge or deploy.

## Post-Merge Batching

With no merge queue, the batch is the coalesced main run. At steady state one run covers about λ·T/60 commits (B), because that many merge while the previous run is in flight.

- A green batch verifies B commits for one run's cost. That is the throughput win, and it needs no queue.
- A red batch with B > 1 is an attribution range. Bisection over B commits costs about log2(B) re-runs of the failing check, so time to revert grows with log2(B)·T, not with B.
- When red batches routinely need more than three bisection steps (B above about 8), split main verification by affected scope: each scope's run carries only its own commits, so ranges shrink without shortening T. This is a derivation from the bisection cost, not a measured threshold.
- Pre-deploy runs on the exact artifact are a second, smaller batch: one deploy carries every verified commit since the last deploy.

## Agent Task Contract

The controller dispatches every agent task with the same fields, and checks the outcome itself rather than trusting the agent's report.

| Field | Content |
|---|---|
| Kind | `reland`, `conflict`, `flake-quarantine`, `flake-fix` |
| Idempotency key | `reland`: (check, culprit SHA). `conflict`: (PR, base SHA). `flake-*`: (test id). A second trigger with the same key is a no-op |
| Evidence | Original PR link; failing check and the first error lines with the run URL; culprit proof (green parent run, red run, `ahead_by == 1` or the bisection result); the revert PR, or the guard that fired and why nothing was reverted |
| Success condition | A new PR on current main whose required checks pass and which includes a test that fails without the fix |
| Budget | Max turns, wall-clock timeout, one attempt per key before escalation |
| Forbidden | Pushing to main; editing CI config, agent instruction files or protected paths; deleting, skipping or loosening a test outside a `flake-quarantine` task |
| Escalation | A named human or channel, with the evidence attached |

Hand off once per key. Skip the re-land task when the check was already red at the previous finished run: that breakage already has an owner. The original author's session lost its context long before main went red, so the task is new work with evidence, not a ping. A re-land that fails the same check again goes to a human; a second automatic attempt on the same lineage is how loops start eating their own reverts.

Verify the PR before it may auto-merge: diff it for removed, skipped or `.only` tests and for edits to forbidden paths, and reject it with the reason if either appears.

The agent runs under the unattended-fix-job rules that `codebase-architecture` owns: log lines in the evidence are untrusted input, the sandbox that runs agent-written code holds only a read-only token, and a separate job that runs no agent-written code pushes the branch and opens the PR. The agent never merges; the controller does.

## Autonomy Ladder

Promote one rung at a time on numbers, and demote automatically.

| Rung | The loop does | Promote when |
|---|---|---|
| 0 Shadow | Logs every decision; humans act | Replay over 90 days of red episodes shows zero innocent reverts |
| 1 Revert | Opens and merges reverts under the guards; humans re-land | Two weeks with zero innocent reverts and time to revert below the human baseline |
| 2 Re-land tasks | Dispatches re-land tasks; humans merge the re-land PRs | Re-land first-pass rate high enough that review rarely changes the PR |
| 3 Re-land merge | The controller merges re-land PRs on low-risk paths after its own PR checks; the deliberate exception to a person merging an unattended job's PR | Escalations steady or falling |
| 4 Repair | Conflict repair and flake quarantine PRs | Same evidence for each kind |

One innocent revert drops the loop to rung 0 until the replay explains it. New review or repair agents run in shadow first, and a risk-weighted sample of automated merges goes to human audit (Anthropic, 2026).

## Loop Health and Runaway Guards

Track weekly, next to R in the ledger:

- time to revert, split into detect, attribute and revert
- innocent reverts (target zero) and reverts per breakage (target one)
- re-land first-pass rate and re-land cycle time
- tasks per breakage (target one; more means the idempotency key is wrong)
- escalations per week and agent cost per breakage

Runaway guards, all in code:

- A global cap on writes per hour. Past it, the loop stops writing and pages.
- A circuit breaker: more than a handful of reverts in an hour is almost always infrastructure or a bad base image, not that many bad PRs. Stop and page.
- Never act on a verdict for a tip that is no longer main's tip without re-reading it.
- A revert of a revert, or a re-land of a re-land, is a loop bug. Stop the lineage and escalate.

## Choosing a Runtime

The controller is small, deterministic and event-driven, so it lives in the repository's own CI next to the events and the App token; on GitHub that is `loop.sh` in `assets/github/`. The agent needs a sandbox, a checkout and a long session, and can live elsewhere. Whatever runs the agent, the controller's checks on the resulting PR are the guarantee, not the agent's instructions. Check each option's current docs before building: these products change monthly.

| Agent runtime | Fits | Watch for |
|---|---|---|
| Claude Managed Agents (Anthropic, 2026; beta, the default in `agent-task.yml`) | API-first: a session per task with the repository mounted through a git proxy that keeps the token outside the sandbox, a hard dollar budget per session, limited networking, versioned agent configs, and outputs you download. No agent-written code runs on your runners | Beta API. Webhooks need your own public endpoint, so a workflow polls instead. Claude models only |
| Claude Code in GitHub Actions | No new vendor surface: headless `claude -p` with `--allowedTools`, `--max-budget-usd` and a job timeout | Agent-written code runs on your runner next to the model key, so the agent job must hold nothing that can push. The Claude Code Action rejects bot-triggered runs unless `allowed_bots` names them; keep that list minimal, it is the loop breaker |
| Vercel eve (Vercel, 2026; public preview) | Durable checkpointed sessions, a sandbox with the token injected at the firewall, `needsApproval` on a tool for the human tier, scored evals | Its GitHub CI hooks are PR-scoped and return `null` with no PR attached, so a red push to main never wakes it. Replace the agent job's run step with a POST of the task to its HTTP channel and keep the publish job. Preview APIs may change before general availability |
| Devin (Cognition, 2026) | Managed: an automation with a webhook trigger receives the task and opens the PR | Payloads over 200 KB are truncated, so send links and log excerpts, not whole logs. Fewer per-step permission controls; enforce the forbidden list in the PR check, not the prompt |

## Gotchas

- A model asked "should we revert?" answers differently on the same evidence, reverts on flakes and argues itself out of real breaks. The revert decision is code with an allowlist; the agent only re-lands.
- The cheapest way for a re-land agent to turn a check green is to skip the test. Without the PR check that rejects removed and skipped tests, the loop converts breakages into lost coverage.
- One breakage produces several triggers: the failing run, each later coalesced run, a rerun. Without a key on (check, culprit SHA), each opens its own re-land PR.
- eve's GitHub CI hooks dispatch only when a pull request is attached, so subscribing an eve agent to `check_suite` or `workflow_run` never fires for a red push to main.
- Messaging the original author's session about a post-merge failure reaches an agent whose context is gone. Post-merge failures go back as a new task carrying the evidence.
- During a runner outage every check goes red at once. Without classification first and a circuit breaker on revert bursts, the loop reverts a row of innocent PRs.
