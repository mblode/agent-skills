---
name: babysit-pr
description: Monitors PR health on a recurring schedule — merge conflicts, CI/CD failures across GitHub Actions, Buildkite, Vercel, and Fly.io, review comment triage and resolution, and merge readiness notifications. Also runs as one-shot comment triage. Use when asked to babysit a PR, watch a PR, monitor CI, fix PR comments, resolve review feedback, triage review threads, keep a PR green, handle merge conflicts, or poll PR status
---

# PR Babysitter

Two modes: **one-shot** comment triage or **monitor** mode with periodic polling via CronCreate.

- One-shot: triage and fix PR review comments in a single pass
- Monitor: set up a cron schedule to periodically check for merge conflicts, CI/CD failures, new review comments, and merge readiness

## Scope

- **One-shot:** unresolved review threads on open PRs, both human and bot comments
- **Monitor:** ongoing PR health — conflicts, CI checks, comments, and readiness
- Skip: closed or merged PRs, draft PRs unless explicitly requested

## Reference Files

| File                              | Read When                                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `references/github-api.md`        | Default: GraphQL queries for fetching, replying, and resolving threads                               |
| `references/bot-patterns.md`      | Comment triage: bot detection, severity parsing, deduplication, false positive rules                 |
| `references/fix-plan-template.md` | Comment triage Phase 3: generating the fix plan document                                             |
| `references/monitoring-setup.md`  | Monitor mode Phase 1: CronCreate configuration, state file format, schedule selection                |
| `references/ci-platforms.md`      | Monitor mode Phase 3: `gh` for GitHub, `bk`/`vercel`/`flyctl` for platform-specific logs and retries |
| `references/merge-conflicts.md`   | Monitor mode Phase 2: detecting and resolving merge conflicts                                        |

---

## One-Shot Mode: Comment Triage

Triage and resolve PR review comments from humans and bots in a structured four-phase workflow.

Copy this checklist to track progress:

```
Comment triage progress:
- [ ] Phase 1: Fetch unresolved review threads, reviews, and comments
- [ ] Phase 2: Triage and classify all items
- [ ] Phase 3: Write fix plan and get approval
- [ ] Phase 4: Execute fixes and resolve threads
```

### Phase 1: Fetch

Load `references/github-api.md` for query templates.

1. **Identify the PR** — auto-detect from current branch (`gh pr view --json number`) or accept an explicit PR number argument
2. **Extract owner/repo** — `gh repo view --json owner,name`
3. **Fetch all review threads** — use the GraphQL `reviewThreads` query with pagination. Collect every thread, then filter to `isResolved == false`
4. **Fetch PR reviews** — use the REST reviews endpoint. Collect all reviews with their state, body, and author. Pay attention to `CHANGES_REQUESTED` reviews with body text — these contain the reviewer's summary of what needs to change
5. **Fetch issue-level comments** — use the REST endpoint for all PR conversation comments. Do not filter by author — bot comments from `github-actions[bot]` may contain actionable findings (DangerJS warnings, schema compatibility checks)
6. **Early exit** — if zero unresolved threads, zero actionable reviews, and zero actionable issue comments, report "No unresolved review items found" and stop

Output: three lists — unresolved threads, reviews with content, and issue-level comments.

### Phase 2: Triage

Load `references/bot-patterns.md` for detection and parsing rules.

For each item across all three sources:

1. **Identify author type** — human or bot. For bots, classify by **content first, then username**. See `references/bot-patterns.md` for detection rules, severity parsing, and false positive patterns
2. **Skip noise** — auto-classify noise items per bot-patterns reference (linear linkbacks, vercel deployments, Devin "no issues" reviews, changeset releases, event-lib triggers)
3. **Parse severity** — extract from bot-specific format (emoji, SVG, HTML tables). Human comments: default to Major for `CHANGES_REQUESTED`, Minor for `APPROVED` + question
4. **Deduplicate** — group inline comments on the same file within a 3-line range. Keep the highest-severity, most-actionable comment. Mark others as `ignore-duplicate`
5. **Classify** each remaining item:
   - **Category:** bug, security, performance, style, correctness, docs, test-coverage
   - **Severity:** critical, major, minor, nitpick
   - **Confidence:** high (human or multi-bot), medium (single bot, clear issue), low (single bot, likely false positive)
   - **Disposition:** fix or ignore (with reason)
   - **Source type:** thread (resolvable), conversation (reply-only)
