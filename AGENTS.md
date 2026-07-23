# Repository Guidelines

## Project Structure & Module Organization

- `skills/` holds each skill in its own folder (kebab-case). Each skill has a `SKILL.md` file with YAML frontmatter (`name`, `description`) and Markdown guidance.
- Some skills include reference files alongside the `SKILL.md` (e.g. `skills/agents-md/references/`).
- Top-level files: `README.md` (overview and install docs).

## Install / Development Commands

### Primary install (recommended)

```bash
npx skills add mblode/agent-skills
```

Installs all skills into `~/.claude/skills/` via the `skills` CLI. Works with Claude Code, OpenCode, Codex, and Cursor.

Install a single skill:

```bash
npx skills add mblode/agent-skills -g --skill pr-reviewer -y
```

### Local dev: symlink hot-swap

For editing skills in place without reinstalling:

```bash
# One-time: symlink the repo's skills folder into the deploy target
ln -s /path/to/agent-skills/skills/<name> ~/.claude/skills/<name>
```

Changes to the repo files take effect immediately, with no re-install needed. Unlink with `unlink ~/.claude/skills/<name>` when done.

The deploy chain: `skills add` writes to `~/.agents/skills/<name>/`, which is symlinked into `~/.claude/skills/<name>/` for Claude Code to pick up.

### Smoke-test

Confirm files landed correctly after install:

```bash
ls ~/.claude/skills/pr-reviewer/
# Expected: SKILL.md (plus any references/ folder)
```

For a full install smoke-check:

```bash
ls ~/.claude/skills/ | sort
```

The list should match the folders in `skills/` here.

## Coding Style & Naming Conventions

- Files are Markdown-first. Keep `SKILL.md` concise with clear headings and short bullet points.
- No em dashes anywhere (skill bodies, descriptions, READMEs, commits). Restructure with commas, colons, periods, or parentheses; don't substitute a spaced hyphen.
- Use YAML frontmatter at the top of every `SKILL.md` with `name` and `description` fields.
- Prefer kebab-case for folder and reference file names (`frontend-standards`, `react-patterns.md`).
- When detail is needed, add a focused reference file rather than expanding `SKILL.md`.

## Skill Authoring (key constraints)

For full authoring rules, run the `agent-skills-creator` skill. The highest-signal constraints:

| Rule          | Detail                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------- |
| `name`        | max 64 chars, lowercase letters/numbers/hyphens only; no "anthropic" or "claude"         |
| `description` | max 1024 chars, non-empty, no XML tags; third-person voice; include "Use when…" triggers |
| Body length   | under 500 lines; split into reference files if longer                                    |
| References    | one level deep only (no reference-to-reference chains)                                   |
| Content       | only context Claude doesn't already have; no time-sensitive content                      |
| Paths         | forward slashes only                                                                     |
| Boundaries    | open the body with an IS/IS-NOT pair when sibling skills exist                           |

## Testing

No automated test suite. See smoke-test above.

## Gotchas

- Every `SKILL.md` must have YAML frontmatter with both `name` and `description`; skills without it will not be recognized.
- Reference files are only loaded when explicitly listed in the `SKILL.md`; dropping a file in the folder is not enough.
- The `cp -R skills/* ~/.claude/skills/` approach bypasses the `~/.agents/skills` symlink chain. Use `npx skills add` instead.

## Commit & Pull Request Guidelines

- Commit messages: short, imperative, sentence case (e.g., "Add pr-reviewer skill").
- PRs: brief summary, list of skills changed/added, README updates (especially when adding a new skill).
- When adding reference files, note how they are used by the corresponding `SKILL.md`.

## ui.sh-sourced skills

- `ui-design` (Build mode guidelines plus the `ideas.md`, `markup-from-image.md`, `add-dark-mode.md`, `dark-mode-image.md`, `make-responsive.md`, `componentize.md`, `canonicalize-tailwind.md`, and `guidelines/` files) contains content pulled from the ui.sh skills API (`npx @uidotsh/install` with the account token, or `GET https://ui.sh/api/skills/<name>`). Published here with permission.
- Upstream ships nine separate skills; this repo consolidates them all into ui-design (seven modes). A re-pull is a manual merge: it would resurface upstream's split structure, short descriptions, and em dashes, so diff carefully and re-apply the local curation (mode dispatch, IS/IS-NOT blocks, trigger descriptions, dash stripping).
- Never commit the ui.sh token. It lives only in the maintainer's environment.

## Maintenance

- When adding or removing a skill, update the `README.md` skill count and add/remove the bullet under the matching category heading.
- When renaming folders or reference files, grep all `SKILL.md` files for stale paths.
- Verify the README bullet count equals `ls skills/ | wc -l`.
