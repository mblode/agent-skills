#!/usr/bin/env bash
# Merge-readiness verdict for one PR, built on fetch-comments.sh.
#
# Ready means: open and not a draft; mergeable; every required check passing
# (or skipped); review decision approved by a review on the head SHA, or no
# review required; zero threads owing a reply. Merge-gate verdicts and
# issue-level comments need reading and are listed under "unchecked".
#
# usage: merge-ready.sh [<pr-number>] [--repo owner/name]
# stdout: one JSON document. stderr: one sentence, on failure only.
# exit:   0 ready; 2 blocked (see blockers[]); 1 on any failure.
set -euo pipefail

die() { printf '%s\n' "$1" >&2; exit 1; }

usage() {
  cat <<'USAGE'
usage: merge-ready.sh [<pr-number>] [--repo owner/name]

  <pr-number>   defaults to the PR of the current branch
  --repo        defaults to the repo of the current checkout

Needs gh (authenticated), jq, and fetch-comments.sh beside this script.
Prints one JSON document:

  { pr, url, headRefOid, ready,
    blockers[]:  one sentence each, naming the check, thread, or review,
    owedReplies[]: { path, author, url } for every thread owing a reply,
    info: { openThreads, awaitingReviewer, staleReviews, checks },
    unchecked[]: what this script cannot judge }

exit 0 ready, 2 blocked, 1 on any failure with one sentence on stderr.
USAGE
}

HERE=$(cd "$(dirname "$0")" && pwd)
FETCH="$HERE/fetch-comments.sh"

PR=""; REPO=""
while [ $# -gt 0 ]; do
  case "$1" in
    --repo) REPO="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    -*) die "unknown flag '$1'. usage: merge-ready.sh [<pr-number>] [--repo owner/name]" ;;
    *) PR="$1"; shift ;;
  esac
done

command -v gh >/dev/null 2>&1 || die "gh not found: install the GitHub CLI from https://cli.github.com"
command -v jq >/dev/null 2>&1 || die "jq not found: install jq"
[ -f "$FETCH" ] || die "fetch-comments.sh not found beside merge-ready.sh"

if [ -z "$REPO" ]; then
  REPO=$(gh repo view --json owner,name --jq '"\(.owner.login)/\(.name)"' 2>/dev/null) \
    || die "could not detect the repo: run inside a git checkout or pass --repo owner/name"
fi
if [ -z "$PR" ]; then
  PR=$(gh pr view --json number --jq .number 2>/dev/null) \
    || die "no PR number given and none found for the current branch: pass <pr-number>"
fi
case "$PR" in ''|*[!0-9]*) die "bad PR number '$PR': expected digits" ;; esac

view=$(gh pr view "$PR" --repo "$REPO" \
  --json number,url,state,isDraft,mergeable,mergeStateStatus,reviewDecision,headRefOid 2>/dev/null) \
  || die "could not read PR #$PR in $REPO: check gh auth status and the number"

# gh pr checks exits 1 on a failing check and 8 while pending, printing the
# JSON either way, so read stdout and ignore the status. With no required
# checks configured --required prints nothing; fall back to every check.
checks=$(gh pr checks "$PR" --repo "$REPO" --required --json name,bucket 2>/dev/null || true)
scope="required"
if ! jq -e 'type == "array" and length > 0' >/dev/null 2>&1 <<<"$checks"; then
  checks=$(gh pr checks "$PR" --repo "$REPO" --json name,bucket 2>/dev/null || true)
  scope="all"
fi
jq -e 'type == "array"' >/dev/null 2>&1 <<<"$checks" || checks="[]"

comments=$(bash "$FETCH" "$PR" --repo "$REPO") || exit 1

result=$(jq -n --argjson v "$view" --argjson checks "$checks" --arg scope "$scope" \
  --argjson c "$comments" '
  ($v.headRefOid) as $head
  | ($c.reviews | map(select(.state == "APPROVED" and (.isMe | not) and (.isStale | not)))) as $fresh
  | ($c.reviews | map(select(.state == "APPROVED" and (.isMe | not) and .isStale))) as $stale
  | ($c.threads | map(select(.owedReply))) as $owed
  | [
      (if $v.state != "OPEN" then "PR is \($v.state | ascii_downcase)" else empty end),
      (if $v.isDraft then "PR is a draft" else empty end),
      (if $v.mergeable == "CONFLICTING" then "conflicts with the base branch"
       elif $v.mergeable == "UNKNOWN" then "mergeability still computing: run again in a few seconds"
       else empty end),
      (if $v.mergeStateStatus == "BEHIND" then "branch is behind the base" else empty end),
      ($checks[] | select(.bucket != "pass" and .bucket != "skipping")
        | "\($scope) check \(.name): \(.bucket)"),
      (if $v.reviewDecision == "CHANGES_REQUESTED" then "changes requested"
       elif $v.reviewDecision == "REVIEW_REQUIRED" then "review required"
       elif $v.reviewDecision == "APPROVED" and ($fresh | length) == 0 then
         "approval is stale: reviewed \(($stale | last | .commitId // "unknown")[0:7]), head \($head[0:7])"
       else empty end),
      ($owed[] | "reply owed to @\(.lastComment.author) on \(.path // "the PR")")
    ] as $blockers
  | {
      pr: $v.number, url: $v.url, headRefOid: $head,
      ready: ($blockers | length == 0),
      blockers: $blockers,
      owedReplies: ($owed | map({path, author: .lastComment.author, url: .lastComment.url})),
      info: {
        openThreads: $c.counts.open,
        awaitingReviewer: ([$c.threads[] | select(.bucket == "open" and (.owedReply | not))] | length),
        staleReviews: $c.counts.staleReviews,
        checks: {scope: $scope, total: ($checks | length)}
      },
      unchecked: [
        "merge-gate verdicts in issue comments (read them against bot-patterns.md)",
        "issue-level comments that may expect a reply"
      ]
    }') || die "could not compute the verdict from the PR and comment data"

printf '%s\n' "$result"
if jq -e '.ready' >/dev/null <<<"$result"; then exit 0; else exit 2; fi
