#!/usr/bin/env bash

CACHE_ROOT="${TIDEPOOL_CACHE_ROOT:-$HOME/.cache/tidepool}"

bucket_size() {
  du -sk "$1" | cut -f1
}

bucket_age_days() {
  local modified now
  modified=$(stat -c %Y "$1" 2>/dev/null || stat -f %m "$1")
  now=$(date +%s)
  echo $(( (now - modified) / 86400 ))
}
