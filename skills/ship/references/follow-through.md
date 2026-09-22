# Follow-through Mode

After the PR is open. The host decides when to look (a PR subscription event, a coordinator, the user asking); this file says what one pass does and what counts as answered. There is no polling loop, cron, or state file here: each pass starts from a fresh fetch.

## Contents

- One pass
- Script output
- Thread buckets
- Who owes a reply
- Anchor ladder
- Classifying comments
- Legal ignore reasons
- Replying and resolving
- Conflicts
- CI failures
- Report
- Manual fallback

## One pass

1. `scripts/fetch-comments.sh <pr>`. Reconcile `reviewers[]` before classifying: every login that spoke appears in the report with findings, a verdict, or an explicit "no content". A reviewer with reviews but zero comments is a fetch that lost something.
2. `gh pr view --json mergeable,mergeStateStatus`. `DIRTY` or `BEHIND` goes to Conflicts; `UNKNOWN` means GitHub is still computing, so query again in a few seconds.
3. Failing checks go to CI failures.
4. Every thread with `owedReply`, every open thread, and every actionable review body or issue comment is classified, then fixed, answered, or ignored with a legal reason.
5. `scripts/merge-ready.sh <pr>` and report. That second fetch is the evidence; "addressed everything" is not.

Stop early only when open threads, owed replies, actionable reviews, actionable issue comments, and failing checks are all zero. Skip closed or merged PRs, and drafts unless asked.

## Script output

`fetch-comments.sh` prints `{ me, repo, pr, headRefOid, counts, reviewers[], reviews[], threads[], issueComments[] }`; `--help` prints every field. What it deliberately leaves to you:

- `severityHints` is an array of raw tokens, verbatim (`"High Severity"`, `"P2"`, `"BUG_"`, `"🟡"`), not a severity. One comment can carry two complementary tokens; mapping and precedence are in `references/bot-patterns.md`.
- `anchor.source == "needs-translation"` means only `originalLine` or `diffHunk` remain, and finishing the anchor needs the working tree (ladder below). `path-only` means the ladder is exhausted.
- `bodyStripped` uses generic strippers only; a bot-specific footer may survive.

A non-zero exit prints one sentence on stderr naming the cause. Fix that cause (usually `gh auth login`) rather than falling back to manual queries.

## Thread buckets

Every thread lands in exactly one bucket, and the report gives every count. Never drop a bucket silently.

| Bucket | Predicate | Handling |
|--------|-----------|----------|
| `open` | `isResolved == false` | Classify and handle |
| `resolved-with-unanswered-reply` | Resolved, newest comment is a human who is not you and did not resolve it themselves | Reply in place without unresolving; say in the report it was already resolved |
| `resolved-quiet` | Resolved otherwise | Count only |
| `pr-level` | `path == null` | Reply only; there is no resolve |

`isResolved` means someone pressed a button, not that the conversation ended. GitHub collapses resolved threads, so a human reply landing after a resolve is the comment most likely to go unread. `isCollapsed` is a display state, never a filter.

## Who owes a reply

`owedReply` is one predicate over each thread's newest comment, compared by `author.login` against `gh api user --jq .login` (`viewerDidAuthor` returned `false` on the viewer's own comments):

| Newest comment | Thread state | You owe |
|----------------|--------------|---------|
| A human, not you | Any, unless they resolved their own last comment | A reply. The strongest signal in the fetch |
| A human, not you | Resolved by that same person | Nothing; they closed it |
| A bot | Open | A fix or a reasoned dismissal, then reply and resolve |
| A bot | Resolved | Nothing |
| You | Open | Nothing until the reviewer answers; do not re-reply |

The self-resolve carve-out keeps readiness reachable when reviewers close their own threads. GitHub exposes no resolution timestamp, so when a last comment plainly expects an answer, treat it as owed regardless of who resolved it.

## Anchor ladder

`line` is null for outdated and multi-line threads. Stop at the first rung that hits and record which:

1. `line` (with `startLine` for a range): anchors on the current diff.
2. `startLine` alone.
3. An anchor the bot embedded in its body (Devin's JSON comment): authoritative when `line` is null.
4. `subjectType == FILE`: anchor at the path; there is no line.
5. `originalLine` with the comment's `originalCommit.oid`, translated with `git diff <original_commit>..HEAD -- <path>`.
6. `diffHunk`: its last line is the commented line; grep that text in the current file. This rung survives a rebase that renumbers the file.
7. Nothing left: `anchor: path-only`, reported as such.

A null `line` is not a PR-level comment; only a null `path` is. Never drop a finding for want of a line number and never guess one.

## Classifying comments

- Every inline comment from every author is read. An author missing from the bot tables is an unlisted reviewer triaged at Major, not noise; noise needs a positive marker match.
- Classify per comment, not per thread: a human reply inside a bot's thread carries full human weight.
- Severity orders the queue; it never decides whether a comment is read. Unknown sources default to Major.
- Intent decides the handling. A fix request gets a fix, reply, resolve. A question gets an answer, no invented code change, and stays open for the reviewer to resolve. A "did you consider" probe gets the code checked, then a fix or an explanation. A nitpick is fixed if cheap, else answered with why not. Praise gets nothing.
- A merge-gate verdict (auto-approval assessment, merge freeze, CODEOWNERS coverage) is a readiness input: record it and what would flip it; never fix, reply to, or resolve it.
- Deduplicate bot findings only (same path within 3 lines, keep the highest severity). Never deduplicate human comments. A finding listing several locations is one item.
- A review whose `commit_id` is not the head SHA is stale: re-check its findings against the current file before fixing, and report its approval as stale.

## Legal ignore reasons

These are the only ones. Each ignored thread gets a one-line reply naming the reason, then a resolve.

| Reason | Means |
|--------|-------|
| `ignore-duplicate` | Another thread covers it; quote the kept thread ID |
| `ignore-superseded` | A re-review opened a newer thread on the same lines |
| `ignore-pre-existing` | The flagged line is not in a `+` hunk of this PR (`gh api repos/{owner}/{repo}/pulls/{pr}/files --paginate`) |
| `ignore-outdated` | The anchor was recovered, the file was read, and the construct is genuinely gone |
| `ignore-contradicts-conventions` | Contradicts a rule in `AGENTS.md` or `CLAUDE.md` |
| `ignore-noise-marker` | Positive match on a documented noise marker |

Not reasons: "author unrecognized", "thread already resolved", "no line number", "outdated" without the construct being gone. A question is never an ignored item, and an outdated thread carrying a human reply is never ignored.

## Replying and resolving

One commit per logical group of fixes, staged by explicit path; then reply; then resolve. A reply is a post: SKILL.md's Authority section says when it is authorized.

```bash
# Reply in a thread: the databaseId of the thread's newest comment
gh api "repos/{owner}/{repo}/pulls/{pr}/comments/{comment_database_id}/replies" -X POST -f body="Fixed in abc1234: ..."

# Reply to an issue-level comment or review body (no thread, no resolve)
gh api "repos/{owner}/{repo}/issues/{pr}/comments" -X POST -f body="..."

# Resolve, after the reply
gh api graphql -f query='mutation($id:ID!){resolveReviewThread(input:{threadId:$id}){thread{isResolved}}}' -f id="$THREAD_ID"
```

If the REST reply fails, `addPullRequestReviewThreadReply` takes the thread ID. Replying to a resolved thread does not unresolve it. Never resolve a thread where you answered a question.

## Conflicts

Rebase your own branch onto the base; if `git log origin/<base>..HEAD --format='%ae' | sort -u` shows more than one author, `git merge origin/<base>` instead. Push a rebase with `git push --force-with-lease --force-if-includes`; a refused lease means someone pushed, so abort and report. During a rebase `--ours` is the base branch, so name sides by branch in the report.

- Lockfiles: resolve `package.json` first, then let the package manager rewrite the lockfile (`npm install --package-lock-only`, `yarn install`, `pnpm install`) and prove it with a frozen install before continuing.
- Generated files: take either side and rerun the generator. Changelogs: keep both, newest first.
- Source where both sides changed the same function, migrations, API contracts, and conflicting test assertions: `git rebase --abort` and report the files and what each side changed. Intent decides those, not the agent.

After pushing, confirm `gh pr view --json mergeable` reports `MERGEABLE`.

## CI failures

`gh pr checks --json name,state,bucket,link,workflow`. Wait on `pending`: diagnosing a half-finished run fixes the wrong thing. For a GitHub Actions failure, `gh run view <id> --log-failed`; for anything else follow the check's `link` to its platform (a Vercel build failure is in `vercel inspect --logs <url>`, not `vercel logs`, which streams runtime logs). A monorepo type error pointing into a sibling package's `dist` is usually stale build output: reinstall and rebuild before editing source. An infrastructure failure is reported, not fixed from code. SKILL.md's Never list governs every fix.

## Report

Open threads, owed replies, questions answered and awaiting acknowledgement, merge-gate verdicts with what would flip them, CI state, and the `merge-ready.sh` verdict with its blockers ("Approval is stale: reviewed abc1234, head def5678"). When posting was not authorized, the drafted replies go here. Ready is reported, never acted on, unless the user opted in to merging.

## Manual fallback

Only when `gh` or `jq` cannot be installed. The GraphQL queries inside `scripts/fetch-comments.sh` are the spec: `reviewThreads(first:100)` paged to the end, then each thread whose `comments.pageInfo.hasNextPage` is true paged on its own. Thread comments arrive oldest first, so `comments(first: 20)` hides the newest comment, the one that decides whether a reply is owed. Compute owed replies only after both loops finish.
