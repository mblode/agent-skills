---
name: agents-md
description: Audits, scores, and refactors AGENTS.md and CLAUDE.md agent instruction files using execution-first standards: working commands, real-failure gotchas, signal-to-noise, and @import progressive disclosure. Runs a 10-check quick triage or a 45-check full audit with letter grades, then proposes minimal diffs. Use when asked to audit, review, score, refactor, or improve agent instruction files, fix stale commands, reduce bloat, write a new AGENTS.md, or when asking "my AGENTS.md is bad", "help me write a CLAUDE.md", or "improve my agent instructions". For SKILL.md skill files use agent-skills-creator; for general docs use docs-writing; for mining session history into instruction suggestions use cadence-advise.
---

# AGENTS.md Audit

- **IS:** auditing, scoring, refactoring, and writing AGENTS.md / CLAUDE.md / CLAUDE.local.md instruction files that agents load at session start.
- **IS NOT:** authoring SKILL.md skill files (use `agent-skills-creator`), writing project docs or READMEs (use `docs-writing` or `readme-creator`), or mining session history for instruction suggestions (use `cadence-advise`; this skill audits the file as it exists).

AGENTS.md files are execution contracts, not knowledge bases. **Litmus test for every line:** "Would removing this cause the agent to make a mistake?" If no, cut it. Bloated instruction files cause agents to ignore the rules that matter.

AGENTS.md is the tool-agnostic source of truth. Claude Code loads `AGENTS.md`, `CLAUDE.md`, and `CLAUDE.local.md` natively from any directory level, no symlinks needed. If a project has only a `CLAUDE.md`, recommend `mv CLAUDE.md AGENTS.md`.

## Reference Files

| File | Read when |
|------|-----------|
| `references/quick-checklist.md` | Every audit; the default 10-check triage (target >= 8/10) |
| `references/quality-criteria.md` | Quick audit fails, file is high-risk, or user requests full scoring (45 checks, letter grades) |
| `references/refactor-workflow.md` | File is bloated (root over ~150 lines), stale, or scores below target |
| `references/root-content-guidance.md` | Deciding what stays in root vs moves behind `@import`; file placement hierarchy |
| `references/templates.md` | Drafting a new file or rebuilding one from scratch |

## Writing From Scratch

No instruction file exists? Skip the audit steps: gather real commands from the project manifest (`package.json`, `Makefile`, CI config), pick a skeleton from `references/templates.md`, fill it with verified commands and any known gotchas, then validate against `references/quick-checklist.md` before delivering.

## Audit Workflow

Copy this checklist to track progress:

```
Audit Progress:
- [ ] Step 1: Discover files
- [ ] Step 2: Select audit mode (quick or full)
- [ ] Step 3: Run audit and score
- [ ] Step 4: Report findings with score table
- [ ] Step 5: Propose minimal diffs
- [ ] Step 6: Validate changes
- [ ] Step 7: Apply and report before/after scores
```

### Step 1: Discover files

```bash
find . \( -name "AGENTS.md" -o -name "CLAUDE.md" -o -name "CLAUDE.local.md" \) 2>/dev/null | sort
```

Also check `~/.claude/CLAUDE.md` (applies to every session). For monorepos, include workspace-level AGENTS.md files. Audit each level independently: root holds universal rules; child files hold directory-specific rules (see the placement hierarchy in `references/root-content-guidance.md`).

### Step 2: Select audit mode

- **Quick audit** (default): 10 checks from `references/quick-checklist.md`, target >= 8/10.
- **Full audit**: 45 checks from `references/quality-criteria.md`, target >= 91% of applicable points (grade A). Use when the quick audit fails, the file gates a high-risk repo, or the user asks for full scoring.

### Step 3: Run audit and score

Score each root file independently. `N/A` checks are excluded from the denominator.

### Step 4: Report findings

Output a concise report before any edits:

```markdown
## AGENTS.md Audit Report

| File | Mode | Score | Grade | Key Issues |
|------|------|-------|-------|------------|
| ./AGENTS.md | Quick | 6/10 | Fail | Missing test command, stale path, doc-heavy section |
```

Every issue named in the table must map to a proposed diff in Step 5; no vague findings.

### Step 5: Propose minimal diffs

In priority order:

1. Fix broken or stale commands; these are bugs, not style.
2. Remove generic, duplicate, or obsolete guidance.
3. Move non-universal detail behind `@path/to/file.md` imports.
4. Add emphasis ("IMPORTANT:", "YOU MUST") only on critical rules agents demonstrably skip.

Show each change as a diff snippet with one-line rationale. Apply only after the user confirms.

### Step 6: Validate changes

1. Smoke-run core commands (`dev`, `test`, `build`, `lint`/`typecheck`) where the environment allows; otherwise verify the script exists in the manifest and note the limitation in the report.
2. Check every linked and `@import`ed path resolves.
3. Confirm no contradictory rules remain across levels (home, root, child).
4. Issues found → revise → validate again. Do not proceed on "looks right".

### Step 7: Apply and report

Apply approved edits, re-score with the same checklist, and report before/after scores plus line counts. After future PRs, add at most one new gotcha, and only if it prevented or fixed a real mistake.

## Gotchas

- `@import` lines are not evaluated inside code spans or fenced blocks; a real import wrapped in backticks silently never loads. Conversely, example imports inside fenced blocks are safe to show.
- `@import` chains stop resolving at 5 hops; content behind a deeper chain silently disappears from context.
- Child-directory AGENTS.md files load on demand when the agent works in that subtree, not at session start, so a universal rule placed only in a child file is invisible to most tasks. Promote it to root.
- Don't put project-specific commands in `~/.claude/CLAUDE.md`; it loads in every session, so one project's `npm run dev` becomes noise (or a wrong command) everywhere else.
- Don't audit `CLAUDE.local.md` as strictly as AGENTS.md; it is gitignored personal config, so flag only broken commands and contradictions with the shared file.
- Don't strip emphasis markers (IMPORTANT, YOU MUST) during a density cut; they exist because the default phrasing was already ignored once.
- A passing quick score does not prove commands run; stale commands hide behind checklist passes. Step 6 smoke-runs are not optional.
- Don't rewrite a whole file when targeted diffs would pass the audit; full rewrites destroy battle-tested wording and inflate review burden.

## Related Skills

- `agent-skills-creator`: authoring and improving SKILL.md skill files (different format, different rules).
- `cadence-advise`: proposes AGENTS.md/CLAUDE.md edits from observed session history; complementary input to this skill's file-first audit.
- `readme-creator` / `docs-writing`: human-facing documentation; AGENTS.md content that belongs in docs should move there.
