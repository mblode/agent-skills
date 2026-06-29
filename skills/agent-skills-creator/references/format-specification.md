# Format Specification

Hard constraints for the Agent Skills format.

## Contents

- Directory structure
- Frontmatter (required)
- Description examples
- SKILL.md body rules
- Reference and rule files
- Naming conventions
- Advanced skill features

## Directory Structure

```
skills/<name>/
├── SKILL.md              (required)
├── references/            (optional, for progressive disclosure)
├── rules/                 (optional, for audit/lint skills)
│   ├── _sections.md       (category map)
│   ├── _template.md       (rule file template)
│   └── <prefix>-<slug>.md (individual rules)
├── scripts/               (optional, executable utilities)
├── assets/                (optional, templates for output files)
├── examples/              (optional, usage examples and code snippets)
├── agents/                (optional, subagent prompts dispatched from SKILL.md)
├── config.json            (optional, user-specific setup context)
└── <track>.md             (optional, for hub-style skills)
```

Root-level `<track>.md` files are exclusive to the simple/hub pattern; other patterns keep supporting files in `references/` (or `rules/` for audit skills). Multiple rules folders (e.g. `rules/` plus `rules-modern/`) are allowed only when SKILL.md explicitly dispatches to each layer.

- Forward slashes only in file paths (even on Windows)
- Kebab-case for all folder and file names
- Folder name must match the `name` field in frontmatter

## Frontmatter (Required)

`name` and `description` are mandatory. Skills without valid frontmatter aren't recognized.

```yaml
---
name: skill-name
description: What the skill does. Use when...
---
```

### `name` field

- Max 64 characters
- Lowercase letters, numbers, hyphens only (`a-z`, `0-9`, `-`)
- Must not start or end with a hyphen
- Must not contain consecutive hyphens (`--`)
- Must not contain "anthropic" or "claude"
- Must match the parent directory name

### `description` field

- Max 1024 characters
- Non-empty, no XML tags
- Third-person voice: "Audits..." not "I audit..." or "Use this to audit..."
- Structure: what the skill does + "Use when..." trigger phrases
- Include keywords users might say to trigger it

### Optional frontmatter fields

- `license`: license name or reference to bundled LICENSE file
- `compatibility`: max 500 chars, environment requirements (rare)
- `metadata`: arbitrary key-value pairs for custom properties

## Description Examples

**Strong descriptions from this repo:**

| Skill | Description pattern |
|-------|-------------------|
| `agents-md` | "Audits X using Y standards. Checks A, B, and C. Use when asked to audit, review, score, refactor, or improve..." |
| `typography-audit` | "Audits X for A, B, C, D, E, F, G, H, I, and J. Use when writing CSS/HTML for text, selecting or pairing typefaces..." |
| `readme-creator` | "Writes or rewrites X tailored to Y. Use when creating A, writing B from scratch, rewriting C, or bootstrapping documentation." |

**Pattern:** `[Does what] for/using [domain]. [Checks/covers what]. Use when [specific trigger phrases with keywords].`

## SKILL.md Body Rules

- Max 500 lines; split into reference files if approaching the limit
- Only add context Claude doesn't already have
- Consistent terminology (pick one term, stick with it)
- Forward slashes in all file paths
- No time-sensitive content (use a collapsed "Old patterns" section if needed)
- No em dashes; restructure with commas, colons, periods, or parentheses (every file in the skill, including the description)

## Reference and Rule Files

- One level deep from SKILL.md (no chains)
- Loaded only when explicitly listed in SKILL.md; an unlinked file is never discovered
- Files over 100 lines start with a table of contents
- Long references up to ~450 lines are fine when TOC'd and single-topic; split by loading condition, not line count alone

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Skill folder | kebab-case | `agent-skills-creator` |
| Reference files | kebab-case | `format-specification.md` |
| Rule files | `<prefix>-<slug>.md` | `punct-smart-quotes.md` |
| Section prefixes | short, lowercase | `punct-`, `a11y-`, `voice-` |

Name for the specific capability:

- Gerund form (`processing-pdfs`, `analyzing-spreadsheets`) is the documented default. Noun-phrase (`pdf-processing`) and action-oriented (`process-pdfs`) forms are acceptable; this repo uses them (`agent-skills-creator`, `pr-reviewer`).
- Avoid vague names: `helper`, `utils`, `tools`, `documents`, `data`, `files`. They give the model nothing to route on.

## Advanced Skill Features

Optional features for skills needing persistent state, executable code, or session hooks.

### `config.json`

For user-specific context (Slack channel, project name, author). Include a template `config.json`; the skill's first step checks for config and gathers missing values via AskUserQuestion.

### `${CLAUDE_PLUGIN_DATA}`

Stable storage path for persistent data that survives skill upgrades; use instead of the skill directory. Supports log files, JSON state, and SQLite databases.

### Script files

Executable scripts (`.sh`, `.py`, `.ts`) in a `scripts/` folder give Claude composable utilities. Document invocation in SKILL.md. Claude can generate wrapper scripts that compose these helpers.

### On-demand hooks

Skills can define PreToolUse and PostToolUse hooks that activate only when the skill is invoked, lasting the session. Use for safety gates (block destructive commands) or observation (log tool usage). Define hook instructions in SKILL.md.
