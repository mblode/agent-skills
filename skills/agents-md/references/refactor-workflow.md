# Refactor Workflow

Use when an AGENTS.md is bloated, stale, or low-signal.

## Trigger conditions

Refactor when any are true:

- Root file over ~150 lines and hard to scan
- Commands missing, stale, or contradictory
- Contains framework docs or copy-pasted templates
- Generic guidance that doesn't prevent real mistakes

## Step 1: Snapshot and isolate essentials

Record current line count, then extract only what every task needs:

- Run/test/build/lint commands
- Critical environment/setup requirements
- High-frequency gotchas
- Project conventions that change implementation choices

Everything else: link to a reference or delete.

## Step 2: Remove bloat fast

Delete first, add back only what earns its place. For every removed line, record one reason: `generic`, `duplicate`, `stale`, or `moved` (to a reference). This log makes the final report traceable.

Remove:

- Full documentation and tutorial-style prose
- Long architecture explanations in root
- Exhaustive file maps
- Generic advice ("write clean code", "use best practices")
- Outdated commands and dead links

## Step 3: Rebuild root file in strict order

1. Project one-liner
2. Commands
3. Gotchas (failure mode -> fix)
4. Conventions and boundaries
5. Links to deeper references

## Step 4: Move detail out with progressive disclosure

Create or update supporting files for non-universal detail (`.claude/testing.md`, `.claude/architecture.md`, workspace-level `AGENTS.md` in monorepos), then link from root with `@import`:

```markdown
- Testing details: @.claude/testing.md
- Architecture: @docs/architecture.md
```

Rule of thumb: guidance needed in fewer than ~30% of tasks moves out of root.

## Step 5: Validate before finalizing

- Core commands run from the documented location (or are marked not runnable here)
- Linked and `@import`ed files exist
- No contradictory rules remain
- Removed guidance had no rare-but-critical constraints (security, migration, release, incident flows); re-check the Step 2 log for anything tagged `generic` that was actually a safety rule

## Step 6: Publish an audit summary

```markdown
| File | Before | After | Score | Key wins |
|------|--------|-------|-------|----------|
| ./AGENTS.md | 240 lines | 96 lines | 26/45 -> 42/45 | Added commands, removed doc dump, fixed stale paths |
```

## Pitfalls

- Preserving large sections "just in case"; they re-bloat the file and bury commands
- Replacing one template dump with another
- Keeping contradictory rules to avoid conflict with file history
- Adding style advice linters already enforce; agents see lint output anyway
