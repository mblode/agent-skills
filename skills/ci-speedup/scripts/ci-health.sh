#!/usr/bin/env bash
# Report red episodes, red minutes per week and flake candidates for push runs
# on one branch of a GitHub repository. Read-only. Needs `gh` (authenticated)
# and `jq`.
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: ci-health.sh [--repo owner/name] [--branch main] [--workflow <file.yml>]
                    [--since YYYY-MM-DD] [--limit N] [--flake-runs N] [--json]

Reads completed push runs on the branch (merge_group, pull_request and
schedule runs are left out: none of them is a verdict on the branch) and prints:

  1. RED EPISODES per workflow: the first failing run after a green run, until
     the next green run. Each row has start, duration, first-bad SHA, last-good
     SHA, the commits between them, a parent flag and the cancelled runs inside.
       parent=direct   last-good is the first-bad commit's direct parent
                       (compare API ahead_by == 1), so the culprit is known
       parent=range    several commits landed between them: bisect with re-runs
       parent=same-sha the same commit went green then red: a flake, not a culprit
       parent=unknown  no green run in the window, or the compare call failed
  2. RED MINUTES PER WEEK: the union of red time across workflows, split at
     Monday 00:00 UTC. Start is the first failing run finishing; end is the
     next green run finishing. An episode still red counts up to now.
  3. FLAKE CANDIDATES: jobs that both succeeded and failed on the same head SHA.
     Only runs with run_attempt > 1 or a repeated SHA are inspected, newest
     first, at most --flake-runs of them, one job listing per attempt. A
     listing that still fails after two retries is counted and reported, not
     read as empty.
     A failed run listing stops the script with a non-zero exit.

Verdicts: success is green; failure and timed_out are red; cancelled, skipped,
neutral, stale, startup_failure and action_required are no verdict and never
open or close an episode.

Options:
  --repo owner/name   repository (exported as GH_REPO); default: current checkout
  --branch NAME       branch to read (default main)
  --workflow FILE     one workflow file, e.g. ci.yml (default: every workflow)
  --since DATE        first day to read, YYYY-MM-DD (default: 14 days ago, UTC)
  --limit N           most runs to read, newest first (default 300; the API
                      returns at most 1000 for a filtered list)
  --flake-runs N      most runs inspected for flake candidates (default 40)
  --json              print one JSON object instead of text
  -h, --help          show this help
USAGE
}

# gh_read <out-file> <gh api args...>: a failed read is retried twice, then
# fails. It is never treated as an empty result.
gh_read() {
  local out="$1" attempt=1
  shift
  while ! gh api "$@" > "$out"; do
    [ "$attempt" -lt 3 ] || { echo "ci-health.sh: gh api $* failed 3 times" >&2; return 1; }
    attempt=$((attempt + 1))
    sleep $((attempt * 3))
  done
}

die_usage() { echo "ci-health.sh: $1" >&2; usage >&2; exit 2; }

branch="main"
workflow=""
since=""
limit=300
flake_runs=40
json=0

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    --repo) [ $# -ge 2 ] || die_usage "--repo needs a value"; export GH_REPO="$2"; shift 2 ;;
    --branch) [ $# -ge 2 ] || die_usage "--branch needs a value"; branch="$2"; shift 2 ;;
    --workflow) [ $# -ge 2 ] || die_usage "--workflow needs a value"; workflow="$2"; shift 2 ;;
    --since) [ $# -ge 2 ] || die_usage "--since needs a value"; since="$2"; shift 2 ;;
    --limit) [ $# -ge 2 ] || die_usage "--limit needs a value"; limit="$2"; shift 2 ;;
    --flake-runs) [ $# -ge 2 ] || die_usage "--flake-runs needs a value"; flake_runs="$2"; shift 2 ;;
    --json) json=1; shift ;;
    *) die_usage "unknown argument $1" ;;
  esac
done

case "$limit" in ''|*[!0-9]*) die_usage "--limit must be a positive integer" ;; esac
case "$flake_runs" in ''|*[!0-9]*) die_usage "--flake-runs must be a non-negative integer" ;; esac
[ "$limit" -gt 0 ] || die_usage "--limit must be a positive integer"
[ "$limit" -le 1000 ] || limit=1000

