# Project Setup

Use when wiring a repo so Claude Code, Codex, and Cursor all work in it, or when the user asks to make a project agent-friendly.

Setup is not the audit. The audit judges an existing file; setup decides which files exist and which tool reads each one. Run setup first on a bare repo, then audit the AGENTS.md it produces.

## Contents

- One File, Then Pointers
- What Each Tool Actually Loads
- Per-Tool Wiring
- Where Deep Docs Go
- Project-Scoped Skills
- Enforcement That Survives Tool Choice
- Verify By Asking, Not By Reading

## One File, Then Pointers

`AGENTS.md` at the repo root is the source of truth. Codex, Cursor, GitHub Copilot, and the rest of the list at agents.md read it natively. Two tools do not: Claude Code reads `CLAUDE.md` (or `.claude/CLAUDE.md`) and ignores `AGENTS.md`; Gemini CLI reads `GEMINI.md` unless its `context.fileName` setting is changed. Every other agent file in the repo is a pointer to `AGENTS.md` or a tool-specific supplement, never a second copy.

Two copies of a rule is the failure this prevents. They drift silently, because nothing in the codebase contradicts either one.

Set the scope deliberately. Repo-specific commands, conventions, and gotchas go in the repo. Personal defaults ("commit to the current branch", a preferred code style) belong in the user-level file each tool reads (`~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, Cursor's User Rules), not in a file the team shares.

## What Each Tool Actually Loads

The instruction files look identical on disk and behave differently per tool. Decide placement from this table, not from the file tree.

| Behaviour | Claude Code | Codex | Cursor |
|-----------|-------------|-------|--------|
| Root file | `CLAUDE.md`, `.claude/CLAUDE.md`, `CLAUDE.local.md`; never `AGENTS.md` | `AGENTS.override.md`, else `AGENTS.md`, else names in `project_doc_fallback_filenames` | `AGENTS.md`, plus `.cursor/rules/*.mdc` |
| User-level file | `~/.claude/CLAUDE.md`, `~/.claude/rules/` | `~/.codex/AGENTS.md` (or `AGENTS.override.md`) | User Rules in the app |
| Nested files | Ancestors of the launch directory at start; subdirectories on demand when Claude reads files there | Only the root-to-launch-directory path, concatenated root first, until `project_doc_max_bytes` (32 KiB default) is hit | Nested `AGENTS.md` in subdirectories |
| `@path` import | Expanded at launch, four hops deep, skipped inside code spans and fences | Plain text, no warning | Plain text |
| Path-scoped rules | `.claude/rules/*.md` with `paths:` frontmatter | None | `.cursor/rules/*.mdc` with `globs:` |
| Enforcement, not advice | Hooks in `.claude/settings.json` | None in the instruction layer | `.cursor/hooks.json` |

Two rules follow from the table:

- Anything every tool must obey goes **inline in the root `AGENTS.md`**. Imports, `.claude/rules/`, and `.mdc` files each reach one tool.
- An import never reduces context; it is expanded at launch. When a root file must shrink and still reach every tool, cut content or move it to a nested file, a path-scoped rule, or a skill. Hiding it behind an import keeps the cost and loses two of the three tools.

## Per-Tool Wiring

Add only what the repo actually needs.

- **Claude Code**: a `CLAUDE.md` at the root that imports the shared file, with Claude-only additions below it if any:

```markdown
@AGENTS.md

## Claude Code
Use plan mode for changes under `src/billing/`.
```

  `ln -s AGENTS.md CLAUDE.md` is equivalent when there are no Claude-only lines; on Windows a symlink needs Administrator rights or Developer Mode, so use the import form there. Never `cp`: the copy drifts. `.claude/rules/*.md` with `paths:` frontmatter holds directory- or language-scoped rules that should load only when matching files are touched. `.claude/settings.json` holds hooks. `CLAUDE.local.md` (gitignored) holds personal overrides. `/init` reads existing Cursor and Copilot rules into a generated `CLAUDE.md`; `/import` copies Codex or Gemini CLI configuration once.
- **Codex**: nothing beyond `AGENTS.md`. `AGENTS.override.md` in the same directory wins over `AGENTS.md`, which is useful for a local experiment and a trap when one is committed by accident, so check `git ls-files | grep override` during setup. A repo that must keep `CLAUDE.md` as its only file can be read by Codex with `project_doc_fallback_filenames = ["CLAUDE.md"]` in `~/.codex/config.toml`, but that is per machine, so renaming to `AGENTS.md` is the fix that travels.
- **Cursor**: `AGENTS.md` covers the prose. Add `.cursor/rules/*.mdc` only for rules that need glob scoping, which `AGENTS.md` cannot express:

```markdown
---
description: Test conventions
globs: **/*.test.ts
alwaysApply: false
---
```

  The `.mdc` extension and the frontmatter are both required; a plain `.md` dropped in that folder is ignored with no message. `alwaysApply: true` with empty `globs` duplicates what `AGENTS.md` already does. Cursor's own ceiling is 500 lines per rule. Hooks live in `.cursor/hooks.json`.

## Where Deep Docs Go

Detail that does not fit the root file goes in a neutral, committed path: `docs/` or `.agents/`, referenced from `AGENTS.md` by plain relative path so every tool can follow it when the task needs it.

Do not put shared knowledge under `.claude/`. That path reads as Claude-only, and it is commonly gitignored, which quietly scopes hard-won knowledge to one machine. Check `.gitignore` during setup: if agent config is ignored, decide per file whether it is personal (leave ignored) or repo knowledge (commit it).

## Project-Scoped Skills

Install skills into the repo rather than the user's home when they encode this project's workflows:

```bash
npx skills add <owner>/<repo>        # project scope is the default; -g would install to the home directory
```

Claude Code reads `.claude/skills/`; Codex and Cursor read `.agents/skills/`. The CLI writes each.

Skills that drive a specific harness do not travel. One that calls a Claude Code tool, spawns `claude -p`, or depends on an MCP server present in only one tool should stay out of the shared set, because in the other tools it advertises a capability that is not there.

Watch the description budget; both tools have one. Claude Code caps the skill listing at 1% of the context window and shortens descriptions to fit (`/doctor` estimates the cost); Codex caps it at 2% of the context window or 8,000 characters, shortens descriptions first, then omits skills with a warning. Either way a large install degrades triggering across every skill, not just the new one. Install what the repo needs, not everything available.

## Enforcement That Survives Tool Choice

An instruction file is context, not configuration; Claude Code's own docs say so, and the same holds in Codex and Cursor. A rule stated in prose is obeyed unevenly across tools. A rule with an exit code is obeyed by all of them.

Prefer, in order: a linter or formatter rule, a git hook (lefthook, husky) that fires whichever agent made the edit, then a CI check. Tool-native hooks (`.claude/settings.json`, `.cursor/hooks.json`) are the last rung, because they cover one tool only. Move a prose rule down to an exit code whenever the check is mechanical, and delete the prose once the gate exists.

## Verify By Asking, Not By Reading

A correct-looking instruction file proves nothing: a broken setup and a working one are identical on disk. Ask each tool to quote a rule back.

```bash
claude -p --model haiku "From loaded instructions only, no tools: quote the repo's test command."
codex exec --skip-git-repo-check "From loaded instructions only, no tools: quote the repo's test command."
agent -p "From loaded rules only, no tools: quote the repo's test command."
```

Pick a rule that appears nowhere else in the repo, so a correct answer cannot come from reading the code. If a tool cannot answer, its wiring is broken regardless of what the file says. Inside an interactive Claude Code session, `/context` lists the memory files that loaded, which catches a missing `CLAUDE.md` pointer without a prompt.
