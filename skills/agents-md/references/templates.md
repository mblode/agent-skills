# Minimal Skeletons (Not Full Templates)

Structure starters only. Fill with project-specific commands, gotchas, and conventions. Never ship verbatim; a shipped placeholder is worse than no file.

## Contents

- Before/After Example
- Root file skeleton (single project)
- Root file skeleton (monorepo)
- Claude Code setup
- Filling a skeleton

## Before/After Example

**Bad (generic template):** no commands, generic advice ("Write clean code. Use TypeScript properly."), no gotchas; the agent learns nothing new.

**Good (execution-first):** copy-paste commands with ports (`npm run dev` starts port 3000), specific gotchas with fixes (use `PaymentIntent.create()` not `Charge.create()`; validate webhook signatures; run migrations before tests), and implementation-affecting conventions (payment amounts are in cents, not dollars).

See `root-content-guidance.md` (Common anti-patterns) and `quality-criteria.md` (Automatic fails) for the full catalogue.

## Root file skeleton (single project)

```markdown
# <Project name>

One-line description.

## Commands
- `<dev command>`
- `<test command>`
- `<targeted test command, quiet flags included>`
- `<build command>`
- `<lint/typecheck command>`

## Gotchas
- `<failure mode> -> <corrective action>`
- `<failure mode> -> <corrective action>`

## Conventions
- `<project-specific convention that changes implementation choices>`

## References
- Architecture: docs/architecture.md
- Release flow: run the `release` skill
```

## Root file skeleton (monorepo)

The bracketed lines apply only when runtimes mix (Node + Python, Node + Rust); drop them otherwise.

```markdown
# <Monorepo name>

One-line description. [<Language A> + <Language B> monorepo using <tooling>.]

## Commands
- `<root install/build/test/lint commands>`
- [`<language-B setup command>`]

## Workspace map
Each workspace has its own `AGENTS.md`, loaded when an agent works there:
- apps/<app>/AGENTS.md
- packages/<pkg>/AGENTS.md

## Rules
- `<cross-workspace rule that affects all workspaces>`
- [**Always use `<venv-or-toolchain-path>`, never global `<tool>`**: dependencies may not be on PATH.]

## Do not commit
<Runtime inputs, build outputs, venvs, node_modules, caches>
```

List workspace files as plain paths, not `@import`s, or every workspace file loads into every Claude Code session and the split buys nothing.

## Claude Code setup

Use these AGENTS.md skeletons directly with Claude Code's enabled built-in `agents-md` mod. Do not add a CLAUDE.md pointer or symlink. Check Project instructions mode and migrate old project instruction files as described in `project-setup.md`.

## Filling a skeleton

- 3-8 gotchas from real failures beats 20 hypothetical ones
- Daily commands include the quiet, targeted form (`npx vitest run <file> --reporter=dot`), not only the full-suite script
- Point at an exemplar file path where one exists, instead of paraphrasing what it already shows
- Keep the root within 60-150 lines; anything a single directory owns goes in that directory's `AGENTS.md`
- State the outcome and let the surrounding code pick the path; reserve absolutes for safety, data loss, format contracts, and failures already observed here
