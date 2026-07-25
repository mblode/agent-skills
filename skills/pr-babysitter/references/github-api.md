# GitHub API Reference

Fetch, reply to, and resolve PR review threads, comments, and reviews. Every command here is `gh`: `gh api` for REST, `gh api graphql` for GraphQL, `gh pr view` for PR state.

## Contents

- [Script output contract](#script-output-contract)
- [Extract owner, repo, and PR number](#extract-owner-repo-and-pr-number)
- [Fetch review threads (GraphQL)](#fetch-review-threads-graphql)
- [Thread accounting](#thread-accounting)
- [Anchor recovery ladder](#anchor-recovery-ladder)
- [Awaiting my reply](#awaiting-my-reply)
- [Fetch PR reviews (REST)](#fetch-pr-reviews-rest)
- [Fetch issue-level comments (REST)](#fetch-issue-level-comments-rest)
- [Reply to a thread](#reply-to-a-thread)
- [Reply to an issue-level comment](#reply-to-an-issue-level-comment)
- [Resolve a thread](#resolve-a-thread)
- [Pagination pattern](#pagination-pattern)

## Script output contract

`scripts/fetch-comments.sh <pr> [--repo owner/name]` does everything in this reference up to and including the awaiting-reply computation, then prints one JSON document. Prefer it; the sections below are the manual fallback when `bash`, `jq`, or `gh` is missing or it exits non-zero.

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

`bucket` and `owedReply` apply the accounting and reply rules below, including the `resolvedBy` carve-out. `bodyStripped` uses generic strippers only, so a bot-specific footer may survive; strip the rest per its bot's entry.

## Extract owner, repo, and PR number

Auto-detect from the current branch:

```bash
gh pr view --json number,url,title,headRefName,baseRefName,headRefOid
```

Owner and repo:

```bash
gh repo view --json owner,name --jq '"\(.owner.login)/\(.name)"'
```

User-provided PR number: use directly. Else parse `number` from the `gh pr view` output.

Keep `headRefOid`: the staleness rules below compare review and comment commits against it.

## Fetch review threads (GraphQL)

Only reliable source of thread resolution status; REST does not expose `isResolved`.

```graphql
query($owner: String!, $repo: String!, $pr: Int!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      headRefOid
      reviewThreads(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          isResolved
          isOutdated
          isCollapsed
          resolvedBy { login }
          subjectType
          path
          line
          startLine
          originalLine
          originalStartLine
          diffSide
          comments(first: 100) {
            totalCount
            pageInfo { hasNextPage endCursor }
            nodes {
              databaseId
              author { login __typename }
              body
              line
              startLine
              originalLine
              originalStartLine
              diffHunk
              outdated
              createdAt
              url
              replyTo { databaseId }
              commit { oid }
              originalCommit { oid }
            }
          }
        }
      }
    }
  }
}
```

Invoke:

```bash
gh api graphql \
  -f query='...' \
  -f owner="$OWNER" \
  -f repo="$REPO" \
  -F pr="$PR_NUMBER"
```

`comments(first: 20)` was a bug worth naming: a thread connection returns comments **oldest first**, so a truncated page hands you the opening comment and hides the newest one, which is exactly the comment that decides whether you owe a reply. 100 is the connection maximum.

When a thread reports `comments.totalCount > 100` or `comments.pageInfo.hasNextPage`, page that thread on its own before computing anything:

```graphql
query($threadId: ID!, $cursor: String) {
  node(id: $threadId) {
    ... on PullRequestReviewThread {
      comments(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes { databaseId author { login } body createdAt url }
      }
    }
  }
}
```

`author { __typename }` returns `Bot` for GitHub App identities and `User` otherwise. A hint only: machine users such as `developer-platform-actions` come back as `User`.

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
3. **Bot-embedded metadata**, written against the commit the bot reviewed and the most precise source available for an outdated thread: Devin's `<!-- devin-review-comment {...} -->` JSON (`file_path`, `start_line`, `end_line`, `side`); Cursor's `<!-- LOCATIONS START ... LOCATIONS END -->` entries in `path#Lstart-Lend` form.
4. `subjectType == FILE`: there is no line to find. Anchor at the path and stop, ahead of the translation rungs below.
5. `originalLine` / `originalStartLine` with the comment's `originalCommit.oid`: the line number as of the commit the comment was written against. Translate with `git diff <original_commit>..HEAD -- <path>`.
6. `diffHunk`: its last line is the commented line. Grep that text in the current file to get today's line number. This is the rung that survives a rebase renumbering the whole file.
7. Nothing left: anchor at `path`, mark the item `anchor: path-only`, and say so in the plan.

**A null `line` is not a PR-level comment. Only a null `path` is.** Never drop a finding for want of a line number, and never guess one: an unanchored finding is reported with `anchor: path-only`, not ignored.

Cross-check with REST when the nulls are confusing:

```bash
gh api --paginate "repos/{owner}/{repo}/pulls/{pr}/comments?per_page=100"
```

It returns the same anchors under `line`, `original_line`, `start_line`, `original_start_line`, `position`, `original_position`, `diff_hunk`, `side`, `in_reply_to_id`, `commit_id`, and `original_commit_id`, flat per comment and easier to `jq`.

## Awaiting my reply

Identify yourself first:

```bash
ME=$(gh api user --jq .login)
```

Do not use `viewerDidAuthor`: it returned `false` on the viewer's own PR in testing, so it cannot identify your own comments. Compare `author.login` against `$ME`.

Sort each thread's comments by `createdAt` and take the last:

| Newest comment's author | Thread state | You owe |
|-------------------------|--------------|---------|
| Not you, human | Any resolution state, **unless** they resolved their own last comment | **A reply.** The strongest signal in the whole fetch |
| Not you, human | Resolved, and they are also `resolvedBy` | Nothing. They closed the conversation themselves |
| Not you, bot | Open | A fix or a reasoned dismissal, then reply and resolve |
| Not you, bot | Resolved | Nothing. A bot is not waiting on an answer |
| You | Open | Nothing until the reviewer answers. Do not re-reply |

This is one predicate, not two. The same carve-out that keeps a self-closed thread out of the accounting buckets has to keep it out of the awaiting count, or a PR whose reviewer resolved their own threads never reaches ready.

```bash
jq --arg me "$ME" '
  [ .[] | . as $t
    | ($t.comments.nodes | sort_by(.createdAt) | last) as $last
    | { id: $t.id, path: $t.path, resolved: $t.isResolved, outdated: $t.isOutdated,
        lastAuthor: $last.author.login, lastUrl: $last.url,
        owedReply: ($last.author.login != $me) } ]' <<<"$all_threads"
```

Truncated comment pages invalidate this computation: the last comment you fetched is not the last comment on the thread. Page every thread with `hasNextPage` first.

A thread whose newest comment is not yours is unanswered whether or not it is resolved, and whether or not it sits under a bot's finding. Count these separately and list every one. **This is the number the user means when they ask whether you read the comments.**

## Fetch PR reviews (REST)

Reviews carry the overall verdict plus possibly actionable body text (especially `CHANGES_REQUESTED`).

```bash
gh api --paginate "repos/{owner}/{repo}/pulls/{pr}/reviews"
```

Each review has:
- `state`: `APPROVED`, `CHANGES_REQUESTED`, `COMMENTED`, `DISMISSED`
- `body`: review-level comment (often empty, because the content went into inline comments instead)
- `user.login`: reviewer username
- `commit_id`: the commit the review was submitted against

Triage rules:
- `CHANGES_REQUESTED`, non-empty body → actionable, classify the body
- `CHANGES_REQUESTED` or `COMMENTED` from a human with an **empty body** → the content is inline, not absent. Pull it with the review-comments endpoint below. Several empty-body reviews from one author are **one review pass**
- `APPROVED`, empty body, no inline comments, from any automation identity → skip (keyed on shape, not login)
- `COMMENTED` from a bot → the body is usually a count or summary; the findings are inline
- `COMMENTED` from a human plus an immediate `APPROVED` → non-blocking question

Inline comments from a specific review:

```bash
gh api "repos/{owner}/{repo}/pulls/{pr}/reviews/{review_id}/comments"
```

**Staleness.** Compare each review's `commit_id` with `headRefOid`. When they differ the review predates HEAD: its findings may already be fixed, and its approval may be dropped by branch protection with "dismiss stale reviews" enabled. Record `reviewed {sha} vs head {sha}` per review, re-verify a finding against the current file before fixing it, and report an approval as **stale** rather than as an approval.

**Reviewer reconciliation.** Fetch reviews before threads and keep the set of reviewer logins. Every reviewer in that set must appear in the triage output with either findings, a stated verdict, or an explicit "no content" reached only after checking its review-comments endpoint. A reviewer with zero threads and an empty body is a fetch that lost something, not a reviewer with nothing to say.

## Fetch issue-level comments (REST)

Top-level PR conversation comments (not inline review threads):

```bash
gh api --paginate "repos/{owner}/{repo}/issues/{pr}/comments?per_page=100"
```

Cannot be resolved via the thread mechanism: they need a reply, not a resolve mutation. Include in triage.

**Do not filter by author type.** Human and bot issue-level comments may both be actionable:
- `github-actions[bot]` posts DangerJS warnings and schema-compat checks
- `linktree-stamp[bot]` posts the auto-approval verdict
- Human reviewers post suggestions and questions
- `linear-code[bot]` posts linkbacks (noise; classify by content)

**Some bots edit one comment in place on every commit** (auto-approval assessments, DangerJS). Their `id` never changes, so comparing IDs against the previous poll shows nothing new. Compare `updated_at` as well, and re-read the body.

Issue-level comments carry **merge-gate verdicts** as well as findings. A verdict is recorded for the readiness check, not replied to and not fixed.

Classify each comment by content using the rules in `bot-patterns.md`.

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

## Pagination pattern

Max 100 threads per page. Paginate until `hasNextPage` is false:

```bash
cursor=""
all_threads="[]"

while true; do
  if [ -z "$cursor" ]; then
    result=$(gh api graphql -f query='...' -f owner="$OWNER" -f repo="$REPO" -F pr="$PR")
  else
    result=$(gh api graphql -f query='...' -f owner="$OWNER" -f repo="$REPO" -F pr="$PR" -f cursor="$cursor")
  fi

  page=$(echo "$result" | jq '.data.repository.pullRequest.reviewThreads.nodes')
  all_threads=$(echo "$all_threads $page" | jq -s 'add')

  has_next=$(echo "$result" | jq -r '.data.repository.pullRequest.reviewThreads.pageInfo.hasNextPage')
  [ "$has_next" = "true" ] || break
  cursor=$(echo "$result" | jq -r '.data.repository.pullRequest.reviewThreads.pageInfo.endCursor')
done
```

Most PRs fit in one page; always check `hasNextPage` regardless.

Two loops, not one: the outer loop pages **threads**, and any node whose `comments.pageInfo.hasNextPage` is true needs the per-thread query above. The awaiting-reply computation runs only after both loops finish, because it depends on having each thread's true last comment.
