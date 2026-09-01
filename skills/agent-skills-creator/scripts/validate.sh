#!/usr/bin/env bash
#
# Validates a skill against the Agent Skills format and this repo's house style.
# Every mechanical authoring rule is stated here and nowhere else; prose in
# SKILL.md and references/ carries only judgement a script cannot make.
#
#   validate.sh skills/<name>    one skill
#   validate.sh --all            every skill in the repo
#
# Output groups checks under "format" (the Agent Skills spec) and "house style"
# (this repo's taste). Exits 1 if any check FAILs. SKIP means a check does not
# apply here, always with a reason.
#
# Portable to bash 3.2 (macOS default): no associative arrays, no mapfile.

set -uo pipefail

# Bare mktemp, not `-t skillvalidate`: GNU mktemp rejects a -t template with no
# X's, so the named form ran on macOS and died on every Linux checkout.
RESULTS="$(mktemp)"
trap 'rm -f "$RESULTS"' EXIT

# record <PASS|FAIL|SKIP> <format|house> <check-name> <detail>
record() { printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$4" >>"$RESULTS"; }

# check <format|house> <check-name> <detail-on-failure> <count>
# A count of 0 passes; anything else fails. Keeps call sites to one line.
check() {
  if [ "$4" -eq 0 ]; then record PASS "$1" "$2" ""; else record FAIL "$1" "$2" "$3"; fi
}

validate_skill() {
  skill_dir="${1%/}"
  name="$(basename "$skill_dir")"
  md="$skill_dir/SKILL.md"

  if [ ! -f "$md" ]; then
    record FAIL format skill-md-present "$skill_dir has no SKILL.md"
    return
  fi

  # --- frontmatter: ruby owns YAML parsing and emits its own result lines ---
  ruby -E UTF-8 -ryaml -e '
    path, folder = ARGV
    src = File.read(path)
    m = src.match(/\A---\n(.*?)\n---\n/m)
    # Detail explains a failure, so suppress it on PASS to avoid lines that read
    # as their own contradiction ("PASS name-reserved ... contains a reserved word").
    def out(status, name, detail) puts [status, "format", name, status == "PASS" ? "" : detail].join("\t") end
    unless m
      out("FAIL", "frontmatter-present", "no --- delimited YAML block at the top")
      exit
    end
    out("PASS", "frontmatter-present", "")
    y = begin
      YAML.safe_load(m[1]) || {}
    rescue => e
      out("FAIL", "frontmatter-parses", e.message.split("\n").first.to_s)
      exit
    end
    n = y["name"].to_s
    d = y["description"].to_s

    if n.empty? then out("FAIL", "name-present", "missing name")
    else
      out("PASS", "name-present", "")
      out(n.length <= 64 ? "PASS" : "FAIL", "name-length", "#{n.length} chars, max 64")
      out(n =~ /\A[a-z0-9]+(-[a-z0-9]+)*\z/ ? "PASS" : "FAIL", "name-charset",
          "#{n.inspect} must be lowercase alphanumeric, single hyphens, no leading or trailing hyphen")
      out(n =~ /anthropic|claude/ ? "FAIL" : "PASS", "name-reserved", "#{n.inspect} contains a reserved word")
      out(n == folder ? "PASS" : "FAIL", "name-matches-folder", "name #{n.inspect} vs folder #{folder.inspect}")
    end

    if d.empty? then out("FAIL", "description-present", "missing description")
    else
      out("PASS", "description-present", "")
      out(d.length <= 1024 ? "PASS" : "FAIL", "description-length", "#{d.length} chars, max 1024")
      out(d =~ /<[a-zA-Z\/]/ ? "FAIL" : "PASS", "description-no-xml", "contains an XML-ish tag")
      out(d =~ /Use when/ ? "PASS" : "FAIL", "description-triggers", "no \"Use when\" trigger phrase")
      out(d =~ /\A\s*(I |Use this|This skill)/ ? "FAIL" : "PASS", "description-third-person",
          "opens in first person or as a human summary, not third-person capability")
    end
  ' "$md" "$name" >>"$RESULTS" 2>/dev/null || record FAIL format frontmatter-parses "ruby failed on $md"

  # --- body ---
  lines=$(wc -l <"$md" | tr -d ' ')
  if [ "$lines" -lt 500 ]; then
    record PASS format body-under-500-lines ""
  else
    record FAIL format body-under-500-lines "$lines lines, split into references/"
  fi

  # Windows separators, only on lines that look like paths, to avoid flagging
  # regex or LaTeX inside fenced blocks.
  n=$(grep -cE '[A-Za-z0-9_.-]+\\[A-Za-z0-9_.-]+\.(md|json|sh|py|ts)' "$md" 2>/dev/null || true)
  check format forward-slashes "backslash in a file path" "${n:-0}"

  # --- references ---
  # Reachability covers every markdown file in the skill, not just references/.
  # Hub skills index subfolders (guidelines/, direction/) from a root track file,
  # so a file counts as reachable if SKILL.md or any root .md names it. Without
  # this, deleting a file and its only link passes silently.
  # NUL-delimited throughout: a filename with whitespace otherwise word-splits,
  # which made this check pass and the kebab check miss the very name it exists
  # to catch. Process substitution, not a pipe, so $orphans survives the loop.
  orphans=""
  while IFS= read -r -d '' f; do
    base="$(basename "$f")"
    # -F so a dot in the filename is a literal, not a regex wildcard.
    find "$skill_dir" -maxdepth 1 -name '*.md' -exec grep -qF "$base" {} + 2>/dev/null \
      || orphans="$orphans $base"
  done < <(find "$skill_dir" -name '*.md' -not -name 'SKILL.md' -not -path '*/rules*' -print0 2>/dev/null)
  check format all-md-reachable "unreachable from SKILL.md or a root track file:$orphans" \
    "$(printf '%s' "$orphans" | wc -w | tr -d ' ')"

  if [ -d "$skill_dir/references" ]; then

    # A chain is a reference telling you to load another reference. A prose
    # cross-mention without an imperative is a pointer, not a chain.
    chains=""
    for f in "$skill_dir"/references/*.md; do
      [ -f "$f" ] || continue
      self="$(basename "$f")"
      for g in "$skill_dir"/references/*.md; do
        other="$(basename "$g")"
        [ "$self" = "$other" ] && continue
        grep -qiE "\b(load|read)\b[^.]*$other" "$f" && chains="$chains $self->$other"
      done
    done
    check format no-reference-chains "imperative chain:$chains" "$(printf '%s' "$chains" | wc -w | tr -d ' ')"
  else
    record SKIP format references-linked "no references/ folder"
  fi

  # TOC on long references and track files. Rule files are exempt: _template.md
  # fixes their schema, so they are single-topic by construction and a TOC there
  # is noise, not navigation.
  no_toc=""
  while IFS= read -r -d '' f; do
    fl=$(wc -l <"$f" | tr -d ' ')
    [ "${fl:-0}" -le 100 ] && continue
    head -20 "$f" | grep -qiE '^#{2,3} (contents|table of contents)' || no_toc="$no_toc $(basename "$f"):${fl}L"
  done < <(find "$skill_dir" -name '*.md' -not -name 'SKILL.md' -not -path '*/rules*' -print0 2>/dev/null)
  check format toc-over-100-lines "over 100 lines with no Contents heading:$no_toc" \
    "$(printf '%s' "$no_toc" | wc -w | tr -d ' ')"

  # bash 3.2 mis-parses `case` inside $( ), so build this in the current shell.
  bad_names=""
  while IFS= read -r -d '' f; do
    b="$(basename "$f" .md)"
    if [ "$b" = "SKILL" ] || [ "$b" = "_sections" ] || [ "$b" = "_template" ]; then continue; fi
    printf '%s' "$b" | grep -qE '^[a-z0-9]+(-[a-z0-9]+)*$' || bad_names="$bad_names ${b// /<space>}"
  done < <(find "$skill_dir" -name '*.md' -print0 2>/dev/null)
  check format kebab-case-filenames "not kebab-case:$bad_names" "$(printf '%s' "$bad_names" | wc -w | tr -d ' ')"

  # Root-level track files belong to the simple/hub pattern only.
  root_md=$(find "$skill_dir" -maxdepth 1 -name '*.md' -not -name 'SKILL.md' 2>/dev/null | wc -l | tr -d ' ')
  if [ "$root_md" -eq 0 ]; then
    record PASS format root-md-hub-only ""
  elif grep -qiE '^#{2,3} (modes|tracks)' "$md"; then
    record PASS format root-md-hub-only ""
  else
    record FAIL format root-md-hub-only "$root_md root .md files but no Modes or Tracks table in SKILL.md"
  fi

  # --- rules folders ---
  rules_total=0
  found_rules=0
  for rd in "$skill_dir"/rules*; do
    [ -d "$rd" ] || continue
    found_rules=1
    rname="$(basename "$rd")"
    [ -f "$rd/_sections.md" ] || record FAIL format rules-sections-present "$rname/_sections.md missing"
    [ -f "$rd/_template.md" ] || record FAIL format rules-template-present "$rname/_template.md missing"

    prefixes="$(grep -oE '\(([a-z0-9-]+)\)' "$rd/_sections.md" 2>/dev/null | tr -d '()' | sort -u)"
    bad_prefix=""
    no_fm=""
    for rf in "$rd"/*.md; do
      [ -f "$rf" ] || continue
      b="$(basename "$rf" .md)"
      case "$b" in _*) continue ;; esac
      rules_total=$((rules_total + 1))
      head -1 "$rf" | grep -q '^---$' || no_fm="$no_fm $b"
      matched=0
      for p in $prefixes; do
        case "$b" in "$p"-*) matched=1; break ;; esac
      done
      [ "$matched" -eq 0 ] && bad_prefix="$bad_prefix $b"
    done
    check format rules-prefix-in-sections "prefix not in $rname/_sections.md:$bad_prefix" \
      "$(printf '%s' "$bad_prefix" | wc -w | tr -d ' ')"
    check format rules-frontmatter "no frontmatter:$no_fm" "$(printf '%s' "$no_fm" | wc -w | tr -d ' ')"
  done

  # Counts stated in the SKILL.md BODY (priority tables, gotchas) drift too, and
  # the description check below misses them entirely when the description states
  # no count. A body count is valid only if it equals the grand total, one
  # folder's total, or one prefix's total. Anything else is stale.
  if [ "$found_rules" -eq 1 ]; then
    valid=" $rules_total "
    for rd in "$skill_dir"/rules*; do
      [ -d "$rd" ] || continue
      valid="$valid $(find "$rd" -maxdepth 1 -name '*.md' -not -name '_*' | wc -l | tr -d ' ') "
      for p in $(find "$rd" -maxdepth 1 -name '*.md' -not -name '_*' -exec basename {} \; | sed 's/-.*//' | sort -u); do
        valid="$valid $(find "$rd" -maxdepth 1 -name "$p-*.md" | wc -l | tr -d ' ') "
      done
    done
    stale=""
    for n in $(grep -oE '[0-9]+ rules' "$md" | grep -oE '^[0-9]+' | sort -u); do
      case "$valid" in *" $n "*) ;; *) stale="$stale $n" ;; esac
    done
    check format rules-body-counts "SKILL.md states a rule count matching no folder, prefix, or total:$stale" \
      "$(printf '%s' "$stale" | wc -w | tr -d ' ')"
  fi

  if [ "$found_rules" -eq 1 ]; then
    stated=$(ruby -E UTF-8 -ryaml -e '
      src = File.read(ARGV[0])
      m = src.match(/\A---\n(.*?)\n---\n/m)
      d = m ? (YAML.safe_load(m[1])["description"].to_s rescue "") : ""
      puts(d[/(\d+)\s+rules/, 1] || "")
    ' "$md" 2>/dev/null)
    if [ -z "$stated" ]; then
      record SKIP format rules-count-reconciles "description states no rule count"
    elif [ "$stated" = "$rules_total" ]; then
      record PASS format rules-count-reconciles ""
    else
      record FAIL format rules-count-reconciles "description says $stated, folders hold $rules_total"
    fi
  else
    record SKIP format rules-count-reconciles "no rules folder"
  fi

  # --- hygiene ---
  aux="$(find "$skill_dir" -maxdepth 1 \( -name 'README.md' -o -name 'CHANGELOG.md' -o -name 'INSTALLATION_GUIDE.md' \) -exec basename {} \; 2>/dev/null | tr '\n' ' ')"
  check format no-auxiliary-docs "auxiliary docs in the skill folder: $aux" "$(printf '%s' "$aux" | wc -w | tr -d ' ')"

  # Only a real command line counts. Prose warning against cp -R is correct content.
  n=$(grep -rhE '^[[:space:]]*cp -R.*\.claude/skills' "$skill_dir" 2>/dev/null | wc -l | tr -d ' ')
  check format install-not-cp-r "install instructions use cp -R into ~/.claude/skills" "$n"

  # Frontmatter is only read when --- is the first byte of the file. A BOM or a
  # leading blank line loads the body with empty metadata and no error.
  if head -c 3 "$md" | grep -q -- '---'; then
    record PASS format frontmatter-first-line ""
  else
    record FAIL format frontmatter-first-line "SKILL.md does not open with --- on line 1 (BOM or leading blank line)"
  fi

  # Claude Code accepts fields the open spec does not. They work locally and are
  # a hard error when the skill is uploaded to claude.ai or the Skills API.
  n=$(sed -n '2,/^---$/p' "$md" | grep -cE '^(disable-model-invocation|user-invocable|when_to_use|argument-hint|arguments|allowed-tools|disallowed-tools|model|effort|context|agent|background|hooks|paths|shell):' || true)
  if [ "$n" -eq 0 ]; then
    record PASS format frontmatter-portable ""
  else
    record SKIP format frontmatter-portable "$n Claude Code-only field(s); this skill will not upload to claude.ai or the Skills API"
  fi

  n=$(grep -rlE '(/Users/|/home/)[a-z]' "$skill_dir" 2>/dev/null | wc -l | tr -d ' ')
  check format no-absolute-paths "hardcoded home path, use \${CLAUDE_SKILL_DIR} or \${CLAUDE_PROJECT_DIR} (\${CLAUDE_PLUGIN_DATA} is substituted in plugin skills only)" "$n"

  n=$(grep -rnE 'MCP' "$skill_dir" 2>/dev/null | grep -E '`[a-z][a-z0-9]*_[a-z0-9_]+`' | grep -vE 'mcp__|[A-Za-z]:[a-z]' | wc -l | tr -d ' ')
  check format mcp-tools-qualified "MCP tool named without a Server:tool prefix" "$n"

  # --- house style ---
  n=$(find "$skill_dir" -name '*.md' -exec perl -CSD -ne 'print if /\x{2014}/' {} + 2>/dev/null | wc -l | tr -d ' ')
  check house no-em-dashes "em dash present, restructure with commas, colons, or periods" "$n"

  # --- repo integration ---
  repo_root="$(cd "$skill_dir/../.." 2>/dev/null && pwd)"
  if [ -f "$repo_root/README.md" ] && [ -d "$repo_root/skills" ]; then
    grep -q "skills/$name/SKILL.md" "$repo_root/README.md" \
      && record PASS format readme-bullet "" \
      || record FAIL format readme-bullet "no bullet in README.md"

    if [ -f "$repo_root/docs/skills.mdx" ]; then
      grep -q "skills/$name/SKILL.md" "$repo_root/docs/skills.mdx" \
        && record PASS format docs-bullet "" \
        || record FAIL format docs-bullet "no bullet in docs/skills.mdx"
    fi

    # Count folders holding a SKILL.md, not raw ls: git leaves empty directories
    # behind when a skill is moved out, and those must not inflate the count.
    actual=$(find "$repo_root/skills" -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')
    stated=$(grep -oE '^([0-9]+) skills' "$repo_root/README.md" | head -1 | grep -oE '[0-9]+')
    if [ -z "$stated" ]; then
      record SKIP format readme-skill-count "README states no skill count"
    elif [ "$stated" = "$actual" ]; then
      record PASS format readme-skill-count ""
    else
      record FAIL format readme-skill-count "README says $stated, skills/ holds $actual"
    fi
  else
    record SKIP format readme-bullet "not inside the skills repo"
    record SKIP format readme-skill-count "not inside the skills repo"
  fi
}

# --- entry point ---
if [ "$#" -ne 1 ]; then
  sed -n '3,12p' "$0" | sed 's/^# \{0,1\}//'
  exit 2
fi

if [ "$1" = "--all" ]; then
  here="$(cd "$(dirname "$0")" && pwd)"
  root="$(cd "$here/../../.." && pwd)"
  for d in "$root"/skills/*/; do
    printf '\n=== %s\n' "$(basename "$d")"
    : >"$RESULTS"
    validate_skill "$d"
    awk -F'\t' '{ printf "  %-5s %-11s %-26s %s\n", $1, $2, $3, $4 }' "$RESULTS"
    f=$(grep -c '^FAIL' "$RESULTS" || true)
    printf '  %s FAIL, %s PASS, %s SKIP\n' "$f" "$(grep -c '^PASS' "$RESULTS" || true)" "$(grep -c '^SKIP' "$RESULTS" || true)"
    [ "$f" -gt 0 ] && any_fail=1
  done
  [ "${any_fail:-0}" -eq 0 ] || exit 1
  exit 0
fi

validate_skill "$1"
for section in format house; do
  if grep -q "	$section	" "$RESULTS"; then
    printf '\n%s\n' "$section"
    grep "	$section	" "$RESULTS" | awk -F'\t' '{ printf "  %-5s %-28s %s\n", $1, $3, $4 }'
  fi
done
fails=$(grep -c '^FAIL' "$RESULTS" || true)
printf '\n%s FAIL, %s PASS, %s SKIP\n' "$fails" "$(grep -c '^PASS' "$RESULTS" || true)" "$(grep -c '^SKIP' "$RESULTS" || true)"
[ "$fails" -eq 0 ]