command -v jq >/dev/null || { echo "jq is required" >&2; exit 2; }
command -v gh >/dev/null || { echo "gh is required" >&2; exit 2; }

if [ -z "$since" ]; then
  since="$(jq -nr 'now - 14 * 86400 | strftime("%Y-%m-%d")')"
fi
case "$since" in
  [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]) ;;
  *) die_usage "--since must be YYYY-MM-DD" ;;
esac

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

if [ -n "$workflow" ]; then
  runs_path="repos/{owner}/{repo}/actions/workflows/${workflow}/runs"
else
  runs_path="repos/{owner}/{repo}/actions/runs"
fi

# --- 1. completed push runs on the branch, newest first, up to --limit ------
: > "$tmp/runs.ndjson"
page=1
got=0
while [ "$got" -lt "$limit" ]; do
  gh_read "$tmp/page.json" "${runs_path}?branch=${branch}&event=push&status=completed&created=%3E%3D${since}&per_page=100&page=${page}"
  n="$(jq '.workflow_runs | length' "$tmp/page.json")"
  [ "$n" -gt 0 ] || break
  jq -c '.workflow_runs[] | {id, name, path, head_sha, conclusion, run_attempt, created_at, updated_at, html_url}' "$tmp/page.json" >> "$tmp/runs.ndjson"
  got=$((got + n))
  [ "$n" -eq 100 ] || break
  page=$((page + 1))
done
head -n "$limit" "$tmp/runs.ndjson" | jq -s '.' > "$tmp/runs.json"
truncated=0
[ "$got" -ge "$limit" ] && truncated=1

# --- 2. episodes per workflow -------------------------------------------------
jq '
  def red: .conclusion == "failure" or .conclusion == "timed_out";
  def slim: {id, head_sha, conclusion, created_at, updated_at, html_url};
  group_by(.path)
  | map(
      sort_by(.created_at, .id)
      | reduce .[] as $r ({good: null, ep: null, eps: []};
          if $r.conclusion == "success" then
            (if .ep != null then (.eps += [.ep + {end_run: ($r | slim), open: false}] | .ep = null) else . end)
            | .good = ($r | slim)
          elif ($r | red) then
            if .ep != null then .ep.reds += 1
            else .ep = {workflow: ($r.path | split("/") | last), name: $r.name,
                        first_bad: ($r | slim), last_good: .good,
                        reds: 1, cancelled: 0, no_verdict: 0}
            end
          elif .ep != null then
            .ep.no_verdict += 1
            | if $r.conclusion == "cancelled" then .ep.cancelled += 1 else . end
          else . end)
      | .eps + (if .ep != null then [.ep + {end_run: null, open: true}] else [] end))
  | flatten
' "$tmp/runs.json" > "$tmp/episodes.json"

# --- 3. direct-parent flag from the compare API -----------------------------
: > "$tmp/compare.ndjson"
jq -r '.[] | select(.last_good != null and .last_good.head_sha != .first_bad.head_sha)
       | .last_good.head_sha + " " + .first_bad.head_sha' "$tmp/episodes.json" | sort -u |
while read -r good bad; do
  if gh_read "$tmp/cmp_one.json" "repos/{owner}/{repo}/compare/${good}...${bad}?per_page=1" --jq '{ahead_by, behind_by, status}' 2>/dev/null; then
    jq -c --arg g "$good" --arg b "$bad" '. + {key: ($g + "..." + $b)}' "$tmp/cmp_one.json" >> "$tmp/compare.ndjson"
  else
    echo "ci-health.sh: compare ${good:0:7}...${bad:0:7} failed; parent left unknown" >&2
  fi
done
jq -s '.' "$tmp/compare.ndjson" > "$tmp/compare.json"

# --- 4. flake candidates: same SHA, same job, success and failure -----------
jq -r --argjson cap "$flake_runs" '
  (group_by(.path + " " + .head_sha) | map(select(length > 1)) | flatten | map(.id)) as $repeat
  | map(select(.run_attempt > 1 or (.id as $i | any($repeat[]; . == $i))))
  | sort_by(.created_at) | reverse | .[:$cap][] | "\(.id) \(.run_attempt)"
