---
name: pr-babysitter
description: >-
  Monitors an open PR, detects it from the current branch, polls for conflicts,
  CI failures, review comments, and merge readiness, fixes safe issues, and
  reports only state changes. Monitor mode uses the Monitor tool when
  available, falling back to CronCreate/CronDelete; without either, run
  one-shot modes only. Use when asked to "babysit a PR",
  "watch this PR", "keep a PR green", "fix CI", "why is CI red", "resolve
  conflicts", "triage review comments", or "address PR comments". For PR
  creation use pr-creator; for diff review use pr-reviewer; for npm releases
  use autoship.
---

# PR Babysitter

- **IS:** autonomous monitoring of an open PR (conflicts, CI across GitHub Actions/Buildkite/Vercel/Fly.io, review comments, merge readiness) with auto-fixes, plus one-shot CI diagnosis or conflict resolution.
- **IS NOT:** creating the PR (use `pr-creator`), reviewing the diff for bugs (use `pr-reviewer`), or npm release pipelines (use `autoship`, which watches its own release CI; never babysit a release or Version Packages PR that autoship is driving).

## Mode Selection

| Invocation | Mode |
|------------|------|
| "babysit", "watch this PR", "monitor", "keep it green" | Monitor: Phase 1 once, then phases 2-5 on every cron tick |
| "fix CI", "why is CI red", "CI is broken", "loop on CI" | One-shot Phase 3 loop, no cron |
| "resolve conflicts", "fix conflicts" | One-shot Phase 2, no cron |
| "triage review comments", "address the comments" | One-shot Comment Triage Workflow, no cron |

Rules for every mode:

- No setup questions: auto-detect the PR, platforms, and defaults, start immediately. Overrides arrive inline only ("poll every 5 minutes", "enable auto-merge").
- Watch mechanism ladder, checked at Phase 1: (1) Monitor tool available: start a background watch script that diffs PR state itself and emits a line only on transitions. (2) Else CronCreate/CronDelete available: cron polling every tick. (3) Neither: do not claim monitor mode is active. Run the matching one-shot mode, or tell the user this runtime cannot keep polling.
- Skip closed or merged PRs. Skip drafts unless the user explicitly asks.
- Comment triage runs autonomously inside the cycle, no plan approval gate.

## Reference Files

| File | Read when |
|------|-----------|
| `references/monitoring-setup.md` | Monitor start: watch script template, CronCreate fallback, state file format, defaults |
| `references/merge-conflicts.md` | Phase 2: mergeStateStatus table, rebase workflow, auto-resolvable file types |
| `references/ci-platforms.md` | Phase 3: per-platform log/retry commands, Buildkite auth fallback, failure classification, stale-dependency and `knip` handling |
| `scripts/fetch-comments.sh` | Comment triage: run it first. Normalized JSON of every review, thread, and issue comment |
| `references/github-api.md` | Comment triage: GraphQL and REST field sets, thread accounting, anchor recovery, awaiting-reply computation, review staleness, reply and resolve |
| `references/bot-patterns.md` | Comment triage: unlisted-reviewer fallback, bot and human detection, severity mapping, merge-gate verdicts, deduplication, false positives |
| `references/fix-plan-template.md` | Comment triage: audit-trail plan format |
| `references/verification-gate.md` | Before any commit/push: lint, type-check, test, `knip` gate, stray-artifact sweep |
| `references/git-resilience.md` | Any git command hangs or fails transiently (fsmonitor wedge, stale index.lock, IPC blip) |

## Monitor Loop

Phase 1 runs once in the foreground and starts the watch. With the Monitor tool, the watch script gates on transitions in the background: quiet polls never wake the agent, and each emitted event runs phases 2-5. With the cron fallback, every tick runs phases 2-5 and diffs against the previous tick's state file. Either way, only transitions produce output; a quiet poll says nothing.

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

Load `references/monitoring-setup.md` for the watch script template, CronCreate fallback config, and defaults.

