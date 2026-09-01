---
name: pr-babysitter
description: >-
  Keeps an open GitHub PR moving to merge: detects the PR from the current
  branch, watches for merge conflicts, red CI (GitHub Actions, Buildkite,
  Vercel, Fly.io), inbound review comments, and merge readiness, fixes what is
  safe, and reports only state changes. Also runs one-shot: diagnose and fix
  CI, rebase and resolve conflicts, or triage and answer review comments. Use
  when asked to "babysit a PR", "watch this PR", "keep the PR green", "fix
  CI", "why is CI red", "resolve conflicts", "rebase onto main", "address the
  review comments", "reply to the reviewers", "is this PR ready to merge", or
  "what is blocking the merge". For opening or editing the PR use pr-creator;
  for reviewing the local diff use pr-reviewer; for applying a pr-reviewer
  report use tidy; for npm release PRs use autoship.
---

# PR Babysitter

- **IS:** keeping one open PR moving: conflicts, CI across GitHub Actions/Buildkite/Vercel/Fly.io, inbound review comments, and merge readiness, as a background monitor or as one-shot fixes.
- **IS NOT:** opening or editing the PR (`pr-creator`), reviewing the diff for bugs (`pr-reviewer`), applying a local `pr-reviewer` report (`tidy`), or npm release PRs (`autoship` watches its own release CI; never babysit a release or Version Packages PR it drives).

## Mode Selection

| Invocation | Mode |
|------------|------|
| "babysit", "watch this PR", "monitor", "keep it green" | Monitor: Phase 1 once, then phases 2-5 on every event or tick |
| "fix CI", "why is CI red", "loop on CI" | One-shot Phase 3 loop |
| "resolve conflicts", "rebase onto main", "update the branch" | One-shot Phase 2 |
| "address the comments", "reply to the reviewers", "triage review comments" | One-shot Comment Triage Workflow |
| "is it ready", "what is blocking the merge" | One-shot Phase 5 report |

Standing rules, every mode:

- No setup questions. Auto-detect the PR, the CI platforms, and the defaults (poll every 2 minutes, auto-resolve noise, no auto-merge), then start. Overrides arrive inline: "poll every 5 minutes", "enable auto-merge".
- Skip closed or merged PRs. Skip drafts (`isDraft`) unless asked.
- Comment triage runs autonomously; the plan file is an audit trail, not an approval gate.
- Speak only on transitions. A quiet poll says nothing.

## Reference Files

