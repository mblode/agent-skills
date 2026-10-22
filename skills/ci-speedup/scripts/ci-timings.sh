#!/usr/bin/env bash
# Print per-job and per-step durations and the critical path for one GitHub
# Actions run, or median and p90 per job across many runs. Read-only. Needs
# `gh` (authenticated) and `jq`, or saved JSON via --jobs-json / --runs-dir.
# Works on bash 3.2 (macOS /bin/bash).
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: ci-timings.sh <run-id> [--repo owner/name] [--min-step-seconds N]
       ci-timings.sh --jobs-json <file> [--run-started-at <iso8601>] [--min-step-seconds N]
       ci-timings.sh --runs N --workflow <file.yml> [--branch <name>] [--event <event>]
                     [--since YYYY-MM-DD] [--success-only] [--repo owner/name]
       ci-timings.sh --runs-dir <dir> [--event <event>] [--since YYYY-MM-DD] [--success-only]

One run (first two forms) prints:
  1. every job with queue wait and duration, in start order
  2. every step at or above --min-step-seconds (default 2), longest first
  3. the critical path: the chain of jobs ending last, walked back through
     the jobs that finished latest before each one started

Many runs (last two forms) print, per event and per job name:
  median / p90 duration over every conclusion (success, failure, cancelled),
  queue wait median / p90 (job created_at to started_at), counts of success,
  failure and cancelled, and rerun share (rows from run_attempt > 1). A RUN
  row covers each run's latest attempt from first job created to last job
  complete; a RUN QUEUE row covers first job created to first job started.

  --runs N         the last N completed runs (status=completed); jobs are
                   fetched with filter=all, so earlier attempts count
  --success-only   successful runs only (the old behaviour; hides failures
                   and reruns from p90)
  --event E        push | pull_request | merge_group (passed to the API)
  --since DATE     runs created on or after DATE, filtered in jq
  --branch B       head branch. Merge-queue runs run on
                   gh-readonly-queue/<base>/..., so --branch main drops every
                   merge_group run; use --event merge_group without --branch
  --runs-dir DIR   read one JSON file per run instead of calling gh: either
                   {"run": <run object>, "jobs": [<job>...]} or a saved
                   jobs response ({"jobs": [...]}, as from list_workflow_jobs)

--repo sets GH_REPO for gh; without it gh uses the current checkout.
--jobs-json takes the output of `GET /repos/{owner}/{repo}/actions/runs/{id}/jobs`
(or a GitHub MCP server's list_workflow_jobs result) saved to a file.
Exit 2 on usage errors.
USAGE
}

die_usage() { echo "ci-timings.sh: $1" >&2; echo "Run with --help for usage." >&2; exit 2; }

need_arg() { [ -n "${2:-}" ] || die_usage "$1 needs a value"; }

run_id=""
jobs_json=""
run_started=""
min_step=2
runs=""
runs_dir=""
workflow=""
branch=""
event=""
since=""
success_only=0

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    --repo) need_arg "$1" "${2:-}"; export GH_REPO="$2"; shift 2 ;;
    --jobs-json) need_arg "$1" "${2:-}"; jobs_json="$2"; shift 2 ;;
    --run-started-at) need_arg "$1" "${2:-}"; run_started="$2"; shift 2 ;;
    --min-step-seconds) need_arg "$1" "${2:-}"; min_step="$2"; shift 2 ;;
    --runs) need_arg "$1" "${2:-}"; runs="$2"; shift 2 ;;
    --runs-dir) need_arg "$1" "${2:-}"; runs_dir="$2"; shift 2 ;;
    --workflow) need_arg "$1" "${2:-}"; workflow="$2"; shift 2 ;;
    --branch) need_arg "$1" "${2:-}"; branch="$2"; shift 2 ;;
    --event) need_arg "$1" "${2:-}"; event="$2"; shift 2 ;;
    --since) need_arg "$1" "${2:-}"; since="$2"; shift 2 ;;
    --success-only) success_only=1; shift ;;
    -*) die_usage "unknown flag $1" ;;
    *) run_id="$1"; shift ;;
  esac
done

case "$event" in
  ""|push|pull_request|merge_group) ;;
  *) die_usage "--event must be push, pull_request or merge_group" ;;
esac
case "$since" in
  ""|[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]) ;;
  *) die_usage "--since must be YYYY-MM-DD" ;;
esac
if [ -n "$runs" ]; then
  case "$runs" in
    *[!0-9]*|0) die_usage "--runs must be a positive integer" ;;
  esac
fi
case "$min_step" in
  *[!0-9]*|"") die_usage "--min-step-seconds must be a whole number" ;;
esac