1. **Auto-detect the PR**: `gh pr view --json number,url,title,headRefName,baseRefName,mergeable,mergeStateStatus,reviewDecision`. If a PR number was passed, use it. No PR for the branch: say so and stop.
2. **Extract owner/repo**: `gh repo view --json owner,name`
3. **Detect CI platforms** from `gh pr checks` check names (dispatch table in Phase 3)
4. **Start the watch**: prefer the Monitor tool with the watch script from `references/monitoring-setup.md` (`persistent: true`); fall back to CronCreate with `*/2 * * * *` running phases 2-5. Capture the watch/job ID.
5. **Snapshot state** to `.claude/scratchpad/babysit-pr-{N}.md`: watch mechanism and ID, HEAD SHA, mergeable status, check statuses, unresolved thread count, review decision.
6. **Print confirmation**:

```
Monitoring PR #{N}: {title}
Polling every 2 minutes | Auto-resolve noise: yes | Auto-merge: no
Detected CI: {platforms}
Watch: {monitor|cron} ({id})
Current state: {mergeable} | {reviewDecision} | {check_summary}
```

### Phase 2: Conflict Check

Load `references/merge-conflicts.md` for the mergeStateStatus table and resolution strategy.

1. **Check mergeable**: `gh pr view --json mergeable,mergeStateStatus`
   - `MERGEABLE`, up to date → skip to Phase 3
   - `CONFLICTING` → resolve
   - `UNKNOWN` → GitHub still computing; recheck next tick
2. **Rebase**: `git fetch origin {base_branch} && git rebase origin/{base_branch}`
   - clean → `git push --force-with-lease` → notify
   - conflicts only in safe files (lockfiles, generated, changelogs) → auto-resolve per the reference, push
   - logic conflicts in source → `git rebase --abort` → notify with the conflicting files and each side's change

Never push with bare `--force`. A failed `--force-with-lease` means someone else pushed: abort and notify, do not overwrite their commits. If `git fetch` or `git rebase` hangs, see `references/git-resilience.md`.

### Phase 3: CI/CD Check

Load `references/ci-platforms.md` for per-platform commands, the Buildkite auth fallback chain, and the failure-classification decision tree.

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

5. **Classify the failure** per the decision tree: flaky (re-run), stale dependency (reinstall/rebuild before touching source), code error (fix), `knip` (remove dead code or configure), infrastructure (notify; not fixable from code)
6. **Fix, gate, push**: run the verification gate (`references/verification-gate.md`) locally before pushing
7. **Compare with previous state**: flag regressions (was passing, now failing)

**One-shot loop ("fix CI"):** after pushing, run `gh pr checks --watch`; re-diagnose if still red. Exit when checks go green (report it), the failure is infrastructure, or the same check fails twice with the same error after a fix; then summarize instead of thrashing.

### Phase 4: Comment Check

1. **Count two numbers**: open threads, and threads awaiting my reply (newest comment is not mine, in any resolution state, minus a reviewer who resolved their own last comment)
2. **Compare with the state file** on both counts plus the newest comment timestamp across review and issue comments. An edited-in-place bot comment and a reply on a resolved thread both have to register
3. **Any increase** → notify "N new review comments on PR #{N}", then run the Comment Triage Workflow
4. **Auto-resolve noise** only on a positive marker match, with a one-line reason. Never auto-resolve human comments, questions, critical or major findings, or merge-gate comments

### Phase 5: Readiness Check

