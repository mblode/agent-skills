#!/usr/bin/env bash
#
# Proves a scaffold on a cold clone: the committed state only, a fresh install,
# every task run with the Turborepo cache disabled, then dev and production
# startup. Each step prints its kind, so a cached green is never reported as a
# fresh one.
#
#   cold-clone.sh [--dev-url URL] [--start-url URL] [--dev CMD] [--start CMD] [REPO]
#
# REPO defaults to the current directory. Uncommitted files are not in the clone,
# which is the point: a scaffold that only works with them is not done.
# Startup checks run only when their URL is given; each polls the URL for up to
# STARTUP_TIMEOUT seconds (default 90) and then stops the whole process group.

set -uo pipefail

repo="."
dev_cmd="npm run dev"
start_cmd="npm run start"
dev_url=""
start_url=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --dev-url) dev_url="$2"; shift 2 ;;
    --start-url) start_url="$2"; shift 2 ;;
    --dev) dev_cmd="$2"; shift 2 ;;
    --start) start_cmd="$2"; shift 2 ;;
    -*) echo "unknown option: $1" >&2; exit 2 ;;
    *) repo="$1"; shift ;;
  esac
done

work="$(mktemp -d)"
logs="$work/logs"
mkdir -p "$logs"
echo "clone: $work/repo (logs in $logs)"
git clone --quiet "$(cd "$repo" && pwd)" "$work/repo" || { echo "FAIL clone"; exit 1; }
cd "$work/repo" || exit 1

# Every turbo task in this shell ignores local and remote cache hits.
export TURBO_FORCE=true

fail() { echo "FAIL $1 (see $logs/$1.log)"; tail -20 "$logs/$1.log"; exit 1; }

run() {
  label="$1"; kind="$2"; shift 2
  "$@" >"$logs/$label.log" 2>&1 || fail "$label"
  echo "PASS $label [$kind]: $*"
}

has_script() {
  node -e "const s=require('./package.json').scripts||{};process.exit(s[process.argv[1]]?0:1)" "$1"
}

run install fresh npm ci
has_script codegen && run codegen fresh npm run codegen
has_script check && run check fresh npm run check
has_script typecheck && run typecheck fresh npm run typecheck
has_script test && run test fresh npm test
run build fresh npm run build

# Job control gives each background job its own process group, so stopping the
# group also stops the servers that turbo or next spawned underneath it.
set -m
probe() {
  label="$1"; cmd="$2"; url="$3"
  bash -c "$cmd" >"$logs/$label.log" 2>&1 &
  pid=$!
  ok=1
  for _ in $(seq 1 "${STARTUP_TIMEOUT:-90}"); do
    if curl -fsS -o /dev/null "$url" 2>/dev/null; then ok=0; break; fi
    kill -0 "$pid" 2>/dev/null || break
    sleep 1
  done
  kill -- "-$pid" 2>/dev/null
  wait "$pid" 2>/dev/null
  [ "$ok" -eq 0 ] || fail "$label"
  echo "PASS $label [runtime]: $cmd answered $url"
}

[ -n "$dev_url" ] && probe dev-startup "$dev_cmd" "$dev_url"
[ -n "$start_url" ] && probe prod-startup "$start_cmd" "$start_url"

echo "cold clone passed; remove $work when done"
