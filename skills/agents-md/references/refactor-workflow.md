# Refactor Workflow

Use this when AGENTS.md is bloated, stale, or low-signal.

## Trigger conditions

Refactor when any of these are true:
- Root file is over ~150 lines and hard to scan
- Commands are missing, stale, or contradictory
- File contains framework docs or copy-pasted templates
- Guidance is generic and does not prevent real mistakes

## Step 1: Snapshot and isolate essentials

Extract only what is required for every task:
- Run/test/build/lint commands
- Critical environment/setup requirements
- High-frequency gotchas
- Project conventions that affect implementation

Everything else is candidate for linked references or deletion.

## Step 2: Remove bloat fast

Delete first, then add back only what earns its place.
For every removed line/section, record one reason: `generic`, `duplicate`, `stale`, or `moved` (to a linked reference).

Remove:
- Full documentation and tutorial-style prose
- Long architecture explanations in root
- Exhaustive file maps
- Generic advice ("write clean code", "use best practices")
- Outdated commands and dead links

## Step 3: Rebuild root file in strict order

Use this order to keep files scannable:
1. Project one-liner
2. Commands
3. Gotchas (failure mode -> fix)
4. Conventions and boundaries
5. Links to deeper references

## Step 4: Move detail out with progressive disclosure

Create or update supporting files for non-universal detail:
- `.claude/testing.md`
- `.claude/architecture.md`
- `.claude/code-style.md`
- workspace-specific `AGENTS.md` files in monorepos

Link from root using `@import` syntax:

```markdown
- Testing details: @.claude/testing.md
- Architecture: @docs/architecture.md
```

Rule: if guidance is needed in fewer than ~30% of tasks, move it out of root.

## Step 5: Validate before finalizing

Run or verify:
- Core commands are runnable from documented location (or explicitly marked as not runnable in the current environment)
- Linked files exist
- No contradictory rules remain
- Root file stays concise and operational
- Removed guidance did not include rare-but-critical constraints (security, migration, release, incident flows)

## Step 6: Publish an audit summary

Use a concise summary table:

```markdown
| File | Before | After | File quality | Audit execution | Key wins |
|------|--------|-------|--------------|-----------------|----------|
| ./AGENTS.md | 240 lines | 96 lines | 26/45 -> 42/45 | 0/2 -> 2/2 | Added commands, removed doc dump, fixed stale paths |
```

## Pitfalls

- Preserving large sections "just in case"
- Replacing one template dump with another template dump
- Keeping contradictory rules to avoid conflict with history
- Adding style advice that linters already enforce
