# Root Content Guidance

Use when deciding what stays in a root instruction file, and where moved content goes so that it still loads for the task that needs it.

## Keep in root

- Copy-paste commands (`dev`, `test`, `build`, `lint`/`typecheck`, deploy/migrate when relevant), with the targeted quiet form of the ones you run all day (`npx vitest run <file> --reporter=dot`)
- High-frequency failure modes with fixes
- Non-obvious conventions that change implementation choices
- Required environment/setup facts to execute tasks
- Any rule every tool must obey, inline; nothing below the root reaches every tool
- Pointers to deeper docs by plain relative path (`docs/*.md`, `.agents/*.md`, workspace-level instruction files)

## Move out of root

- Framework documentation and architecture deep dives
- Copy-pasted templates
- Exhaustive file inventories
- Generic advice not tied to this codebase
- Rules already enforced by linters/CI
- Behavior the agent or harness already performs by default
- Facts auto-memory owns: user preferences, personal feedback, evolving project status
- Directory-specific rules, when the directory has its own instruction file

Rule of thumb: guidance needed in fewer than ~30% of tasks moves out of root.

## Where moved content goes

Ranked by how many tools see it and when:

1. **A nested `AGENTS.md` in the directory it concerns.** Every tool reads it, with different timing: Claude Code loads it when it reads files in that directory, Codex only when the session was launched inside it or below. Right for conventions owned by one package.
2. **A skill.** Loads on demand in Claude Code, Codex, and Cursor. Right for a repeated multi-step procedure (release flow, verification sequence, migration runbook); root keeps one pointer line naming the skill.
3. **A plain relative link to `docs/*.md`.** Every tool can follow it when a task needs it; none loads it automatically. Right for reference material.
4. **A path-scoped rule.** `.claude/rules/*.md` with `paths:` frontmatter (Claude Code) or `.cursor/rules/*.mdc` with `globs:` (Cursor). Loads when matching files are touched. One tool each, so never the only home of a rule the whole repo must obey.
5. **An `@import`.** Claude Code only, and expanded at launch, so it organizes text without reducing what loads. Use it for the `CLAUDE.md -> @AGENTS.md` pointer and for Claude-only depth that must be present every session, not as a way to shrink the root.

```markdown
# Additional context
- Architecture: docs/architecture.md
- Git workflow: docs/git-instructions.md
- Release flow: run the `release` skill
```

An import whose path resolves outside the repo (`@~/.claude/my-project-instructions.md`) makes Claude Code show a one-time approval dialog per project; a declined import stays disabled with no further prompt. Keep such imports in `CLAUDE.local.md` or the user-level file, never in the shared root.

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

- **Managed policy** (`/etc/claude-code/CLAUDE.md` and equivalents): organisation-wide, cannot be excluded by users; not the repo's concern, but a rule duplicated from it in root is dead weight
- **Auto-memory**: facts about the user, their feedback, and ongoing project state; written by the agent as it works, not hand-maintained
- **User-level file** (`~/.claude/CLAUDE.md`, `~/.claude/rules/`, `~/.codex/AGENTS.md`): applies to every session on that machine; personal defaults only, never project-specific commands
- **Project root `./AGENTS.md`**: shared via git; the tool-agnostic source of truth, with `./CLAUDE.md` as a pointer to it
- **`./.claude/rules/*.md`**: Claude Code only; unscoped rules load with the root, `paths:`-scoped rules load when matching files are touched
- **`./CLAUDE.local.md`**: gitignored personal overrides at project level
- **`AGENTS.override.md`**: Codex only; replaces `AGENTS.md` in the same directory, so one committed by accident silently swaps the rule set
- **Parent directories**: inherited in monorepos (root and ancestors both load)
- **Child directories**: Claude Code loads them on demand when working in that subtree; Codex loads them only when launched there

Write shared rules to AGENTS.md. Audit each level independently: root holds only universal rules, child files hold directory-specific rules. A universal rule placed only in a child is invisible to most tasks in every tool.

Block-level HTML comments (`<!-- maintainer note -->`) are stripped before Claude Code injects a file, so notes for humans cost nothing there; other tools send them as text, so keep them short.

## Emphasis for critical rules

Use emphasis markers ("IMPORTANT:", "YOU MUST", "NEVER") only on rules agents skip: security, data-loss, and deployment constraints. If everything is "IMPORTANT", nothing is.

## Common anti-patterns

- "Follow best practices." -> replace with explicit commands/rules
- "Use TypeScript." in an all-TypeScript repo -> remove
- "NEVER write comments." -> "match the comment density of the file you are editing"; the absolute is wrong in every densely commented file
- "Remember I prefer X." -> auto-memory's job, not a shared repo file's
- 300+ line root file -> move directory-specific sections into nested files or path-scoped rules and procedures into skills; splitting into `@import`s leaves the context cost unchanged and drops two of the three tools
- Commands copied from stale CI config -> verify against the manifest or delete
