---
name: pr-babysitter
description: "Monitors or repairs an open GitHub PR: CI failures, conflicts, review threads, and merge readiness, reporting state changes. Use when asked to \"watch this PR\", \"fix CI\", \"resolve conflicts\", or \"address review comments\"."
compatibility: Requires a Git checkout, authenticated GitHub CLI, and jq. Continuous monitoring also needs a supported scheduler or event subscription.
---

# PR Babysitter

- **IS:** keeping one open PR moving: conflicts, CI across GitHub Actions/Buildkite/Vercel/Fly.io, inbound review comments, and merge readiness, then following the merge through the repo's post-merge watch, as a background monitor or as one-shot fixes.
- **IS NOT:** opening or editing the PR (`pr-creator`), reviewing or fixing the diff itself (`tidy`), or npm release PRs (`autoship` watches its own release CI; never babysit a release or Version Packages PR it drives).

## Mode Selection

| Invocation | Mode |
|------------|------|
| "babysit", "watch this PR", "monitor", "keep it green" | Monitor: Phase 1 once, then phases 2-5 on every event or tick |
| "fix CI", "why is CI red", "loop on CI" | One-shot Phase 3 loop |
| "resolve conflicts", "rebase onto main", "update the branch" | One-shot Phase 2 |
| "address the comments", "reply to the reviewers", "triage review comments" | One-shot Comment Triage Workflow |
| "is it ready", "what is blocking the merge" | One-shot Phase 5 report |

Standing rules, every mode:

- Monitoring or fixing code does not by itself authorize posting replies. Post, resolve threads, or request reviews only when the user authorized that communication; otherwise prepare replies and report them.
- Resolve `scripts/fetch-comments.sh` relative to this installed SKILL.md. `${CLAUDE_SKILL_DIR}` below is a Claude Code adapter, not a portable environment variable.

- No setup questions. Auto-detect the PR, the CI platforms, and the defaults (poll every 2 minutes, auto-resolve noise, no auto-merge), then start. Overrides arrive inline: "poll every 5 minutes", "enable auto-merge".
- Skip closed PRs. Skip drafts (`isDraft`) unless asked. A merged PR goes on to the repo's post-merge watch: wait for the `watch/<env>` commit statuses on the merge SHA, stop at the first `failure` or `error`, and report the result (Post-merge Watch in `references/monitoring-setup.md`). If the base it merged onto (the merge commit's first parent, or for a rebase merge the commit before the PR's rebased commits) has no `watch/*` status, report "no post-merge watch". Either way, once the merge is live in production, smoke-test the change there read-only (Production smoke test in the same reference), report that too, and stop.
- Comment triage runs autonomously; the plan file is an audit trail, not an approval gate.
- Speak only on transitions. A quiet poll says nothing.

## Reference Files

| File | Read when |
|------|-----------|
| `references/monitoring-setup.md` | Phase 1, a merged PR, and Stopping: watch ladder, Monitor watch script, cron fallback, post-merge watch, state file format, defaults, stop and lifecycle |
| `references/merge-conflicts.md` | Phase 2: `mergeStateStatus` table, rebase workflow, lockfile and generated-file resolution, abort criteria |
| `references/ci-platforms.md` | Phase 3: `gh pr checks` fields and exit codes, per-platform log and retry commands, Buildkite auth chain, failure classification |
| `scripts/fetch-comments.sh` | Comment triage: run `${CLAUDE_SKILL_DIR}/scripts/fetch-comments.sh {N}` first. One JSON document of every review, thread, and issue comment; `--help` prints the output shape |
| `references/github-api.md` | Comment triage: script output contract, thread accounting, anchor ladder, awaiting-reply rule, reply and resolve |
| `references/bot-patterns.md` | Comment triage: reviewer detection, severity mapping, merge gates, noise markers, dedup, false positives |
| `references/fix-plan-template.md` | Comment triage: plan file format and the legal ignore reasons |
| `references/verification-gate.md` | Before any commit: lint, type-check, test, `knip`, stray-artifact sweep |
| `references/git-resilience.md` | A git command hangs or fails transiently (fsmonitor wedge, stale `index.lock`, network blip) |
| `evals/evals.json` | Only when changing this skill; never during a PR task |

## Monitor Loop

Phase 1 runs once in the foreground and starts the watch. Every event or tick then runs phases 2-5, diffs against the state file, and speaks only when something changed.

Copy this checklist to track progress:

