#!/usr/bin/env bash
#
# Probes the machine-readable surfaces a site advertises and prints one TSV
# line per URL: status, content-type, link, location, url. Exits 1 when any
# probe misses: a non-200 status, a curl failure, or a Content-Type that does
# not start with --expect-type. Redirects are not followed; a 3xx is a miss
# with its Location shown, because agents that do not follow it see the miss.
#
#   check-surfaces.sh --origin https://docs.example.com
#       probes the standard set: /llms.txt /robots.txt /sitemap.xml
#   check-surfaces.sh --origin https://docs.example.com /guide.md /openapi.json
#       probes the given paths on that origin (absolute URLs also accepted)
#   check-surfaces.sh --accept text/markdown --expect-type text/markdown https://docs.example.com/guide
#       content negotiation: the HTML URL must answer with markdown
#   check-surfaces.sh --origin https://docs.example.com --out surfaces.tsv
#       also writes the TSV to a file for the report
#
# Portable to bash 3.2 (macOS default): no associative arrays, no mapfile.

set -uo pipefail

ORIGIN=""
ACCEPT=""
EXPECT_TYPE=""
OUT=""
# llms-full.txt on a large site runs several megabytes; a surface that takes
# longer than this to answer is itself a finding, so do not wait longer.
MAX_TIME=20

usage() { sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'; }

TARGETS=""
while [ $# -gt 0 ]; do
  case "$1" in
    --origin) ORIGIN="${2%/}"; shift 2 ;;
    --accept) ACCEPT="$2"; shift 2 ;;
    --expect-type) EXPECT_TYPE="$2"; shift 2 ;;
    --out) OUT="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    -*) echo "unknown option: $1" >&2; usage >&2; exit 2 ;;
    *) TARGETS="$TARGETS
$1"; shift ;;
  esac
done

if [ -z "$TARGETS" ]; then
  if [ -z "$ORIGIN" ]; then
    echo "give --origin URL, one or more paths or URLs, or both" >&2
    exit 2
  fi
  TARGETS="
/llms.txt
/robots.txt
/sitemap.xml"
fi

# header_value <headers-file> <name>: first matching header's value, lowercase
# name match, trailing CR stripped. Empty when absent.
header_value() {
  awk -v name="$2" 'BEGIN { IGNORECASE = 1 }
    tolower($0) ~ "^" tolower(name) ":" { sub(/^[^:]*:[ \t]*/, ""); sub(/\r$/, ""); print; exit }' "$1"
}

HEADERS="$(mktemp)"
trap 'rm -f "$HEADERS"' EXIT

misses=0
lines="status	content-type	link	location	url"

probe() {
  url="$1"
  if [ -n "$ACCEPT" ]; then
    curl -sS -o /dev/null -D "$HEADERS" --max-time "$MAX_TIME" -H "Accept: $ACCEPT" "$url" 2>/dev/null
  else
    curl -sS -o /dev/null -D "$HEADERS" --max-time "$MAX_TIME" "$url" 2>/dev/null
  fi
  rc=$?
  if [ $rc -ne 0 ]; then
    status="000"; ctype=""; link=""; location="curl exit $rc"
  else
    # HTTP/1.1 and HTTP/2 status lines both carry the code in field 2.
    status="$(awk 'NR == 1 { print $2 }' "$HEADERS")"
    ctype="$(header_value "$HEADERS" content-type)"
    link="$(header_value "$HEADERS" link)"
    location="$(header_value "$HEADERS" location)"
  fi
  miss=0
  [ "$status" = "200" ] || miss=1
  if [ -n "$EXPECT_TYPE" ]; then
    case "$ctype" in
      "$EXPECT_TYPE"*) ;;
      *) miss=1 ;;
    esac
  fi
  [ $miss -eq 0 ] || misses=$((misses + 1))
  lines="$lines
$status	$ctype	$link	$location	$url"
}

echo "$TARGETS" | while IFS= read -r target; do
  [ -n "$target" ] || continue
  case "$target" in
    http://*|https://*) echo "$target" ;;
    *)
      if [ -z "$ORIGIN" ]; then
        echo "path $target needs --origin" >&2
        exit 2
      fi
      echo "$ORIGIN/${target#/}"
      ;;
  esac
done > "$HEADERS.urls" || exit 2

while IFS= read -r url; do
  [ -n "$url" ] || continue
  probe "$url"
done < "$HEADERS.urls"
rm -f "$HEADERS.urls"

printf '%s\n' "$lines"
if [ -n "$OUT" ]; then
  printf '%s\n' "$lines" > "$OUT"
  echo "wrote $OUT" >&2
fi

if [ $misses -gt 0 ]; then
  echo "$misses surface(s) missed" >&2
  exit 1
fi
