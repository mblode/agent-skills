#!/usr/bin/env bash
# Normalized dump of every review, review thread, and issue comment on a PR.
#
# Extracts tokens and anchors. It does NOT classify: `severityHints` holds every
# raw token found in the body, verbatim, and mapping those to a severity is the
# job of references/bot-patterns.md. No intent, no dedupe, no ignore reasons, no
# verdict interpretation.
#
# usage: fetch-comments.sh <pr-number> [--repo owner/name]
# stdout: one JSON document. stderr: one sentence, on failure only.
set -euo pipefail

die() { printf '%s\n' "$1" >&2; exit 1; }

# One temp file so gh's own stderr can be folded into our single sentence
# rather than leaking alongside it.
ERRF=$(mktemp) || die "could not create a temp file"
trap 'rm -f "$ERRF"' EXIT
ghwhy() { sed -e 's/^gh: //' -e 's/^GraphQL: //' "$ERRF" | tr '\n' ' ' | sed 's/ *$//'; }

PR=""; REPO=""
while [ $# -gt 0 ]; do
  case "$1" in
    --repo) REPO="${2:-}"; shift 2 ;;
    -h|--help) printf 'usage: fetch-comments.sh <pr-number> [--repo owner/name]\n'; exit 0 ;;
    -*) die "unknown flag '$1'. usage: fetch-comments.sh <pr-number> [--repo owner/name]" ;;
    *) PR="$1"; shift ;;
  esac
done

command -v gh >/dev/null 2>&1 || die "gh not found: install the GitHub CLI from https://cli.github.com"
command -v jq >/dev/null 2>&1 || die "jq not found: install jq"
gh auth status >/dev/null 2>&1 || die "gh not authenticated: run gh auth login"

if [ -z "$REPO" ]; then
  REPO=$(gh repo view --json owner,name --jq '"\(.owner.login)/\(.name)"' 2>/dev/null) \
    || die "could not detect the repo: run inside a git checkout or pass --repo owner/name"
fi
OWNER="${REPO%%/*}"; NAME="${REPO##*/}"
{ [ -n "$OWNER" ] && [ -n "$NAME" ] && [ "$OWNER" != "$REPO" ]; } \
  || die "bad --repo value '$REPO': expected owner/name"

if [ -z "$PR" ]; then
  PR=$(gh pr view --json number --jq .number 2>/dev/null) \
    || die "no PR number given and none found for the current branch: pass <pr-number>"
fi
case "$PR" in ''|*[!0-9]*) die "bad PR number '$PR': expected digits" ;; esac

ME=$(gh api user --jq .login 2>/dev/null) || die "could not resolve your login: check gh auth status"

THREAD_Q='query($o:String!,$r:String!,$n:Int!,$c:String){
  repository(owner:$o,name:$r){ pullRequest(number:$n){
    headRefOid
    reviewThreads(first:100, after:$c){
      pageInfo{ hasNextPage endCursor }
      nodes{
        id isResolved isOutdated isCollapsed resolvedBy{login} subjectType
        path line startLine originalLine originalStartLine diffSide
        comments(first:100){
          totalCount pageInfo{ hasNextPage endCursor }
          nodes{
            databaseId author{login __typename} body
            line startLine originalLine originalStartLine diffHunk outdated
            createdAt url replyTo{databaseId} commit{oid} originalCommit{oid}
          } } } } } } }'

COMMENT_Q='query($t:ID!,$c:String){ node(id:$t){ ... on PullRequestReviewThread {
  comments(first:100, after:$c){ pageInfo{ hasNextPage endCursor }
    nodes{ databaseId author{login __typename} body line startLine originalLine
           originalStartLine diffHunk outdated createdAt url replyTo{databaseId}
           commit{oid} originalCommit{oid} } } } } }'

gql_threads() {
  if [ -z "$1" ]; then
    gh api graphql -f query="$THREAD_Q" -f o="$OWNER" -f r="$NAME" -F n="$PR"
  else
    gh api graphql -f query="$THREAD_Q" -f o="$OWNER" -f r="$NAME" -F n="$PR" -f c="$1"
  fi
}

