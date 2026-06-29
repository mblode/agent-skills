# CI Watching with the Monitor Tool

## Table of Contents

- [Why Monitor, not /loop](#why-monitor-not-loop)
- [Watching CI on the Current Branch](#watching-ci-on-the-current-branch)
- [Waiting for the Version Packages PR to Appear](#waiting-for-the-version-packages-pr-to-appear)
- [Watching the Publish Workflow](#watching-the-publish-workflow)
- [Failure Diagnosis](#failure-diagnosis)
- [Stopping a Monitor](#stopping-a-monitor)
- [Rate Limit Awareness](#rate-limit-awareness)
- [The Changeset Status PR Check](#the-changeset-status-pr-check)

## Why Monitor, not /loop

"Monitor" is not a separate tool: run one of the watch scripts below as a background bash command (the `run_in_background` Bash option), which feeds each output line back to the agent as it arrives. The agent reacts mid-conversation, with no scheduled re-prompt and no extra context per poll. Better than `/loop` because the script controls cadence (one `sleep`), the agent sees output only on state change, and stopping is one cancellation (no cron to delete).

Use `Monitor` for every CI / PR / workflow wait in autoship.

## Watching CI on the Current Branch

After `git push`, start a Monitor that waits for every workflow run on the pushed commit to reach `completed`, then classifies the result. Scope by commit SHA, not branch, so older pushes do not bleed in and the Monitor does not exit early when one of several parallel workflows finishes first.

```bash
SHA=$(git rev-parse HEAD)
LAST=""
while true; do
  CUR=$(gh run list --commit "$SHA" --limit 20 \
    --json status,conclusion,workflowName,databaseId \
    --jq 'map("\(.databaseId)|\(.workflowName)|\(.status)|\(.conclusion // "")") | .[]')
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

Each state change surfaces a new block; stop on the first `TERMINAL:` line. Any non-`success` conclusion (`failure`, `cancelled`, `timed_out`, `action_required`, `neutral`, `skipped`, `stale`) is reported as a failure so the agent inspects logs rather than spins.

## Waiting for the Version Packages PR to Appear

`changesets/action` may take minutes to open the PR after the changeset commit lands on the default branch. Watch for it:

```bash
DEADLINE=$(( $(date +%s) + 600 ))   # 10-minute cap
while [ "$(date +%s)" -lt "$DEADLINE" ]; do
  PR=$(gh pr list --state open --search "Version Packages in:title" \
    --json number,headRefName \
    --jq '.[] | select(.headRefName == "changeset-release/main") | .number' | head -n1)
  if [ -n "$PR" ]; then
    echo "FOUND: $PR"
    exit 0
  fi
  sleep 30
done
echo "TIMEOUT"
exit 1
```

Stop the Monitor on `FOUND:` or `TIMEOUT`.

## Watching the Publish Workflow

After merging the Version Packages PR, the same workflow runs again, invoking `changeset publish`. Identify the workflow file in `.github/workflows/`, then:

```bash
WF="release.yml"   # adjust to the actual file name
LAST=""
while true; do
  CUR=$(gh run list --workflow "$WF" --branch main --limit 1 \
    --json status,conclusion,databaseId \
    --jq '.[0] | "\(.databaseId)|\(.status)|\(.conclusion // "")"')
  if [ "$CUR" != "$LAST" ]; then echo "$CUR"; LAST="$CUR"; fi
  case "$CUR" in
    *"|completed|success") echo "TERMINAL: success"; exit 0 ;;
    *"|completed|"*)       echo "TERMINAL: failure"; exit 0 ;;
  esac
  sleep 30
done
```

Pipe (`|`) is the delimiter (not tab) so `case` patterns anchor on the string end, avoiding the trailing-delimiter trap. Any conclusion other than `success` counts as failure, surfacing non-standard terminal states (`neutral`, `skipped`, `action_required`, etc.) rather than looping silently.

Do not auto-retry on publish failure; these are real (auth, OIDC, tag conflict).

## Failure Diagnosis

When a Monitor reports a failed run:

1. Read the failed logs: `gh run view <id> --log-failed`.
2. Classify the failure:

| Type | Indicators | Action |
|------|-----------|--------|
| Flaky test | Intermittent, passes on re-run, known flaky test names | `gh run rerun <id> --failed`, restart the Monitor |
| Real failure | Consistent, reproducible, related to the changes | Fix code, commit, push, restart the Monitor |
| Infrastructure | Network timeout, runner issue, service unavailable | `gh run rerun <id>`, restart the Monitor |

Retry flaky/infrastructure failures up to 3 times, then escalate to the user. Never auto-retry the publish workflow.

## Stopping a Monitor

A Monitor stops when its script exits (the examples exit on `TERMINAL:` / `FOUND:` / `TIMEOUT` lines). To cancel one mid-flight, stop the background command. Always stop monitors before reporting autoship complete.

## Rate Limit Awareness

`gh` calls count against your GitHub API rate limit. Keep Monitor `sleep` at 30s or higher. Check remaining quota if throttling is suspected:

```bash
gh api rate_limit --jq '.resources.core.remaining'
```

## The Changeset Status PR Check

Changesets repos typically run `npx changeset status --since origin/<baseBranch>` on every PR (often a step in the main CI job), verifying that a PR modifying publishable code includes a pending `.changeset/*.md` file.

Common failure modes:

- **"no changeset found":** the PR touches code but adds no changeset. Fix: run Step 1 of autoship to add one.
- **"changeset consumed":** a local `npx changeset version` ran; the changeset file is gone and `package.json` is already bumped. Fix: revert the version bump and `CHANGELOG.md` edit, re-add the changeset file, force-push. Do NOT retry CI; the state is broken at the commit level.

Read this check first when a release PR fails CI.
