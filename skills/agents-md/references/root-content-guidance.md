# Root Content Guidance

Use this when deciding what stays in a root instruction file vs moves out.

## Keep in root

- Copy-paste commands (`dev`, `test`, `build`, `lint`/`typecheck`, deploy/migrate when relevant)
- High-frequency failure modes with fixes
- Non-obvious conventions that change implementation choices
- Required environment/setup facts needed to execute tasks
- Pointers to deeper docs (`.claude/*.md`, workspace-level instruction files)

## Move out of root

- Framework documentation and architecture deep dives
- Copy-pasted templates
- Exhaustive file inventories
- Generic advice not tied to this codebase
- Rules already enforced by linters/CI

Link detail files from root with `@import` syntax:

```markdown
# Additional context
- Architecture: @docs/architecture.md
- Git workflow: @docs/git-instructions.md
- Personal overrides: @~/.claude/my-project-instructions.md
```

If framework behavior causes repeated mistakes, do not paste the framework docs; add one short gotcha plus the command or link that resolves it.

## File placement hierarchy

Instruction files load from multiple locations; each has a distinct job:

- **`~/.claude/CLAUDE.md`**: applies to every session; personal defaults only, never project-specific commands
- **Project root `./AGENTS.md`**: shared with the team via git; the tool-agnostic source of truth
- **`./CLAUDE.local.md`**: gitignored personal overrides at project level
- **Parent directories**: inherited in monorepos (root + child both load)
- **Child directories**: loaded on demand when the agent works in that subtree

Always write shared rules to AGENTS.md. Audit each level independently: root holds only universal rules; child files hold directory-specific rules. A universal rule placed only in a child file is invisible to most tasks.

## Emphasis for critical rules

Use emphasis markers ("IMPORTANT:", "YOU MUST", "NEVER") only on rules agents demonstrably skip, typically security, data-loss, and deployment constraints. If everything is "IMPORTANT", nothing is.

## Common anti-patterns

- "Follow best practices." -> replace with explicit commands/rules
- "Use TypeScript." in an all-TypeScript repo -> remove
- 300+ line root file with no links -> split with `@import` progressive disclosure
- Commands copied from stale CI config -> verify against the manifest or delete
