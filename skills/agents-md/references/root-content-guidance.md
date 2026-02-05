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
- Copy-pasted AGENTS.md templates
- Exhaustive file inventories
- Generic advice not tied to this codebase
- Rules already enforced by linters/CI defaults

## Framework note

- Do not paste framework docs into AGENTS.md.
- If framework behavior causes repeated mistakes, add one short gotcha plus the command/link that resolves it.

## Common anti-patterns

- "Follow best practices." -> replace with explicit commands/rules
- "Use TypeScript." in an all-TypeScript repo -> remove
- 300+ line root file with no links -> split with progressive disclosure
- Commands copied from stale CI config -> verify or delete