```text
PR babysit progress:
- [ ] Phase 1: Initialize (detect PR, pick watch mechanism, snapshot state)
- [ ] Phase 2: Conflict check
- [ ] Phase 3: CI check (diagnose, fix, gate, push)
- [ ] Phase 4: Comment check (triage new comments)
- [ ] Phase 5: Readiness check (report transitions, write state file)
- [ ] After merge: post-merge watch until watch/* passes, fails, or is absent, then a read-only production smoke test
```

### Phase 1: Initialize

1. `gh pr view [N] --json number,url,title,state,isDraft,headRefName,baseRefName,headRefOid,mergeable,mergeStateStatus,reviewDecision`. No PR for the branch: say so and stop.
2. `gh repo view --json owner,name` for the calls that need `owner/repo`.
3. Detect CI platforms from `gh pr checks --json name,link` (pattern table in `references/ci-platforms.md`).
4. Pick the watch mechanism: the first rung of the watch ladder in `references/monitoring-setup.md` that applies (harness PR subscription, Monitor tool, cron, none). With no rung, do not claim monitor mode: run the matching one-shot mode or say this runtime cannot keep polling.
5. Snapshot state to `.claude/pr-babysitter/babysit-pr-{N}.md`: mechanism and ID, head SHA, mergeability, check states, open and awaiting-reply thread counts, review decision. This folder is never staged.
6. Confirm in five lines: PR, watch mechanism and ID, detected CI, current state, defaults in effect.

### Phase 2: Conflict Check

`gh pr view --json mergeable,mergeStateStatus`. `DIRTY` resolves; `BEHIND` updates; `UNKNOWN` means GitHub is still computing, recheck next tick; anything else moves on.

```bash
git fetch origin {base} && git rebase origin/{base}
git push --force-with-lease --force-if-includes
```

- Clean rebase: push, notify.
- Conflicts only in lockfiles, generated files, or changelogs: regenerate per the reference, continue the rebase, push.
- Conflicts in source logic, migrations, or API contracts: `git rebase --abort`, then notify with the files and what each side changed. Human intent decides those.

Bare `--force` is never used. A refused lease means someone else pushed: abort and notify rather than overwrite their commits. More than one author on the branch means a rebase rewrites their commits: merge `origin/{base}` instead.

### Phase 3: CI Check

1. `gh pr checks --json name,state,bucket,link,workflow`. `bucket` is `pass`, `fail`, `pending`, `skipping`, or `cancel`; `link` is the details URL.
2. Anything `pending`: wait. Diagnosing a half-finished run fixes the wrong thing.
3. Every `fail`: fetch logs with the platform's commands in `references/ci-platforms.md` (GitHub Actions, Buildkite auth chain, Vercel, Fly.io).
4. Classify per the reference: flaky (re-run once), stale dependency (reinstall and rebuild before touching source), code error (fix), `knip` (delete dead code or configure), infrastructure (notify; not fixable from code).
5. Fix, run the verification gate, commit, push. Flag regressions against the previous state (was passing, now failing).

**One-shot loop ("fix CI"):** after each push, `gh pr checks --watch --fail-fast` (exit 0 green, 1 a check failed, 8 still pending). Stop and summarize when checks are green, the failure is infrastructure, or the same check fails twice with the same error after a fix. Two identical failures is the signal to stop pushing, not to try a third variant.

### Phase 4: Comment Check

1. Count open threads and threads awaiting my reply (newest comment not mine, in any resolution state, minus a reviewer who resolved their own last comment).
2. Compare both counts and the newest `updated_at` across review and issue comments against the state file. An edited-in-place bot comment and a reply on a resolved thread both have to register.
3. Any increase: run the Comment Triage Workflow, then notify "N new review comments on PR #{N}", counting only comments that are not noise. A poll whose new comments are all noise (such as the sticky `<!-- pr-evidence -->` comment, edited on every push) is a quiet poll.

### Phase 5: Readiness Check

1. Ready means all of: `mergeable == MERGEABLE`, every required check `pass`, `reviewDecision == APPROVED` from a review whose `commit_id` is the head SHA, zero open blocking threads, zero threads awaiting my reply, every merge gate satisfied.
2. A merge-gate comment reading "Human review required" is a blocker to report with the criteria that forced it, not a finding to fix.
3. Ready: notify "PR #{N} is ready to merge." Merge is a one-way door: `gh pr merge --auto` with the repo's merge method, and only when the user opted in.
4. Not ready: name the blockers ("Waiting on: 2 checks pending", "Awaiting your answer: 2 questions from @reviewer", "Approval is stale: reviewed abc1234, head def5678").
5. Write the state file for the next tick.

## Comment Triage Workflow

Inline from Phase 4 or one-shot. Autonomous: no approval gate, the plan file is the audit trail.

