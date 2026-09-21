#!/usr/bin/env bash
# Print per-job and per-step durations and the critical path for one GitHub
# Actions run. Read-only. Needs `gh` (authenticated) and `jq`, or a saved jobs
# JSON via --jobs-json for hosts without the CLI.
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: ci-timings.sh <run-id> [--repo owner/name] [--min-step-seconds N]
       ci-timings.sh --jobs-json <file> [--run-started-at <iso8601>] [--min-step-seconds N]
       ci-timings.sh --runs N --workflow <file.yml> [--branch <name>] [--repo owner/name]
       ci-timings.sh --runs-dir <dir>

One run (first two forms) prints:
  1. every job with queue wait and duration, in start order
  2. every step at or above --min-step-seconds (default 2), longest first
  3. the critical path: the chain of jobs ending last, walked back through
     the jobs that finished latest before each one started

Many runs (last two forms) print, per job name and for the whole run, the
median and p90 duration across the runs, plus the spread. A single run is a
sample: the same shard has measured 2:26 and 3:30 on consecutive pushes.
--runs fetches the last N completed successful runs of the workflow (and
branch) through gh; --runs-dir reads one saved jobs JSON per file instead.

--jobs-json takes the output of `GET /repos/{owner}/{repo}/actions/runs/{id}/jobs`
(or a GitHub MCP server's list_workflow_jobs result) saved to a file.
USAGE
}

run_id=""
repo_flag=()
jobs_json=""
run_started=""
min_step=2
runs=""
runs_dir=""
workflow=""
branch=""

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    --repo) repo_flag=(--repo "$2"); shift 2 ;;
    --jobs-json) jobs_json="$2"; shift 2 ;;
    --run-started-at) run_started="$2"; shift 2 ;;
    --min-step-seconds) min_step="$2"; shift 2 ;;
    --runs) runs="$2"; shift 2 ;;
    --runs-dir) runs_dir="$2"; shift 2 ;;
    --workflow) workflow="$2"; shift 2 ;;
    --branch) branch="$2"; shift 2 ;;
    -*) echo "unknown flag $1" >&2; usage >&2; exit 2 ;;
    *) run_id="$1"; shift ;;
  esac
done

command -v jq >/dev/null || { echo "jq is required" >&2; exit 2; }

