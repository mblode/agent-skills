#!/usr/bin/env bash
# Where merged PRs wait between open and deploy: per-stage median, p90 and
# minutes per week, a Little's-law check, and the constraint. Read-only.
# Needs `gh` (authenticated) and `jq`. Works on macOS /bin/bash 3.2.
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: ci-flow.sh [--repo owner/name] [--since YYYY-MM-DD] [--base <branch>]
                  [--limit N] [--workflow <file.yml>] [--environment <name>] [--json]

Pulls every PR merged into --base since --since and splits its life into
stages, each ending at a milestone:

  ready         WORK  opened -> marked ready for review (0 when never a draft)
  head green    WORK  -> last check on the final head commit finished, all passing
  approved      WAIT  -> first APPROVED review
  enqueued      WAIT  -> added to the merge queue (the last time)
  merged        WAIT  -> merged
  main verdict  WORK  -> push run(s) on the merge commit finished
  deployed      WAIT  -> first successful deployment to --environment created
                       at or after the merge (an approximation: it assumes a
                       later deploy contains every earlier merge)

Milestones are taken in the order they happened, and each stage gets the time
since the milestone before it, so stages never double-count and add up to the
PR's lead time. When review and CI overlap, the one that finished last gets
the tail. A milestone that is missing, or that happened after the merge,
makes that stage n/a, never 0.

Prints per stage: PRs measured, median, p90, minutes per week and share; then
pushes per PR (commit count, a proxy), merge-queue ejections, bot-authored
share, a Little's-law check (merges per hour x mean open->merged hours against
PRs open now), and a CONSTRAINT line naming the stage with the most minutes
per week.

Options:
  --repo owner/name    repository (default: the current checkout); sets GH_REPO
  --since YYYY-MM-DD   merged on or after this date (default: 14 days ago)
  --base <branch>      base branch (default: the repository default branch)
  --limit N            at most N merged PRs, most recently updated first (default 200)
  --workflow <file>    main verdict from this workflow's push runs only
                       (default: every push-triggered run on the base branch)
  --environment <name> deployment environment for the deployed stage
                       (default: none, deployed is n/a)
  --json               print per-PR rows and the summary as JSON
  -h, --help           this help

Exit codes: 0 ok, 1 API or tool failure, 2 usage error.
USAGE
}

since=""
base=""
limit=200
workflow=""
environment=""
json=0

need_arg() { [ $# -ge 2 ] && [ -n "$2" ] || { echo "$1 needs a value" >&2; usage >&2; exit 2; }; }

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    --repo) need_arg "$@"; export GH_REPO="$2"; shift 2 ;;
    --since) need_arg "$@"; since="$2"; shift 2 ;;
    --base) need_arg "$@"; base="$2"; shift 2 ;;
    --limit) need_arg "$@"; limit="$2"; shift 2 ;;
    --workflow) need_arg "$@"; workflow="$2"; shift 2 ;;
    --environment) need_arg "$@"; environment="$2"; shift 2 ;;
    --json) json=1; shift ;;
    *) echo "unknown argument $1" >&2; usage >&2; exit 2 ;;
  esac
done

case "$limit" in
  ''|*[!0-9]*|0) echo "--limit must be a positive integer" >&2; exit 2 ;;
esac
command -v jq >/dev/null || { echo "jq is required" >&2; exit 2; }
command -v gh >/dev/null || { echo "gh is required" >&2; exit 2; }

if [ -z "$since" ]; then
  since="$(jq -nr 'now - 14 * 86400 | strftime("%Y-%m-%d")')"
fi
case "$since" in
  [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]) ;;
  *) echo "--since must be YYYY-MM-DD" >&2; exit 2 ;;
esac

if ! repo_info="$(gh repo view ${GH_REPO:+"$GH_REPO"} --json nameWithOwner,defaultBranchRef --jq '.nameWithOwner + " " + .defaultBranchRef.name')"; then
  echo "could not resolve the repository: run inside a GitHub checkout or pass --repo owner/name" >&2
  exit 2