# Page the thread list.
threads="[]"; cursor=""; head_oid=""
while :; do
  res=$(gql_threads "$cursor" 2>"$ERRF") \
    || die "thread fetch failed for $REPO#$PR: $(ghwhy)"
  node=$(jq -c '.data.repository.pullRequest // empty' <<<"$res")
  [ -n "$node" ] || die "PR #$PR not found in $REPO"
  head_oid=$(jq -r '.headRefOid' <<<"$node")
  threads=$(jq -c -n --argjson a "$threads" \
    --argjson b "$(jq -c '.reviewThreads.nodes' <<<"$node")" '$a + $b')
  [ "$(jq -r '.reviewThreads.pageInfo.hasNextPage' <<<"$node")" = "true" ] || break
  cursor=$(jq -r '.reviewThreads.pageInfo.endCursor' <<<"$node")
done

# Page any thread whose comments were truncated. Thread comments come oldest
# first, so a truncated page hides the newest comment, which is the one that
# decides whether a reply is owed.
for tid in $(jq -r '.[] | select(.comments.pageInfo.hasNextPage) | .id' <<<"$threads"); do
  ccur=$(jq -r --arg t "$tid" '.[] | select(.id == $t) | .comments.pageInfo.endCursor' <<<"$threads")
  extra="[]"
  while [ -n "$ccur" ] && [ "$ccur" != "null" ]; do
    cres=$(gh api graphql -f query="$COMMENT_Q" -f t="$tid" -f c="$ccur" 2>"$ERRF") \
      || die "comment paging failed on thread $tid: $(ghwhy)"
    extra=$(jq -c -n --argjson a "$extra" \
      --argjson b "$(jq -c '.data.node.comments.nodes' <<<"$cres")" '$a + $b')
    if [ "$(jq -r '.data.node.comments.pageInfo.hasNextPage' <<<"$cres")" = "true" ]; then
      ccur=$(jq -r '.data.node.comments.pageInfo.endCursor' <<<"$cres")
    else
      ccur=""
    fi
  done
  threads=$(jq -c --arg t "$tid" --argjson extra "$extra" \
    'map(if .id == $t then .comments.nodes += $extra else . end)' <<<"$threads")
done

reviews=$(gh api --paginate "repos/$REPO/pulls/$PR/reviews" 2>"$ERRF" | jq -c -s 'flatten(1)') \
  || die "could not fetch reviews for $REPO#$PR: $(ghwhy)"
issue_comments=$(gh api --paginate "repos/$REPO/issues/$PR/comments?per_page=100" 2>"$ERRF" \
  | jq -c -s 'flatten(1)') || die "could not fetch issue comments for $REPO#$PR: $(ghwhy)"

jq -n \
  --arg me "$ME" --arg repo "$REPO" --arg head "$head_oid" --argjson pr "$PR" \
  --argjson threads "$threads" --argjson reviews "$reviews" \
  --argjson issue_comments "$issue_comments" '

# REST and GraphQL disagree on bot logins: "cursor[bot]" vs "cursor".
def canon: sub("\\[bot\\]$"; "");

# Generic markup, plus the vendor footers common enough to be worth hard-coding.
# Anything narrower than that belongs in bot-patterns.md.
def strip_markup:
  gsub("<!--(?:.|\n)*?-->"; "")
  | gsub("<details[^>]*>(?:.|\n)*?</details>"; "")
  | gsub("<sup>(?:.|\n)*?</sup>"; "")
  | gsub("<sub>(?:.|\n)*?</sub>"; "")
  | gsub("<picture>(?:.|\n)*?</picture>"; "")
  | gsub("<a\\s[^>]*>(?:.|\n)*?</a>"; "")
  | gsub("!\\[[^\\]]*\\]\\([^)]*\\)"; "")
  # Nested <sub><sub>...</sub></sub> leaves an orphan closing tag behind, since
  # the non-greedy block match stops at the first close. Sweep what is left.
  | gsub("</?(sub|sup|div|br|p|picture|source|summary|details|a|img)[^>]*>"; "")
  | gsub("(?i)_?Was this helpful\\?[^\n]*"; "")
  | gsub("(?i)_?Comment `@[A-Za-z0-9_-]+ review`[^\n]*"; "")
  | gsub("(?i)Want higher recall\\?[^\n]*"; "")
  | gsub("(?i)Reviewed by[^\n]*for commit[^\n]*"; "")
  | gsub("(?i)Bugbot Autofix is OFF[^\n]*"; "")
  | gsub("[ \t]+\n"; "\n")
  | gsub("[ \t]{2,}"; " ")
  | gsub("\n{3,}"; "\n\n")
  | sub("^\\s+"; "") | sub("\\s+$"; "");

