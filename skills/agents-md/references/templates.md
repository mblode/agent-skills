# Minimal Skeletons (Not Full Templates)

Use these as structure starters only. Fill with project-specific commands, gotchas, and conventions.

Do not ship these verbatim.

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
- `<path/to/deep-detail.md>`
```

## Root file skeleton (monorepo)

```markdown
# <Monorepo name>

## Commands
- `<root install/build/test/lint commands>`

## Scope
- Root file: shared rules only
- `apps/<app>/AGENTS.md`: app-specific rules
- `packages/<pkg>/AGENTS.md`: package-specific rules

## Cross-workspace gotchas
- `<workspace failure mode> -> <fix>`
```

## Bad vs good

Bad:
- 300 lines of framework docs
- Full folder tree for entire repo
- Generic advice with no commands

Good:
- Clear run/test/build/lint commands
- 3-8 high-value gotchas from real failures
- Non-obvious conventions and boundaries
- Links to deeper files for non-universal detail

## Authoring rules

- Prefer bullets over paragraphs
- Keep root file typically within 60-150 lines
- Each line should save debugging time or prevent a known mistake
