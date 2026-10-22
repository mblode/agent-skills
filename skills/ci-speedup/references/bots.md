# Bots That Write

Hygiene for any bot that changes repository state: revert, repair, re-queue, re-land. A read-only report can be wrong and cheap; a writing bot that is wrong reverts innocent work on every run until someone notices.

## Reads Fail Closed

- A failed read stops the run. Retry twice with backoff, then fail the job loudly.
- Never coerce an error into an empty result: no `|| echo '[]'`, no `.items // []` over an error body, no `2>/dev/null` on a call whose result feeds a guard. An empty list of recent reverts reads exactly like "no reverts", and every guard built on that list passes.
- Re-read right before each write. State fetched at detection time is minutes old by the time the bot acts.

## One Mutate Wrapper With Dry-Run

- Every write (push, PR create, merge, close, comment, label, re-run) goes through one function that logs the action, the target and the reason.
- `DRY_RUN=1` makes that function print instead of act. Dry-run is the default outside the scheduled job.
- The decision logic is a pure function from recorded API responses to a list of intended actions. Test it on saved responses from real past episodes; the wrapper is the only side-effect seam.

## Kill Switch and Caps

- A repository variable gates every write and ships off. Off means the bot runs its reads and logs what it would have done.
- Cap attempts. The bot is stateless between runs, so count past attempts from marker comments it left on the PR (a hidden HTML comment carrying the bot name, attempt number and head SHA), and stop at the cap with a comment that names a human.

## Test That the Trigger Fires

A bot that never fires looks exactly like a healthy bot with nothing to do. After deploying, cause one real trigger and confirm the run appears; log a heartbeat line ("ran, nothing to do") on quiet runs.

- `status` event: the payload's `branches` array lists at most 10 branches containing the SHA. With many agent branches, main drops off the list and a `branches` filter skips main's own statuses. Ask the compare API whether the SHA is on main (`compare/main...<sha>` returns `identical` or `behind`).
- `pull_request` does not run on a PR with merge conflicts, so a repair bot on that trigger never sees the PRs that need it. Use `pull_request_target`, restricted to same-repository PRs (`head.repo.full_name == github.repository`). It runs with base-branch secrets: never check out or execute the PR's code in that job.
- Pushes and PRs made with the built-in `GITHUB_TOKEN` start no workflows. A revert PR opened that way never gets CI, never goes green and never merges. Use a GitHub App installation token for any write that must trigger CI.

## Least Privilege

- Set top-level `permissions:` to read-only and widen per job.
- Put the write token in `env:` on the one step that writes, not on the job. A tool installed in an earlier step should not be able to read it.
- Install lazily: decide whether there is anything to do first, then install tools in the step that needs them. A quiet run costs seconds and exposes nothing.

## Refuse a Dev Checkout

A bot that resets, cleans or force-checks-out a tree destroys uncommitted work when someone runs it locally to debug. Require an explicit workspace path the bot created and marked as its own, and exit with an error when the working tree is anything else or has uncommitted changes.

## API Budget

GraphQL allows 5,000 points per hour for a user token (GitHub docs). A bot that reads each PR with its own REST calls exhausts that at agent PR volume. Batch reads into one GraphQL query with aliases (`pr1: pullRequest(number: 101) { ... }`), request only the fields the decision uses, and include `rateLimit { cost remaining resetAt }` so the bot backs off before it is cut off mid-run.

## Gotchas

- An empty read of recent commits: the "never revert a revert" guard saw no reverts and reverted one.
- A revert PR pushed with `GITHUB_TOKEN`: no workflow started, the PR sat with pending checks, and main stayed red.
- A `status` workflow gated on `github.event.branches` containing main: once the SHA was on more than 10 branches, main fell off the payload and the bot stopped firing with no error.
- A repair bot on `pull_request`: conflicted PRs, the only ones it existed for, never triggered it.
