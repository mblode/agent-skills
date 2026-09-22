---
name: ship
description: Ships work through GitHub and npm. Opens or rewrites a PR with a house-style title, Linear ID, and a body that says why plus a Risk and Proof section; runs a changesets npm release through the Version Packages PR, OIDC publish, and registry check; and once a PR is open, answers or resolves every review thread, handles conflicts safely, and reports merge readiness. Use when asked to "create a PR", "write the PR description", "polish this PR", "ship it", "release this package", "merge Version Packages", "why didn't it publish", "address the review comments", "reply to the reviewers", "resolve conflicts", or "is this ready to merge". For reviewing the diff itself use tidy; for PR size, review capacity, required checks, and CI speed use gates; for a new package use scaffold.
compatibility: Requires Git, an authenticated GitHub CLI, and jq. Release mode also needs Node.js and a changesets-based npm release workflow.
---

# Ship

Move a change from a branch to merged, or from the default branch to npm, with a PR a reviewer can trust and no review thread left unanswered. Watching the PR is the host's job; this skill supplies what to write, what counts as answered, and what counts as ready.

- **IS:** the PR itself (title, body, Linear link, template, draft state, commit shape); changesets npm releases from changeset file to registry; follow-through on an open PR: review-thread accounting, replies, conflicts, merge readiness.
- **IS NOT:** reviewing or fixing the diff for bugs (`tidy`); PR size budgets, review capacity, required checks, hooks, and CI speed (`gates`); a new package and its bootstrap publish (`scaffold`); prose in the user's voice outside the PR body (`ghostwriter`).

## Modes

| Mode | Triggers | Done means |
|------|----------|------------|
| **PR** | "create a PR", "open a PR", "write or rewrite the PR description", "polish this PR", "ship it" on a feature branch | The PR exists or is updated to the contract below, and the URL from `gh pr view --json url,title` is returned |
| **Release** | "release this package", "publish", "merge Version Packages", "why didn't it publish", "ship it" in a changesets repo on the default branch | `npm view <pkg>@<version> version` prints the new version and `npm view <pkg> dist-tags` shows `latest` on it (unless pre mode), both quoted in the report. A diagnosis ends at the named cause and fix, with nothing re-run |
| **Follow-through** | "address the review comments", "reply to the reviewers", "resolve conflicts", "is it ready to merge", a host PR event (CI failure, new review) | A fresh run of `scripts/merge-ready.sh` shows zero owed replies, and every blocker it lists is fixed or named in the report |

"Ship it" means PR mode unless the repo has a `.changeset/` folder and the user is on the default branch or says release or publish. Never follow-through on a Version Packages PR that Release mode is driving.

## Reference Files

| File | Read when |
|------|-----------|
| `references/pr.md` | PR mode: title and body rules, examples, templates, the create and edit commands, `gh` failure modes |
| `references/pr-polish.md` | Commits carry fixup, WIP, or "address review" noise, `gates` flags the diff as over the review budget, or the user asks to squash, restructure, or split |
| `references/release.md` | Release mode: the two-run release loop, changeset file, release commit, CI watch, failure recovery |
| `references/version-pr-and-publish.md` | Release CI is green, or diagnosing a release that versioned but did not publish: workflow shape, merge preconditions, publish failure table, npm verification |
| `references/follow-through.md` | Follow-through mode: script output, thread buckets, awaiting-reply rule, anchor ladder, legal ignore reasons, reply and resolve, conflicts, CI failures, readiness |
| `references/bot-patterns.md` | Classifying comments from bots or unfamiliar reviewers: severity markers, merge-gate verdicts, noise markers, dedup, false positives |

## Scripts

Resolve each path against the directory holding this SKILL.md (Claude Code exposes it as `${CLAUDE_SKILL_DIR}`). Each needs `gh` and `jq`, prints JSON or event lines on stdout, and one sentence on stderr on failure; `--help` prints the interface.

| Script | Contract |
|--------|----------|
| `scripts/fetch-comments.sh [<pr>] [--repo owner/name]` | Pages every review, thread, and thread comment to the end; buckets each thread; computes `owedReply` against your login; lists every reviewer who spoke |
| `scripts/merge-ready.sh [<pr>] [--repo owner/name]` | Readiness verdict against the criteria below. Exit 0 ready, 2 blocked with `blockers[]`, 1 error |
| `scripts/watch-commit.sh [<sha>]` | Release CI watch on one commit: a block per state change, then one `TERMINAL: success` or `TERMINAL: failure` line |

## Authority

Invoking the skill is consent for its mode's normal flow. Announce in one line, then act, without re-confirming:

- push a branch you own, create or edit the PR, write changesets, commit fixes staged by explicit path
- rerun a failed CI job, fix a failure the change caused, and push again: the rerun and the push touch only this branch's CI
- merge the Version Packages PR once its head is `changeset-release/<default-branch>`, every check reports `bucket: pass`, and it is `MERGEABLE`
- post replies and resolve threads when the user asked to address or reply to comments. A host event on its own authorizes fixes and pushes, not posts: put the drafted replies in the report

