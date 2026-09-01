# Minimal Skeletons (Not Full Templates)

Structure starters only. Fill with project-specific commands, gotchas, and conventions. Never ship verbatim; a shipped placeholder is worse than no file.

## Contents

- Before/After Example
- Root file skeleton (single project)
- Root file skeleton (monorepo)
- Root file skeleton (multi-language monorepo)
- The Claude Code pointer file
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

```markdown
# <Monorepo name>

One-line description.

## Commands
- `<root install/build/test/lint commands>`

## Workspace map
Each workspace has its own `AGENTS.md`, loaded when an agent works there:
- apps/<app>/AGENTS.md
- packages/<pkg>/AGENTS.md

## Rules
- `<cross-workspace rule that affects all workspaces>`

## Do not commit
<Files/dirs that are runtime inputs or build outputs, not source>
```

List workspace files as plain paths, not `@import`s. An import would load every workspace file into every Claude Code session, which defeats the split, and Codex and Cursor would see only the literal text.

## Root file skeleton (multi-language monorepo)

For projects mixing runtimes (e.g., Node + Python, Node + Rust):

```markdown
# <Monorepo name>

One-line description. <Language A> + <Language B> monorepo using <tooling>.

## Commands
- `<root install/build/test/lint commands>`
- `<language-B setup command>`

## Workspace map
Each workspace has its own `AGENTS.md`, loaded when an agent works there:
- apps/<app>/AGENTS.md
- packages/<pkg>/AGENTS.md

(`packages/<lang-b-pkg>` is <Language B>-only; see its README for entry points.)

## Rules
- **Always use `<venv-or-toolchain-path>`, never global `<tool>`**: dependencies may not be on PATH.
- <Cross-language boundary rule>

## Do not commit
<Runtime inputs, build outputs, venvs, node_modules, caches>
```

## The Claude Code pointer file

Claude Code does not read `AGENTS.md`. Every skeleton above needs this `CLAUDE.md` beside it, or a `CLAUDE.md -> AGENTS.md` symlink when the Claude-only section would be empty:

```markdown
@AGENTS.md

## Claude Code
<Claude-only additions, or delete this section>
```

## Filling a skeleton

- 3-8 gotchas from real failures beats 20 hypothetical ones
- Daily commands include the quiet, targeted form (`npx vitest run <file> --reporter=dot`), not only the full-suite script
- Point at an exemplar file path where one exists, instead of paraphrasing what it already shows
- Keep the root within 60-150 lines; anything a single directory owns goes in that directory's `AGENTS.md`
- State the outcome and let the surrounding code pick the path; reserve absolutes for safety, data loss, format contracts, and failures already observed here