6. **Flag ignore candidates** with specific reasoning:
   - Pre-existing code not changed in this PR
   - Bot flagged .md, config, lock, or migration files (no security implications)
   - Contradicts project CLAUDE.md/AGENTS.md conventions
   - Outdated thread where code has changed substantially
   - Noise bot boilerplate or badge injection

**Human comments are never auto-ignored.** Always classify as fix unless clearly already resolved or the reviewer explicitly marked it as optional ("up to you", "but not blocking").

### Phase 3: Plan

Load `references/fix-plan-template.md` for the output template.

1. **Create plan file** — write to `.claude/scratchpad/pr-{N}-review-plan.md` (create directory if needed)
2. **Issues to Fix** — ordered by severity (critical first), each with thread ID, file:line, author, category, finding, fix approach, and commit group label
3. **Conversation Items** — issue-level comments and review bodies that need fixes but have no thread ID. These get a reply but no resolve mutation
4. **Ignored** — each with thread ID or comment ID, author, reason, and the brief reply to post when resolving
5. **Summary table** — disposition-by-severity matrix for quick scanning
6. **Present to user** — print a summary showing counts (N to fix, K conversation items, M to ignore) and ask for approval

**Stop here. Do not proceed to Phase 4 until the user reviews and approves the plan.**

The user may edit the plan — move items between fix/conversation/ignore, change priorities, add notes. Re-read the plan file before executing.

### Phase 4: Execute

After user approval, re-read `.claude/scratchpad/pr-{N}-review-plan.md` in case it was edited.

**4a. Resolve ignored threads:**

For each ignored item that has a thread ID:

1. Post a brief reply explaining the decision
2. Resolve the thread via GraphQL mutation

Use concise, specific reasons:

- "Duplicate of thread addressing the same finding — resolving."
- "Contradicts project convention (see CLAUDE.md) — resolving."
- "Outdated thread — code has been refactored. Resolving."
- "CI notification — not actionable. Resolving."

For ignored noise without a thread ID (issue-level bot comments), do nothing — no reply needed.

**4b. Fix real issues:**

Group fixes by commit group label from the plan. For each group:

- If fixes touch independent files, launch parallel subagents (one per file group)
- If fixes touch the same file or overlapping lines, execute sequentially
- Each subagent reads the file, applies the fix, and verifies correctness

**4c. Commit and push:**

- Run project lint/test commands if available
- One commit per logical fix group, message format: `fix({scope}): {description}`
- Push the branch

**4d. Resolve and reply:**

- Resolved threads: post reply ("Fixed in latest push.") then resolve via GraphQL
- Conversation items: post reply acknowledging the fix
- Issue-level comments have no resolve mechanism — the reply is the acknowledgment

**4e. Verify:**

- Re-fetch threads from GitHub (fresh API call) to confirm zero unresolved remain
- Check CI status with `gh pr checks`
- Report results to the user

---

## Monitor Mode: Babysit PR

Set up periodic monitoring via CronCreate. Polls for merge conflicts, CI/CD failures, new review comments, and deployment status. Fixes what it can, runs comment triage when needed, and notifies on state changes.

Copy this checklist to track progress:

```
PR babysit progress:
- [ ] Phase 1: Initialize — identify PR, snapshot state, set up cron
- [ ] Phase 2: Conflict check — detect and resolve merge conflicts
- [ ] Phase 3: CI/CD check — poll checks, diagnose failures, fix and push
- [ ] Phase 4: Comment check — detect new comments, run comment triage
- [ ] Phase 5: Readiness check — evaluate merge readiness, notify user
```

### Phase 1: Initialize

Load `references/monitoring-setup.md` for schedule configuration.

