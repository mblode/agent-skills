---
name: pr-babysitter
description: Autonomous monitor for an open PR. Polls every 2 minutes for merge conflicts, CI failures across GitHub Actions, Buildkite, Vercel, and Fly.io, review comments, and merge readiness, then fixes what it can and notifies only on state changes. Auto-detects the PR from the current branch with no setup questions. Also runs one-shot for a single concern. Use when asked to "babysit a PR", "watch a PR", "monitor CI", "keep a PR green", "poll PR status", run /pr-babysitter, "fix CI", "diagnose CI failure", "why is CI red", "CI is broken", "loop on CI", "fix CI checks", "resolve merge conflicts", or "fix conflicts". For creating the PR use pr-creator; for reviewing the diff for bugs use pr-reviewer; for npm release pipelines use autoship, which watches its own release CI.
---

# PR Babysitter

Autonomous monitor for an open PR. Detects the PR from the current branch, polls every 2 minutes, fixes what it can, and speaks only when state changes.

- **IS:** autonomous monitoring of an open PR (merge conflicts, CI across GitHub Actions, Buildkite, Vercel, and Fly.io, review comments, merge readiness) with auto-fixes, plus one-shot CI diagnosis or conflict resolution.
- **IS NOT:** creating the PR (use `pr-creator`), reviewing the diff for bugs (use `pr-reviewer`), or npm release pipelines (use `autoship`, which watches its own release CI; never start a babysitter on a release or Version Packages PR that autoship is driving).

## Mode Selection

| Invocation | Mode |
|------------|------|
| "babysit", "watch this PR", "monitor", "keep it green" | Monitor: Phase 1 once, then phases 2-5 on every cron tick |
| "fix CI", "why is CI red", "CI is broken", "loop on CI" | One-shot Phase 3 loop, no cron |
| "resolve conflicts", "fix conflicts" | One-shot Phase 2, no cron |
| "triage review comments", "address the comments" | One-shot Comment Triage Workflow, no cron |

Rules that apply in every mode:

- No setup questions. Auto-detect the PR, platforms, and defaults; start immediately. Overrides arrive inline only ("poll every 5 minutes", "enable auto-merge").
- Skip closed or merged PRs. Skip draft PRs unless the user explicitly asks.
- Comment triage runs autonomously inside the cycle, with no plan approval gate.

## Reference Files

| File | Read when |
|------|-----------|
| `references/monitoring-setup.md` | Starting monitor mode: CronCreate config, state file format, defaults |
| `references/merge-conflicts.md` | Phase 2: mergeStateStatus table, rebase workflow, auto-resolvable file types |
| `references/ci-platforms.md` | Phase 3: per-platform log and retry commands, Buildkite auth fallback chain, failure classification, stale-dependency and `knip` handling |
| `references/github-api.md` | Comment triage: GraphQL queries for fetching, replying to, and resolving threads |
| `references/bot-patterns.md` | Comment triage: bot detection, severity parsing, deduplication, false-positive rules |
| `references/fix-plan-template.md` | Comment triage: the audit-trail plan document format |
| `references/verification-gate.md` | Before any commit or push: lint, type-check, test, `knip` gate, stray-artifact sweep |
| `references/git-resilience.md` | Any git command hangs or fails transiently (fsmonitor wedge, stale index.lock, IPC blip) |

## Monitor Loop

Phase 1 runs once in the foreground and registers the cron job. Each tick then runs phases 2-5 in order: read the state file, check conflicts, check CI, check comments, evaluate readiness, write the state file. Every notification is a transition against the previous tick's state; a quiet poll produces no output.

Copy this checklist to track progress:

```
PR babysit progress:
- [ ] Phase 1: Initialize (auto-detect PR, snapshot state, start cron)
- [ ] Phase 2: Conflict check (detect and resolve merge conflicts)
- [ ] Phase 3: CI/CD check (poll checks, diagnose failures, fix and push)
- [ ] Phase 4: Comment check (detect new comments, triage autonomously)
- [ ] Phase 5: Readiness check (evaluate merge readiness, notify user)
```

### Phase 1: Initialize

Load `references/monitoring-setup.md` for CronCreate configuration and defaults.