fi
repo="${repo_info%% *}"
[ -n "$base" ] || base="${repo_info#* }"
owner="${repo%%/*}"
name="${repo#*/}"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# --- 1. merged PRs: one paginated GraphQL search ----------------------------
pr_query() {
  cat <<'GRAPHQL'
query($q: String!, $open: String!, $n: Int!, $cursor: String) {
  rateLimit { cost remaining }
  open: search(query: $open, type: ISSUE, first: 0) { issueCount }
  search(query: $q, type: ISSUE, first: $n, after: $cursor) {
    issueCount
    pageInfo { hasNextPage endCursor }
    nodes {
      ... on PullRequest {
        number
        createdAt
        mergedAt
        author { __typename login }
        mergeCommit { oid }
        commits { totalCount }
        reviews(states: APPROVED, first: 1) { nodes { submittedAt } }
        timelineItems(first: 50, itemTypes: [READY_FOR_REVIEW_EVENT, ADDED_TO_MERGE_QUEUE_EVENT, REMOVED_FROM_MERGE_QUEUE_EVENT]) {
          nodes {
            __typename
            ... on ReadyForReviewEvent { createdAt }
            ... on AddedToMergeQueueEvent { createdAt }
            ... on RemovedFromMergeQueueEvent { createdAt reason }
          }
        }
        lastCommit: commits(last: 1) {
          nodes {
            commit {
              statusCheckRollup {
                contexts(first: 100) {
                  nodes {
                    __typename
                    ... on CheckRun { status conclusion completedAt }
                    ... on StatusContext { state createdAt }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
GRAPHQL
}

search="repo:$repo is:pr is:merged base:$base merged:>=$since sort:updated-desc"
open_search="repo:$repo is:pr is:open base:$base"
page=0
fetched=0
cursor=""
cost=0
while :; do
  page=$((page + 1))
  n=$((limit - fetched))
  [ "$n" -gt 25 ] && n=25
  out="$tmp/prs-$page.json"
  if [ -z "$cursor" ]; then
    gh api graphql -f query="$(pr_query)" -f q="$search" -f open="$open_search" -F n="$n" > "$out"
  else
    gh api graphql -f query="$(pr_query)" -f q="$search" -f open="$open_search" -F n="$n" -f cursor="$cursor" > "$out"
  fi
  fetched=$((fetched + $(jq '.data.search.nodes | length' "$out")))
  cost=$((cost + $(jq '.data.rateLimit.cost // 0' "$out")))
  cursor="$(jq -r '.data.search.pageInfo.endCursor // ""' "$out")"
  [ "$(jq -r '.data.search.pageInfo.hasNextPage' "$out")" = "true" ] && [ "$fetched" -lt "$limit" ] || break
done
jq -s '.' "$tmp"/prs-*.json > "$tmp/pages.json"

# --- 2. main verdict: push runs on the base branch, joined on the merge SHA --
base_uri="$(jq -rn --arg b "$base" '$b | @uri')"
if [ -n "$workflow" ]; then
  runs_path="repos/$repo/actions/workflows/$workflow/runs"
else
  runs_path="repos/$repo/actions/runs"
fi
p=0
while [ "$p" -lt 10 ]; do
  p=$((p + 1))
  gh api "$runs_path?event=push&branch=$base_uri&created=%3E%3D$since&per_page=100&page=$p" \
    --jq '[.workflow_runs[] | {head_sha, status, conclusion, updated_at, name}]' > "$tmp/runs-$p.json"
  [ "$(jq 'length' "$tmp/runs-$p.json")" -eq 100 ] || break
  [ "$p" -lt 10 ] || echo "note: stopped at 1000 push runs; pass --workflow to narrow" >&2
done
jq -s 'add // []' "$tmp"/runs-*.json > "$tmp/runs.json"

# --- 3. deployments for --environment (optional) -----------------------------
deploy_query() {
  cat <<'GRAPHQL'
query($owner: String!, $name: String!, $env: String!, $cursor: String) {
  rateLimit { cost remaining }
  repository(owner: $owner, name: $name) {
    deployments(environments: [$env], first: 50, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
      pageInfo { hasNextPage endCursor }
      nodes { createdAt statuses(first: 20) { nodes { state createdAt } } }
    }
  }
}
GRAPHQL
}

echo '[]' > "$tmp/deploys-0.json"
if [ -n "$environment" ]; then
  since_ts="$(jq -rn --arg s "$since" '"\($s)T00:00:00Z" | fromdateiso8601')"
  cursor=""
  p=0
  while [ "$p" -lt 10 ]; do
    p=$((p + 1))
    out="$tmp/dpage-$p.json"
    if [ -z "$cursor" ]; then
      gh api graphql -f query="$(deploy_query)" -f owner="$owner" -f name="$name" -f env="$environment" > "$out"
    else
      gh api graphql -f query="$(deploy_query)" -f owner="$owner" -f name="$name" -f env="$environment" -f cursor="$cursor" > "$out"
    fi
    cost=$((cost + $(jq '.data.rateLimit.cost // 0' "$out")))
    jq '.data.repository.deployments.nodes' "$out" > "$tmp/deploys-$p.json"
    cursor="$(jq -r '.data.repository.deployments.pageInfo.endCursor // ""' "$out")"
    oldest="$(jq -r '[.data.repository.deployments.nodes[].createdAt | fromdateiso8601] | min // 0' "$out")"
    [ "$(jq -r '.data.repository.deployments.pageInfo.hasNextPage' "$out")" = "true" ] && [ "$oldest" -ge "$since_ts" ] || break
  done
fi
jq -s 'add // []' "$tmp"/deploys-*.json > "$tmp/deploys.json"

echo "graphql cost: $cost points" >&2

# --- 4. join and summarise -----------------------------------------------------
jq -n -r \
  --slurpfile pages "$tmp/pages.json" \
  --slurpfile runs "$tmp/runs.json" \
  --slurpfile deploys "$tmp/deploys.json" \
  --arg repo "$repo" --arg base "$base" --arg since "$since" \
  --arg workflow "$workflow" --arg environment "$environment" \
  --argjson limit "$limit" --argjson json "$json" '
  def ts: if . == null then null else sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601 end;
  def pct(p): sort | if length == 0 then null else .[((length - 1) * p) | floor] end;
  def mean: if length == 0 then null else add / length end;
  def r1: if . == null then null else (. * 10 | round) / 10 end;
  def dur: if . == null then "n/a" else (round) as $m
    | if $m >= 1440 then "\($m / 1440 | floor)d\(($m % 1440) / 60 | floor)h"
      elif $m >= 60 then "\($m / 60 | floor)h\($m % 60)m"
      else "\($m)m" end end;
  def pad(w): tostring | if length < w then . + (" " * (w - length)) else . end;
  def iso: if . == null then null else todate end;
  def unit(u): if . == null then "n/a" else "\(.)\(u)" end;

  $pages[0] as $pg
  | ($pg[0].data.search.issueCount) as $merged_total
  | ($pg[0].data.open.issueCount) as $open_now
  | ([ $pg[].data.search.nodes[] | select(.number != null) ] | .[:$limit]) as $prs
  | ((now - ("\($since)T00:00:00Z" | fromdateiso8601)) / 86400) as $days
  | ($days / 7) as $weeks
  | ($runs[0] | map(select(.status == "completed"
        and (.conclusion == "success" or .conclusion == "failure" or .conclusion == "timed_out")))
      | reduce .[] as $r ({}; .[$r.head_sha] += [$r])) as $runs_by_sha
  | ($deploys[0] | map({created: (.createdAt | ts),
        ok: ([.statuses.nodes[] | select(.state == "SUCCESS") | .createdAt | ts] | min)})
      | map(select(.ok != null))) as $deps
  | [ {stage: "ready", label: "WORK"}, {stage: "head green", label: "WORK"},
      {stage: "approved", label: "WAIT"}, {stage: "enqueued", label: "WAIT"},
      {stage: "merged", label: "WAIT"}, {stage: "main verdict", label: "WORK"},
      {stage: "deployed", label: "WAIT"} ] as $stages

  | [ $prs[] as $pr
      | ($pr.createdAt | ts) as $open
      | ($pr.mergedAt | ts) as $merged
      | def before_merge: if . != null and . <= $merged then . else null end;
        ($pr.timelineItems.nodes) as $ev
      | ([ $ev[] | select(.__typename == "ReadyForReviewEvent") | .createdAt | ts | before_merge ] | max // $open) as $ready
      | ($pr.lastCommit.nodes[0].commit.statusCheckRollup.contexts.nodes // []
          | map(if .__typename == "CheckRun"
                then {ok: ((.conclusion // "") as $c | $c == "SUCCESS" or $c == "NEUTRAL" or $c == "SKIPPED"),
                      skip: (.conclusion == "SKIPPED"), t: (.completedAt | ts)}
                else {ok: (.state == "SUCCESS"), skip: false, t: (.createdAt | ts)} end)
          | if length > 0 and all(.ok)
            then ((map(select(.skip | not)) | if length > 0 then . else null end) // . | map(.t) | max)
            else null end
          | before_merge) as $green
      | ($pr.reviews.nodes[0].submittedAt | ts | before_merge) as $approved
      | ([ $ev[] | select(.__typename == "AddedToMergeQueueEvent") | .createdAt | ts | before_merge ] | max) as $enqueued
      | ([ $ev[] | select(.__typename == "RemovedFromMergeQueueEvent" and ((.reason // "") | ascii_downcase) != "merged") ] | length) as $ejections
      | ($pr.mergeCommit.oid // "") as $sha
      | ($runs_by_sha[$sha] // []) as $mr
      | (if ($mr | length) == 0 then null else ($mr | map(.updated_at | ts) | max) end) as $verdict
      | (if ($mr | length) == 0 then null
         elif ($mr | any(.conclusion != "success")) then "red" else "green" end) as $verdict_state
      | ([ $deps[] | select(.created >= $merged) | .ok ] | min) as $deployed
      | ([ $ready, $green, $approved, $enqueued, $merged, $verdict, $deployed ]) as $marks
      | (reduce ([ range(0; $marks | length) | select($marks[.] != null) | {i: ., t: $marks[.]} ]
            | sort_by(.t, .i))[] as $m
          ({prev: $open, out: ($stages | map({key: .stage, value: null}) | from_entries)};
           .out[$stages[$m.i].stage] = ((([$m.t - .prev, 0] | max) / 60) | r1) | .prev = $m.t)
        | .out) as $stage_min
      | {
          number: $pr.number,
          author: ($pr.author.login // "ghost"),
          bot: (($pr.author.__typename // "") == "Bot" or (($pr.author.login // "") | endswith("[bot]"))),
          pushes: $pr.commits.totalCount,
          ejections: $ejections,
          opened: $pr.createdAt, ready: ($ready | iso), head_green: ($green | iso),
          approved: ($approved | iso), enqueued: ($enqueued | iso), merged: $pr.mergedAt,
          main_verdict: ($verdict | iso), main_verdict_state: $verdict_state,
          main_red_workflows: ([ $mr[] | select(.conclusion != "success") | .name ] | unique),
          deployed: ($deployed | iso),
          lead_open_to_merged_min: ((($merged - $open) / 60) | r1),
          stages: $stage_min
        } ] as $rows

  | ($rows | length) as $n
  | (if $n > 0 then ($merged_total / $n) else 0 end) as $scale
  | ([ $stages[] as $s | ($rows | map(.stages[$s.stage]) | map(select(. != null))) as $v
      | {stage: $s.stage, label: $s.label, prs: ($v | length),
         median_min: ($v | pct(0.5) | r1), p90_min: ($v | pct(0.9) | r1),
         min_per_week: (if ($v | length) == 0 then null else (($v | add) * $scale / $weeks | round) end)} ]) as $sum0
  | ([ $sum0[] | .min_per_week // 0 ] | add) as $all
  | ($sum0 | map(.share_pct = (if .min_per_week == null or $all == 0 then null else (.min_per_week * 100 / $all | round) end))) as $summary
  | ([ $summary[] | select(.min_per_week != null) ] | max_by(.min_per_week)) as $constraint
  | ($rows | map(.pushes)) as $pushes
  | ($rows | map(.lead_open_to_merged_min) | mean) as $lead_mean
  | (if $days > 0 then $merged_total / ($days * 24) else null end) as $lambda
  | (if $lambda == null or $lead_mean == null then null else $lambda * $lead_mean / 60 end) as $wip
  | {
      repo: $repo, base: $base, since: $since, window_days: ($days | r1),
      workflow: (if $workflow == "" then null else $workflow end),
      environment: (if $environment == "" then null else $environment end),
      merged_total: $merged_total, sampled: $n, open_now: $open_now,
      bot_share_pct: (if $n == 0 then null else ([ $rows[] | select(.bot) ] | length) * 100 / $n | round end),
      pushes_per_pr: {median: ($pushes | pct(0.5)), p90: ($pushes | pct(0.9)), mean: ($pushes | mean | r1)},
      enqueued_prs: ([ $rows[] | select(.enqueued != null) ] | length),
      ejections: ([ $rows[].ejections ] | add // 0),
      ejected_prs: ([ $rows[] | select(.ejections > 0) ] | length),
      main_verdicts: ([ $rows[] | select(.main_verdict_state != null) ] | length),
      main_red: ([ $rows[] | select(.main_verdict_state == "red") ] | length),
      main_red_by_workflow: ([ $rows[].main_red_workflows[] ] | group_by(.) | map({key: .[0], value: length}) | from_entries),
      little: {merges_per_hour: ($lambda | if . == null then null else (. * 100 | round) / 100 end),
               mean_lead_hours: (if $lead_mean == null then null else ($lead_mean / 60 | r1) end),
               expected_wip: ($wip | r1), open_now: $open_now},
      stages: $summary,
      constraint: $constraint
    } as $s

  | if $json == 1 then ($s + {prs: $rows})
    else
      "ci-flow  \($repo)  base \($base)  merged since \($since) (\($s.window_days) days)",
      "PRs merged \($merged_total) (sampled \($n))  bot-authored \($s.bot_share_pct | unit("%"))  open now \($open_now)",
      (if $merged_total < 20 then "few merged PRs (under 20): treat every number below as a projection, not a measurement" else empty end),
      "pushes per PR (commit count)  median \($s.pushes_per_pr.median // "n/a")  p90 \($s.pushes_per_pr.p90 // "n/a")  mean \($s.pushes_per_pr.mean // "n/a")",
      "merge queue  \($s.enqueued_prs) PRs enqueued  ejections \($s.ejections) across \($s.ejected_prs) PRs",
      "main verdict  \($s.main_verdicts) of \($n) merge commits have a finished push run\(if $workflow == "" then " (all workflows)" else " (\($workflow))" end)  red \($s.main_red)"
        + (if $s.main_red > 0 then "  [" + ($s.main_red_by_workflow | to_entries | sort_by(-.value) | map("\(.key) \(.value)") | join(", ")) + "]" else "" end),
      "",
      "\("STAGE" | pad(14))\("LABEL" | pad(7))\("PRS" | pad(6))\("MEDIAN" | pad(9))\("P90" | pad(9))\("MIN/WEEK" | pad(10))SHARE",
      ($summary[] | "\(.stage | pad(14))\(.label | pad(7))\(.prs | pad(6))\(.median_min | dur | pad(9))\(.p90_min | dur | pad(9))\((.min_per_week // "n/a") | pad(10))\(if .share_pct == null then "n/a" else "\(.share_pct)%" end)"
        + (if .stage == "deployed" and $environment == "" then "  (pass --environment)" else "" end)),
      "",
      "lead open->merged  median \($rows | map(.lead_open_to_merged_min) | pct(0.5) | dur)  p90 \($rows | map(.lead_open_to_merged_min) | pct(0.9) | dur)  mean \($s.little.mean_lead_hours | unit("h"))",
      "LITTLE: \($s.little.merges_per_hour // "n/a") merges/h x \($s.little.mean_lead_hours | unit("h")) mean lead = \($s.little.expected_wip // "n/a") PRs in flight expected; \($open_now) open now",
      (if $constraint == null then "CONSTRAINT: n/a (no stage measured)"
       else "CONSTRAINT: \($constraint.stage) (\($constraint.label)) \($constraint.min_per_week) min/week, \($constraint.share_pct)% of stage minutes, median \($constraint.median_min | dur), p90 \($constraint.p90_min | dur)" end)
    end
'
