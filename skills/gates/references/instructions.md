# Instructions: AGENTS.md as the one source

AGENTS.md at the repository root, plus nested AGENTS.md files where a directory owns its rules, is the single instruction source for every agent. Claude Code, Codex, and Cursor read it natively, so no CLAUDE.md wrapper, symlink, or copy is needed; a second copy is a finding, because copies drift and an agent reads the stale one.

## Contents

- Two tests for every line
- Audit
- Verify commands
- Verify loading by asking
- What each tool loads
- What stays in root, and where the rest goes
- Harness restatements to delete
- Gotchas

## Two tests for every line

AGENTS.md is an execution contract, not a knowledge base.

- **Dead weight:** would removing this line cause a mistake? If not, cut it; bloat makes agents skip the rules that matter.
- **Harmful precision:** is this wrong on any plausible task here? A prohibition wrong one task in ten is still obeyed on that task. State the outcome it protects: `NEVER write comments` becomes `match the comment density of the file you are editing`.

Absolutes stay for safety, data loss, format contracts, and rules this repo's agents were observed to break. A rule a script can check leaves the file for a hook or required check (`hooks.md`), and the file keeps one line naming the gate.

## Audit

1. **Find the files.** `find . \( -name AGENTS.md -o -name AGENTS.override.md -o -name CLAUDE.md -o -name CLAUDE.local.md \) -not -path "*/node_modules/*" | sort`, plus `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`, which load in every repo. A project `CLAUDE.md` that duplicates AGENTS.md is a finding; merge its unique lines into AGENTS.md and remove it without deleting a symlink's target.
2. **Score.** Quick 12-check triage by default (`quick-checklist.md`, target 10 of 12); the 49-check `quality-criteria.md` when the quick audit fails, the repo is high-risk, or full scoring is asked for. Score each root file independently; `N/A` leaves the denominator.
3. **Report** one table row per file (mode, score, grade, key issues); every issue maps to a diff.
4. **Diffs, in priority order:** broken or stale commands; generic, duplicate, or harness-restating lines; blanket prohibitions rewritten as outcomes; detail needed in under about 30% of tasks moved to where it loads on demand; emphasis ("IMPORTANT") only on a rule agents were seen to skip, one line at a time.
5. **Apply.** A request to audit proposes the diffs and edits nothing. A request to improve, fix, refactor, or write the file authorizes the edits: apply them, log each removed line's reason (`generic`, `duplicate`, `stale`, `moved` with destination, `reworded`), re-score, and report before and after scores and line counts. Re-check anything tagged `generic` for a safety, migration, or release rule before finishing.

## Verify commands

Run every command the file names (`dev`, `test`, `build`, `lint`, `typecheck`, the pre-PR `verify`) from the location it says, in the quiet form. Where the environment cannot run one, confirm the script exists in the manifest and say so. A passing checklist score with a stale command is still a broken file. Check every linked path resolves.

## Verify loading by asking

A broken setup and a working one look identical on disk. Ask each tool to quote a rule that appears nowhere else in the repo:

```bash
claude -p "From loaded instructions only, no tools: quote the repo's pre-PR command."
codex exec --skip-git-repo-check "From loaded instructions only, no tools: quote the repo's pre-PR command."
agent -p "From loaded rules only, no tools: quote the repo's pre-PR command."
```

A tool that cannot answer is not loading the file, whatever the tree looks like. Leftover project `CLAUDE.md` or `CLAUDE.local.md` files and host settings can change what loads; this probe is what settles it.

## What each tool loads

| Behaviour | Claude Code | Codex | Cursor |
|-----------|-------------|-------|--------|
| Root | `AGENTS.md` | `AGENTS.override.md`, else `AGENTS.md` | `AGENTS.md`, plus `.cursor/rules/*.mdc` |
| Nested | Loaded when it reads files in that directory | Only the root-to-launch-directory path, concatenated, until `project_doc_max_bytes` (32 KiB default) | Nested `AGENTS.md` |
| `@path` import | Expanded at launch, so it saves no context | Plain text, no warning | Plain text |
| Path-scoped rules | `.claude/rules/*.md` with `paths:` | None | `.cursor/rules/*.mdc` with `globs:` |

Anything every tool must obey goes inline in the root AGENTS.md. An import, a `.claude/rules/` file, or an `.mdc` file reaches one tool, and an import never reduces what loads.

## What stays in root, and where the rest goes

Root keeps: copy-paste commands with their quiet targeted form, the pre-PR command, high-frequency failure modes with the fix, conventions that change implementation choices, setup facts, and plain relative links to deeper docs. Aim for 60 to 150 lines.

Moved content goes, in order of reach: a nested `AGENTS.md` in the directory it concerns; a skill for a repeated multi-step procedure, with one pointer line in root; a plain link to `docs/*.md` for reference material; a path-scoped rule for one tool's file-type detail, never as the only home of a must-obey rule. Shared knowledge goes in a committed neutral path (`docs/`, `.agents/`), not `.claude/`, which is often gitignored.

When a convention has an exemplar, name the file (`Route handlers follow app/api/links/route.ts`) instead of describing it.

## Harness restatements to delete

Each buys a reconciliation against the harness and changes nothing: "read a file before editing it", "use the todo tool", "run the tests after making changes", "don't commit unless asked", "search before assuming a helper doesn't exist", "think step by step". Keep the version with repo payload: "`yarn test` needs `yarn db:seed` first" stays.

## Gotchas

- Codex stops adding instruction files at `project_doc_max_bytes`, root first; a bloated root silently crowds out every nested file.
- A rule living only in `packages/api/AGENTS.md` is invisible to a Codex session launched at the root.
- A committed `AGENTS.override.md` silently replaces `AGENTS.md` for Codex in that directory. Check `git ls-files | grep -i override`.
- Project commands in `~/.claude/CLAUDE.md` or `~/.codex/AGENTS.md` load in every repo and become wrong commands elsewhere.
- `CLAUDE.local.md` is personal and gitignored: audit it only for broken commands and contradictions, and never copy it into the shared file.
- Preferences, feedback, and project status are memory's job. In a shared file they load every session and drift silently.
- Emphasis markers exist because plain phrasing was ignored once; do not strip them in a density cut. When many lines carry them, none stands out.
- A full rewrite destroys battle-tested wording and inflates review. Targeted diffs, unless the score says the file is beyond them.
