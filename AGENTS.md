# Repository Guidelines

## Project Structure & Module Organization
- `skills/` holds each skill in its own folder (kebab-case). Each skill has a `SKILL.md` file with YAML frontmatter (`name`, `description`) and Markdown guidance.
- Some skills include reference files alongside the `SKILL.md`, e.g. `skills/frontend-standards/typescript-patterns.md` or `skills/frontend-design/aesthetic-direction.md`.
- Top-level files: `README.md` (overview and install docs) and `install.sh` (installer script).

## Build, Test, and Development Commands
This repo has no build system; the main workflow is installing the skills bundle.

```bash
./install.sh                 # install to $CODEX_HOME/skills or ~/.claude/skills
./install.sh --dest /path    # explicit destination
DEST=/path ./install.sh      # env-based destination
```

Manual copy is also supported:

```bash
cp -R skills/* /path/to/skills/
```

## Coding Style & Naming Conventions
- Files are Markdown-first. Keep `SKILL.md` concise with clear headings and short bullet points.
- Use YAML frontmatter at the top of every `SKILL.md` with `name` and `description` fields.
- Prefer kebab-case for folder and reference file names (`frontend-standards`, `react-patterns.md`).
- When detail is needed, add a focused reference file rather than expanding `SKILL.md`.

## Testing Guidelines
There is no automated test suite. Smoke-check changes by running `./install.sh` and confirming the target folder contains the updated skill files.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and sentence case (e.g., “Update install URL and copyright”).
- PRs should include a brief summary, list of skills changed/added, and any README updates (especially when adding a new skill).
- If you add new reference files, note how they are used by the corresponding `SKILL.md`.