# --- many runs: median and p90 per job -------------------------------------
if [ -n "$runs" ] || [ -n "$runs_dir" ]; then
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  if [ -n "$runs_dir" ]; then
    cp "$runs_dir"/*.json "$tmp"/
  else
    [ -n "$workflow" ] || { echo "--runs needs --workflow <file.yml>" >&2; exit 2; }
    command -v gh >/dev/null || { echo "gh is required for --runs" >&2; exit 2; }
    query="status=success&per_page=${runs}"
    [ -n "$branch" ] && query="${query}&branch=${branch}"
    for id in $(gh api "${repo_flag[@]}" "repos/{owner}/{repo}/actions/workflows/${workflow}/runs?${query}" --jq '.workflow_runs[].id'); do
      gh api "${repo_flag[@]}" --paginate "repos/{owner}/{repo}/actions/runs/${id}/jobs?per_page=100" > "$tmp/$id.json"
    done
  fi
  # Each file becomes one run: its jobs (skipped ones dropped) plus a
  # synthetic "RUN" row from the earliest job creation to the latest finish.
  cat "$tmp"/*.json | jq -s '
    def secs(a; b): ((b | fromdateiso8601) - (a | fromdateiso8601));
    def fmt(s): ((s / 60 | floor | tostring) + ":" + (((s % 60) | tostring) | if length < 2 then "0" + . else . end));
    def pct(p): sort | if length == 0 then null else .[((length - 1) * p) | floor] end;
    [ .[] | (if has("jobs") then (.jobs | if type == "object" and has("jobs") then .jobs else . end) else . end)
      | map(select(.completed_at != null and .started_at != null and .conclusion != "skipped"))
      | select(length > 0)
      | ( map({name, s: secs(.started_at; .completed_at)}) )
        + [ {name: "RUN (first job created to last job complete)",
             s: secs((map(.created_at) | min); (map(.completed_at) | max))} ] ]
    | (length) as $n
    | flatten
    | group_by(.name)
    | map({name: .[0].name, runs: length, med: (map(.s) | pct(0.5)), p90: (map(.s) | pct(0.9)), min: (map(.s) | min), max: (map(.s) | max)})
    | sort_by(-.p90)
    | "RUNS " + ($n | tostring) + "   median / p90   (min .. max)   job",
      (.[] | "  " + fmt(.med) + " / " + fmt(.p90) + "   (" + fmt(.min) + " .. " + fmt(.max) + ")   " + .name + "  [" + (.runs | tostring) + " runs]")
  '
  exit 0
fi

if [ -n "$jobs_json" ]; then
  jobs="$(cat "$jobs_json")"
else
  [ -n "$run_id" ] || { usage >&2; exit 2; }
  command -v gh >/dev/null || { echo "gh is required without --jobs-json" >&2; exit 2; }
  jobs="$(gh api "${repo_flag[@]}" --paginate "repos/{owner}/{repo}/actions/runs/${run_id}/jobs?per_page=100")"
  run_started="$(gh api "${repo_flag[@]}" "repos/{owner}/{repo}/actions/runs/${run_id}" --jq '.run_started_at')"
fi

# Normalise: gh --paginate emits one object per page; a saved MCP result may
# wrap the array as {"jobs": {"jobs": [...]}}.
normalised="$(printf '%s' "$jobs" | jq -s '
  [ .[] | if has("jobs") then (.jobs | if type == "object" and has("jobs") then .jobs else . end) else . end ]
  | flatten
  | map(select(.completed_at != null and .started_at != null and .conclusion != "skipped"))
')"

printf '%s' "$normalised" | jq -r --arg run_started "$run_started" --arg min "$min_step" '
  def secs(a; b): ((b | fromdateiso8601) - (a | fromdateiso8601));
  def fmt(s): (s / 60 | floor | tostring) + ":" + (((s % 60) | tostring) | if length < 2 then "0" + . else . end);

  sort_by(.started_at) as $jobs
  | ($jobs | map(.completed_at) | max) as $end
  | (if $run_started == "" then ($jobs | map(.created_at) | min) else $run_started end) as $start

  | "RUN  " + fmt(secs($start; $end)) + "  from " + $start + " to " + $end,
    "",
    "JOBS (queue wait / duration)",
    ($jobs[] | "  " + fmt(secs(.created_at; .started_at)) + " / " + fmt(secs(.started_at; .completed_at)) + "  " + .name + "  [" + .conclusion + "]"),
    "",
    "STEPS >= " + $min + "s, longest first",
    ([ $jobs[] as $j | $j.steps[]? | select(.completed_at != null and .started_at != null)
       | {job: $j.name, step: .name, s: secs(.started_at; .completed_at)} ]
     | map(select(.s >= ($min | tonumber)))
     | sort_by(-.s)[]
     | "  " + fmt(.s) + "  " + .job + " / " + .step),
    "",
    "CRITICAL PATH (jobs ending last, walked back through the latest finisher before each start)",
    ( [ $jobs[] | select(.completed_at == $end) ][0] as $last
      | [ $last ]
      | until(
          ( .[0] as $head | [ $jobs[] | select(.id != $head.id and .completed_at <= $head.started_at) ] | length == 0 );
          ( .[0] as $head
            | ([ $jobs[] | select(.id != $head.id and .completed_at <= $head.started_at) ] | sort_by(.completed_at) | last) as $prev
            | [ $prev ] + . )
        )
      | map("  " + .name + " (" + fmt(secs(.started_at; .completed_at)) + ")")[] ),
    "  = " + fmt(secs($start; $end)) + " from run start",
    "",
    "The walk-back uses finish order, not the workflow needs graph: a job that merely finished before another started is listed as its predecessor. Confirm against needs: in the workflow file."
'
