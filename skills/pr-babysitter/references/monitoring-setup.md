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
ME=$(gh api user --jq .login)
prev=""
while true; do
  view=$(gh pr view "$PR" --repo "$OWNER/$REPO" \
    --json state,headRefOid,mergeable,mergeStateStatus,reviewDecision 2>/dev/null) \
    || { sleep "$INTERVAL"; continue; }
  state=$(jq -r .state <<<"$view")
  if [ "$state" != "OPEN" ]; then echo "TERMINAL: PR $state"; exit 0; fi
  checks=$(gh pr checks "$PR" --repo "$OWNER/$REPO" --json name,state 2>/dev/null \
    | jq -c 'sort_by(.name)')
  tdata=$(gh api graphql \
    -f query='query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100){nodes{isResolved comments(last:1){nodes{author{login}}}}}}}}' \
    -f o="$OWNER" -f r="$REPO" -F n="$PR" 2>/dev/null)
  nodes='.data.repository.pullRequest.reviewThreads.nodes[]'
  threads=$(jq "[$nodes | select(.isResolved | not)] | length" <<<"$tdata")
  awaiting=$(jq --arg me "$ME" \
    "[$nodes | select(.comments.nodes[0].author.login != \$me)] | length" <<<"$tdata")
  newest=$(for ep in pulls issues; do
    gh api "repos/$OWNER/$REPO/$ep/$PR/comments?per_page=1&sort=updated&direction=desc" \
      --jq '.[0].updated_at // empty' 2>/dev/null
  done | sort | tail -1)
  fp="$(jq -r '[.headRefOid,.mergeable,.mergeStateStatus,.reviewDecision] | join("|")' <<<"$view")"
  fp="$fp|$checks|threads=$threads|awaiting=$awaiting|newest=$newest"
  if [ -n "$prev" ] && [ "$fp" != "$prev" ]; then echo "CHANGED: $fp"; fi
  prev="$fp"
  sleep "$INTERVAL"
done
```

`threads` alone was blind to the two events that matter most. A human reply on an already-resolved thread and a bot comment edited in place both leave the head SHA, mergeability, review decision, check states, and unresolved count **all unchanged**, so the watch never woke. `awaiting` and `newest` are what move on those events.

Both new probes are deliberately coarse: `awaiting` counts every thread whose newest comment is not yours, resolved or not, with no `resolvedBy` carve-out. A fingerprint only has to **change**, so over-counting here costs nothing and under-counting loses an event. The precise bucketing happens in Phase 4.

`ME` is resolved once before the loop, not per iteration.

Emitted lines:

| Line | Meaning | React by |
|------|---------|----------|
| `CHANGED: {fingerprint}` | Head SHA, mergeability, review decision, a check state, the unresolved thread count, the awaiting-reply count, or the newest comment timestamp changed. This includes a reply on a resolved thread and an edited-in-place bot comment | Run phases 2-5 |
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
- **Awaiting My Reply:** {count}
- **Merge Gate:** {verdict or none}
- **Newest Comment:** {timestamp}
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
