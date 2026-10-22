# Flake Policy

A flaky check is one that has both passed and failed on the same SHA. Nothing else counts: a test that fails on one commit and passes on the next may be a real break that the next commit fixed. Same tree, two verdicts, is the whole definition.

## Contents

- How common flakes are
- Measuring flakes from history
- Quarantine
- Retry budget
- Deflake before batching or bisecting
- What agents need
- Gotchas

## How Common Flakes Are

- About 16% of Google's tests showed some flakiness, about 1.5% of all test runs reported a flaky result, and about 84% of observed pass-to-fail transitions involved a flaky test (Google, 2016).
- Slack took main-branch stability from 19.8% to 96% and test-job failures from 56.8% to 3.9% by detecting flakes automatically and disabling them (Slack, 2022).

The 84% is the number to carry: when most pass-to-fail transitions involve a flaky test, a policy that treats every red as a code failure spends most of its effort on noise.

## Measuring Flakes from History

Measure, don't ask. People remember the flake that cost them an afternoon, not the base rate.

1. Collect job results keyed by (check, SHA) over two to four weeks of PR, merge-queue and main runs. Include reruns: on GitHub a rerun keeps the SHA and raises `run_attempt`.
2. A (check, SHA) pair with at least one pass and at least one fail is a flake observation. `scripts/ci-health.sh` lists these candidates for the default branch.
3. Count a rerun that turned a failure green as flake evidence, never as a pass. A suite that agents rerun until green has its flake rate hidden inside the rerun rate; record that rate per check next to the flake count.
4. Rank checks by flake observations per 100 runs. The top few usually account for most of the noise; fix or quarantine those first.
5. Drop observations whose failing attempt was an infra exit (lost runner, Docker failure, checkout failure, OOM kill). Those are infrastructure, handled under the retry budget, not test flakes.

## Quarantine

Quarantine stops a flaky test from running in the blocking lanes. It does not hide its result.

- **Disable execution, never results.** Slack's first attempt filtered flaky results out of the verdict; real failures leaked into main because a newly broken test looked like a known flake. Disabling the test itself (a skip annotation or a renamed test) worked (Slack, 2022).
- **Through a pull request.** The quarantine is a reviewable diff that disables one named test, so it shows in history, can be reverted, and runs through the same gate as any change. A bot may open it; a human or a merge policy approves it like any other PR.
- **Owner, expiry and ticket.** Each quarantined test carries the owning team, a ticket, and an expiry date in a comment beside the skip. On expiry the test is fixed, deleted, or re-quarantined with a new date by its owner. A quarantine with no expiry is a deletion nobody approved.
- **Keep running it off the merge path.** Run quarantined tests in the nightly lane so the owner sees whether the fix holds. A nightly red is not a merge verdict.
- **Cap it.** Track the quarantined count in the ledger. A rising count means the suite is decaying behind the policy.

`continue-on-error: true` is never a quarantine. It turns the whole job advisory, so every test in it stops blocking, the next real failure goes green, and nobody owns it.

## Retry Budget

Automatic retries cover infra exits only: the runner was lost, the container runtime failed, the checkout failed, or the process was killed for memory. One retry per job attempt, logged with the exit reason.

A test assertion that fails gets no automatic retry. Retrying it converts a flake into a silent pass and deletes the evidence the measurement step needs. A single manual rerun on one PR is fine when it is recorded: it is the same evidence, counted in the rerun rate.

Exit 137 is SIGKILL, usually the kernel's OOM killer. When several agent worktrees run suites on one machine, or one job runs many workers, 137 is memory pressure, and a retry lands on the same pressure. Cap workers, cut memory per worker, or move CI off the machine running agents. Retrying 137 makes the symptom intermittent instead of fixing it.

## Deflake Before Batching or Bisecting

Both batching and bisection assume a failure means a bad change.

- **Batching.** A queue that tests B changes together and splits the batch on failure treats a flake as a broken change: it bisects a good batch, ejects innocent PRs, and re-runs everything behind them. The gain from batching depends on a low failure rate, and flakes raise that rate on every run.
- **Bisection.** A bisect that hits a flake on a good commit names the wrong culprit and sends a revert to an innocent author.

So quarantine the top flakes and measure the remaining rate before sizing a batch or turning on automated culprit finding. If flakes remain, the bisect must re-run each step enough times to tell a flake from a break.

## What Agents Need

An agent that sees a red check has three moves: fix the code, rerun, or report. Without flake data it guesses, and it usually reruns until green.

Give it a way to ask "is this a known flake":

- A machine-readable list of quarantined and known-flaky tests in the repository (one file, or an issue label the agent can query), with the ticket for each.
- The rule in the instruction file: a failure in a listed test is reported against its ticket, not fixed or rerun; a failure in an unlisted test is treated as real until the same SHA passes.
- One recorded rerun per head at most, so the rerun rate stays a measurement.

## Gotchas

- Filtering flaky results out of the verdict: a newly broken test looks like a known flake and real breakages reach main.
- Exit 137 retried as a flake: the OOM from parallel worktrees stays, and the next run dies at the same point.
- `continue-on-error: true` on a test job: every test in it stops blocking, not only the flaky one.
- Rerun-until-green counted as a pass: the flake rate reads zero while the rerun rate climbs.
- A quarantine with no expiry: the test is deleted in practice with no owner deciding it.
