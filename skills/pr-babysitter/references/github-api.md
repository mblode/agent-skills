# GitHub API Reference

Fetch, reply to, and resolve PR review threads, comments, and reviews.

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

Owner and repo:

```bash
gh repo view --json owner,name --jq '"\(.owner.login)/\(.name)"'
```

User-provided PR number: use directly. Else parse `number` from the `gh pr view` output.

## Fetch review threads (GraphQL)

Only reliable source of thread resolution status; REST does not expose `isResolved`.

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

Invoke:

```bash
gh api graphql \
  -f query='...' \
  -f owner="$OWNER" \
  -f repo="$REPO" \
  -F pr="$PR_NUMBER"
```

Post-fetch filtering:
- Keep threads where `isResolved == false`
- `isOutdated` threads: diff may have moved; flag for scrutiny
- `path: null` threads are PR-level comments (not inline)

## Fetch PR reviews (REST)

Reviews carry the overall verdict plus possibly actionable body text (especially `CHANGES_REQUESTED`).

```bash
gh api --paginate "repos/{owner}/{repo}/pulls/{pr}/reviews"
```

Each review has:
- `state`: `APPROVED`, `CHANGES_REQUESTED`, `COMMENTED`, `DISMISSED`
- `body`: review-level comment (may be empty when content went into inline comments instead)
- `user.login`: reviewer username

Triage rules:
- `CHANGES_REQUESTED`, non-empty body → actionable, classify the body
- `CHANGES_REQUESTED`, empty body → the inline comments carry the request
- `APPROVED`, empty body → skip (just an approval)
- `COMMENTED` from a bot → check the body for findings (Devin, etc.)
- `COMMENTED` from a human + immediate `APPROVED` → non-blocking question

Inline comments from a specific review:

```bash
gh api "repos/{owner}/{repo}/pulls/{pr}/reviews/{review_id}/comments"
```

## Fetch issue-level comments (REST)

Top-level PR conversation comments (not inline review threads):

```bash
gh api --paginate "repos/{owner}/{repo}/issues/{pr}/comments?per_page=100"
```

Cannot be resolved via the thread mechanism: they need a reply, not a resolve mutation. Include in triage.

**Do not filter by author type.** Human and bot issue-level comments may both be actionable:
- `github-actions[bot]` posts DangerJS warnings and schema-compat checks
- Human reviewers post suggestions and questions
- `linear[bot]` posts linkbacks (noise; classify by content)

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
