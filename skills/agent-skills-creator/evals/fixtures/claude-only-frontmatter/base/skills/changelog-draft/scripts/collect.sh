#!/usr/bin/env bash
set -euo pipefail

since="${1:-$(git describe --tags --abbrev=0)}"

git log "${since}..HEAD" --merges --pretty='%s%x09%b' | while IFS=$'\t' read -r subject body; do
  number="$(printf '%s' "$subject" | sed -n 's/.*#\([0-9][0-9]*\).*/\1/p')"
  label="$(printf '%s' "$body" | sed -n 's/^\[\([a-z]*\)\].*/\1/p')"
  title="$(printf '%s' "$body" | sed 's/^\[[a-z]*\] *//')"
  marker=""
  if git log "${since}..HEAD" --pretty='%s' | grep -q "Revert \"${title}\""; then
    marker=" reverted"
  fi
  printf '#%s\t%s\t%s%s\n' "$number" "${label:-unlabelled}" "$title" "$marker"
done
