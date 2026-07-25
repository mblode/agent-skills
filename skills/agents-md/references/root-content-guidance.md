# Root Content Guidance

Use when deciding what stays in a root instruction file vs moves out.

## Keep in root

- Copy-paste commands (`dev`, `test`, `build`, `lint`/`typecheck`, deploy/migrate when relevant)
- High-frequency failure modes with fixes
- Non-obvious conventions that change implementation choices
- Required environment/setup facts to execute tasks
- Pointers to deeper docs (`.claude/*.md`, workspace-level instruction files)

## Move out of root

- Framework documentation and architecture deep dives
- Copy-pasted templates
- Exhaustive file inventories
- Generic advice not tied to this codebase
- Rules already enforced by linters/CI
- Behavior the agent or harness already performs by default
- Facts auto-memory owns: user preferences, personal feedback, evolving project status

Link detail files from root with `@import`:

```markdown
# Additional context
- Architecture: @docs/architecture.md
- Git workflow: @docs/git-instructions.md
- Personal overrides: @~/.claude/my-project-instructions.md
```

A repeated multi-step procedure (release flow, verification sequence, migration runbook) belongs in a skill the agent invokes on demand, not inlined and not `@import`ed; root keeps one pointer line naming the skill. An `@import` loads every session, so it costs context on every task that never touches the procedure.

If framework behavior causes repeated mistakes, don't paste the docs; add one short gotcha plus the command or link that resolves it.

## Harness restatements to delete

These are the lines most often mistaken for useful instruction. Current agents do all of it unprompted, so each one buys a reconciliation against the harness and changes no behavior:

- "Read a file before editing it"
- "Use the todo/task tool for multi-step work"
- "Prefer the file tools over `cat`, `sed`, or `echo`"
- "Run the tests after making changes"
- "Don't commit unless asked"
- "Ask before force-pushing or deleting files"
- "Explain your reasoning" / "think step by step"
- "Search the codebase before assuming a helper doesn't exist"

Keep the version that carries repo-specific payload. "Run the tests after changes" goes; "`yarn test` needs `yarn db:seed` first or every suite fails" stays.

## Prefer a path over a description

When a convention already has an exemplar in the repo, name the file instead of describing the pattern. `Route handlers follow app/api/links/route.ts` beats three bullets paraphrasing that file, because code cannot be vague and cannot drift from itself. Prefer, in order: the file path, a test that pins the behavior, then prose.

## File placement hierarchy

Instruction files load from multiple locations, each with a distinct job:

- **Auto-memory**: facts about the user, their feedback, and ongoing project state; written as the agent works, not hand-maintained
- **`~/.claude/CLAUDE.md`**: applies to every session; personal defaults only, never project-specific commands
- **Project root `./AGENTS.md`**: shared via git; the tool-agnostic source of truth
- **`./CLAUDE.local.md`**: gitignored personal overrides at project level
- **Parent directories**: inherited in monorepos (root + child both load)
- **Child directories**: loaded on demand when the agent works in that subtree

Write shared rules to AGENTS.md. Audit each level independently: root holds only universal rules, child files hold directory-specific rules. A universal rule placed only in a child is invisible to most tasks.

## Emphasis for critical rules

Use emphasis markers ("IMPORTANT:", "YOU MUST", "NEVER") only on rules agents skip: security, data-loss, and deployment constraints. If everything is "IMPORTANT", nothing is.

## Common anti-patterns

- "Follow best practices." -> replace with explicit commands/rules
- "Use TypeScript." in an all-TypeScript repo -> remove
- "NEVER write comments." -> "match the comment density of the file you are editing"; the absolute is wrong in every densely commented file
- "Remember I prefer X." -> auto-memory's job, not a shared repo file's
- 300+ line root file with no links -> split with `@import` progressive disclosure
- Commands copied from stale CI config -> verify against the manifest or delete