1. **Identify the PR** — auto-detect from current branch (`gh pr view --json number,url,title,headRefName,baseRefName,mergeable,mergeStateStatus,reviewDecision`) or accept an explicit PR number
2. **Extract owner/repo** — `gh repo view --json owner,name`
3. **Snapshot current state** — write to `.claude/scratchpad/babysit-pr-{N}.md`:
   - Current HEAD SHA, mergeable status, check statuses, unresolved thread count, review decision
4. **Detect CI platforms** — scan check names from `gh pr checks` to identify active platforms (GitHub Actions, Buildkite, Vercel, Fly.io)
5. **Choose schedule** — default: every 5 minutes (`*/5 * * * *`). User may override
6. **Ask user preferences** — auto-resolve noise bot comments? auto-merge when ready?
7. **Create cron job** — CronCreate with a prompt that runs phases 2-5
8. **Confirm with user** — report state snapshot and schedule

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

Load `references/ci-platforms.md` for `gh` CLI commands per platform.

1. **Poll check status** — `gh pr checks --json name,state,conclusion,detailsUrl`
2. **Classify each check** — passing, pending (wait), or failing
3. **If all passing** → proceed to Phase 4
4. **If any failing** → diagnose:
   - Identify platform from check name (see reference for patterns)
   - Fetch logs via `gh run view --log-failed` (GitHub Actions), `bk` (Buildkite), `vercel logs` (Vercel), `flyctl logs` (Fly.io)
   - Classify failure: flaky test (re-run), code error (fix + push), infrastructure (notify user), dependency issue (update lockfile)
   - Fix and push if possible
5. **Compare with previous state** — flag regressions (previously passing, now failing)

### Phase 4: Comment Check

1. **Count unresolved threads** — quick GraphQL count or `gh pr view --json`
2. **Compare with state file** — if new unresolved threads since last poll:
   - Notify user: "N new review comments on PR #{N}"
   - Run the one-shot comment triage workflow (phases 1-4 above)
3. **Auto-resolve noise** (if opted in during setup) — resolve only unambiguous noise bots (vercel, linear, changeset) with brief reason. Never auto-resolve human comments or critical/major findings

### Phase 5: Readiness Check

1. **Evaluate merge readiness** — all of:
   - `mergeable == MERGEABLE` (no conflicts)
   - All required checks passing
   - `reviewDecision == APPROVED`
   - No unresolved blocking threads
2. **If ready** → notify user: "PR #{N} is ready to merge. All checks green, reviews approved, no conflicts."
   - If auto-merge opted in: `gh pr merge --auto --squash`
3. **If not ready** → report blockers: "Waiting on: 2 checks pending" / "Blocked by: merge conflict"
4. **Notify only on state changes** — compare with previous poll:
   - Check went green → "Build is green"
   - Check broke → "Build broke: {check_name}"
   - New review → "New review from @{reviewer}: {state}"
   - Conflict detected → "Merge conflict with {base_branch}"
   - All clear → "PR #{N} is green and ready"
5. **Update state file** for next poll cycle

## Stopping the Monitor

- "Stop babysitting" / "cancel the PR monitor" → CronDelete to remove the job
- Session exit → jobs auto-clean (session-scoped)
- PR merged or closed → auto-detect on next poll, self-cancel

On stop, report a final summary: total polls, fixes applied, conflicts resolved, current state.

## Anti-patterns

- Force-pushing without `--force-with-lease` — risks overwriting teammate commits
- Auto-resolving human comments — never auto-resolve human feedback
- Resolving threads without posting a reply — reviewers need to see the reasoning
- Auto-ignoring human comments — always classify for user review
- Fixing items the plan marked as ignore without approval
- One commit per individual comment — group related fixes by commit group label
- Pushing before verifying lint/test pass locally
- Skipping Phase 3 (Plan) approval — the fix plan is the quality gate
- Re-diagnosing failures while checks are still running — wait for completion
- Polling more frequently than every 2 minutes — wastes API quota and context
- Notifying on every poll with no state change — only notify on transitions
- Auto-merging without explicit user opt-in — merge is a one-way door
- Classifying `github-actions[bot]` as always noise — it is a shared identity used by DangerJS, schema checkers, and other active tools. Classify by content

## Related skills

- `review-pr` for local self-review before pushing fixes
