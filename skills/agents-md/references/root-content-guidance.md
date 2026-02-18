# Root Content Guidance

Use this when deciding what stays in root instruction files.

## Keep in root

- Copy-paste commands (`dev`, `test`, `build`, `lint/typecheck`, deploy/migrate when relevant)
- High-frequency failure modes with fixes
- Non-obvious conventions that affect implementation choices
- Required environment/setup facts needed to execute tasks
- Pointers to deeper docs (`.claude/*.md`, workspace-level instruction files)

## Move out of root

- Framework documentation and architecture deep dives
- Copy-pasted templates
- Exhaustive file inventories
- Generic advice not tied to this codebase
- Rules already enforced by linters/CI defaults

Use `@path/to/file.md` import syntax to link detail files from root:

```markdown
# Additional context
- Architecture: @docs/architecture.md
- Git workflow: @docs/git-instructions.md
- Personal overrides: @~/.claude/my-project-instructions.md
```

## Framework note

- Do not paste framework docs into AGENTS.md.
- If framework behavior causes repeated mistakes, add one short gotcha plus the command/link that resolves it.

## File placement hierarchy

AGENTS.md is the source of truth. CLAUDE.md should be a symlink to AGENTS.md:

```bash
ln -s AGENTS.md CLAUDE.md
```

Instruction files are loaded from multiple locations:

- **`~/.claude/CLAUDE.md`** — applies to all sessions (personal defaults)
- **Project root `./AGENTS.md`** — shared with team via git (symlink `CLAUDE.md` -> `AGENTS.md`)
- **`./CLAUDE.local.md`** — gitignored personal overrides at project level
- **Parent directories** — inherited in monorepos (root + child both load)
- **Child directories** — loaded on demand when working in that directory

Always write to AGENTS.md, never to CLAUDE.md directly. Audit each level independently. Root should contain only universal rules; child files should contain directory-specific rules.

## Emphasis for critical rules

Use emphasis markers ("IMPORTANT:", "YOU MUST", "NEVER") on rules that agents tend to skip. This improves adherence for high-stakes constraints (security, data loss, deployment). Do not overuse — if everything is "IMPORTANT", nothing is.

## Common anti-patterns

- "Follow best practices." -> replace with explicit commands/rules
- "Use TypeScript." in an all-TypeScript repo -> remove
- 300+ line root file with no links -> split with `@import` progressive disclosure
- Commands copied from stale CI config -> verify or delete