### Fetch

Run `${CLAUDE_SKILL_DIR}/scripts/fetch-comments.sh {N}`. It pages every thread and every thread's comments, recovers anchors, buckets threads, and computes `owedReply` against your own login. A non-zero exit prints one sentence on stderr saying why; fix that cause and re-run rather than hand-writing queries.

Check `reviewers[]` before classifying: every login that spoke must appear in the output with findings, a verdict, or an explicit "no content". A reviewer with reviews but zero comments is a fetch that lost something. `anchor.source == "needs-translation"` means finish the anchor ladder against the working tree before judging that finding.

Early exit only when open threads, awaiting-reply threads, actionable reviews, and actionable issue comments are all zero.

### Classify

- Every inline comment from every author is read. An author absent from the bot table is unknown, not noise; noise needs a positive marker match.
- Classify per comment, not per thread: a human reply inside a bot's thread carries full human weight.
- Author type from content first, then login. `github-actions[bot]` is shared by reviewers and noise alike.
- Severity from the source's own markers; unknown sources default to Major. Severity orders the queue; it never decides whether a comment is read.
- Human intent: fix request, question, nitpick, or acknowledgement. A question gets an answer, not a code change. Human comments are never auto-ignored: fix unless the reviewer marked it optional.
- Merge-gate verdicts are Phase 5 inputs: record, never fix, never reply, never resolve.
- Deduplicate bots only (same path within 3 lines, keep the highest severity). A multi-location finding is one item.
- Every ignore carries one of the legal reasons from the plan template. "Author unrecognized" and "thread already resolved" are not among them.

### Fix

1. Write the plan (`references/fix-plan-template.md`) to `.claude/pr-babysitter/pr-{N}-review-plan.md`, print the counts, proceed.
2. Ignored threads: one-line reply, then resolve.
3. Questions: post the answer, leave the thread open. The reviewer resolves it.
4. Resolved threads with an unanswered human reply: reply in place, do not unresolve, note it in the report.
5. Fixes, one commit per logical group. Run the verification gate before each commit and stage only that group's files.
6. Reply, then resolve, each fixed thread.
7. Re-run the script and report: open threads, threads still awaiting my reply, questions answered but not yet acknowledged, and current CI status. The re-run is the evidence; "addressed everything" is not.

## Stopping

"Stop babysitting" or "cancel the monitor": stop the mechanism recorded in the state file per `references/monitoring-setup.md` (Stopping, Session Lifecycle), then report polls or events handled, fixes applied, conflicts resolved, comments triaged, and current state.

## Gotchas

- Filtering threads on `isResolved == false`: GitHub collapses resolved threads, so a human reply posted after the resolve is the comment most likely to go unread.
- `comments(first: 20)`: thread comments arrive oldest first, so a truncated page hides the newest comment, the one that decides whether you owe a reply. The script pages every thread to the end.
- `viewerDidAuthor` returned `false` on the viewer's own comments. Compare `author.login` to `gh api user --jq .login`.
- A null `line` means outdated or multi-line, not PR-level. Only a null `path` is PR-level. Recover the anchor before deciding anything.
- Triaging a bot's review body: the body is a count. Codex, Devin, Copilot, and Bugbot all put findings inline. Four empty-body human reviews are one review pass with its content in threads, not four reviewers with nothing to say.
- Bots that edit one comment in place (auto-approval assessments, DangerJS) keep the same `id`, so a state diff on ids sees nothing. Compare `updated_at`.
- Counting a review whose `commit_id` is not the head SHA as an approval: branch protection with "dismiss stale approvals" drops it on the next push, and the PR reads ready until then.
- `git add -A` after a fix commits hook artifacts (a root `schema.gql`) into the PR. Sweep `git status --porcelain` and stage paths.
- Resolving a thread without replying first: the reviewer sees a silent resolve and unresolves it.
- A subscription-only watch never sees conflicts: GitHub emits no webhook when the base branch advances into one.
- Cron when Monitor is available wakes the agent on every quiet tick and burns tokens for no signal. Polling under 2 minutes does the same to the GitHub rate limit.

## Related Skills

- `pr-creator`: opens or edits the PR; babysitting starts after it exists
- `planning`: writes plans a fresh session executes. The fix plan this skill writes is an audit trail for one PR, not a `planning` deliverable
- `tidy`: reviews and fixes the diff itself; this skill applies GitHub review comments. Run it on monitor-authored fixes beyond a trivial patch
- `autoship`: npm release pipelines; it watches its own release CI, so never babysit a release PR it drives
