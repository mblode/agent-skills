---
name: pr-babysitter
description: Autonomous PR monitor — polls every 2 minutes for merge conflicts, CI/CD failures across GitHub Actions, Buildkite, Vercel, and Fly.io, review comments, and merge readiness. Auto-detects PR from current branch, fixes what it can, notifies on state changes. No setup questions. Use when asked to babysit a PR, watch a PR, monitor CI, keep a PR green, handle merge conflicts, poll PR status, or run `/pr-babysitter`
---

# PR Babysitter

Autonomous PR monitor. Detects the PR from your current branch and starts polling every 2 minutes. No setup questions — auto-detects everything and applies sensible defaults.

## Scope

- Ongoing PR health: merge conflicts, CI checks, review comments, merge readiness
- Comment triage runs autonomously within the monitor cycle — no plan approval
- Skip: closed or merged PRs, draft PRs unless explicitly requested

## Reference Files

| File                              | Read When                                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `references/github-api.md`        | Default: GraphQL queries for fetching, replying, and resolving threads                               |
| `references/bot-patterns.md`      | Comment triage: bot detection, severity parsing, deduplication, false positive rules                 |
| `references/fix-plan-template.md` | Comment triage: generating the fix plan document                                                     |
| `references/monitoring-setup.md`  | Default: CronCreate configuration, state file, defaults                                              |
| `references/ci-platforms.md`      | CI/CD check: `gh` for GitHub, Buildkite auth fallback chain, `vercel`/`flyctl` for platform logs     |
| `references/merge-conflicts.md`   | Conflict check: detecting and resolving merge conflicts                                              |

---

## Monitor Workflow

Copy this checklist to track progress:

```
PR babysit progress:
- [ ] Phase 1: Initialize — auto-detect PR, snapshot state, start cron
- [ ] Phase 2: Conflict check — detect and resolve merge conflicts
- [ ] Phase 3: CI/CD check — poll checks, diagnose failures, fix and push
- [ ] Phase 4: Comment check — detect new comments, triage autonomously
- [ ] Phase 5: Readiness check — evaluate merge readiness, notify user
```

### Phase 1: Initialize

Load `references/monitoring-setup.md` for CronCreate configuration and defaults.

1. **Auto-detect the PR** — `gh pr view --json number,url,title,headRefName,baseRefName,mergeable,mergeStateStatus,reviewDecision` from the current branch. If no PR found, tell the user and stop. If a PR number was passed as an argument, use it directly
2. **Extract owner/repo** — `gh repo view --json owner,name`
3. **Snapshot current state** — write to `.claude/scratchpad/babysit-pr-{N}.md`: current HEAD SHA, mergeable status, check statuses, unresolved thread count, review decision
4. **Detect CI platforms** — scan check names from `gh pr checks` to identify active platforms (GitHub Actions, Buildkite, Vercel, Fly.io)
5. **Create cron job** — CronCreate with `*/2 * * * *` schedule running phases 2-5. Print a single confirmation:

```
Monitoring PR #{N}: {title}
Polling every 2 minutes | Auto-resolve noise: yes | Auto-merge: no
Detected CI: {platforms}
Current state: {mergeable} | {reviewDecision} | {check_summary}
```

### Phase 2: Conflict Check

Load `references/merge-conflicts.md` for resolution strategy.

1. **Check mergeable status** — `gh pr view --json mergeable,mergeStateStatus`
   - `MERGEABLE` → skip to Phase 3
   - `CONFLICTING` → proceed to resolve
   - `UNKNOWN` → wait, recheck next cycle
2. **Attempt rebase** — `git fetch origin {base_branch} && git rebase origin/{base_branch}`
   - Clean rebase → `git push --force-with-lease` → notify user
   - Conflicts in safe files (lockfiles, generated) → auto-resolve, push
   - Complex conflicts → `git rebase --abort` → notify user with details

**Never force-push without `--force-with-lease`.** If the lease fails, someone else pushed — abort and notify.

### Phase 3: CI/CD Check

Load `references/ci-platforms.md` for platform-specific commands and the Buildkite auth fallback chain.

1. **Poll check status** — `gh pr checks --json name,state,conclusion,detailsUrl`
2. **Classify each check** — passing, pending (wait), or failing
3. **If all passing** → proceed to Phase 4
4. **If any failing** → diagnose:
   - Identify platform from check name (see reference for patterns)
   - Fetch logs via `gh run view --log-failed` (GitHub Actions), Buildkite auth fallback chain (Buildkite), `vercel logs` (Vercel), `flyctl logs` (Fly.io)
   - Classify failure: flaky test (re-run), code error (fix + push), infrastructure (notify user), dependency issue (update lockfile)
   - Fix and push if possible
