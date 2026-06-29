# Minimal Skeletons (Not Full Templates)

Structure starters only. Fill with project-specific commands, gotchas, and conventions. Never ship verbatim; a shipped placeholder is worse than no file.

## Contents

- Before/After Example
- Root file skeleton (single project)
- Root file skeleton (monorepo)
- Root file skeleton (multi-language monorepo)
- Authoring rules

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
- `<build command>`
- `<lint/typecheck command>`

## Gotchas
- `<failure mode> -> <corrective action>`
- `<failure mode> -> <corrective action>`

## Conventions
- `<project-specific convention that changes implementation choices>`

## References
- @docs/architecture.md
- @.claude/testing.md
```

## Root file skeleton (monorepo)

```markdown
# <Monorepo name>

One-line description.

## Commands
- `<root install/build/test/lint commands>`

## Workspace map
Each workspace has its own `AGENTS.md`:
@apps/<app>/AGENTS.md
@packages/<pkg>/AGENTS.md

## Rules
- `<cross-workspace rule that affects all workspaces>`

## Do not commit
<Files/dirs that are runtime inputs or build outputs, not source>
```

## Root file skeleton (multi-language monorepo)

For projects mixing runtimes (e.g., Node + Python, Node + Rust):

```markdown
# <Monorepo name>

One-line description. <Language A> + <Language B> monorepo using <tooling>.

## Commands
- `<root install/build/test/lint commands>`
- `<language-B setup command>`

## Workspace map
Each workspace has its own `AGENTS.md`:
@apps/<app>/AGENTS.md
@packages/<pkg>/AGENTS.md

(`packages/<lang-b-pkg>` is <Language B>-only; see its README for entry points.)

## Rules
- **Always use `<venv-or-toolchain-path>`, never global `<tool>`**: dependencies may not be on PATH.
- <Cross-language boundary rule>

## Do not commit
<Runtime inputs, build outputs, venvs, node_modules, caches>
```

## Authoring rules

- Prefer bullets over paragraphs
- Keep root within 60-150 lines for typical active repos
- 3-8 gotchas from real failures beats 20 hypothetical ones
- Each line must save debugging time or prevent a known mistake
