#!/usr/bin/env bash
#
# Validates a skill against the Agent Skills format and this repo's house style.
# Every mechanical authoring rule is stated here and nowhere else; prose in
# SKILL.md and references/ carries only judgement a script cannot make.
#
#   validate.sh skills/<name>    one skill
#   validate.sh --all            every skill in the repo
#   validate.sh --format tsv --policy private --repo /path/to/private-repo
#
# Output groups checks under "format" (the Agent Skills spec) and "house style"
# (this repo's taste). Exits 1 if any check FAILs. SKIP means a check does not
# apply here, always with a reason.
#
# Portable to bash 3.2 (macOS default): no associative arrays, no mapfile.

set -uo pipefail
POLICY=public
FORMAT=text

# Bare mktemp, not `-t skillvalidate`: GNU mktemp rejects a -t template with no
# X's, so the named form ran on macOS and died on every Linux checkout.
RESULTS="$(mktemp)"
trap 'rm -f "$RESULTS"' EXIT

# record <PASS|FAIL|SKIP> <format|house> <check-name> <detail>
record() {
  detail="$4"
  detail="${detail//$'\t'/ }"
  detail="${detail//$'\n'/ }"
  detail="${detail//$'\r'/ }"
  printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$detail" >>"$RESULTS"
}

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
  SKILL_VALIDATION_POLICY="$POLICY" ruby -E UTF-8 -ryaml -e '
    path, folder = ARGV
    src = File.read(path)
    m = src.match(/\A---\n(.*?)\n---\n/m)
    # Detail explains a failure, so suppress it on PASS to avoid lines that read
    # as their own contradiction ("PASS name-reserved ... contains a reserved word").
    def out(status, name, detail) puts [status, "format", name, status == "PASS" ? "" : detail].map { |value| value.to_s.gsub(/[\t\r\n]/, " ") }.join("\t") end
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
    unless y.is_a?(Hash)
      out("FAIL", "frontmatter-mapping", "frontmatter must be a mapping")
      exit
    end
    fields = %w[name description license compatibility metadata allowed-tools]
    extra = y.keys - fields
    out(extra.empty? ? "PASS" : "FAIL", "frontmatter-portable", "unsupported fields: #{extra.join(", ")}")
    %w[name description license compatibility allowed-tools].each do |field|
      next unless y.key?(field)
      value = y[field]
      out(value.is_a?(String) ? "PASS" : "FAIL", "#{field}-type", "#{field} must be a string")
    end
    if y.key?("compatibility")
      value = y["compatibility"]
      valid = value.is_a?(String) && !value.strip.empty? && value.length <= 500
      out(valid ? "PASS" : "FAIL", "compatibility-length", "compatibility must contain 1-500 characters")
    end
    if y.key?("metadata")
      value = y["metadata"]
      valid = value.is_a?(Hash) && value.all? { |k, v| k.is_a?(String) && v.is_a?(String) }
      out(valid ? "PASS" : "FAIL", "metadata-types", "metadata must map strings to strings")
    end
    n = y["name"].is_a?(String) ? y["name"] : ""
    d = y["description"].is_a?(String) ? y["description"] : ""
    def house(status, name, detail)
      return if ENV["SKILL_VALIDATION_POLICY"] == "private"
      puts [status, "house", name, status == "PASS" ? "" : detail].map { |value| value.to_s.gsub(/[\t\r\n]/, " ") }.join("\t")
    end

    if n.strip.empty? then out("FAIL", "name-present", "missing name")
    else
      out("PASS", "name-present", "")
      out(n.length <= 64 ? "PASS" : "FAIL", "name-length", "#{n.length} chars, max 64")
      out((n == n.downcase && n =~ /\A[\p{L}\p{N}]+(-[\p{L}\p{N}]+)*\z/) ? "PASS" : "FAIL", "name-charset",
          "#{n.inspect} must be lowercase alphanumeric, single hyphens, no leading or trailing hyphen")
      house(n =~ /anthropic|claude/ ? "FAIL" : "PASS", "name-reserved", "#{n.inspect} contains a reserved word")
      out(n == folder ? "PASS" : "FAIL", "name-matches-folder", "name #{n.inspect} vs folder #{folder.inspect}")
    end

    if d.strip.empty? then out("FAIL", "description-present", "missing description")
    else
      out("PASS", "description-present", "")
      out(d.length <= 1024 ? "PASS" : "FAIL", "description-length", "#{d.length} chars, max 1024")
      house(d =~ /<[a-zA-Z\/]/ ? "FAIL" : "PASS", "description-no-xml", "contains an XML-ish tag")
      house(d =~ /Use when/ ? "PASS" : "FAIL", "description-triggers", "no \"Use when\" trigger phrase")
      house(d =~ /\A\s*(I |Use this|This skill)/ ? "FAIL" : "PASS", "description-third-person",
          "opens in first person or as a human summary, not third-person capability")
    end
  ' "$md" "$name" >>"$RESULTS" 2>/dev/null || record FAIL format frontmatter-parses "ruby failed on $md"

  if [ "$POLICY" = public ]; then
  # --- body ---
  lines=$(wc -l <"$md" | tr -d ' ')
  if [ "$lines" -lt 500 ]; then
    record PASS house body-under-500-lines ""
  else
    record FAIL house body-under-500-lines "$lines lines, split into references/"
  fi

  # Windows separators, only on lines that look like paths, to avoid flagging
  # regex or LaTeX inside fenced blocks.
  n=$(grep -cE '[A-Za-z0-9_.-]+\\[A-Za-z0-9_.-]+\.(md|json|sh|py|ts)' "$md" 2>/dev/null || true)
  check house forward-slashes "backslash in a file path" "${n:-0}"

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
  check house all-md-reachable "unreachable from SKILL.md or a root track file:$orphans" \
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
    check house no-reference-chains "imperative chain:$chains" "$(printf '%s' "$chains" | wc -w | tr -d ' ')"
  else
    record SKIP house references-linked "no references/ folder"
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
  check house toc-over-100-lines "over 100 lines with no Contents heading:$no_toc" \
    "$(printf '%s' "$no_toc" | wc -w | tr -d ' ')"

  # bash 3.2 mis-parses `case` inside $( ), so build this in the current shell.
  bad_names=""
  while IFS= read -r -d '' f; do
    b="$(basename "$f" .md)"
    if [ "$b" = "SKILL" ] || [ "$b" = "_sections" ] || [ "$b" = "_template" ]; then continue; fi
    printf '%s' "$b" | grep -qE '^[a-z0-9]+(-[a-z0-9]+)*$' || bad_names="$bad_names ${b// /<space>}"
  done < <(find "$skill_dir" -name '*.md' -print0 2>/dev/null)
  check house kebab-case-filenames "not kebab-case:$bad_names" "$(printf '%s' "$bad_names" | wc -w | tr -d ' ')"

  # Root-level track files belong to the simple/hub pattern only.
  root_md=$(find "$skill_dir" -maxdepth 1 -name '*.md' -not -name 'SKILL.md' 2>/dev/null | wc -l | tr -d ' ')
  if [ "$root_md" -eq 0 ]; then
    record PASS house root-md-hub-only ""
  elif grep -qiE '^#{2,3} (modes|tracks)' "$md"; then
    record PASS house root-md-hub-only ""
  else
    record FAIL house root-md-hub-only "$root_md root .md files but no Modes or Tracks table in SKILL.md"
  fi

  # --- rules folders ---
  rules_total=0
  found_rules=0
  for rd in "$skill_dir"/rules*; do
    [ -d "$rd" ] || continue
    found_rules=1
    rname="$(basename "$rd")"
    [ -f "$rd/_sections.md" ] || record FAIL house rules-sections-present "$rname/_sections.md missing"
    [ -f "$rd/_template.md" ] || record FAIL house rules-template-present "$rname/_template.md missing"

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
    check house rules-prefix-in-sections "prefix not in $rname/_sections.md:$bad_prefix" \
      "$(printf '%s' "$bad_prefix" | wc -w | tr -d ' ')"
    check house rules-frontmatter "no frontmatter:$no_fm" "$(printf '%s' "$no_fm" | wc -w | tr -d ' ')"
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
    check house rules-body-counts "SKILL.md states a rule count matching no folder, prefix, or total:$stale" \
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
      record SKIP house rules-count-reconciles "description states no rule count"
    elif [ "$stated" = "$rules_total" ]; then
      record PASS house rules-count-reconciles ""
    else
      record FAIL house rules-count-reconciles "description says $stated, folders hold $rules_total"
    fi
  else
    record SKIP house rules-count-reconciles "no rules folder"
  fi

  # --- hygiene ---
  aux="$(find "$skill_dir" -maxdepth 1 \( -name 'README.md' -o -name 'CHANGELOG.md' -o -name 'INSTALLATION_GUIDE.md' \) -exec basename {} \; 2>/dev/null | tr '\n' ' ')"
  check house no-auxiliary-docs "auxiliary docs in the skill folder: $aux" "$(printf '%s' "$aux" | wc -w | tr -d ' ')"

  # Only a real command line counts. Prose warning against cp -R is correct content.
  n=$(grep -rhE '^[[:space:]]*cp -R.*\.claude/skills' "$skill_dir" 2>/dev/null | wc -l | tr -d ' ')
  check house install-not-cp-r "install instructions use cp -R into ~/.claude/skills" "$n"

  # Frontmatter is only read when --- is the first byte of the file. A BOM or a
  # leading blank line loads the body with empty metadata and no error.
  if head -c 3 "$md" | grep -q -- '---'; then
    record PASS format frontmatter-first-line ""
  else
    record FAIL format frontmatter-first-line "SKILL.md does not open with --- on line 1 (BOM or leading blank line)"
  fi

  n=$(grep -rlE '(/Users/|/home/)[a-z]' "$skill_dir" 2>/dev/null | wc -l | tr -d ' ')
  check house no-absolute-paths "hardcoded home path; resolve against the installed skill or project directory" "$n"

  n=$(grep -rnE 'MCP' "$skill_dir" 2>/dev/null | grep -E '`[a-z][a-z0-9]*_[a-z0-9_]+`' | grep -vE 'mcp__|[A-Za-z]:[a-z]' | wc -l | tr -d ' ')
  check house mcp-tools-qualified "MCP tool named without a Server:tool prefix" "$n"

  fi

  # Authored evaluation scenarios are data, not executed tests. Validate their
  # local contract so malformed or empty cases cannot masquerade as coverage.
  if [ -f "$skill_dir/evals/evals.json" ]; then
    ruby -rjson -e '
      path, name = ARGV
      def fail_case(message)
        puts ["FAIL", "house", "eval-scenarios", message].map { |value| value.to_s.gsub(/[\t\r\n]/, " ") }.join("\t")
        exit
      end
      begin
        data = JSON.parse(File.read(path))
      rescue JSON::ParserError => e
        fail_case("invalid JSON: #{e.message.lines.first.strip}")
      end
      fail_case("skill_name differs from folder") unless data.is_a?(Hash) && data["skill_name"] == name
      cases = data["evals"]
      fail_case("evals must be a nonempty array") unless cases.is_a?(Array) && !cases.empty?
      ids = []
      cases.each do |item|
        fail_case("case must be an object") unless item.is_a?(Hash)
        id = item["id"]
        fail_case("case id must be a unique positive integer") unless id.is_a?(Integer) && id > 0 && !ids.include?(id)
        ids << id
        %w[prompt expected_output].each do |field|
          value = item[field]
          fail_case("case #{id}: #{field} must be nonempty text") unless value.is_a?(String) && !value.strip.empty?
        end
        %w[files assertions].each do |field|
          value = item[field]
          fail_case("case #{id}: #{field} must be an array of nonempty strings") unless value.is_a?(Array) && value.all? { |v| v.is_a?(String) && !v.strip.empty? }
        end
        fail_case("case #{id}: missing assertions") if item["assertions"].empty?
      end
      puts ["PASS", "house", "eval-scenarios", "#{cases.length} authored cases; behavior not executed"].map { |value| value.to_s.gsub(/[\t\r\n]/, " ") }.join("\t")
    ' "$skill_dir/evals/evals.json" "$name" >>"$RESULTS" 2>/dev/null || record FAIL house eval-scenarios "evaluation validation failed"
  else
    record SKIP house eval-scenarios "no evals/evals.json; behavior coverage not established"
  fi

  if [ "$POLICY" = public ]; then
  # --- house style ---
  n=$(find "$skill_dir" -name '*.md' -exec perl -CSD -ne 'print if /\x{2014}/' {} + 2>/dev/null | wc -l | tr -d ' ')
  check house no-em-dashes "em dash present, restructure with commas, colons, or periods" "$n"

  fi

  # --- repo integration ---
  repo_root="$(cd "$skill_dir/../.." 2>/dev/null && pwd)"
  if [ -f "$repo_root/README.md" ] && [ -d "$repo_root/skills" ]; then
    { grep -Fq "skills/$name/SKILL.md" "$repo_root/README.md" || { [ "$POLICY" = private ] && grep -Fq "| \`$name\` |" "$repo_root/README.md"; }; } \
      && record PASS house readme-bullet "" \
      || record FAIL house readme-bullet "no bullet in README.md"

    if [ "$POLICY" = public ] && [ -f "$repo_root/docs/skills.mdx" ]; then
      grep -q "skills/$name/SKILL.md" "$repo_root/docs/skills.mdx" \
        && record PASS house docs-bullet "" \
        || record FAIL house docs-bullet "no bullet in docs/skills.mdx"
    fi

    # Count folders holding a SKILL.md, not raw ls: git leaves empty directories
    # behind when a skill is moved out, and those must not inflate the count.
    actual=$(find "$repo_root/skills" -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')
    stated=$(grep -oE '^([0-9]+) skills' "$repo_root/README.md" | head -1 | grep -oE '[0-9]+')
    if [ -z "$stated" ]; then
      record SKIP house readme-skill-count "README states no skill count"
    elif [ "$stated" = "$actual" ]; then
      record PASS house readme-skill-count ""
    else
      record FAIL house readme-skill-count "README says $stated, skills/ holds $actual"
    fi
  else
    record SKIP house readme-bullet "not inside the skills repo"
    record SKIP house readme-skill-count "not inside the skills repo"
  fi
}

