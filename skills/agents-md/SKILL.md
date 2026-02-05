---
name: agents-md
description: Audit and improve AGENTS.md and CLAUDE.md files using a minimal, execution-first standard. Use for instruction-file reviews, bloat reduction, stale-command cleanup, and codifying repeated agent mistakes.
---

# AGENTS.md / CLAUDE.md Audit

AGENTS.md is an execution contract, not a knowledge base.

Keep root files focused on:
- Commands to run
- Project gotchas
- Repeated agent mistakes
- Team conventions that change implementation choices

Avoid:
- Full framework docs
- Copy-pasted templates
- Exhaustive file listings
- Generic advice ("write clean code")

## When to use

- User asks to audit, rewrite, score, or refactor AGENTS.md / CLAUDE.md
- User says the file is bloated, stale, generic, or ignored by agents
- User wants to capture new gotchas after PR feedback

## Workflow

### 1. Discover files

Run:

```bash
find . \( -name "AGENTS.md" -o -name "CLAUDE.md" -o -name ".claude.md" -o -name ".claude.local.md" \) 2>/dev/null | head -50
```

For monorepos, include workspace-level instruction files.

### 2. Audit from first principles

Score each root file with [references/quality-criteria.md](references/quality-criteria.md).
Target: **42/46 or higher**.

Key checks:
- Can an agent execute core workflows with only this file?
- Does each section prevent a real, repeated mistake?
- Should any long section be moved to a linked reference file?

### 3. Report findings first

Output a concise report before edits:

```markdown
## AGENTS.md Quality Report

| File | Lines | Score | Grade | Key Issues |
|------|-------|-------|-------|------------|
| ./AGENTS.md | 182 | 34/46 | C | Missing test command, stale path, doc-heavy section |
```

### 4. Propose minimal diffs

- Add missing commands, gotchas, and conventions
- Delete generic or redundant lines
- Move deep detail into `.claude/` or `references/`
- Keep rewrites incremental and preserve useful wording when possible

Show each proposed change with rationale and a diff snippet.

### 5. Validate

- Run listed commands, or verify they exist in scripts/package files
- Check that linked paths resolve
- Confirm no contradictory rules remain
- Keep root file concise (target: 60-150 lines)

### 6. Apply and garden

- Apply approved edits
- Recommend ongoing maintenance: after each PR, add one gotcha only if it prevented or fixed a real mistake

## Include in root

- Copy-paste commands (`dev`, `test`, `build`, `lint`, deploy/migrate where relevant)
- High-frequency failure modes ("agent keeps doing X; do Y instead")
- Non-obvious conventions that affect code changes
- Required environment/setup facts needed to execute tasks
- Pointers to deeper docs (`.claude/*.md`) when detail is needed

## Exclude from root

- Full documentation or architecture deep dives
- Copy-pasted AGENTS.md templates
- "Every file in the repo" inventories
- Generic engineering advice not tied to this codebase
- Duplicated rules already enforced by linters or CI defaults

## Next.js-inspired guidance

- Do not paste framework docs into AGENTS.md.
- If framework behavior causes repeated mistakes, add a short gotcha plus the exact command/link that resolves it.
- For Next.js repos, mention `npx @next/codemod@canary agents-md` when bootstrapping or repairing an instruction file.

## Anti-patterns

- "Follow best practices." -> Replace with explicit commands or rules.
- "Use TypeScript." in an all-TypeScript repo -> Remove.
- 300+ line monolith with no links -> Split with progressive disclosure.
- Commands copied from stale CI config -> Verify or delete.