# Every raw token found, verbatim, in no particular order. Not a severity, and
# deliberately not a single winner: one comment can carry two complementary
# tokens (Devin pairs a BUG_/ANALYSIS_ kind with a colour severity emoji).
# Resolving precedence is bot-patterns.md, not this script.
def severity_hints:
  . as $b
  | [ ( $b | capture("\\*\\*(?<s>(High|Medium|Low) Severity)\\*\\*") | .s )?
    , ( $b | capture("img\\.shields\\.io/badge/(?<s>P[0-9])") | .s )?
    , ( $b | capture("(?<s>(high|medium|low)-priority)\\.svg") | .s )?
    , ( ($b | capture("\"id\":\\s*\"(?<s>BUG|ANALYSIS)_") | .s + "_") )?
    , ( if ($b | test("🔴")) then "🔴" else empty end )
    , ( if ($b | test("🟠")) then "🟠" else empty end )
    , ( if ($b | test("🟡")) then "🟡" else empty end )
    , ( if ($b | test("⚠️ Potential issue")) then "⚠️ Potential issue" else empty end )
    # Severity-adjacent context only. A bare word match reports "critical" for
    # both "not critical at all" and "the critical path".
    , ( $b | capture("(?i)(^|\\*\\*|\\b(severity|priority)\\s*[:=]\\s*)(?<s>critical|blocker)\\b") | .s )?
    , ( if ($b | test("(?i)\\bnit(pick)?\\b")) then "nit" else empty end )
    ] | unique;