1. **Auto-detect the PR**: `gh pr view --json number,url,title,headRefName,baseRefName,mergeable,mergeStateStatus,reviewDecision`. If a PR number was passed as an argument, use it directly. If no PR exists for the branch, say so and stop.
2. **Extract owner/repo**: `gh repo view --json owner,name`
3. **Snapshot state** to `.claude/scratchpad/babysit-pr-{N}.md`: HEAD SHA, mergeable status, check statuses, unresolved thread count, review decision
4. **Detect CI platforms** from `gh pr checks` check names (dispatch table in Phase 3)
5. **Create cron job**: CronCreate with `*/2 * * * *` running phases 2-5. Print a single confirmation:

```
Monitoring PR #{N}: {title}
Polling every 2 minutes | Auto-resolve noise: yes | Auto-merge: no
Detected CI: {platforms}
Current state: {mergeable} | {reviewDecision} | {check_summary}
```

### Phase 2: Conflict Check

Load `references/merge-conflicts.md` for the mergeStateStatus table and resolution strategy.

1. **Check mergeable status**: `gh pr view --json mergeable,mergeStateStatus`
   - `MERGEABLE` and up to date → skip to Phase 3
   - `CONFLICTING` → resolve
   - `UNKNOWN` → GitHub is still computing; recheck next tick
2. **Attempt rebase**: `git fetch origin {base_branch} && git rebase origin/{base_branch}`
   - Clean rebase → `git push --force-with-lease` → notify
   - Conflicts only in safe files (lockfiles, generated files, changelogs) → auto-resolve per the reference, push
   - Logic conflicts in source → `git rebase --abort` → notify with the conflicting files and what each side changed

Never push with bare `--force`. A failed `--force-with-lease` means someone else pushed; abort and notify rather than overwrite their commits. If `git fetch` or `git rebase` hangs, see `references/git-resilience.md`.

### Phase 3: CI/CD Check

Load `references/ci-platforms.md` for full per-platform commands, the Buildkite auth fallback chain, and the failure-classification decision tree.

1. **Poll**: `gh pr checks --json name,state,conclusion,detailsUrl`
2. **Classify each check**: passing, pending (wait for completion before diagnosing), or failing
3. **All passing** → proceed to Phase 4
4. **Failing** → dispatch on check name to fetch logs:

| Check name / detailsUrl | Platform | Failure logs via |
|-------------------------|----------|------------------|
| `buildkite/` prefix | Buildkite | Auth fallback chain: `bk` CLI, then REST API, then detailsUrl |
| `vercel` in name or `vercel.com` in URL | Vercel | `vercel logs {deployment_url}` |
| `fly-` prefix or `fly.io` in URL | Fly.io | `flyctl logs --app {app_name} --no-tail` |
| Anything else | GitHub Actions | `gh run view {run_id} --log-failed` |

5. **Classify the failure** per the decision tree: flaky (re-run), stale dependency (reinstall and rebuild before touching source), code error (fix), `knip` (remove dead code or configure), infrastructure (notify; not fixable from code)
6. **Fix, gate, push**: run the verification gate (`references/verification-gate.md`) locally before any push
7. **Compare with previous state**: flag regressions (previously passing, now failing)

**One-shot loop ("fix CI"):** after pushing a fix, run `gh pr checks --watch` and re-diagnose if still red. Exit when all checks are green (report the green run), when the failure is infrastructure, or when the same check fails twice with the same error after a fix attempt; then summarize the diagnosis instead of thrashing.

### Phase 4: Comment Check

1. **Count unresolved threads**: GraphQL count via `references/github-api.md`
2. **Compare with the state file**. New unresolved threads since last tick → notify "N new review comments on PR #{N}" and run the Comment Triage Workflow below
3. **Auto-resolve noise**: resolve unambiguous noise bots (vercel, linear, changeset linkbacks) with a one-line reason. Never auto-resolve human comments or critical/major findings

### Phase 5: Readiness Check

1. **Ready** means all of: `mergeable == MERGEABLE`, all required checks passing, `reviewDecision == APPROVED`, zero unresolved blocking threads
2. **Ready** → notify: "PR #{N} is ready to merge. All checks green, reviews approved, no conflicts." Do not merge; auto-merge requires explicit opt-in
3. **Not ready** → report blockers: "Waiting on: 2 checks pending" / "Blocked by: merge conflict"
4. **Notify only on transitions**: check went green or red, new review, conflict appeared or cleared, all clear
5. **Write the state file** so the next tick can diff against it

## Comment Triage Workflow

Runs inline when Phase 4 finds new comments, or one-shot when invoked directly. No plan approval; the plan file is an audit trail.