1. **Ready** = all of: `mergeable == MERGEABLE`, all required checks passing, `reviewDecision == APPROVED` from a review whose `commit_id` is the head SHA, zero open blocking threads, zero threads awaiting my reply, every merge gate satisfied
2. **Merge gates**: an auto-approval assessment reading "Human review required" means this PR will not be auto-approved. Report it as a blocker naming the path criteria that forced it and the human review needed. Never treat it as a finding to fix
3. **Ready** → notify: "PR #{N} is ready to merge. All checks green, reviews approved, no conflicts." Do not merge; auto-merge requires explicit opt-in
4. **Not ready** → report blockers: "Waiting on: 2 checks pending" / "Blocked by: merge conflict" / "Awaiting your answer: {Q} questions from @{reviewer}" / any stale approval
4. **Notify only on transitions**: check went green/red, new review, conflict appeared/cleared, all clear
5. **Write the state file** for the next tick to diff against

## Comment Triage Workflow

Runs inline when Phase 4 finds comments, or one-shot when invoked directly. No plan approval; the plan file is an audit trail.

Load `references/github-api.md` for query templates and `references/bot-patterns.md` for detection rules.

### Fetch

Run `scripts/fetch-comments.sh {N}` first: it emits normalized JSON for every review, thread, and issue comment, with recovered anchors, thread buckets, and `owedReply` already computed. If `bash`, `jq`, or `gh` is unavailable or it exits non-zero, fall back to the queries in the API reference and do these steps by hand.

1. **Identify yourself**: `gh api user --jq .login`. Every reply-owed decision compares against this; `viewerDidAuthor` is unreliable
2. **Reviews first**: REST reviews with `state`, `body`, `user.login`, `commit_id`. Keep the reviewer set: every reviewer must be accounted for in the output
3. **All review threads**: paginated GraphQL with the full field set. Do not filter on `isResolved`. Bucket every thread (open, resolved with an unanswered reply, resolved and quiet, PR-level) and keep all the counts
4. **Page truncated threads**: any thread with `comments.hasNextPage` is re-fetched. Thread comments come oldest first, so the reply you owe is the one a truncated page hides
5. **Recover anchors**: for every thread with a null `line`, walk the anchor ladder. A null `line` means outdated or multi-line, not PR-level
6. **Issue-level comments**: REST conversation comments. Compare `updated_at`, not just `id`: gate and Danger bots edit one comment in place
7. **Early exit** only when all of these are zero: open threads, threads awaiting my reply, actionable reviews, actionable issue comments. Plus every reviewer accounted for

### Classify

1. **Read every inline comment from every author.** A reviewer absent from the bot table is unknown, not noise: triage it as an active reviewer. Noise requires a positive marker match
2. **Classify per comment, not per thread**: a human reply inside a bot's thread is a human comment with full human weight
3. **Author type**: content first, then username. `github-actions[bot]` is shared; a `[bot]` suffix and `__typename` are hints, not verdicts
4. **Severity**: parse the source's markers; unknown sources default to Major
5. **Intent** for human comments: fix request, question, nitpick, or acknowledgement. A question gets an answer, not a code change
6. **Merge gates**: an auto-approval or merge-freeze verdict is a readiness-check input. Record it, never fix it, never resolve it
7. **Deduplicate bots only**: same path within 3 lines, keep the highest severity. Never across the human boundary; a multi-location finding is one item
8. **Disposition**: fix, answer, or ignore with a stated reason. There is no ignore reason for "author unrecognized" or "thread already resolved"

Human comments are never auto-ignored. Classify as fix unless already resolved or the reviewer marked it optional.

### Fix

1. **Write the plan** to `.claude/scratchpad/pr-{N}-review-plan.md` per `references/fix-plan-template.md` (the audit trail)
2. **Print counts** (N to fix, Q questions to answer, K conversation items, M ignored, plus the thread buckets) and proceed immediately
3. **Resolve ignored threads**: brief reply, then resolve via GraphQL
4. **Answer questions**: post the reply, leave the thread unresolved. The reviewer resolves it once the answer lands
5. **Reply on already-resolved threads with an unanswered human reply**: reply in place, do not unresolve, note it in the report
6. **Fix real issues** grouped by commit group; parallelize independent file fixes
7. **Gate, commit, push**: the verification gate (`references/verification-gate.md`) must pass; sweep stray artifacts (e.g. a root `schema.gql` from a hook); one commit per logical group, staging only that group's files
8. **Reply and resolve** each fixed thread via GraphQL
9. **Verify**: re-fetch threads; report open threads, threads still awaiting my reply, and questions answered but not yet acknowledged, plus current CI status