' "$tmp/runs.json" > "$tmp/flake_ids.txt"
jq '[ .[] | select(.run_attempt > 1) ] | length' "$tmp/runs.json" > "$tmp/rerun_count.txt"
: > "$tmp/jobs.ndjson"
job_failures=0
# One listing per attempt, 30 jobs per page: on runs with hundreds of jobs a
# 100-job page (step lists included) returned HTTP 502 every time, while
# 30-job pages succeeded.
while read -r id attempts; do
  [ -n "$id" ] || continue
  a=1
  while [ "$a" -le "$attempts" ]; do
    jobs_path="repos/{owner}/{repo}/actions/runs/${id}/attempts/${a}/jobs?per_page=30"
    if gh_read "$tmp/jobs_one.ndjson" --paginate "$jobs_path" \
      --jq '.jobs[] | {run_id, head_sha, name, conclusion, run_attempt, workflow_name}'; then
      cat "$tmp/jobs_one.ndjson" >> "$tmp/jobs.ndjson"
    else
      job_failures=$((job_failures + 1))
    fi
    a=$((a + 1))
  done
done < "$tmp/flake_ids.txt"
jq -s '
  group_by(.workflow_name + "\u0000" + .head_sha + "\u0000" + .name)
  | map(select(any(.[]; .conclusion == "success") and any(.[]; .conclusion == "failure" or .conclusion == "timed_out")))
  | map({workflow: .[0].workflow_name, head_sha: .[0].head_sha, job: .[0].name,
          success: (map(select(.conclusion == "success")) | length),
          failure: (map(select(.conclusion == "failure" or .conclusion == "timed_out")) | length),
          runs: (map(.run_id) | unique)})
' "$tmp/jobs.ndjson" > "$tmp/flakes.json"

