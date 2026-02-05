---
name: agents-md
description: Audits and improves AGENTS.md and CLAUDE.md instruction files using a minimal, execution-first standard. Use when users ask to audit, review, rewrite, score, or refactor agent instruction files, reduce bloat, fix stale commands, or codify repeated mistakes after PR feedback.
---

# AGENTS.md / CLAUDE.md Audit

AGENTS.md and CLAUDE.md are execution contracts, not knowledge bases.

## How to use this skill

Default path:
- Start with `Quick audit` using `references/quick-checklist.md` (10 checks).
- Escalate to `Full audit` (`references/quality-criteria.md`) only when quick audit fails, the file is high-risk/critical, or the user asks for full scoring.
- Apply edits only after reporting findings and getting confirmation.

Load references progressively:
- Always load the checklist for the selected mode.
- Load `references/refactor-workflow.md` only for low-signal files (below target score, stale commands/rules, or root file over ~150 lines).
- Load `references/templates.md` only when drafting a new file or rebuilding from scratch.
- Load `references/root-content-guidance.md` only when deciding what stays in root vs moved out.

Authoring guardrails:
- Keep this `SKILL.md` concise (well under 500 lines).
- Keep references one level deep from `SKILL.md`.
- Use forward-slash paths in all file references.

## Workflow

### 1. Discover files

Run:

```bash
find . \( -name "AGENTS.md" -o -name "CLAUDE.md" -o -name ".claude.md" -o -name ".claude.local.md" \) 2>/dev/null | sort
```

For monorepos, include workspace-level instruction files.
If output is long, page it for display, but audit the full result set.

### 2. Audit

- Quick mode target: **>= 8/10** checks from `references/quick-checklist.md`.
- Full mode file-quality target: **>= 91% of applicable points** from `references/quality-criteria.md`.
- Full mode audit-execution target: **2/2** when producing an edit proposal.
- Score each root/workspace instruction file independently.

### 3. Report findings first

Output a concise report before edits:

```markdown
## AGENTS.md Quality Report

| File | Mode | Score | Grade | Key Issues |
|------|------|-------|-------|------------|
| ./AGENTS.md | Quick | 6/10 | Fail | Missing test command, stale path, doc-heavy section |
```

### 4. Propose minimal diffs

- Fix broken/stale commands first.
- Remove generic, duplicate, or obsolete guidance.
- Move deep detail into `.claude/` or reference files.
- Keep rewrites incremental and preserve useful wording when possible.

Show each proposed change with rationale and a diff snippet.

### 5. Validate

- Run smoke checks for core commands (`dev`, `test`, `build`, `lint/typecheck`) when applicable. If one cannot be run, verify script existence and note the limitation.
- Check that linked paths resolve.
- Confirm no contradictory rules remain.

### 6. Apply and garden

- Apply approved edits.
- After each PR, add at most one new gotcha only if it prevented or fixed a real mistake.
