# GitHub API Reference

Read, reply to, and resolve PR review threads, comments, and reviews. `scripts/fetch-comments.sh` does the fetching; this reference is its output contract, the rules it applies, and the write calls.

## Contents

- [Script output contract](#script-output-contract)
- [Thread accounting](#thread-accounting)
- [Anchor recovery ladder](#anchor-recovery-ladder)
- [Awaiting my reply](#awaiting-my-reply)
- [Reply to a thread](#reply-to-a-thread)
- [Reply to an issue-level comment](#reply-to-an-issue-level-comment)
- [Resolve a thread](#resolve-a-thread)

## Script output contract

`${CLAUDE_SKILL_DIR}/scripts/fetch-comments.sh [<pr>] [--repo owner/name]` pages every review thread and every thread's comments (oldest first, so a truncated page would hide the newest comment that decides whether you owe a reply), applies the accounting and awaiting-reply rules below, then prints one JSON document (`--help` prints the shape). A non-zero exit carries one sentence on stderr naming the cause; fix that cause (usually `gh auth login` or installing `jq`) and re-run. There is no hand-written fallback.

```
{ me, repo, pr, headRefOid, counts, reviewers, reviews[], threads[], issueComments[] }
```

`counts`: `threads`, `open`, `resolvedWithUnansweredReply`, `resolvedQuiet`, `prLevel`, `outdated`, `collapsed`, `awaitingReply`, `anchorsNeedingWork`, `reviews`, `staleReviews`, `issueComments`.

`reviewers[]`: `login` (canonicalized, `[bot]` suffix stripped), `isBot`, `isMe`, `reviews`, `inlineComments`, `issueComments`, `emptyBodyReviews`. Reconcile against this: a reviewer with reviews but no comments and no verdict means something was missed.

`threads[]`: `id`, `path`, `subjectType`, `isResolved`, `isOutdated`, `isCollapsed`, `resolvedBy`, `anchor {line, startLine, endLine, side, source}`, `threadAuthor`, `lastComment {author, isMe, isBot, createdAt, url}`, `owedReply`, `bucket`, `commentCount`, `comments[]`.

`comments[]`: `databaseId`, `author`, `authorTypename`, `isMe`, `isBot`, `createdAt`, `url`, `replyTo`, `commit`, `originalCommit`, `line`, `startLine`, `originalLine`, `originalStartLine`, `outdated`, `diffHunk`, `body`, `bodyStripped`, `severityHints[]`, `embeddedAnchors[]`.

Two things the script deliberately does not do:

- **`severityHints` is an array of raw tokens, verbatim** (`"High Severity"`, `"P2"`, `"BUG_"`, `"🟡"`), not a severity. It never picks a winner, because one comment can carry two complementary tokens. Mapping and precedence are the bot-patterns rules.
- **`anchor.source` of `needs-translation`** means rungs 1 to 3 missed and only `originalLine`/`diffHunk` remain. Those rungs need the working tree, so finish them yourself. `path-only` means the ladder is exhausted.

`staleReviews` counts reviews whose `commit_id` is not `headRefOid`. Their findings may already be fixed, so re-verify each against the current file before fixing it, and report such an approval as stale (branch protection that dismisses stale approvals drops it on the next push).

`bucket` and `owedReply` apply the accounting and reply rules below, including the `resolvedBy` carve-out. `bodyStripped` uses generic strippers only, so a bot-specific footer may survive; strip the rest per its bot's entry.

## Thread accounting

Put every thread in exactly one bucket and report all the counts. **Never drop a bucket silently.**

| Bucket | Predicate | Handling |
|--------|-----------|----------|
| Open | `isResolved == false` | Triage |
| Resolved with an unanswered reply | `isResolved == true`, the newest comment's author is neither you nor a bot, and `resolvedBy.login` is **not** that same author | Triage. Reply without unresolving, and say in the report that it was already resolved |
| Resolved and quiet | `isResolved == true` otherwise | Count only |
| PR-level | `path == null` | Not inline. Reply only, no resolve |

`isResolved == true` means someone pressed a button, not that the conversation ended. GitHub collapses resolved threads out of sight, so a human reply landing after a resolve is the single comment most likely to go unread. `isCollapsed` is a display state that follows resolution and outdatedness; it is never a filter, only a number to report.

The `resolvedBy` carve-out matters: a reviewer who writes the last comment **and** resolves the thread is closing the conversation themselves ("Fixed in abc1234", then resolve). Without the carve-out those threads count as awaiting your reply forever and readiness never clears. GitHub exposes no resolution timestamp, so this cannot distinguish a reply posted after a resolve; when the last comment reads like it expects an answer, treat it as awaiting regardless of who resolved it.

Report line:

```
Threads: {open} open, {resolved} resolved ({with_reply} with a reply after the resolve), {outdated} outdated, {collapsed} collapsed
```

## Anchor recovery ladder

`line` comes back `null` for outdated and multi-line threads. Walk this ladder, stop at the first rung that hits, and record which rung produced the anchor:

1. `line`, with `startLine` when the thread spans a range. Anchors on the current diff.
2. `startLine` alone, when `line` is null but `startLine` is set.
3. `subjectType == FILE`: there is no line to find. Anchor at the path and stop, ahead of the translation rungs below.
4. `originalLine` / `originalStartLine` with the comment's `originalCommit.oid`: the line number as of the commit the comment was written against. Translate with `git diff <original_commit>..HEAD -- <path>`.
5. `diffHunk`: its last line is the commented line. Grep that text in the current file to get today's line number. This is the rung that survives a rebase renumbering the whole file.
6. Nothing left: anchor at `path`, mark the item `anchor: path-only`, and say so in the plan.

**A null `line` is not a PR-level comment. Only a null `path` is.** Never drop a finding for want of a line number, and never guess one: an unanchored finding is reported with `anchor: path-only`, not ignored.

Cross-check with REST when the nulls are confusing:

```bash
gh api --paginate "repos/{owner}/{repo}/pulls/{pr}/comments?per_page=100"
```

It returns the same anchors under `line`, `original_line`, `start_line`, `original_start_line`, `position`, `original_position`, `diff_hunk`, `side`, `in_reply_to_id`, `commit_id`, and `original_commit_id`, flat per comment and easier to `jq`.

## Awaiting my reply

The newest comment on each thread (by `createdAt`) decides, and its author is compared by `login` to your own:

| Newest comment's author | Thread state | You owe |
|-------------------------|--------------|---------|
| Not you, human | Any resolution state, **unless** they resolved their own last comment | **A reply.** The strongest signal in the whole fetch |
| Not you, human | Resolved, and they are also `resolvedBy` | Nothing. They closed the conversation themselves |
| Not you, bot | Open | A fix or a reasoned dismissal, then reply and resolve |
| Not you, bot | Resolved | Nothing. A bot is not waiting on an answer |
| You | Open | Nothing until the reviewer answers. Do not re-reply |

This is one predicate, not two. The same carve-out that keeps a self-closed thread out of the accounting buckets has to keep it out of the awaiting count, or a PR whose reviewer resolved their own threads never reaches ready.

A thread whose newest comment is not yours is unanswered whether or not it is resolved, and whether or not it sits under a bot's finding. Count these separately and list every one. **This is the number the user means when they ask whether you read the comments.**

## Reply to a thread

REST reply endpoint (most reliable):

```bash
gh api "repos/{owner}/{repo}/pulls/{pr}/comments/{comment_database_id}/replies" \
  -X POST \
  -f body="Done: fixed in latest push."
```

`comment_database_id` is the `databaseId` of the thread's last comment (reply to the most recent message).

GraphQL alternative (use if REST fails):

```graphql
mutation($threadId: ID!, $body: String!) {
  addPullRequestReviewThreadReply(input: {
    pullRequestReviewThreadId: $threadId
    body: $body
  }) {
    comment { id }
  }
}
```

Replying to an already-resolved thread does not unresolve it, so a reply is always safe there.

## Reply to an issue-level comment

Different endpoint, no thread mechanism; post a new comment on the PR:

```bash
gh api "repos/{owner}/{repo}/issues/{pr}/comments" \
  -X POST \
  -f body="Acknowledged: addressed in latest push."
```

For a contextual reply, quote the original in the body.

## Resolve a thread

```graphql
mutation($threadId: ID!) {
  resolveReviewThread(input: { threadId: $threadId }) {
    thread { isResolved }
  }
}
```

Invoke:

```bash
gh api graphql \
  -f query='mutation($threadId: ID!) { resolveReviewThread(input: { threadId: $threadId }) { thread { isResolved } } }' \
  -f threadId="$THREAD_ID"
```

Always reply before resolving so the reviewer sees the reason.

Never resolve:
- a thread where you answered a reviewer's **question**. Only the reviewer knows whether the answer landed
- a **merge-gate** status comment, and never reply to one either: a reply does not change the verdict

Issue-level comments and review bodies have no thread mechanism: reply to acknowledge, but there is no "resolve" action.

