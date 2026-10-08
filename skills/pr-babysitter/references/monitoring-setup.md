# Monitoring Setup

Watch setup for monitor mode: the watch ladder, the Monitor watch script, the cron fallback, the post-merge watch, the state file format, defaults, and lifecycle.

## Contents

- [Watch Ladder](#watch-ladder)
- [Harness PR Subscription](#harness-pr-subscription)
- [Monitor Watch Script](#monitor-watch-script)
- [Cron Fallback](#cron-fallback)
- [Post-merge Watch](#post-merge-watch)
- [State File Format](#state-file-format)
- [Auto-Detection Defaults](#auto-detection-defaults)
- [Stopping](#stopping)
- [Session Lifecycle](#session-lifecycle)

## Watch Ladder

Checked once in Phase 1, first rung that applies. The mechanism and its ID go in the state file so Stopping can find them.

| Rung | Available when | Wakes the agent on |
|------|----------------|--------------------|
| 1. Harness PR subscription | A PR-subscription tool is exposed, or the web session's Auto-fix toggle is on | Review comments, CI failures, check-suite success, pushed by GitHub |
| 2. Monitor tool | `Monitor` is in the tool list | A `CHANGED` or `TERMINAL` line from the watch script below |
| 3. Cron | `CronCreate` is in the tool list | Every tick |
| 4. None | Neither | Nothing. Run one-shot modes only and say so |

## Harness PR Subscription

Cloud and remote sessions expose `Claude_Code_Remote:subscribe_pr_activity` (owner, repo, pullNumber); the GitHub MCP server exposes `github:subscribe_pr_activity`. Claude Code on the web has the same thing as an Auto-fix toggle in the CI status bar, and `/autofix-pr` from a terminal spawns a cloud session with it on. Events arrive as external-event envelopes; each one runs phases 2-5.

Three limits of this rung:

- GitHub emits no webhook when the base branch advances into a conflict. Pair the subscription with a Monitor poll of `gh pr view --json mergeable,mergeStateStatus` every 10 minutes (a base branch rarely moves faster, and the watch has nothing else to do), or check conflicts on every event that does arrive.
- PR activity carries no commit statuses on the base branch, so it never sees the post-merge watch. On merge, unsubscribe and start the Monitor watch script (it skips straight to the post-merge part), or cron.
- If the subscribe call reports that a PR Steward already watches this PR, this session receives no events. Do not claim monitor mode; say the PR is already covered and offer the one-shot modes, because two agents pushing fixes to one branch trip each other's leases.

Stop with the matching unsubscribe tool (`Claude_Code_Remote:unsubscribe_pr_activity` or `github:unsubscribe_pr_activity`).

## Monitor Watch Script

Start it with `persistent: true` (the default watch ends at its timeout) and a `description` naming the PR. Monitor commands run under the same permission rules as Bash.

The script polls, fingerprints PR state, and emits one line only when the fingerprint changes. Once the PR merges, it polls the merge SHA's `watch/*` statuses instead (see [Post-merge Watch](#post-merge-watch)). It never fixes or classifies anything; react to each emitted line per the table below.

Substitute `{N}`, `{owner}`, `{repo}`, and the interval (respect inline overrides like "poll every 5 minutes"):

```bash
PR={N}; OWNER={owner}; REPO={repo}
# 120s: GitHub takes a minute or two to recompute checks and mergeability after
# a push, so polling faster returns the same answer and spends rate limit.
INTERVAL=120
ME=$(gh api user --jq .login)
prev=""
while true; do
  view=$(gh pr view "$PR" --repo "$OWNER/$REPO" \
    --json state,headRefOid,mergeable,mergeStateStatus,reviewDecision 2>/dev/null) \
    || { sleep "$INTERVAL"; continue; }
  state=$(jq -r .state <<<"$view")
  if [ "$state" = "MERGED" ]; then break; fi
  if [ "$state" != "OPEN" ]; then echo "TERMINAL: PR $state"; exit 0; fi
  # gh pr checks exits 1 on a failed check and 8 while pending; the JSON is
  # printed either way, so read the pipeline's output and ignore its status.
  checks=$(gh pr checks "$PR" --repo "$OWNER/$REPO" --json name,bucket 2>/dev/null \
    | jq -c 'sort_by(.name)')
  tdata=$(gh api graphql \
    -f query='query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100){nodes{isResolved comments(last:1){nodes{author{login}}}}}}}}' \
    -f o="$OWNER" -f r="$REPO" -F n="$PR" 2>/dev/null)
  nodes='.data.repository.pullRequest.reviewThreads.nodes[]'
  threads=$(jq "[$nodes | select(.isResolved | not)] | length" <<<"$tdata")
  awaiting=$(jq --arg me "$ME" \
    "[$nodes | select(.comments.nodes[0].author.login != \$me)] | length" <<<"$tdata")
  # Review comments support sort=updated; issue comments do not, so page them
  # and take the max. Both feeds matter: bots edit issue comments in place.
  newest_review=$(gh api "repos/$OWNER/$REPO/pulls/$PR/comments?per_page=1&sort=updated&direction=desc" \
    --jq '.[0].updated_at // empty' 2>/dev/null)
  newest_issue=$(gh api --paginate "repos/$OWNER/$REPO/issues/$PR/comments?per_page=100" \
    --jq '.[].updated_at' 2>/dev/null | sort | tail -1)
  newest=$(printf '%s\n%s\n' "$newest_review" "$newest_issue" | sort | tail -1)
  fp="$(jq -r '[.headRefOid,.mergeable,.mergeStateStatus,.reviewDecision] | join("|")' <<<"$view")"
  fp="$fp|$checks|threads=$threads|awaiting=$awaiting|newest=$newest"
  if [ -n "$prev" ] && [ "$fp" != "$prev" ]; then echo "CHANGED: $fp"; fi
  prev="$fp"
  sleep "$INTERVAL"
done

# Post-merge watch. The merge SHA has no watch/* status until its deploy and
# checks finish, so only the first parent can show the repo runs a watch.
until sha=$(gh pr view "$PR" --repo "$OWNER/$REPO" --json mergeCommit \
    --jq '.mergeCommit.oid // empty' 2>/dev/null) && [ -n "$sha" ]; do
  sleep "$INTERVAL"
done
echo "MERGED: $sha"
until parent=$(gh api "repos/$OWNER/$REPO/commits/$sha" --jq '.parents[0].sha' 2>/dev/null) \
  && want=$(gh api "repos/$OWNER/$REPO/commits/$parent/status?per_page=100" \
    --jq '[.statuses[] | select(.context | startswith("watch/")) | .context]' 2>/dev/null); do
  sleep "$INTERVAL"
done
if [ "$want" = "[]" ]; then echo "TERMINAL: no post-merge watch"; exit 0; fi
prev=""
# No timeout: a watch/<env> status lands only once that environment's checks end.
while true; do
  status=$(gh api "repos/$OWNER/$REPO/commits/$sha/status?per_page=100" 2>/dev/null) \
    || { sleep "$INTERVAL"; continue; }
  line=$(jq -r --argjson want "$want" '
    [.statuses[] | select(.context | startswith("watch/"))] as $w
    | ($w | map("\(.context)=\(.state)") | sort | join(" ")) as $s
    | if any($w[]; .state == "failure" or .state == "error") then "TERMINAL: WATCH FAILED \($s)"
      elif ($want - [$w[] | select(.state == "success") | .context]) == [] then "TERMINAL: WATCH PASSED \($s)"
      else $s end' <<<"$status")
  case "$line" in TERMINAL:*) echo "$line"; exit 0 ;; esac
  if [ "$line" != "$prev" ]; then echo "WATCH: $line"; fi
  prev="$line"
  sleep "$INTERVAL"
done
```

`threads` alone was blind to the two events that matter most. A human reply on an already-resolved thread and a bot comment edited in place both leave the head SHA, mergeability, review decision, check buckets, and unresolved count **all unchanged**, so the watch never woke. `awaiting` and `newest` are what move on those events.

Both probes are deliberately coarse: `awaiting` counts every thread whose newest comment is not yours, resolved or not, with no `resolvedBy` carve-out. A fingerprint only has to **change**, so over-counting costs nothing and under-counting loses an event. Precise bucketing happens in Phase 4.

Emitted lines:

| Line | Meaning | React by |
|------|---------|----------|
| `CHANGED: {fingerprint}` | Head SHA, mergeability, review decision, a check bucket, the unresolved count, the awaiting count, or the newest comment timestamp changed | Run phases 2-5 |
| `TERMINAL: PR CLOSED` | PR closed without merging; the script exits and the watch ends | Report the final summary, stop |
| `MERGED: {sha}` | PR merged; the script moves on to the merge SHA's `watch/*` statuses | Report the merge, write the merge SHA to the state file |
| `WATCH: {context=state ...}` | A `watch/*` status on the merge SHA changed | Report the transition ("watch/staging passed, waiting on watch/production") |
| `TERMINAL: no post-merge watch` | The merge commit's first parent has no `watch/*` status | Report "no post-merge watch", stop |
| `TERMINAL: WATCH PASSED {context=state ...}` / `TERMINAL: WATCH FAILED {context=state ...}` | Every expected `watch/*` context passed, or one reads `failure` or `error`; the script exits | Report per [Post-merge Watch](#post-merge-watch), stop |

Transient `gh` failures skip the iteration and retry next interval; they never emit.

## Cron Fallback

`CronCreate` with a 5-field expression; the prompt below runs phases 2-5 on every tick.

| User intent | Cron expression |
|-------------|-----------------|
| Every 2 minutes (default) | `*/2 * * * *` |
| Every 5 minutes | `*/5 * * * *` |
| Every 10 minutes | `*/10 * * * *` |
| Every hour | `7 * * * *` |

The scheduler jitters recurring tasks by up to half the interval (up to 30 minutes for hourly and slower), derived from the task ID, so a 2-minute cron fires somewhere inside each 2-minute window rather than on the minute. Pick an off-minute like `7` for hourly jobs; `:00` and `:30` carry extra jitter.

Recurring tasks expire 7 days after creation (one final fire, then self-delete). Re-run the skill if the PR is still open or its post-merge watch has not finished.

Prompt template:

```text
Check PR #{N} in {owner}/{repo}. Run pr-babysitter monitor phases 2-5:
1. State: gh pr view --json state. CLOSED: report and delete this job. MERGED: skip 2-5, run one Post-merge Watch check (references/monitoring-setup.md), delete this job on a terminal result
2. Conflicts: gh pr view --json mergeable,mergeStateStatus; resolve if safe
3. CI: gh pr checks --json name,state,bucket,link; diagnose failures, Buildkite auth chain if needed
4. Comments: compare open and awaiting-reply counts and newest updated_at with the state file; triage autonomously
5. Readiness: report only transitions
State file: .claude/pr-babysitter/babysit-pr-{N}.md
Auto-resolve noise: yes
Auto-merge: no
```

## Post-merge Watch

A merged PR is followed, not dropped. A repo with a post-merge watch posts one `watch/<env>` commit status per environment (`watch/staging`, `watch/production`) on the merge SHA, and only after that environment's deploy and checks finish. There is no fixed timeout: wait for the status.

1. Merge SHA: `gh pr view {N} --json mergeCommit --jq .mergeCommit.oid`.
2. Does the repo run a watch? Read the first parent, `gh api repos/{owner}/{repo}/commits/{sha} --jq '.parents[0].sha'`, then its `watch/*` contexts: `gh api "repos/{owner}/{repo}/commits/{parent}/status?per_page=100" --jq '[.statuses[] | select(.context | startswith("watch/")) | .context]'`. The merge SHA cannot answer this, because nothing posts there until its own deploy finishes. An empty list: report "no post-merge watch" and stop. Otherwise that list is the set of environments to wait for.
3. Poll `gh api "repos/{owner}/{repo}/commits/{sha}/status?per_page=100"` (the latest status per context) every interval. Stop at the first `failure` or `error` on any `watch/*` context. Done when every expected context reads `success`. One environment passing while another is still out is a transition: report it.
4. Report the result: each context's state, and for a failure its `description` and `target_url`. Post it as one comment on the PR only when the user authorized PR comments (the standing rule in SKILL.md); otherwise report it in the session. "No post-merge watch" is a session line only, never a PR comment.
5. Write the merge SHA and the watch result to the state file, then stop the mechanism per [Stopping](#stopping).

A failed watch is reported, never repaired from here: the repo's watch owns holding promotion and rolling back, so do not re-run a deploy, revert the merge, or push a fix to the base branch.

Per rung: the Monitor watch script does all of this after its `MERGED` line. A harness subscription cannot see these statuses, so switch to a Monitor or cron on merge. Cron runs one check per tick. With no rung, check once, report the current statuses, and say this runtime cannot keep polling.

## State File Format

Write to `.claude/pr-babysitter/babysit-pr-{N}.md` (create the folder; never stage it).

```markdown
# Babysit PR #{N}

**PR:** {title} (#{N})
**URL:** {pr_url}
**Branch:** {head_branch} -> {base_branch}
**Watch:** {subscription|monitor|cron} ({id})
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
- **Merge SHA:** {sha, once merged}
- **Watch:** {watch/staging=success watch/production=pending, or no post-merge watch}
- **Checks:**
  - {check_name}: {pass|fail|pending|skipping|cancel} ({platform})

## History

| Time | Event |
|------|-------|
| {timestamp} | {state change description} |
```

Keep the history to the last 20 entries.

## Auto-Detection Defaults

| Setting | Default | Override |
|---------|---------|----------|
| PR | Current branch | Pass PR number as argument |
| Poll interval | Every 2 minutes | "Poll every 5 minutes" |
| Auto-resolve noise | Yes | "Don't auto-resolve noise" |
| Auto-merge | No | "Enable auto-merge" (then `gh pr merge --auto` with the repo's merge method once Phase 5 says ready) |
| CI platforms | From `gh pr checks` names and links | Always auto-detected |

Overrides given inline when invoking: "babysit PR #42, poll every 5 minutes, enable auto-merge."

## Stopping

1. Read the watch mechanism and ID from the state file
2. Monitor watch: `TaskStop` with that ID. Cron: `CronDelete` with the job ID. Subscription: the matching unsubscribe tool
3. Report: polls or events handled, conflicts resolved, CI failures fixed, comments triaged, current PR state, and the post-merge watch result once merged

## Session Lifecycle

- Monitor watches, cron jobs, and subscriptions are session-scoped
- Monitor watch: ends on `TaskStop`, session exit, or script exit (`TERMINAL` line); without `persistent: true` it dies at the default timeout
- Cron: 7-day expiry; restored on `--resume` if unexpired. Background Monitor tasks are never restored on resume
- An event or tick arriving while the agent is busy is handled when it goes idle; there is no catch-up for missed fires