# --- 5. report ----------------------------------------------------------------
jq -n \
  --slurpfile runs "$tmp/runs.json" \
  --slurpfile eps "$tmp/episodes.json" \
  --slurpfile cmp "$tmp/compare.json" \
  --slurpfile flakes "$tmp/flakes.json" \
  --arg repo "${GH_REPO:-current checkout}" --arg branch "$branch" --arg since "$since" \
  --arg workflow "${workflow:-all}" --argjson truncated "$truncated" --argjson limit "$limit" \
  --argjson inspected "$(wc -l < "$tmp/flake_ids.txt" | tr -d ' ')" \
  --argjson reruns "$(cat "$tmp/rerun_count.txt")" \
  --argjson job_failures "$job_failures" \
  --argjson json "$json" -r '
  def t: fromdateiso8601;
  def wk(x): (((x - 345600) / 604800) | floor) * 604800 + 345600;
  def hm(s): (s / 3600 | floor | tostring) + ":" + ((s % 3600 / 60 | floor | tostring) | if length < 2 then "0" + . else . end);
  def pad(n): tostring | if length < n then . + (" " * (n - length)) else . end;
  def short: if . == null then "-" else .[0:7] end;

  $runs[0] as $runs | ($cmp[0] | map({key, value: .}) | from_entries) as $cmp
  | now as $now
  | ($since + "T00:00:00Z" | t) as $since_t
  | ($eps[0] | map(
      . as $e
      | ($e.first_bad.updated_at | t) as $s
      | (if $e.open then $now else ($e.end_run.updated_at | t) end) as $end
      | (if $e.last_good == null then null else $cmp[$e.last_good.head_sha + "..." + $e.first_bad.head_sha] end) as $c
      | $e + {
          start: $e.first_bad.updated_at,
          end: (if $e.open then null else $e.end_run.updated_at end),
          start_t: $s, end_t: ([$end, $s] | max),
          minutes: ((([$end, $s] | max) - $s) / 60 | floor),
          commits: (if $c == null then null else $c.ahead_by end),
          parent: (if $e.last_good == null then "unknown"
                   elif $e.last_good.head_sha == $e.first_bad.head_sha then "same-sha"
                   elif $c == null then "unknown"
                   elif $c.ahead_by == 1 and $c.behind_by == 0 then "direct"
                   else "range" end)
        })
      | sort_by(.start_t)) as $episodes
  # union of red intervals across workflows, then split at week boundaries
  | ($episodes | map([.start_t, .end_t]) | sort
      | reduce .[] as $i ([]; if length > 0 and $i[0] <= .[-1][1]
                              then .[-1][1] = ([.[-1][1], $i[1]] | max) else . + [$i] end)) as $union
  | ([range(wk($since_t); $now; 604800)] | map(. as $w | {
        week: ($w | strftime("%Y-%m-%d")),
        red_minutes: ([$union[] | [([.[0], $w] | max), ([.[1], $w + 604800] | min)]
                       | select(.[1] > .[0]) | .[1] - .[0]] | add // 0 | . / 60 | floor)
      })) as $weeks
  | ($runs | group_by(.conclusion) | map({key: (.[0].conclusion // "null"), value: length}) | from_entries) as $counts
  | ($runs | map(.created_at) | min) as $oldest
  | {
      repo: $repo, branch: $branch, workflow: $workflow, since: $since,
      runs_read: ($runs | length), oldest_run: $oldest, truncated_by_limit: ($truncated == 1),
      conclusions: $counts,
      episodes: ($episodes | map({workflow, start, end, open, minutes, reds, cancelled, no_verdict,
                                  first_bad: .first_bad.head_sha, first_bad_run: .first_bad.html_url,
                                  last_good: (.last_good.head_sha // null), commits, parent})),
      red_minutes_per_week: $weeks,
      flake_candidates: $flakes[0],
      flake_runs_inspected: $inspected, flake_job_listings_failed: $job_failures,
      reruns_in_window: $reruns
    }
  | if $json == 1 then . else
      "ci-health  " + .repo + "  branch " + .branch + "  workflow " + .workflow + "  since " + .since,
      "runs read " + (.runs_read | tostring) + " (push, completed)   "
        + (.conclusions | to_entries | map(.key + " " + (.value | tostring)) | join(", ")),
      (if .truncated_by_limit then "WARNING: --limit reached; oldest run read is " + (.oldest_run // "-")
         + ", so the window starts later than --since" else empty end),
      "",
      "RED EPISODES (first failure after a green, until the next green; cancelled = no verdict)",
      (if (.episodes | length) == 0 then "  none" else
        "  " + ("start (UTC)" | pad(17)) + ("h:mm" | pad(7)) + ("state" | pad(7)) + ("workflow" | pad(26))
          + ("first-bad" | pad(10)) + ("last-good" | pad(10)) + ("commits" | pad(8)) + ("parent" | pad(9)) + "reds cancelled",
        (.episodes[] | "  " + (.start[0:16] | sub("T"; " ") | pad(17)) + (hm(.minutes * 60) | pad(7))
          + ((if .open then "OPEN" else "closed" end) | pad(7)) + (.workflow[0:25] | pad(26))
          + (.first_bad | short | pad(10)) + (.last_good | short | pad(10))
          + ((.commits // "-") | tostring | pad(8)) + (.parent | pad(9))
          + (.reds | tostring | pad(5)) + (.cancelled | tostring))
      end),
      "",
      "RED MINUTES PER WEEK (union across workflows; weeks start Monday UTC; first and last weeks are partial)",
      (.red_minutes_per_week[] | "  " + .week + "  " + (.red_minutes | tostring)),
      "",
      "FLAKE CANDIDATES (same head SHA and job, both success and failure)",
      "  inspected " + (.flake_runs_inspected | tostring) + " runs (re-run or repeated SHA); "
        + (.reruns_in_window | tostring) + " runs in the window had run_attempt > 1",
      (if .flake_job_listings_failed > 0 then "  INCOMPLETE: " + (.flake_job_listings_failed | tostring)
         + " job listings failed after retries; candidates below are a lower bound" else empty end),
      (if (.flake_candidates | length) == 0 then "  none" else
        (.flake_candidates[] | "  " + (.head_sha | short) + "  " + .workflow + " / " + .job
          + "  success " + (.success | tostring) + ", failure " + (.failure | tostring))
      end)
    end
'