| File | Read when |
|------|-----------|
| `references/monitoring-setup.md` | Phase 1: watch ladder detail, Monitor watch script, cron fallback, state file format, defaults |
| `references/merge-conflicts.md` | Phase 2: `mergeStateStatus` table, rebase workflow, lockfile and generated-file resolution, abort criteria |
| `references/ci-platforms.md` | Phase 3: `gh pr checks` fields and exit codes, per-platform log and retry commands, Buildkite auth chain, failure classification |
| `scripts/fetch-comments.sh` | Comment triage: run `${CLAUDE_SKILL_DIR}/scripts/fetch-comments.sh {N}` first. One JSON document of every review, thread, and issue comment; `--help` prints the output shape |
| `references/github-api.md` | Comment triage: script output contract, manual GraphQL/REST fallback, thread accounting, anchor ladder, awaiting-reply rule, reply and resolve |
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
```

### Phase 1: Initialize

1. `gh pr view [N] --json number,url,title,state,isDraft,headRefName,baseRefName,headRefOid,mergeable,mergeStateStatus,reviewDecision`. No PR for the branch: say so and stop.
2. `gh repo view --json owner,name` for the calls that need `owner/repo`.
3. Detect CI platforms from `gh pr checks --json name,link` (dispatch table in Phase 3).
4. Pick the watch mechanism: first rung that applies.

| Rung | Available when | Behaviour |
|------|----------------|-----------|
| Harness PR subscription | A PR-subscription tool is exposed (cloud sessions: `Claude_Code_Remote:subscribe_pr_activity`; GitHub MCP server: `github:subscribe_pr_activity`), or the web session's Auto-fix toggle is on | GitHub pushes review comments, CI failures, and check-suite success into the session. GitHub sends nothing when the base branch advances, so pair it with a slow Monitor poll (10 minutes) on `mergeStateStatus`. If the tool reports a PR Steward already watching, this session gets no events: say the PR is already covered and offer the one-shot modes instead of double-fixing |
| Monitor tool | `Monitor` is in the tool list | Start the watch script from the monitoring reference with `persistent: true`. Quiet polls never wake the agent; each emitted line runs phases 2-5 |
| Cron | `CronCreate` is in the tool list | `*/2 * * * *` running phases 2-5; every tick wakes the agent. Recurring tasks expire after 7 days |
| None | Neither | Do not claim monitor mode. Run the matching one-shot mode, or say this runtime cannot keep polling |

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
3. Every `fail`: fetch logs by platform.

| Check `name` or `link` | Platform | Logs |
|------------------------|----------|------|
| `buildkite/` prefix | Buildkite | `bk` CLI when `bk auth status` passes, else REST with `BUILDKITE_API_TOKEN`, else hand over the `link` |
| `vercel` in name or `vercel.com` in link | Vercel | `vercel inspect --logs {deployment_url}` (build logs; `vercel logs` is runtime) |
| `fly-` prefix or `fly.io` in link | Fly.io | `flyctl logs --app {app} --no-tail` |
| Anything else | GitHub Actions | `gh run view {run_id} --log-failed` |

4. Classify per the reference: flaky (re-run once), stale dependency (reinstall and rebuild before touching source), code error (fix), `knip` (delete dead code or configure), infrastructure (notify; not fixable from code).
5. Fix, run the verification gate, commit, push. Flag regressions against the previous state (was passing, now failing).

**One-shot loop ("fix CI"):** after each push, `gh pr checks --watch --fail-fast` (exit 0 green, 1 a check failed, 8 still pending). Stop and summarize when checks are green, the failure is infrastructure, or the same check fails twice with the same error after a fix. Two identical failures is the signal to stop pushing, not to try a third variant.

### Phase 4: Comment Check

1. Count open threads and threads awaiting my reply (newest comment not mine, in any resolution state, minus a reviewer who resolved their own last comment).
2. Compare both counts and the newest `updated_at` across review and issue comments against the state file. An edited-in-place bot comment and a reply on a resolved thread both have to register.
3. Any increase: notify "N new review comments on PR #{N}" and run the Comment Triage Workflow.

### Phase 5: Readiness Check

1. Ready means all of: `mergeable == MERGEABLE`, every required check `pass`, `reviewDecision == APPROVED` from a review whose `commit_id` is the head SHA, zero open blocking threads, zero threads awaiting my reply, every merge gate satisfied.
2. A merge-gate comment reading "Human review required" is a blocker to report with the criteria that forced it, not a finding to fix.
3. Ready: notify "PR #{N} is ready to merge." Merge is a one-way door: `gh pr merge --auto` with the repo's merge method, and only when the user opted in.
4. Not ready: name the blockers ("Waiting on: 2 checks pending", "Awaiting your answer: 2 questions from @reviewer", "Approval is stale: reviewed abc1234, head def5678").
5. Write the state file for the next tick.

## Comment Triage Workflow

Inline from Phase 4 or one-shot. Autonomous: no approval gate, the plan file is the audit trail.

### Fetch

Run `${CLAUDE_SKILL_DIR}/scripts/fetch-comments.sh {N}`. It pages every thread and every thread's comments, recovers anchors, buckets threads, and computes `owedReply` against your own login. A non-zero exit prints one sentence on stderr saying why; fall back to the manual queries in the API reference only when `gh` or `jq` cannot be installed.

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

- "Stop babysitting" / "cancel the monitor": read the mechanism and ID from the state file. Monitor watch: `TaskStop`. Cron: `CronDelete`. Harness subscription: the matching unsubscribe tool.
- PR merged or closed: the watch script emits `TERMINAL` and exits; cron detects it next tick and self-cancels.
- Session exit: watches and cron jobs are session-scoped and clean themselves up. Background tasks are not restored on `--resume`; re-run the skill.

On stop, report: polls or events handled, fixes applied, conflicts resolved, comments triaged, current state.

## Gotchas

- `gh pr checks --json name,state,conclusion,detailsUrl` errors: `conclusion` and `detailsUrl` belong to `gh pr view --json statusCheckRollup`. The check fields are `bucket` and `link`.
- Filtering threads on `isResolved == false`: GitHub collapses resolved threads, so a human reply posted after the resolve is the comment most likely to go unread.
- `comments(first: 20)`: thread comments arrive oldest first, so a truncated page hides the newest comment, the one that decides whether you owe a reply. The script pages every thread to the end.
- `viewerDidAuthor` returned `false` on the viewer's own comments. Compare `author.login` to `gh api user --jq .login`.
- A null `line` means outdated or multi-line, not PR-level. Only a null `path` is PR-level. Recover the anchor before deciding anything.
- Triaging a bot's review body: the body is a count. Codex, Devin, Copilot, and Bugbot all put findings inline. Four empty-body human reviews are one review pass with its content in threads, not four reviewers with nothing to say.
- Bots that edit one comment in place (auto-approval assessments, DangerJS) keep the same `id`, so a state diff on ids sees nothing. Compare `updated_at`.
- Counting a review whose `commit_id` is not the head SHA as an approval: branch protection with "dismiss stale approvals" drops it on the next push, and the PR reads ready until then.
- `vercel logs {url}` streams runtime logs. A failed build lives in `vercel inspect --logs {url}`.
- `bk` without `bk auth status` first: keychain tokens expire and a dead token stalls the cycle. Fall through to REST, then the check `link`.
- A monorepo type-check failure pointing into a sibling package's `dist` is usually stale build output. Reinstall and rebuild before editing source.
- `git add -A` after a fix commits hook artifacts (a root `schema.gql`) into the PR. Sweep `git status --porcelain` and stage paths.
- Resolving a thread without replying first: the reviewer sees a silent resolve and unresolves it.
- A subscription-only watch never sees conflicts: GitHub emits no webhook when the base branch advances into one.
- Cron when Monitor is available wakes the agent on every quiet tick and burns tokens for no signal. Polling under 2 minutes does the same to the GitHub rate limit.

## Related Skills

- `pr-creator`: opens or edits the PR; babysitting starts after it exists
- `planning`: writes plans a fresh session executes. The fix plan this skill writes is an audit trail for one PR, not a `planning` deliverable
- `pr-reviewer`: local diff review for bugs; run it on monitor-authored fixes beyond a trivial patch
- `tidy`: applies a `pr-reviewer` report to the working tree; this skill applies GitHub review comments
- `autoship`: npm release pipelines; it watches its own release CI, so never babysit a release PR it drives