command -v jq >/dev/null || { echo "jq is required" >&2; exit 2; }

# --- many runs: median and p90 per job -------------------------------------
if [ -n "$runs" ] || [ -n "$runs_dir" ]; then
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT

  if [ -n "$runs_dir" ]; then
    [ -d "$runs_dir" ] || die_usage "--runs-dir $runs_dir is not a directory"
    found=0
    for f in "$runs_dir"/*.json; do
      [ -f "$f" ] || continue
      found=1
      # A file may hold several documents (gh --paginate pages); merge them.
      jq -c -s '
        def unwrap: if type == "object" and has("jobs") then .jobs else . end;
        [ .[] | if type == "object" and has("run")
                then {run: .run, jobs: (.jobs | unwrap | unwrap)}
                elif type == "object" and has("jobs") then {run: null, jobs: (.jobs | unwrap)}
                elif type == "array" then {run: null, jobs: .}
                else empty end ]
        | {run: (map(.run) | map(select(. != null)) | .[0]), jobs: (map(.jobs) | add // [])}
      ' "$f" >> "$tmp/all.jsonl"
    done
    [ "$found" = 1 ] || die_usage "no .json files in $runs_dir"
  else
    [ -n "$workflow" ] || die_usage "--runs needs --workflow <file.yml>"
    command -v gh >/dev/null || { echo "gh is required for --runs" >&2; exit 2; }
    if [ -n "$branch" ] && [ "$event" = "merge_group" ]; then
      echo "note: merge_group runs run on gh-readonly-queue/... branches; --branch $branch will match none" >&2
    fi
    status="completed"
    [ "$success_only" = 1 ] && status="success"
    base="status=${status}&per_page=100"
    [ -n "$branch" ] && base="${base}&branch=${branch}"
    [ -n "$event" ] && base="${base}&event=${event}"
    page=1
    : > "$tmp/runs.jsonl"
    while [ "$(wc -l < "$tmp/runs.jsonl" | tr -d ' ')" -lt "$runs" ]; do
      gh api "repos/{owner}/{repo}/actions/workflows/${workflow}/runs?${base}&page=${page}" \
        --jq '.workflow_runs[] | {id, event, status, conclusion, run_attempt, created_at, run_started_at, updated_at, head_branch, head_sha}' \
        > "$tmp/page.jsonl"
      [ -s "$tmp/page.jsonl" ] || break
      # Runs arrive newest first; stop paging once a page reaches past --since.
      jq -c --arg since "$since" 'select($since == "" or .created_at >= $since)' "$tmp/page.jsonl" >> "$tmp/runs.jsonl"
      if [ -n "$since" ] && [ "$(jq -s --arg since "$since" 'map(select(.created_at < $since)) | length' "$tmp/page.jsonl")" -gt 0 ]; then
        break
      fi
      page=$((page + 1))
    done
    head -n "$runs" "$tmp/runs.jsonl" > "$tmp/selected.jsonl"
    : > "$tmp/all.jsonl"
    while IFS= read -r run; do
      id="$(printf '%s' "$run" | jq -r '.id')"
      gh api --paginate "repos/{owner}/{repo}/actions/runs/${id}/jobs?filter=all&per_page=100" --jq '.jobs[]' \
        | jq -c -s --argjson run "$run" '{run: $run, jobs: .}' >> "$tmp/all.jsonl"
    done < "$tmp/selected.jsonl"
  fi

  jq -r -s --arg event "$event" --arg since "$since" --arg success_only "$success_only" '
    def secs(a; b): ((b | fromdateiso8601) - (a | fromdateiso8601));
    def fmt(s): if s == null then "-" else
      ((s / 60 | floor | tostring) + ":" + (((s % 60 | floor) | tostring) | if length < 2 then "0" + . else . end)) end;
    # Nearest rank: the p90 of two samples is the larger one.
    def pct(p): sort | if length == 0 then null else .[((length * p) | ceil) - 1] end;
    def pad(n): tostring | if length < n then (" " * (n - length)) + . else . end;
    def share(a; b): if b == 0 then "-" else ((a * 100 / b | floor | tostring) + "%") end;
    def failed: . == "failure" or . == "timed_out" or . == "startup_failure";

    # Fill run fields from the jobs when a file had no run object.
    map(. as $r
      | ($r.jobs | map(select(.conclusion != "skipped"))) as $live
      | ($r.jobs | map(.run_attempt // 1) | max // 1) as $last
      | .run = ($r.run // {
          id: ($r.jobs[0].run_id // null),
          event: "unknown",
          run_attempt: $last,
          created_at: ($r.jobs | map(.created_at) | min),
          conclusion: (if ($live | map(select((.run_attempt // 1) == $last)) | all(.conclusion == "success")) then "success" else "failure" end)
        })
      | .run.event = (.run.event // "unknown"))
    | map(select(.run.created_at != null))
    | map(select($event == "" or .run.event == $event))
    | map(select($since == "" or .run.created_at >= $since))
    | map(select($success_only != "1" or .run.conclusion == "success"))
    | if length == 0 then "No runs match the filters." else
    group_by(.run.event)[]
    | . as $runs
    | ($runs | length) as $n
    | ([ $runs[] | . as $r | ($r.jobs | map(.run_attempt // 1) | max // 1) as $last
         | $r.jobs | map(select(.conclusion != "skipped" and (.run_attempt // 1) == $last
                                and .created_at != null and .started_at != null and .completed_at != null))
         | select(length > 0)
         | {total: secs(map(.created_at) | min; map(.completed_at) | max),
            queue: secs(map(.created_at) | min; map(.started_at) | min)} ]) as $runrows
    | ([ $runs[].jobs[] | select(.conclusion != "skipped") ]) as $jobs
    | "EVENT " + $runs[0].run.event + "   RUNS " + ($n | tostring)
        + "   success " + ($runs | map(select(.run.conclusion == "success")) | length | tostring)
        + ", failure " + ($runs | map(select(.run.conclusion | failed)) | length | tostring)
        + ", cancelled " + ($runs | map(select(.run.conclusion == "cancelled")) | length | tostring)
        + ($runs | map(.run.conclusion | select(. != "success" and . != "cancelled" and (failed | not)))
           | if length == 0 then "" else ", other " + (length | tostring) + " (" + (unique | map(tostring) | join(",")) + ")" end)
        + "   rerun runs " + share($runs | map(select((.run.run_attempt // 1) > 1)) | length; $n),
      "  median /  p90   queue med /  p90    ok fail canc  rerun  job",
      ( "  " + (fmt($runrows | map(.total) | pct(0.5)) | pad(6)) + " / " + (fmt($runrows | map(.total) | pct(0.9)) | pad(5))
          + "   " + ("" | pad(9)) + "   " + ("" | pad(5))
          + "                      RUN (latest attempt, first job created to last job complete)  [" + ($runrows | length | tostring) + " runs]" ),
      ( "  " + ("" | pad(6)) + "   " + ("" | pad(5))
          + "   " + (fmt($runrows | map(.queue) | pct(0.5)) | pad(9)) + " / " + (fmt($runrows | map(.queue) | pct(0.9)) | pad(5))
          + "                      RUN QUEUE (first job created to first job started)" ),
      ( $jobs | group_by(.name)
        | map(. as $g
            | ($g | map(select(.started_at != null and .completed_at != null) | secs(.started_at; .completed_at))) as $d
            | ($g | map(select(.created_at != null and .started_at != null) | secs(.created_at; .started_at))) as $q
            | {name: $g[0].name, rows: ($g | length),
               med: ($d | pct(0.5)), p90: ($d | pct(0.9)), qmed: ($q | pct(0.5)), qp90: ($q | pct(0.9)),
               ok: ($g | map(select(.conclusion == "success")) | length),
               fail: ($g | map(select(.conclusion | failed)) | length),
               canc: ($g | map(select(.conclusion == "cancelled")) | length),
               rerun: ($g | map(select((.run_attempt // 1) > 1)) | length)})
        | sort_by(-(.p90 // 0))[]
        | "  " + (fmt(.med) | pad(6)) + " / " + (fmt(.p90) | pad(5))
          + "   " + (fmt(.qmed) | pad(9)) + " / " + (fmt(.qp90) | pad(5))
          + "  " + (.ok | pad(4)) + " " + (.fail | pad(4)) + " " + (.canc | pad(4)) + "  " + (share(.rerun; .rows) | pad(5))
          + "  " + .name + "  [" + (.rows | tostring) + " rows]" ),
      ""
    end
  ' "$tmp/all.jsonl"
  exit 0
fi

# --- one run: jobs, steps, critical path -----------------------------------
if [ -n "$jobs_json" ]; then
  jobs="$(cat "$jobs_json")"
else
  [ -n "$run_id" ] || { usage >&2; exit 2; }
  command -v gh >/dev/null || { echo "gh is required without --jobs-json" >&2; exit 2; }
  jobs="$(gh api --paginate "repos/{owner}/{repo}/actions/runs/${run_id}/jobs?per_page=100")"
  run_started="$(gh api "repos/{owner}/{repo}/actions/runs/${run_id}" --jq '.run_started_at')"
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

  if length == 0 then "No finished jobs in this run." else
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
  end
'
