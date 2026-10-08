# Monitoring Setup

Watch setup for monitor mode: the watch ladder, the Monitor watch script, the cron fallback, the post-merge watch, the state file format, defaults, and lifecycle.

## Contents

- [Watch Ladder](#watch-ladder)
- [Harness PR Subscription](#harness-pr-subscription)
- [Monitor Watch Script](#monitor-watch-script)
- [Cron Fallback](#cron-fallback)
- [Post-merge Watch](#post-merge-watch)
  - [Production smoke test](#production-smoke-test)
- [State File Format](#state-file-format)
- [Auto-Detection Defaults](#auto-detection-defaults)
- [Stopping](#stopping)
- [Session Lifecycle](#session-lifecycle)

## Watch Ladder

Checked once in Phase 1, first rung that applies. The mechanism and its ID go in the state file so Stopping can find them.

| Rung | Available when | Wakes the agent on |
|------|----------------|--------------------|
| 1. Harness PR subscription | A PR-subscription tool is exposed, or the web session's Auto-fix toggle is on | Review comments, CI failures, check-suite success, pushed by GitHub |
| 2. Monitor tool | `Monitor` is in the tool list | Any line the watch script below emits |
| 3. Cron | `CronCreate` is in the tool list | Every tick |
| 4. None | Neither | Nothing. Run one-shot modes only and say so |

## Harness PR Subscription

Cloud and remote sessions expose `Claude_Code_Remote:subscribe_pr_activity` (owner, repo, pullNumber); the GitHub MCP server exposes `github:subscribe_pr_activity`. Claude Code on the web has the same thing as an Auto-fix toggle in the CI status bar, and `/autofix-pr` from a terminal spawns a cloud session with it on. Events arrive as external-event envelopes; each one runs phases 2-5.

Three limits of this rung:

- GitHub emits no webhook when the base branch advances into a conflict. Pair the subscription with a Monitor poll of `gh pr view --json state,mergeable,mergeStateStatus` every 10 minutes (a base branch rarely moves faster, and the watch has nothing else to do), or check conflicts on every event that does arrive.
- PR activity carries no commit statuses on the base branch, so it never sees the post-merge watch, and it may not wake on the merge itself. When the paired poll or an event shows `state` MERGED, unsubscribe, start the Monitor watch script (it skips straight to the post-merge part) or cron, and rewrite the state file's `Watch` line with the new mechanism and ID so Stopping finds it.
- If the subscribe call reports that a PR Steward already watches this PR, this session receives no events. Do not claim monitor mode; say the PR is already covered and offer the one-shot modes, because two agents pushing fixes to one branch trip each other's leases.

Stop with the matching unsubscribe tool (`Claude_Code_Remote:unsubscribe_pr_activity` or `github:unsubscribe_pr_activity`).

## Monitor Watch Script

Start it with `persistent: true` where the Monitor tool offers it; otherwise give it the longest timeout the tool allows and re-arm the same script on each expiry (after a merge it resumes at `MERGED`). Give it a `description` naming the PR. Monitor commands run under the same permission rules and shell as Bash, so the script avoids names zsh reserves, such as `status`.

The script polls, fingerprints PR state, and emits one line only when the fingerprint changes. Once the PR merges, it polls the merge SHA's `watch/*` statuses instead (see [Post-merge Watch](#post-merge-watch)). It never fixes or classifies anything; on each `CHANGED` line, run phases 2-5, which diff against the state file for the detailed comparison and write it back. React to the other lines per the table below.

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
# checks finish, so only the base it landed on can show the repo runs a watch.
until sha=$(gh pr view "$PR" --repo "$OWNER/$REPO" --json mergeCommit \
    --jq '.mergeCommit.oid // empty' 2>/dev/null) && [ -n "$sha" ]; do
  sleep "$INTERVAL"
done
echo "MERGED: $sha"
watch_contexts() {
  gh api "repos/$OWNER/$REPO/commits/$1/status?per_page=100" \
    --jq '[.statuses[] | select(.context | startswith("watch/")) | .context]' 2>/dev/null
}
until pr_info=$(gh pr view "$PR" --repo "$OWNER/$REPO" --json commits \
    --jq '"\(.commits | length) \(.commits[-1].authoredDate)"' 2>/dev/null) \
  && sha_info=$(gh api "repos/$OWNER/$REPO/commits/$sha" \
    --jq '"\(.parents | length) \(.commit.author.date) \(.parents[0].sha)"' 2>/dev/null); do
  sleep "$INTERVAL"
done
read -r n pr_date <<<"$pr_info"
read -r parents sha_date base <<<"$sha_info"
# A rebase merge of n commits leaves the merge SHA as the last rebased commit,
# so its first parent is the PR's own and the base is n back. A rebase keeps
# author dates; a squash stamps a new one.
if [ "$parents" = 1 ] && [ "$n" -gt 1 ] && [ "$sha_date" = "$pr_date" ]; then
  # One commit per page: a rebase merge can carry 100 commits, past one page.
  until base=$(gh api "repos/$OWNER/$REPO/commits?sha=$sha&per_page=1&page=$((n + 1))" \
      --jq '.[0].sha // empty' 2>/dev/null) && [ -n "$base" ]; do
    sleep "$INTERVAL"
  done
fi
until want=$(watch_contexts "$base") \
  && earlier=$(gh api "repos/$OWNER/$REPO/commits?sha=$base&per_page=10" \
    --jq '.[1:][].sha' 2>/dev/null); do
  sleep "$INTERVAL"
done
if [ "$want" = "[]" ]; then echo "TERMINAL: no post-merge watch"; exit 0; fi
# The base can be mid-deploy (watch/staging posted, watch/production not yet),
# so the commits before it fill in the environments still to come.
while read -r c; do
  [ -n "$c" ] || continue
  until more=$(watch_contexts "$c"); do sleep "$INTERVAL"; done
  want=$(jq -c --argjson more "$more" '. + $more | unique' <<<"$want")
done <<<"$earlier"
prev=""
# No timeout: a watch/<env> status lands only once that environment's checks end.
while true; do
  combined=$(gh api "repos/$OWNER/$REPO/commits/$sha/status?per_page=100" 2>/dev/null) \
    || { sleep "$INTERVAL"; continue; }
  line=$(jq -r --argjson want "$want" '
    [.statuses[] | select(.context | startswith("watch/"))] as $w
    | ($w | map("\(.context)=\(.state)") | sort | join(" ")) as $s
    | if any($w[]; .state == "failure" or .state == "error") then "TERMINAL: WATCH FAILED \($s)"
      elif ($want - [$w[] | select(.state == "success") | .context]) == [] then "TERMINAL: WATCH PASSED \($s)"
      else $s end' <<<"$combined")
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
| `TERMINAL: no post-merge watch` | The base the PR merged onto has no `watch/*` status | Report "no post-merge watch", run the [production smoke test](#production-smoke-test), stop |
| `TERMINAL: WATCH PASSED {context=state ...}` / `TERMINAL: WATCH FAILED {context=state ...}` | Every expected `watch/*` context passed, or one reads `failure` or `error`; the script exits | Report per [Post-merge Watch](#post-merge-watch); after a pass, run the production smoke test first; stop |

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

A merged PR is followed, not dropped, and phases 2-5 no longer run on it. A repo with a post-merge watch posts one `watch/<env>` commit status per environment (`watch/staging`, `watch/production`) on the merge SHA, and only after that environment's deploy and checks finish. There is no fixed timeout: wait for the status.

1. Merge SHA: `gh pr view {N} --json mergeCommit --jq .mergeCommit.oid`.
2. Does the repo run a watch? Find the base the PR merged onto: the first parent, `gh api repos/{owner}/{repo}/commits/{sha} --jq '.parents[0].sha'`, except after a rebase merge. There the merge SHA is the last of the PR's n rebased commits, so its first parent is the PR's own commit and the base is n commits back (`commits?sha={sha}&per_page=1&page={n+1}`; one commit per page because a rebase merge can carry 100 commits, more than one page holds). A single-parent merge SHA whose author date equals the PR head commit's `authoredDate` is a rebase: a rebase keeps author dates, a squash stamps a new one. Then read the base's `watch/*` contexts: `gh api "repos/{owner}/{repo}/commits/{base}/status?per_page=100" --jq '[.statuses[] | select(.context | startswith("watch/")) | .context]'`. The merge SHA cannot answer this, because nothing posts there until its own deploy finishes. An empty list: report "no post-merge watch" and stop. Otherwise wait for every `watch/*` context found on the base or the nine commits before it (`gh api "repos/{owner}/{repo}/commits?sha={base}&per_page=10"`): the base can be mid-deploy, with `watch/staging` posted and `watch/production` not yet, and its list alone would call the watch passed after staging.
3. Poll `gh api "repos/{owner}/{repo}/commits/{sha}/status?per_page=100"` (the latest status per context) every interval. Stop at the first `failure` or `error` on any `watch/*` context. Done when every expected context reads `success`. One environment passing while another is still out is a transition: report it.
4. Unless the watch failed, run the [production smoke test](#production-smoke-test).
5. Report the result: each context's state, and for a failure its `description` and `target_url`, plus the smoke test's outcome and evidence. Post it as one comment on the PR only when the user authorized PR comments (the standing rule in SKILL.md); otherwise report it in the session. "No post-merge watch" is a session line only, never a PR comment.
6. Write the merge SHA, the watch result, and the smoke result to the state file, then stop the mechanism per [Stopping](#stopping).

A failed watch or smoke test is reported, never repaired from here: the repo's watch owns holding promotion and rolling back, so do not re-run a deploy, revert the merge, or push a fix to the base branch.

### Production smoke test

A green watch says the repo's own checks passed; the smoke test confirms this PR's change actually works in production. Run it once the merge SHA is live there:

- **When:** after `watch/production` passes. With no post-merge watch, once a production deployment of the merge SHA reports success: `gh api "repos/{owner}/{repo}/deployments?sha={sha}&environment=production"`, then that deployment's `statuses` (a Vercel or similar deploy check on the merge SHA counts too). Wait for it the way the watch waits, with no fixed timeout. Nothing in the repo shows a production deploy: say so and claim nothing.
- **What:** the repo's own production smoke command when its docs or scripts name one. Otherwise exercise what the PR changed on the production URL (the deployment's `environment_url`, or the URL the repo documents): request the changed page or endpoint and check the changed behaviour is there, not just a 200.
- **Read-only:** no sign-ups, purchases, form submissions, emails, or writes to production data. A change that can only be proven by writing is reported as unverified, with the step that would prove it.
- **Evidence:** the command or URL, the status, and the line or value that shows the change. "Looks fine" is not a result.

Per rung: the Monitor watch script does all of this after its `MERGED` line. A harness subscription switches to a Monitor or cron on merge (see its limits above). Cron runs one check per tick. With no rung, check once, report the current statuses, and say this runtime cannot keep polling.

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
- **Post-merge Watch:** {watch/staging=success watch/production=pending, or no post-merge watch}
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
- Monitor watch: ends on `TaskStop`, session exit, or script exit (`TERMINAL` line); without `persistent: true` it also dies at its timeout, so re-arm it
- Cron: 7-day expiry; restored on `--resume` if unexpired. Background Monitor tasks are never restored on resume
- An event or tick arriving while the agent is busy is handled when it goes idle; there is no catch-up for missed fires
