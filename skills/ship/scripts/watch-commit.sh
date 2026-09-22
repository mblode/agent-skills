#!/usr/bin/env bash
# Watch every GitHub Actions run for one commit until all of them complete.
#
# usage: watch-commit.sh [<sha>] [--repo owner/name] [--interval <seconds>]
# stdout: a "---" block listing id|workflow|status|conclusion on every state
#         change, then exactly one "TERMINAL: success" or "TERMINAL: failure".
# stderr: one sentence, on a startup failure only.
# exit:   0 once a TERMINAL line is printed; 1 on a startup failure.
#
# Scoped by commit SHA, not branch, so older pushes do not bleed in and the
# watch does not end when the first of several parallel workflows finishes.
# Any conclusion other than success (cancelled, timed_out, action_required,
# neutral, skipped, stale) reports as failure so the logs get read.
set -euo pipefail

die() { printf '%s\n' "$1" >&2; exit 1; }

usage() {
  sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'
}

SHA=""; REPO=""
# 30s: faster loops spend API quota for no new information and can stall a
# release mid-flow on the rate limit.
INTERVAL=30
while [ $# -gt 0 ]; do
  case "$1" in
    --repo) REPO="${2:-}"; shift 2 ;;
    --interval) INTERVAL="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    -*) die "unknown flag '$1'. usage: watch-commit.sh [<sha>] [--repo owner/name] [--interval <seconds>]" ;;
    *) SHA="$1"; shift ;;
  esac
done

command -v gh >/dev/null 2>&1 || die "gh not found: install the GitHub CLI from https://cli.github.com"
gh auth status >/dev/null 2>&1 || die "gh not authenticated: run gh auth login"
case "$INTERVAL" in ''|*[!0-9]*) die "bad --interval '$INTERVAL': expected whole seconds" ;; esac
[ "$INTERVAL" -ge 30 ] || die "--interval below 30 seconds burns the API rate limit; use 30 or more"

if [ -z "$SHA" ]; then
  SHA=$(git rev-parse HEAD 2>/dev/null) || die "no SHA given and not inside a git checkout: pass <sha>"
fi

# ${arr[@]+...} below: bash 3.2 (macOS) treats an empty array as unbound under set -u.
repo_args=()
if [ -n "$REPO" ]; then repo_args=(--repo "$REPO"); fi

LAST=""
while true; do
  # A transient gh failure skips the iteration instead of ending the watch.
  CUR=$(gh run list ${repo_args[@]+"${repo_args[@]}"} --commit "$SHA" --limit 50 \
    --json status,conclusion,workflowName,databaseId \
    --jq 'sort_by(.databaseId) | map("\(.databaseId)|\(.workflowName)|\(.status)|\(.conclusion // "")") | .[]' \
    2>/dev/null) || { sleep "$INTERVAL"; continue; }
  if [ "$CUR" != "$LAST" ]; then
    echo "---"
    [ -n "$CUR" ] && echo "$CUR"
    LAST="$CUR"
  fi
  # No runs registered yet: they take a moment to queue after a push.
  [ -z "$CUR" ] && { sleep "$INTERVAL"; continue; }
  # Any run still in flight: keep waiting.
  if printf '%s\n' "$CUR" | grep -qv '|completed|'; then sleep "$INTERVAL"; continue; fi
  if printf '%s\n' "$CUR" | grep -qv '|success$'; then
    echo "TERMINAL: failure"
  else
    echo "TERMINAL: success"
  fi
  exit 0
done