Ask first: merging a feature PR (on opt-in, `gh pr merge --auto` with the repo's merge method), rewriting history already pushed under an open PR, changing repository or npm settings.

## Never

Each of these is an observed failure; none has an exception.

- **Force-push someone else's commits.** More than one author in `git log origin/<base>..HEAD --format='%ae' | sort -u` means merge the base in instead of rebasing. On your own branch use `--force-with-lease --force-if-includes`; a refused lease means someone pushed, so stop and report.
- **Go green by weakening the check.** No skipped, deleted, or narrowed tests; no conditionals or test-only headers that make a test pass under CI; no lowered thresholds; no `--no-verify`. Agents have forced e2e green this way, and the bug ships under a green badge.
- **Push an empty commit to kick CI.** Rerun the job (`gh run rerun <id> --failed`). The same check failing twice with the same error after a fix is the signal to stop and report, not to try a third variant.
- **Stage with `git add -A`.** Hooks leave artifacts (a root `schema.gql`) that ride into the PR. Sweep `git status --porcelain`, stage explicit paths.
- **Version or publish locally.** No `changeset version`, no `npm publish`, no hand edits to `CHANGELOG.md` or the package `version`; CI owns all four.
- **Override a gate.** No `gh pr merge --admin`, and never reply to, fix, or resolve a merge-gate verdict.

## PR contract

The reviewer has none of your context, so the body answers what the diff cannot: why, what could break, and what proves it did not. Reviewers skip AI-written descriptions; what they still read is the risk and the evidence, so that section is never padding and never invented.

- **Title:** `ABC-123: Add auth flow` with a Linear ID, `Add auth flow` without; under 60 characters, no trailing period. A repo that lints PR titles gets its shape with the ID at the end.
- **Body:** one short paragraph, what changed and why, only the why that the prompt, issue, branch, commits, or diff actually state. Length follows the change.
- **Risk and Proof**, after the paragraph, in the shape `gates` requires of every agent PR (if the two ever differ, the `gates` shape wins):

  ```markdown
  ## Risk
  - Blast radius: <what breaks for whom if this is wrong>
  - Touches: <auth | tenancy | migration | money | infra | none>
  - Rollback: <revert | flag off | down migration>

  ## Proof
  - `<command>` -> <last line of its output>
  - <acceptance check from the ticket> -> <observed result>
  - Evidence level: <cached | fresh tests | build | runtime startup>
  - Not verified: <what was not run, and why>
  ```

  One line per field, drop a Proof bullet that has nothing true to say. Proof quotes commands run in this session and their result; a command you did not run never appears as passed. The evidence level is stated because a cached green run once hid a test that failed on a cold clone. A Proof that says only "tests pass" is not ready for review.

`references/pr.md` has the rest: Linear partial-work links, drafts, reviewers, templates, the footer, examples, and the `gh` failure modes.

## Follow-through contract

Every unresolved thread ends answered or resolved, and the evidence is the script's second run, not memory.

- A fix gets a commit, then a reply, then a resolve. A reviewer's question gets an answer and stays open; the reviewer resolves it. An ignored finding carries one legal reason from `references/follow-through.md`, a one-line reply, then a resolve. A resolved thread with an unanswered human reply gets a reply in place, not an unresolve.
- **Ready** means all of: the PR is open and not a draft; `mergeable` is `MERGEABLE`; every required check reports `pass`; `reviewDecision` is `APPROVED` from a review whose `commit_id` is the head SHA (or no review is required); zero threads with `owedReply`; every merge-gate verdict satisfied. `scripts/merge-ready.sh` checks all but the last, which needs the gate comments read.
- Watching belongs to the host. When asked to watch a PR, subscribe with the host's PR subscription tool if it exposes one (`Claude_Code_Remote:subscribe_pr_activity`, `github:subscribe_pr_activity`) and handle each event once; this skill starts no polling loop, cron, or state file. If the subscription reports another agent already watching, say so and do not also push fixes: two agents on one branch trip each other's leases.

## Gotchas

- `gh pr checks --json conclusion,detailsUrl` and `gh pr list --json headBranch` error: the fields are `bucket`, `link`, and `headRefName`.
- Filtering threads on `isResolved == false` misses the comment most likely to be owed a reply: a human reply posted after the thread was resolved.
- An approval whose `commit_id` is not the head SHA reads as ready until branch protection dismisses it on the next push. Report it as stale.
- A PR subscription never fires when the base branch advances into a conflict. Check `mergeStateStatus` on every event that does arrive.
- A wrong Linear ID in the title links the PR to someone else's issue and moves it to Done on merge. No ID found means no prefix.
- Posting before the fix lands, or resolving without a reply: the reviewer sees a silent resolve and unresolves it.

Maintenance only: `evals/evals.json` holds the behavioural scenarios and routing prompts for anyone changing this skill. It never loads during a user task.