# Anchors a bot wrote into its own body. Authoritative when line is null.
def embedded_anchors:
  . as $b
  | [ $b
      | match("<!--\\s*devin-review-comment\\s*(\\{[^}]*\\})\\s*-->"; "g")
      | .captures[0].string
      | try (fromjson
             | {kind:"devin", path:.file_path, line:.start_line,
                endLine:.end_line, side:(.side // "RIGHT")}) catch empty ]
    + ( if ($b | test("LOCATIONS START")) then
          ( $b | capture("LOCATIONS START(?<l>(?:.|\n)*?)LOCATIONS END") | .l
            | [ scan("([^\\s#]+)#L([0-9]+)(?:-L([0-9]+))?") ]
            | map({kind:"cursor", path:.[0], line:(.[1]|tonumber),
                   endLine:(if .[2] then (.[2]|tonumber) else (.[1]|tonumber) end),
                   side:"RIGHT"}) )
        else [] end );

def norm_comment($me):
  (.body // "") as $b
  | { databaseId, author: (.author.login // "ghost"),
      authorTypename: (.author.__typename // "User"),
      isMe: ((.author.login // "") == $me),
      isBot: ((.author.__typename // "User") == "Bot"),
      createdAt, url,
      replyTo: (.replyTo.databaseId // null),
      commit: (.commit.oid // null),
      originalCommit: (.originalCommit.oid // null),
      line, startLine, originalLine, originalStartLine, outdated,
      diffHunk: (.diffHunk // null),
      body: $b,
      bodyStripped: ($b | strip_markup),
      severityHints: ($b | severity_hints),
      embeddedAnchors: ($b | embedded_anchors) };

# Rungs resolvable without a checkout. originalLine and diffHunk are handed
# back as needs-translation for the agent to finish against the working tree.
def anchor($t; $first):
  ($first.embeddedAnchors // []) as $emb
  | if $t.line != null then
      {line: $t.line, startLine: $t.startLine, endLine: $t.line,
       side: $t.diffSide, source: "line"}
    elif $t.startLine != null then
      {line: $t.startLine, startLine: $t.startLine, endLine: $t.startLine,
       side: $t.diffSide, source: "startLine"}
    elif ($emb | length) > 0 then
      ($emb[0] | {line, endLine, startLine: .line, side,
                  source: ("embedded-" + .kind)})
    elif $t.subjectType == "FILE" then
      {line: null, startLine: null, endLine: null, side: $t.diffSide, source: "file"}
    elif ($t.originalLine != null or ($first.diffHunk // "") != "") then
      {line: $t.originalLine, startLine: $t.originalStartLine,
       endLine: $t.originalLine, side: $t.diffSide, source: "needs-translation"}
    else
      {line: null, startLine: null, endLine: null, side: $t.diffSide,
       source: "path-only"} end;

($threads | map(
  (.comments.nodes | map(norm_comment($me))) as $cs
  | ($cs | sort_by(.createdAt) | last) as $last
  | ($cs | first) as $first
  # One predicate for "a reply is owed", mirroring the awaiting-reply table.
  # A bot only owes on an open thread. A human owes in any resolution state,
  # unless they resolved their own last comment, which is them closing the
  # conversation: without that carve-out, readiness never clears.
  | ($last != null and ($last.isMe | not)
     and (if $last.isBot then (.isResolved | not)
          else ((.isResolved and ((.resolvedBy.login // null) == $last.author)) | not)
          end)) as $owed
  | {
      id, path, subjectType,
      isResolved, isOutdated, isCollapsed,
      resolvedBy: (.resolvedBy.login // null),
      anchor: anchor(.; $first),
      threadAuthor: ($first.author // null),
      lastComment: (if $last then
          {author: $last.author, isMe: $last.isMe, isBot: $last.isBot,
           createdAt: $last.createdAt, url: $last.url} else null end),
      owedReply: $owed,
      bucket: (
        if .path == null then "pr-level"
        elif (.isResolved | not) then "open"
        elif $owed then "resolved-with-unanswered-reply"
        else "resolved-quiet" end),
      commentCount: ($cs | length),
      comments: $cs
    }
)) as $t
| ($reviews | map({
    id, author: .user.login,
    isMe: (.user.login == $me),
    state, submittedAt,
    commitId: .commit_id,
    isStale: ((.commit_id // "") != $head),
    bodyEmpty: (((.body // "") | gsub("\\s"; "")) == ""),
    body: (.body // ""),
    bodyStripped: ((.body // "") | strip_markup),
    severityHints: ((.body // "") | severity_hints)
  })) as $r
| ($issue_comments | map({
    id, author: .user.login,
    isMe: (.user.login == $me),
    createdAt, updatedAt: .updated_at,
    wasEdited: (.updated_at != .created_at),
    url: .html_url,
    body: (.body // ""),
    bodyStripped: ((.body // "") | strip_markup),
    severityHints: ((.body // "") | severity_hints)
  })) as $ic
| {
    me: $me, repo: $repo, pr: $pr, headRefOid: $head,
    counts: {
      threads: ($t | length),
      open: ([$t[] | select(.bucket == "open")] | length),
      resolvedWithUnansweredReply:
        ([$t[] | select(.bucket == "resolved-with-unanswered-reply")] | length),
      resolvedQuiet: ([$t[] | select(.bucket == "resolved-quiet")] | length),
      prLevel: ([$t[] | select(.bucket == "pr-level")] | length),
      outdated: ([$t[] | select(.isOutdated)] | length),
      collapsed: ([$t[] | select(.isCollapsed)] | length),
      awaitingReply: ([$t[] | select(.owedReply)] | length),
      anchorsNeedingWork:
        ([$t[] | select(.anchor.source == "needs-translation"
                        or .anchor.source == "path-only")] | length),
      reviews: ($r | length),
      staleReviews: ([$r[] | select(.isStale)] | length),
      issueComments: ($ic | length)
    },
    # Every login that spoke, canonicalized. REST returns "cursor[bot]" while
    # GraphQL returns "cursor" for the same identity, so an uncanonicalized index
    # splits every bot in two and makes reviewer reconciliation cry wolf.
    # A reviewer here with no findings and no verdict is a fetch that lost
    # something, not a reviewer with nothing to say.
    reviewers: (
      ([$r[] | .author] + [$t[] | .comments[] | .author] + [$ic[] | .author]) as $raw
      | ($raw | map(canon) | unique)
      | map(. as $login | {
          login: $login,
          isMe: ($login == ($me | canon)),
          # Hint, not a verdict: machine users such as developer-platform-actions
          # have no [bot] suffix and report as User.
          isBot: (([$raw[] | select(canon == $login) | test("\\[bot\\]$")] | any)
                  or ([$t[] | .comments[] | select((.author | canon) == $login) | .isBot]
                      | any)),
          reviews: ([$r[] | select((.author | canon) == $login)] | length),
          inlineComments:
            ([$t[] | .comments[] | select((.author | canon) == $login)] | length),
          issueComments: ([$ic[] | select((.author | canon) == $login)] | length),
          emptyBodyReviews:
            ([$r[] | select((.author | canon) == $login and .bodyEmpty)] | length)
        })
    ),
    reviews: $r,
    threads: $t,
    issueComments: $ic
  }
'
