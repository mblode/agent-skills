# Refactor Workflow

Use when an AGENTS.md is bloated, stale, or low-signal.

## Trigger conditions

Refactor when any are true:

- Root file over ~150 lines and hard to scan (Claude Code's own ceiling is 200; Codex stops reading at 32 KiB across all files)
- Commands missing, stale, or contradictory
- Contains framework docs or copy-pasted templates
- Generic guidance that doesn't prevent real mistakes

## Step 1: Snapshot and isolate essentials

Record current line count, then extract only what every task needs:

- Run/test/build/lint commands
- Critical environment/setup requirements
- High-frequency gotchas
- Project conventions that change implementation choices

Everything else: move to a location that loads on demand, or delete.

## Step 2: Remove bloat fast

Delete first, add back only what earns its place. For every line, record one reason: `generic`, `duplicate`, `stale`, `moved` (with the destination), or `reworded`. This log makes the final report traceable, and `reworded` keeps the Step 5 safety re-check from treating a rewritten rule as lost content.

Remove:

- Full documentation and tutorial-style prose
- Long architecture explanations in root
- Exhaustive file maps
- Generic advice ("write clean code", "use best practices")
- Outdated commands and dead links
- Restatements of default agent behavior ("read before editing", "run the tests")
- Facts auto-memory owns: user preferences, personal feedback, evolving project status

Reword rather than remove: a blanket prohibition that some plausible task would want broken becomes the outcome it was protecting. Tag it `reworded`, since deleting it outright loses a real constraint.

## Step 3: Rebuild root file in strict order

1. Project one-liner
2. Commands
3. Gotchas (failure mode -> fix)
4. Conventions and boundaries
5. Pointers to deeper material

## Step 4: Move detail out so it still loads

Pick the destination by who needs it and when. Guidance needed in fewer than ~30% of tasks leaves root.

- Owned by one directory -> that directory's `AGENTS.md` (every tool; Claude Code loads it on demand, Codex only when launched there)
- A repeated multi-step procedure -> a skill; root keeps one line naming it
- Reference material -> `docs/*.md`, linked by plain relative path
- Claude-only or Cursor-only detail tied to file types -> `.claude/rules/*.md` with `paths:` or `.cursor/rules/*.mdc` with `globs:`

Do not reach for `@import` to shrink the file. Imported content is expanded at launch, so the context cost is unchanged, and Codex and Cursor never see it. The one import that belongs in a multi-tool repo is `@AGENTS.md` at the top of `CLAUDE.md`.

## Step 5: Validate before finalizing

- Core commands run from the documented location (or are marked not runnable here)
- Linked files, nested files, and `@import`ed files exist; in Claude Code, `/context` confirms which ones loaded
- No contradictory rules remain
- Removed guidance had no rare-but-critical constraints (security, migration, release, incident flows); re-check the Step 2 log for anything tagged `generic` that was actually a safety rule
- Nothing tagged `moved` landed in a single-tool location if every tool must obey it

## Step 6: Publish an audit summary

```markdown
| File | Before | After | Score | Key wins |
|------|--------|-------|-------|----------|
| ./AGENTS.md | 240 lines | 96 lines | 28/49 -> 45/49 | Added commands, removed doc dump, moved API rules to packages/api/AGENTS.md |
```

## Pitfalls

- Preserving large sections "just in case"; they re-bloat the file and bury commands
- Replacing one template dump with another
- Splitting into `@import`s and reporting the root line count as the win; the loaded context did not change
- Keeping contradictory rules to avoid conflict with file history
- Adding style advice linters already enforce; agents see lint output anyway
