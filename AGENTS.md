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

Installs all skills into `~/.claude/skills/` via the `skills` CLI. Works with Claude Code, Codex, Cursor, and OpenCode.

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

The deploy chain: `skills add` writes the content once to `~/.agents/skills/<name>/`. Agents that read that canonical path directly, which is every agent whose `skillsDir` is `.agents/skills` (Codex, Cursor, and most others), need nothing further; the CLI calls them universal and installs there rather than into `~/.codex/skills` or `~/.cursor/skills`. Claude Code reads `.claude/skills`, so it alone gets a relative symlink, `~/.claude/skills/<name> -> ../../.agents/skills/<name>`. Editing this repo changes none of them until you reinstall or symlink the folder directly.

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

- Files are Markdown-first, with two exceptions: `skills/agent-skills-creator/scripts/validate.sh` and `skills/pr-babysitter/scripts/fetch-comments.sh`.
- No em dashes anywhere (skill bodies, descriptions, READMEs, commits). Restructure with commas, colons, periods, or parentheses; don't substitute a spaced hyphen.
- When detail is needed, add a focused reference file rather than expanding `SKILL.md`.

## Skill Authoring

Every mechanical constraint (frontmatter limits, body length, reference chains, TOCs, kebab-case, rule-count reconciliation, README bullets) is enforced by the validator and stated nowhere else:

```bash
skills/agent-skills-creator/scripts/validate.sh skills/<name>
skills/agent-skills-creator/scripts/validate.sh --all
```

For the judgement a script cannot make (what to include, how prescriptive to be, when an absolute earns its place), run the `agent-skills-creator` skill.

## Testing

No unit tests. The validator above is the test suite: run it on every skill you touch, plus the smoke-test above when install behavior changes.

## Gotchas

- Every `SKILL.md` must have YAML frontmatter with both `name` and `description`; skills without it will not be recognized.
- Reference files are only loaded when explicitly listed in the `SKILL.md`; dropping a file in the folder is not enough.
- The `cp -R skills/* ~/.claude/skills/` approach bypasses the `~/.agents/skills` symlink chain. Use `npx skills add` instead.

## Commit & Pull Request Guidelines

- Commit messages: short, imperative, sentence case (e.g., "Add pr-reviewer skill").
- PRs: brief summary, list of skills changed/added, README updates (especially when adding a new skill).
- When adding reference files, note how they are used by the corresponding `SKILL.md`.

## Maintenance

- When adding or removing a skill, update the `README.md` skill count and add/remove the bullet under the matching category heading.
- When renaming folders or reference files, grep all `SKILL.md` files for stale paths.
- Verify counts and bullets with `skills/agent-skills-creator/scripts/validate.sh --all`. Don't count with `ls skills/ | wc -l`: git leaves empty directories behind when a skill moves out, which inflates it.