5. **Compare with previous state** — flag regressions (previously passing, now failing)

### Phase 4: Comment Check

1. **Count unresolved threads** — quick GraphQL count or `gh pr view --json`
2. **Compare with state file** — if new unresolved threads since last poll:
   - Notify user: "N new review comments on PR #{N}"
   - Run comment triage autonomously (fetch → classify → fix → resolve, no plan approval)
3. **Auto-resolve noise** — resolve unambiguous noise bots (vercel, linear, changeset) with brief reason. Never auto-resolve human comments or critical/major findings

### Phase 5: Readiness Check

1. **Evaluate merge readiness** — all of:
   - `mergeable == MERGEABLE` (no conflicts)
   - All required checks passing
   - `reviewDecision == APPROVED`
   - No unresolved blocking threads
2. **If ready** → notify user: "PR #{N} is ready to merge. All checks green, reviews approved, no conflicts."
3. **If not ready** → report blockers: "Waiting on: 2 checks pending" / "Blocked by: merge conflict"
4. **Notify only on state changes** — compare with previous poll:
   - Check went green → "Build is green"
   - Check broke → "Build broke: {check_name}"
   - New review → "New review from @{reviewer}: {state}"
   - Conflict detected → "Merge conflict with {base_branch}"
   - All clear → "PR #{N} is green and ready"
5. **Update state file** for next poll cycle

## Comment Triage Workflow

When Phase 4 detects new comments, run this inline — no separate invocation needed.

Load `references/github-api.md` for query templates and `references/bot-patterns.md` for detection rules.

### Fetch

1. **Fetch all review threads** — GraphQL `reviewThreads` query with pagination. Filter to `isResolved == false`
2. **Fetch PR reviews** — REST reviews endpoint. Collect all reviews with state, body, and author
3. **Fetch issue-level comments** — REST endpoint for PR conversation comments
4. **Early exit** — if zero unresolved threads and zero actionable reviews and zero actionable issue comments, skip triage

### Classify

For each item:

1. **Identify author type** — human or bot. For bots, classify by content first, then username
2. **Skip noise** — auto-classify noise items per bot-patterns reference
3. **Parse severity** — extract from bot-specific format. Human comments: Major for `CHANGES_REQUESTED`, Minor for `APPROVED` + question
4. **Deduplicate** — group inline comments on the same file within a 3-line range. Keep highest-severity
5. **Classify** — category (bug/security/performance/style/correctness/docs/test-coverage), severity (critical/major/minor/nitpick), confidence (high/medium/low), disposition (fix or ignore with reason)

**Human comments are never auto-ignored.** Always classify as fix unless clearly already resolved or explicitly marked optional by the reviewer.

### Fix

1. **Write plan file** to `.claude/scratchpad/pr-{N}-review-plan.md` as audit trail
2. **Report summary** — print counts (N to fix, K conversation items, M to ignore) and proceed immediately
3. **Resolve ignored threads** — post brief reply, resolve via GraphQL
4. **Fix real issues** — group by commit group, parallelize independent file fixes
5. **Commit and push** — run lint/test if available, one commit per logical fix group
6. **Resolve and reply** — post reply on fixed threads, resolve via GraphQL
7. **Verify** — re-fetch threads to confirm zero unresolved remain, check CI status

## Stopping the Monitor

- "Stop babysitting" / "cancel the PR monitor" → CronDelete to remove the job
- Session exit → jobs auto-clean (session-scoped)
- PR merged or closed → auto-detect on next poll, self-cancel

On stop, report a final summary: total polls, fixes applied, conflicts resolved, current state.

## Anti-patterns

- Asking setup questions before starting — auto-detect everything, use defaults, start immediately
- Force-pushing without `--force-with-lease` — risks overwriting teammate commits
- Auto-resolving human comments — never auto-resolve human feedback
- Resolving threads without posting a reply — reviewers need to see the reasoning
- Fixing items the triage classified as ignore — respect the classification
- One commit per individual comment — group related fixes by commit group label
- Pushing before verifying lint/test pass locally
- Re-diagnosing failures while checks are still running — wait for completion
- Polling more frequently than every 2 minutes — 2 minutes is the floor
- Notifying on every poll with no state change — only notify on transitions
- Auto-merging without explicit user opt-in — merge is a one-way door
- Classifying `github-actions[bot]` as always noise — it is a shared identity used by DangerJS, schema checkers, and other active tools. Classify by content
- Using `bk` CLI without checking auth first — test with `bk auth status` and fall back to REST API or `gh pr checks`

## Related skills

- `pr-reviewer` for local self-review before pushing fixes
