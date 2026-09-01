# CI Watching

## Contents

- [Monitor Tool or Background Bash](#monitor-tool-or-background-bash)
- [Commit Watch Script](#commit-watch-script)
- [Failure Diagnosis](#failure-diagnosis)
- [The Changeset Status Check](#the-changeset-status-check)
- [Rate Limit](#rate-limit)

## Monitor Tool or Background Bash

Run the watch script below through the `Monitor` tool when the harness offers it: every stdout line arrives as an event, silence costs nothing, and the script's exit ends the watch. Pass `timeout_ms: 3600000`; the default of 300000 kills the watch after five minutes, before most CI runs finish, and the timeout reads like a quiet run. Without the Monitor tool, run the same script as a background Bash command (`run_in_background`); the completion notification carries the `TERMINAL:` line.

Do not use `/loop` or a cron for this: each tick wakes the agent whether or not anything changed.

Always stop watches you started before reporting autoship complete (`TaskStop` for a Monitor).

## Commit Watch Script

Used twice: Step 4a on the pushed changeset commit, Step 5 on the merge commit of the Version Packages PR. Scope by commit SHA, not branch, so older pushes do not bleed in and the watch does not exit when one of several parallel workflows finishes first. The release workflow itself (`changesets/action` opening or updating the Version PR) runs on the same push and is included.

```bash
SHA=$(git rev-parse HEAD)   # Step 5: the merge SHA from gh pr view --json mergeCommit
LAST=""
while true; do
  CUR=$(gh run list --commit "$SHA" --limit 20 \
    --json status,conclusion,workflowName,databaseId \
    --jq 'map("\(.databaseId)|\(.workflowName)|\(.status)|\(.conclusion // "")") | .[]' 2>/dev/null) || { sleep 30; continue; }
  if [ "$CUR" != "$LAST" ]; then echo "---"; echo "$CUR"; LAST="$CUR"; fi
  # No runs registered yet: keep waiting
  [ -z "$CUR" ] && { sleep 30; continue; }
  # Any run still in flight: keep waiting
  echo "$CUR" | grep -qv '|completed|' && { sleep 30; continue; }
  # All runs completed: classify
  if echo "$CUR" | grep -qv '|success$'; then
    echo "TERMINAL: failure"
  else
    echo "TERMINAL: success"
  fi
  exit 0
done
```

Each state change surfaces a new block; act on the first `TERMINAL:` line. Any conclusion other than `success` (`failure`, `cancelled`, `timed_out`, `action_required`, `neutral`, `skipped`, `stale`) is reported as failure so the agent inspects logs rather than spins. A transient `gh` error skips the iteration instead of ending the watch.

`gh run watch <id> --exit-status --compact` is the one-run alternative when you already have a run id and want its steps streamed; it re-prints the step table on every refresh, so keep it out of the main window.

## Failure Diagnosis

1. `gh run view <id> --log-failed` (the `databaseId` from the watch output).
2. Classify:

| Type | Indicators | Action |
|------|-----------|--------|
| Flaky test | Intermittent, passes on re-run, known flaky names | `gh run rerun <id> --failed`, restart the watch |
| Infrastructure | Network timeout, runner lost, service unavailable | `gh run rerun <id>`, restart the watch |
| Real failure | Consistent, reproducible, tied to the change | Fix, commit, push, start a fresh watch on the new SHA |
| Release workflow failed on the changeset push | Log says "not permitted to create or approve pull requests", or the action errored | Repo settings or workflow config, not code; see SKILL.md Gotchas and Failure Recovery |

Retry flaky and infrastructure failures up to 3 times, then report. The publish run (Step 5) is never retried blind; its failure table lives in `references/version-pr-and-publish.md`.

## The Changeset Status Check

Changesets repos typically run `npx changeset status --since origin/<base>` on pull requests (a step in the main CI job, or the `changesets/action/pr-status` sub-action), failing a PR that changes publishable code without a pending `.changeset/*.md`. It needs `fetch-depth: 0` on checkout; a shallow clone makes `--since` fail on every PR.

- **"Some packages have been changed but no changesets were found", exit 1:** the PR adds no changeset. Fix: Step 1 (or `npx changeset add --empty` when the change needs no release).
- **Changeset consumed:** a local `changeset version` ran, so the file is gone and `package.json` is already bumped. Fix: revert the bump and the `CHANGELOG.md` edit, re-add the changeset file, push. Rerunning CI cannot fix state that is wrong at the commit.

Read this check first when a release-related PR fails CI.

## Rate Limit

Every `gh` call spends GitHub API quota. Keep the loop `sleep` at 30 seconds or slower, and check remaining quota when calls start failing with 403:

```bash
gh api rate_limit --jq '.resources.core.remaining'
```
