# GitHub API Reference

Queries and mutations for fetching, replying to, and resolving PR review threads, comments, and reviews.

## Contents

- [Extract owner, repo, and PR number](#extract-owner-repo-and-pr-number)
- [Fetch review threads (GraphQL)](#fetch-review-threads-graphql)
- [Fetch PR reviews (REST)](#fetch-pr-reviews-rest)
- [Fetch issue-level comments (REST)](#fetch-issue-level-comments-rest)
- [Reply to a thread](#reply-to-a-thread)
- [Reply to an issue-level comment](#reply-to-an-issue-level-comment)
- [Resolve a thread](#resolve-a-thread)
- [Pagination pattern](#pagination-pattern)

## Extract owner, repo, and PR number

Auto-detect from the current branch:

```bash
gh pr view --json number,url,title,headRefName,baseRefName
```

Get owner and repo from the current repository:

```bash
gh repo view --json owner,name --jq '"\(.owner.login)/\(.name)"'
```

If the user provides a PR number, use it directly. Otherwise parse `number` from the `gh pr view` output.

## Fetch review threads (GraphQL)

This is the only reliable source of thread resolution status. REST endpoints do not expose `isResolved`.

```graphql
query($owner: String!, $repo: String!, $pr: Int!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      reviewThreads(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          comments(first: 20) {
            nodes {
              databaseId
              author { login }
              body
              path
              line
              originalLine
              createdAt
              url
            }
          }
        }
      }
    }
  }
}
```

Invoke with `gh api graphql`:

```bash
gh api graphql \
  -f query='...' \
  -f owner="$OWNER" \
  -f repo="$REPO" \
  -F pr="$PR_NUMBER"
```

Post-fetch filtering:
- Keep threads where `isResolved == false`
- Note `isOutdated` threads — the diff may have moved; flag for extra scrutiny
- Threads with `path: null` are PR-level comments (not inline)

## Fetch PR reviews (REST)

Reviews contain the reviewer's overall verdict and may include actionable body text (especially `CHANGES_REQUESTED` reviews).

```bash
gh api --paginate "repos/{owner}/{repo}/pulls/{pr}/reviews"
```

Each review has:
- `state`: `APPROVED`, `CHANGES_REQUESTED`, `COMMENTED`, `DISMISSED`
- `body`: review-level comment (may be empty — reviewer put content in inline comments instead)
- `user.login`: reviewer username

Triage rules:
- `CHANGES_REQUESTED` with non-empty body → actionable, classify the body text
- `CHANGES_REQUESTED` with empty body → the reviewer's inline comments carry the request
- `APPROVED` with empty body → skip (just an approval)
- `COMMENTED` from a bot → check if the body contains findings (Devin, etc.)
- `COMMENTED` from a human + immediate `APPROVED` → non-blocking conversational question

To get inline comments from a specific review:

```bash
gh api "repos/{owner}/{repo}/pulls/{pr}/reviews/{review_id}/comments"
```

## Fetch issue-level comments (REST)

Top-level PR conversation comments (not inline review threads):

```bash
gh api --paginate "repos/{owner}/{repo}/issues/{pr}/comments?per_page=100"
```

These cannot be "resolved" via the thread mechanism. Include in triage but handle differently — they need a reply, not a resolve mutation.

**Do not filter by author type.** Both human and bot issue-level comments may be actionable:
- `github-actions[bot]` posts DangerJS warnings and schema compatibility checks here
- Human reviewers post suggestions and questions here
- `linear[bot]` posts linkbacks here (noise — classify by content)

Classify each comment by its content using the rules in `bot-patterns.md`.

## Reply to a thread

Use the REST reply endpoint (most reliable):

```bash
gh api "repos/{owner}/{repo}/pulls/{pr}/comments/{comment_database_id}/replies" \
  -X POST \
  -f body="Done — fixed in latest push."
```

The `comment_database_id` is the `databaseId` of the last comment in the thread (reply to the most recent message).

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

## Reply to an issue-level comment

Issue-level comments use a different endpoint. There is no thread mechanism — just post a new comment on the PR:

```bash
gh api "repos/{owner}/{repo}/issues/{pr}/comments" \
  -X POST \
  -f body="Acknowledged — addressed in latest push."
```

To reply to a specific comment contextually, quote the original in your reply body.

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

Always post a reply before resolving so the reviewer sees the resolution reason.

Issue-level comments and review bodies cannot be resolved — they have no thread mechanism. Reply to acknowledge, but there is no "resolve" action.

## Pagination pattern

The API returns max 100 threads per page. Paginate until `hasNextPage` is false:

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

Most PRs have fewer than 100 threads, so a single page suffices. Always check `hasNextPage` regardless.