# --- entry point ---
root=""
target=""
all=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --format|--policy|--repo)
      [ "$#" -ge 2 ] || { echo "Missing value for $1" >&2; exit 2; }
      case "$1" in --format) FORMAT="$2";; --policy) POLICY="$2";; --repo) root="$2"; all=1;; esac
      shift 2 ;;
    --all) all=1; shift ;;
    -*) echo "Unknown option: $1" >&2; exit 2 ;;
    *) [ -z "$target" ] || { echo "Only one skill path is accepted" >&2; exit 2; }; target="$1"; shift ;;
  esac
done
case "$POLICY" in public|private) ;; *) echo "Policy must be public or private" >&2; exit 2;; esac
case "$FORMAT" in text|tsv) ;; *) echo "Format must be text or tsv" >&2; exit 2;; esac
if { [ "$all" -eq 1 ] && [ -n "$target" ]; } || { [ "$all" -eq 0 ] && [ -z "$target" ]; }; then
  echo "Usage: validate.sh [--format text|tsv] [--policy public|private] SKILL_PATH | --all | --repo REPO" >&2
  exit 2
fi
emit() {
  [ -s "$RESULTS" ] || return 0
  if [ "$FORMAT" = tsv ]; then
    awk -v skill="$name" -F'\t' 'BEGIN { OFS="\t" } { detail=$4; for(i=5;i<=NF;i++) detail=detail " " $i; gsub(/\r/, " ",detail); print skill,$1,$2,$3,detail }' "$RESULTS"
  else
    printf '\n=== %s\n' "$name"
    awk -F'\t' '{ printf "  %-5s %-11s %-26s %s\n", $1, $2, $3, $4 }' "$RESULTS"
    printf '  %s FAIL, %s PASS, %s SKIP\n' "$(grep -c '^FAIL' "$RESULTS" || true)" "$(grep -c '^PASS' "$RESULTS" || true)" "$(grep -c '^SKIP' "$RESULTS" || true)"
  fi
  if grep -q '^FAIL' "$RESULTS"; then any_fail=1; fi
}
any_fail=0
if [ "$all" -eq 1 ]; then
  if [ -z "$root" ]; then
    here="$(cd "$(dirname "$0")" && pwd)"
    root="$(cd "$here/../../.." && pwd)"
  fi
  [ -d "$root/skills" ] || { echo "Missing skills directory: $root/skills" >&2; exit 2; }
  count=0
  for d in "$root"/skills/*/; do
    [ -d "$d" ] || continue
    [ -n "$(find "$d" -type f -print -quit)" ] || continue
    count=$((count + 1))
    : >"$RESULTS"
    validate_skill "$d"
    emit
  done
  : >"$RESULTS"
  name=_catalogue
  ruby -e '
    root, policy = ARGV
    path = File.join(root, "README.md")
    unless File.file?(path)
      puts ["FAIL", "house", "readme-bullet", "README.md missing"].map { |value| value.to_s.gsub(/[\t\r\n]/, " ") }.join("\t")
      exit
    end
    text = File.read(path)
    names = text.scan(%r{skills/([a-z0-9-]+)/SKILL\.md}).flatten
    names += text.scan(/^\| `([a-z0-9-]+)` \|/).flatten if policy == "private"
    names.uniq.each do |name|
      unless File.file?(File.join(root, "skills", name, "SKILL.md"))
        puts ["FAIL", "house", "readme-bullet", "README lists missing skill #{name}"].map { |value| value.to_s.gsub(/[\t\r\n]/, " ") }.join("\t")
      end
    end
  ' "$root" "$POLICY" >>"$RESULTS" || record FAIL house readme-bullet "catalogue validation failed"
  emit
  [ "$count" -gt 0 ] || { echo "No skills found in $root" >&2; exit 2; }
else
  validate_skill "$target"
  emit
fi
exit "$any_fail"
