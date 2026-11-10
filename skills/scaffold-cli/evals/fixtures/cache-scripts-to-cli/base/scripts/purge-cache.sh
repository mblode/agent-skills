#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/lib/common.sh"

if [ $# -lt 1 ]; then
  echo "usage: purge-cache.sh <bucket> [--older-than DAYS]"
  exit 1
fi

bucket="$1"
shift
older_than=0
if [ "${1:-}" = "--older-than" ]; then
  older_than="$2"
fi

target="$CACHE_ROOT/$bucket"
if [ "$older_than" -gt 0 ] && [ "$(bucket_age_days "$target")" -lt "$older_than" ]; then
  echo "$bucket is newer than $older_than days, keeping it"
  exit 0
fi

read -r -p "Delete $target? [y/N] " answer
if [ "$answer" = "y" ]; then
  rm -rf "$target"
  echo "purged $bucket"
fi
