# Monitoring Setup

Watch setup for monitor mode: the Monitor tool watch script (primary), CronCreate config (fallback), state file format, and lifecycle.

## Contents

- [Monitor Watch Script](#monitor-watch-script)
- [Schedule Patterns (cron fallback)](#schedule-patterns-cron-fallback)
- [CronCreate Prompt Template (cron fallback)](#croncreate-prompt-template-cron-fallback)
- [State File Format](#state-file-format)
- [Auto-Detection Defaults](#auto-detection-defaults)
- [Stopping](#stopping)
- [Session Lifecycle](#session-lifecycle)

## Monitor Watch Script

When the Monitor tool is available, start it with `persistent: true` (the watch must outlive the default timeout) and the script below. Monitor commands run under the same permission rules as Bash.

The script polls, fingerprints PR state, and emits one line only when the fingerprint changes. It never fixes or classifies anything; on each emitted line, run phases 2-5 (they diff against the state file for the detailed comparison and write it back).

Substitute `{N}`, `{owner}`, `{repo}`, and the interval (default 120 seconds; respect inline overrides like "poll every 5 minutes"):

```bash
PR={N}; OWNER={owner}; REPO={repo}; INTERVAL=120
prev=""
while true; do
  view=$(gh pr view "$PR" --repo "$OWNER/$REPO" \
    --json state,headRefOid,mergeable,mergeStateStatus,reviewDecision 2>/dev/null) \
    || { sleep "$INTERVAL"; continue; }
  state=$(jq -r .state <<<"$view")
  if [ "$state" != "OPEN" ]; then echo "TERMINAL: PR $state"; exit 0; fi
  checks=$(gh pr checks "$PR" --repo "$OWNER/$REPO" --json name,state 2>/dev/null \
    | jq -c 'sort_by(.name)')
  threads=$(gh api graphql \
    -f query='query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100){nodes{isResolved}}}}}' \
    -f o="$OWNER" -f r="$REPO" -F n="$PR" 2>/dev/null \
    | jq '[.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved | not)] | length')
  fp="$(jq -r '[.headRefOid,.mergeable,.mergeStateStatus,.reviewDecision] | join("|")' <<<"$view")|$checks|threads=$threads"
  if [ -n "$prev" ] && [ "$fp" != "$prev" ]; then echo "CHANGED: $fp"; fi
  prev="$fp"
  sleep "$INTERVAL"
done
```

Emitted lines:

| Line | Meaning | React by |
|------|---------|----------|
| `CHANGED: {fingerprint}` | Head SHA, mergeability, review decision, a check state, or the unresolved thread count changed | Run phases 2-5 |
| `TERMINAL: PR MERGED` / `TERMINAL: PR CLOSED` | PR left the OPEN state; the script exits and the watch ends | Report the final summary, stop |

Transient `gh` failures skip the iteration and retry next interval; they never emit.

## Schedule Patterns (cron fallback)

Cron fallback only. With the Monitor tool, the interval is the script's `INTERVAL` sleep (default 120 seconds).

| User intent | Cron expression | Notes |
|-------------|-----------------|-------|
| Every 2 minutes (default) | `*/2 * * * *` | Default: responsive polling for active PRs |
| Every 5 minutes | `*/5 * * * *` | Lower API usage for stable PRs |
| Every 10 minutes | `*/10 * * * *` | Minimal polling |
| Every 15 minutes | `*/15 * * * *` | Background monitoring |
| Every hour | `7 * * * *` | Use off-minute (`:07`) to avoid jitter on `:00` |

Prefer off-minute scheduling: CronCreate jitters tasks at `:00` and `:30`. For hourly+ intervals pick a minute like `3`, `7`, or `13`.

Recurring tasks auto-expire after 3 days; re-run `/pr-babysitter` to restart if the PR is still open.

## CronCreate Prompt Template (cron fallback)

```
Check PR #{N} in {owner}/{repo}. Run pr-babysitter monitor phases 2-5:
1. Check for merge conflicts (gh pr view --json mergeable) and resolve if possible
2. Check CI/CD status (gh pr checks) and diagnose any failures. Use Buildkite auth fallback chain if needed.
3. Check for new review comments and triage autonomously if needed (no plan approval; fix and resolve directly)
4. Evaluate merge readiness and notify me of any state changes
State file: .claude/scratchpad/babysit-pr-{N}.md
Auto-resolve noise: yes
Auto-merge: no
```

## State File Format

Write to `.claude/scratchpad/babysit-pr-{N}.md`. Create the directory if needed.

```markdown
# Babysit PR #{N}

**PR:** {title} (#{N})
**URL:** {pr_url}
**Branch:** {head_branch} → {base_branch}
**Watch:** {monitor|cron} ({id})
**Started:** {timestamp}
**Last Poll:** {timestamp}

## Preferences

- Auto-resolve noise: yes
- Auto-merge when ready: no
- Poll interval: every 2 minutes

## Current State

- **HEAD:** {sha}
- **Mergeable:** {MERGEABLE|CONFLICTING|UNKNOWN}
- **Review Decision:** {APPROVED|CHANGES_REQUESTED|REVIEW_REQUIRED}
- **Unresolved Threads:** {count}
- **Checks:**
  - {check_name}: {SUCCESS|FAILURE|PENDING} ({platform})
  - ...

## History

| Time | Event |
|------|-------|
| {timestamp} | {state change description} |
| ... | ... |
```

Keep the history log to the last 20 entries; drop older ones.

## Auto-Detection Defaults

No setup questions; auto-detect and apply defaults:

| Setting | Default | Override |
|---------|---------|----------|
| PR | Auto-detect from current branch | Pass PR number as argument |
| Poll interval | Every 2 minutes | "Poll every 5 minutes" |
| Auto-resolve noise | Yes | "Don't auto-resolve noise" |
| Auto-merge | No | "Enable auto-merge" |
| CI platforms | Auto-detected from `gh pr checks` | n/a (always auto-detected) |

Overrides given inline when invoking: "babysit PR #42, poll every 5 minutes, enable auto-merge."

## Stopping

To stop monitoring:

1. Read the watch mechanism and ID from the state file
2. Monitor watch: TaskStop with that ID. Cron fallback: CronDelete with the job ID
3. Report final summary: total polls run, conflicts resolved, CI failures fixed, comments triaged, current PR state

## Session Lifecycle

- Monitor watches and cron jobs are both session-scoped: they stop when the agent session ends
- Monitor watch: ends on TaskStop, session exit, or script exit (`TERMINAL` line); `persistent: true` is required or it dies at the default timeout
- Cron fallback: 3-day auto-expiry on recurring jobs
- No persistence across session restarts
- If the session is busy when an event or poll arrives, it is handled when the agent becomes idle