## Stopping

- "Stop babysitting" / "cancel the PR monitor" → cancel the watch using the mechanism and ID from the state file: TaskStop for a Monitor watch, CronDelete for the cron fallback
- PR merged or closed → the Monitor script emits a terminal event and exits; cron detects it on the next tick and self-cancels
- Session exit → watches and jobs are session-scoped, auto-clean

On stop, report a final summary: total polls, fixes applied, conflicts resolved, comments triaged, current state.

## Gotchas

- Skipping a reviewer because it is not in the bot table: unlisted reviewers are the ones posting High-severity bugs. Absent means unknown, not noise.
- Triaging a bot's review body instead of its inline comments: the body is a count, the findings are inline. Cursor and Codex both put every finding in threads.
- Filtering threads on `isResolved == false`: a resolved thread with a reply after the resolve is the comment most likely to be missed, and GitHub collapses it out of sight.
- Treating a null `line` as no location: null means outdated or multi-line. Recover the anchor before deciding anything.
- Reading only the first page of a thread's comments: thread comments come oldest first, so the reply you owe is the one you cannot see.
- Trusting `viewerDidAuthor` to spot your own comments: it returns false even on your own PR. Compare against `gh api user --jq .login`.
- Answering a reviewer's question with a code change: a question wants an answer. Change code only if the honest answer is that it is broken.
- Resolving a thread where you answered a question: only the reviewer knows whether the answer landed.
- Reporting "no comments" because every review body was empty: humans put everything inline. Four empty-body reviews are one review pass with all its content in threads.
- Treating an auto-approval verdict as a finding or as noise: "Human review required" is a merge gate for Phase 5, not something to fix or resolve.
- Counting a stale approval as approval: a review whose `commit_id` is not the head SHA may be dismissed by branch protection.
- Auto-resolving or auto-ignoring human comments: reviewers re-open them and lose trust. Humans classify as fix unless marked optional.
- Resolving a thread without a reply first: the reviewer sees a silent resolve and unresolves it.
- Fixing items the triage classified as ignore: churn nobody asked for; contradicts the audit trail.
- One commit per individual comment: unreadable review history. Group related fixes by commit-group label.
- Committing stray hook artifacts (e.g. a root `schema.gql`): pollutes the PR diff. Sweep `git status --porcelain`, stage only the fix's files.
- Treating a monorepo type-check failure as a code bug: often stale deps or generated types. Reinstall and rebuild first; edit source only if it persists.
- Aborting the monitor on one hung or transient git command: fsmonitor wedges and stale locks are recoverable (`references/git-resilience.md`). Retry first.
- Re-diagnosing while checks are still pending: you fix the wrong thing on a half-finished run. Wait for completion.
- Polling faster than every 2 minutes: burns GitHub API rate limit for no signal. 2 minutes is the floor.
- Using cron when the Monitor tool is available: every quiet tick wakes the agent and burns tokens. The Monitor script diffs in the background; only transitions wake the agent.
- Auto-merging without explicit opt-in: merge is a one-way door. "Ready to merge" is a notification, not an action.
- Classifying `github-actions[bot]` as always noise: shared identity used by DangerJS, schema checkers, and other reviewers. Classify by content.
- Using `bk` CLI without checking `bk auth status` first: Keychain tokens expire; a dead token stalls the cycle. Fall back to the REST API or `gh pr checks`.

## Related Skills

- `pr-creator`: opens the PR; babysitting starts after it exists
- `pr-reviewer`: local diff review for bugs; run it on monitor-authored fixes beyond a trivial patch
- `autoship`: npm release pipelines; it watches its own release CI, so never babysit a release PR it drives