Load `references/github-api.md` for query templates and `references/bot-patterns.md` for detection rules.

### Fetch

1. **Review threads**: GraphQL `reviewThreads` query with pagination; filter to `isResolved == false`
2. **PR reviews**: REST reviews endpoint (state, body, author)
3. **Issue-level comments**: REST endpoint for PR conversation comments
4. **Early exit** if zero unresolved threads, zero actionable reviews, and zero actionable issue comments

### Classify

1. **Author type**: human or bot. Bots classify by content first, then username (`github-actions[bot]` is a shared identity)
2. **Skip noise** per the bot-patterns reference
3. **Severity**: parse bot-specific markers; humans default to Major for `CHANGES_REQUESTED`, Minor for `APPROVED` plus a question
4. **Deduplicate**: comments on the same file within a 3-line range are one issue; keep the highest severity. Never deduplicate human comments
5. **Disposition**: category, severity, confidence, then fix or ignore with a stated reason

Human comments are never auto-ignored. Classify as fix unless clearly already resolved or the reviewer explicitly marked it optional.

### Fix

1. **Write the plan** to `.claude/scratchpad/pr-{N}-review-plan.md` per `references/fix-plan-template.md`, as the audit trail
2. **Print counts** (N to fix, K conversation items, M ignored) and proceed immediately
3. **Resolve ignored threads**: post a brief reply, then resolve via GraphQL
4. **Fix real issues** grouped by commit group; parallelize independent file fixes
5. **Gate, commit, push**: the verification gate (`references/verification-gate.md`) must pass; sweep stray artifacts (e.g. a root `schema.gql` left by a hook); one commit per logical group, staging only that group's files
6. **Reply and resolve** each fixed thread via GraphQL
7. **Verify**: re-fetch threads and report zero unresolved remaining (or list what remains), plus current CI status

## Stopping

- "Stop babysitting" / "cancel the PR monitor" → CronDelete using the job ID from the state file
- PR merged or closed → detected on the next tick, self-cancel
- Session exit → jobs are session-scoped and auto-clean

On stop, report a final summary: total polls, fixes applied, conflicts resolved, comments triaged, current state.

## Gotchas

- Asking setup questions before starting: every question defeats the point of an autonomous monitor. Auto-detect, apply defaults, start.
- `git push --force` instead of `--force-with-lease`: silently overwrites a teammate's commits. A failed lease means someone pushed; abort and notify.
- Auto-resolving or auto-ignoring human comments: reviewers re-open the threads and stop trusting the monitor. Humans always classify as fix unless marked optional.
- Resolving a thread without posting a reply first: the reviewer sees a silent resolve with no reasoning and unresolves it.
- Fixing items the triage classified as ignore: produces churn nobody asked for and contradicts the audit trail.
- One commit per individual comment: makes review history unreadable. Group related fixes by commit-group label.
- Pushing before the verification gate (lint, type-check, test, `knip`) passes locally: a red push wastes the whole poll cycle plus a CI run.
- Committing stray hook artifacts (e.g. a root `schema.gql`): pollutes the PR diff. Sweep `git status --porcelain` and stage only the fix's files.
- Treating a monorepo type-check failure as a code bug: it is often stale deps or generated types. Reinstall and rebuild first; edit source only if it persists.
- Aborting the monitor on one hung or transient git command: fsmonitor wedges and stale locks are recoverable (`references/git-resilience.md`). Retry before giving up.
- Re-diagnosing while checks are still pending: you diagnose a half-finished run and fix the wrong thing. Wait for completion.
- Polling faster than every 2 minutes: burns GitHub API rate limit for no signal. 2 minutes is the floor.
- Notifying on every poll with no state change: notification fatigue trains the user to ignore the monitor. Only transitions speak.
- Auto-merging without explicit user opt-in: merge is a one-way door. "Ready to merge" is a notification, not an action.
- Classifying `github-actions[bot]` as always noise: it is a shared identity used by DangerJS, schema checkers, and other active reviewers. Classify by content.
- Using the `bk` CLI without checking `bk auth status` first: Keychain tokens expire, and a dead token stalls the cycle. Fall back to the REST API or `gh pr checks`.

## Related Skills

- `pr-creator`: opens the PR; babysitting starts after it exists
- `pr-reviewer`: local diff review for bugs; run it on monitor-authored fixes that grow beyond a trivial patch
- `autoship`: npm release pipelines; it watches its own release CI, so never babysit a release PR autoship is driving
