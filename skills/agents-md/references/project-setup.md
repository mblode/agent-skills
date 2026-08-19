# Project Setup

Use when wiring a repo so Claude Code, Codex, and Cursor all work in it, or when the user asks to make a project agent-friendly.

Setup is not the audit. The audit judges an existing file; setup decides which files exist and which tool reads each one. Run setup first on a bare repo, then audit the AGENTS.md it produces.

## Contents

- One File, Read By Everything
- The Import Trap
- Per-Tool Wiring
- Where Deep Docs Go
- Project-Scoped Skills
- Enforcement That Survives Tool Choice
- Verify By Asking, Not By Reading

## One File, Read By Everything

`AGENTS.md` at the repo root is the source of truth. Claude Code, Codex, Cursor, Copilot, Gemini CLI, Aider, Windsurf, and Zed all read it natively. Every other agent file in the repo is a pointer to it or a tool-specific supplement, never a second copy.

Two copies of a rule is the failure this prevents. They drift silently, because nothing in the codebase contradicts either one.

Set the scope deliberately. Repo-specific commands, conventions, and gotchas go in the repo. Personal defaults ("commit to the current branch", a preferred code style) belong in the user's global config, not in a file the team shares.

## The Import Trap

`@import` is not portable, and the failure is silent.

| Tool | Reads `AGENTS.md` | Expands `@path` imports |
|------|-------------------|-------------------------|
| Claude Code | yes | yes |
| Codex | yes | **no, and it does not warn** |
| Cursor | yes | no |

A rule behind an `@import` reaches Claude Code and nothing else. Codex neither errors nor logs, so the file looks correct and the rule is simply absent from the session.

The rule that follows: anything every tool must obey goes **inline in AGENTS.md**. Reserve `@import` for depth that only Claude Code needs, and never for a safety, data-loss, or format-contract rule. When a repo must stay under a size budget and still reach every tool, cut content rather than hiding it behind an import.

## Per-Tool Wiring

Add only what the repo actually needs.

- **Claude Code**: nothing. It reads `AGENTS.md` at any directory level. Add `CLAUDE.md -> AGENTS.md` as a symlink only when a tool in use reads solely `CLAUDE.md`; a symlink keeps one source of truth where a copy would drift. Use `.claude/settings.json` for hooks, and `CLAUDE.local.md` (gitignored) for personal overrides.
- **Codex**: nothing beyond `AGENTS.md`, subject to the import trap above.
- **Cursor**: `AGENTS.md` covers the prose. Add `.cursor/rules/*.mdc` only for rules that need Cursor's glob scoping, which `AGENTS.md` cannot express:

```markdown
---
description: Test conventions
globs: **/*.test.ts
alwaysApply: false
---
```

`alwaysApply: true` with empty `globs` duplicates what `AGENTS.md` already does, so it is usually the wrong choice. Frontmatter is required; a rule file without it is ignored.

## Where Deep Docs Go

Detail that does not fit the root file goes in a neutral, committed path: `docs/` or `.agents/`, referenced from `AGENTS.md` by plain relative path so every tool can follow it.

Do not put shared knowledge under `.claude/`. That path reads as Claude-only, and it is commonly gitignored, which quietly scopes hard-won knowledge to one machine. Check `.gitignore` during setup: if agent config is ignored, decide per file whether it is personal (leave ignored) or repo knowledge (commit it).

## Project-Scoped Skills

Install skills into the repo rather than the user's home when they encode this project's workflows:

```bash
npx skills add <owner>/<repo>        # project scope; omit -g
```

Skills that drive a specific harness do not travel. One that calls a Claude Code tool, spawns `claude -p`, or depends on an MCP server present in only one tool should stay out of the shared set, because in the other tools it advertises a capability that is not there.

Watch the budget: Codex truncates skill descriptions once its context allowance is exceeded, which degrades triggering across every skill, not just the new one. Install what the repo needs, not everything available.

## Enforcement That Survives Tool Choice

A rule stated in prose is obeyed unevenly across tools. A rule with an exit code is obeyed by all of them.

Prefer, in order: a linter or formatter rule, a git hook (lefthook, husky) that fires whichever agent made the edit, then a CI check. Tool-native hooks (`.claude/settings.json`, Cursor's `hooks.json`) are the last rung, because they cover one tool only. Move a prose rule down to an exit code whenever the check is mechanical, and delete the prose once the gate exists.

## Verify By Asking, Not By Reading

A correct-looking instruction file proves nothing: the import trap makes a broken setup and a working one identical on disk. Ask each tool to quote a rule back.

```bash
claude -p --model claude-haiku-4-5-20251001 "From loaded instructions only, no tools: quote the repo's test command."
codex exec --skip-git-repo-check "From loaded instructions only, no tools: quote the repo's test command." </dev/null
cursor-agent -p "From loaded rules only, no tools: quote the repo's test command."
```

Pick a rule that appears nowhere else in the repo, so a correct answer cannot come from reading the code. If a tool cannot answer, its wiring is broken regardless of what the file says.
