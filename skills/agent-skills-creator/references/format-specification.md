# Format Specification

Hard constraints for the Agent Skills format. Every skill must follow these rules.

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
├── config.json            (optional, user-specific setup context)
└── <track>.md             (optional, for hub-style skills)
```

- Forward slashes only in file paths (even on Windows)
- Kebab-case for all folder and file names
- Folder name must match the `name` field in frontmatter

## Frontmatter (Required)

Both `name` and `description` are mandatory. Skills without valid frontmatter will not be recognized.

```yaml
---
name: skill-name
description: What the skill does. Use when...
---
```

### `name` field

- Max 64 characters
- Lowercase letters, numbers, and hyphens only (`a-z`, `0-9`, `-`)
- Must not start or end with a hyphen
- Must not contain consecutive hyphens (`--`)
- Must not contain "anthropic" or "claude"
- Must match the parent directory name

### `description` field

- Max 1024 characters
- Non-empty, no XML tags
- Third-person voice: "Audits..." not "I audit..." or "Use this to audit..."
- Structure: what the skill does + "Use when..." trigger phrases
- Include specific keywords users might say to trigger the skill

### Optional frontmatter fields

- `license`: License name or reference to bundled LICENSE file
- `compatibility`: Max 500 chars, environment requirements (rare)
- `metadata`: Arbitrary key-value pairs for custom properties

## Description Examples

**Strong descriptions from this repo:**

| Skill | Description pattern |
|-------|-------------------|
| `agents-md` | "Audits X using Y standards. Checks A, B, and C. Use when asked to audit, review, score, refactor, or improve..." |
| `typography-audit` | "Audits X for A, B, C, D, E, F, G, H, I, and J. Use when writing CSS/HTML for text, selecting or pairing typefaces..." |
| `readme-creator` | "Writes or rewrites X tailored to Y. Use when creating A, writing B from scratch, rewriting C, or bootstrapping documentation." |

**Pattern:** `[Does what] for/using [domain]. [Checks/covers what]. Use when [specific trigger phrases with keywords].`

## SKILL.md Body Rules

- Max 500 lines; split into reference files if approaching this limit
- Only add context Claude does not already have (Claude is smart by default)
- Use consistent terminology (pick one term and stick with it)
- Forward slashes in all file paths
- No time-sensitive content (use collapsed "Old patterns" section if needed)

## Reference and Rule Files

- References must be one level deep from SKILL.md (no chains)
- Files are only loaded when explicitly listed in SKILL.md
- Files over 100 lines should start with a table of contents
- Dropping a file in the folder without linking it from SKILL.md means it will not be discovered

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Skill folder | kebab-case | `agent-skills-creator` |
| Reference files | kebab-case | `format-specification.md` |
| Rule files | `<prefix>-<slug>.md` | `punct-smart-quotes.md` |
| Section prefixes | Short, lowercase | `punct-`, `a11y-`, `voice-` |

## Advanced Skill Features

Optional features for skills that need persistent state, executable code, or session hooks.

### `config.json`

For skills that need user-specific context (Slack channel, project name, author). Include a template `config.json` in the skill folder. The skill's first step should check for config and gather missing values via AskUserQuestion.

### `${CLAUDE_PLUGIN_DATA}`

Stable storage path for persistent data that survives skill upgrades. Use this instead of storing data in the skill directory itself. Supports log files, JSON state, and SQLite databases.

### Script files

Executable scripts (`.sh`, `.py`, `.ts`) in a `scripts/` folder give Claude composable utilities. Document invocation instructions in SKILL.md. Claude can generate wrapper scripts that compose these helpers.

### On-demand hooks

Skills can define PreToolUse and PostToolUse hooks that activate only when the skill is invoked and last for the session. Use for safety gates (block destructive commands) or observation (log tool usage). Define hook instructions in SKILL.md.
