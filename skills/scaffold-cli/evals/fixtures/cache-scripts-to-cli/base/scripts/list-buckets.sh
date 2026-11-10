#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/lib/common.sh"

if [ ! -d "$CACHE_ROOT" ]; then
  echo "no cache at $CACHE_ROOT"
  exit 0
fi

printf '%-28s %10s %6s\n' BUCKET SIZE_KB AGE_D
for dir in "$CACHE_ROOT"/*/; do
  [ -d "$dir" ] || continue
  printf '%-28s %10s %6s\n' "$(basename "$dir")" "$(bucket_size "$dir")" "$(bucket_age_days "$dir")"
done
