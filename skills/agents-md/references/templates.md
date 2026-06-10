# Minimal Skeletons (Not Full Templates)

Use these as structure starters only. Fill with project-specific commands, gotchas, and conventions. Do not ship these verbatim; a shipped placeholder is worse than no file.

## Contents

- Before/After Example
- Root file skeleton (single project)
- Root file skeleton (monorepo)
- Root file skeleton (multi-language monorepo)
- Authoring rules

## Before/After Example

### Bad (generic template)

```markdown
# My Project

This is a TypeScript project. Follow best practices.

## Getting Started
Install dependencies and run the app.

## Code Style
Write clean code. Use TypeScript properly.
```

**Issues:** no commands, generic advice, no gotchas; an agent learns nothing it didn't already know.

### Good (execution-first)

```markdown
# payments-api

REST API for payment processing.

## Commands
- `npm run dev` - Start local server (port 3000)
- `npm test` - Run test suite
- `npm run typecheck` - Type check without building
- `npm run db:migrate` - Run database migrations

## Gotchas
- Use `PaymentIntent.create()`, not `Charge.create()` (Stripe v3 deprecation)
- Always validate webhook signatures with `stripe.webhooks.constructEvent()`
- Run migrations before tests: `npm run db:migrate && npm test`

## Conventions
- Payment amounts are in cents, not dollars
- Use `createPaymentIntent()` helper for all payment creation
```

**Wins:** copy-paste commands, specific gotchas with fixes, implementation-affecting conventions.

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
- Keep the root file within 60-150 lines for typical active repos
- 3-8 gotchas from real failures beats 20 hypothetical ones
- Each line must save debugging time or prevent a known mistake
