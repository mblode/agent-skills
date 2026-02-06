# Repository Guidelines

## Project Structure & Module Organization
- `skills/` holds each skill in its own folder (kebab-case). Each skill has a `SKILL.md` file with YAML frontmatter (`name`, `description`) and Markdown guidance.
- Some skills include reference files alongside the `SKILL.md` (e.g. `skills/agents-md/references/`).
- Top-level files: `README.md` (overview and install docs).

## Install / Development Commands
Install the skills bundle:

```bash
npx skills add mblode/agent-skills
```

Manual copy is also supported:

```bash
cp -R skills/* ~/.claude/skills/
```

## Coding Style & Naming Conventions
- Files are Markdown-first. Keep `SKILL.md` concise with clear headings and short bullet points.
- Use YAML frontmatter at the top of every `SKILL.md` with `name` and `description` fields.
- Prefer kebab-case for folder and reference file names (`frontend-standards`, `react-patterns.md`).
- When detail is needed, add a focused reference file rather than expanding `SKILL.md`.

## Skill Authoring

### Frontmatter constraints
- `name`: max 64 chars, lowercase letters/numbers/hyphens only. Must not contain "anthropic" or "claude".
- `description`: max 1024 chars, non-empty, no XML tags.

### Description style
- Third-person voice: "Audits web typography..." not "I audit..." or "Use this to audit...".
- Include what the skill does + "Use when..." trigger phrases with specific keywords users might say.

### Body rules
- Keep SKILL.md under 500 lines; split into reference files if longer.
- Only add context Claude doesn't already have — assume Claude is smart.
- References must be one level deep from SKILL.md (no reference-to-reference chains).
- Reference files over 100 lines should start with a table of contents.
- No time-sensitive content (use a collapsed "Old patterns" section if needed).
- Use consistent terminology within a skill — pick one term and stick with it.
- Forward slashes only in file paths.

### Workflows
- Complex multi-step skills should include a copyable progress checklist.
- Include validation/feedback loops for quality-critical tasks.

## Testing
No automated test suite. Smoke-check by installing and confirming the target folder contains updated skill files.

## Gotchas
- Every `SKILL.md` must have YAML frontmatter with both `name` and `description` — skills without it will not be recognized.
- Reference files are only loaded when explicitly listed in the SKILL.md; dropping a file in the folder is not enough.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and sentence case (e.g., “Update install URL and copyright”).
- PRs should include a brief summary, list of skills changed/added, and any README updates (especially when adding a new skill).
- If you add new reference files, note how they are used by the corresponding `SKILL.md`.

## Maintenance
- When adding or removing a skill, update README.md (Lifecycle Chooser + Skills Included sections).
- When renaming folders or reference files, grep CLAUDE.md and all SKILL.md files for stale paths.
