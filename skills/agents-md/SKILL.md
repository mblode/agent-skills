---
name: agents-md
description: >-
  Audits, scores, refactors, and writes the AGENTS.md and CLAUDE.md files
  agents load at session start, and wires a repo so Claude Code, Codex, and
  Cursor all read the same instructions. Execution-first standards: working
  commands, real-failure gotchas, signal-to-noise, on-demand placement that
  survives tool choice, and enforcement by exit code rather than prose. Runs a
  12-check quick triage or a 49-check full audit with letter grades, then
  proposes minimal diffs. Use when asked to audit, review, score, refactor, or
  improve agent instruction files, fix stale commands, reduce bloat, write a
  new AGENTS.md, set up a project for agents, make a repo agent-friendly, wire
  a repo for Cursor or Codex, or when asking "my AGENTS.md is bad", "help me
  write a CLAUDE.md", "my CLAUDE.md is too long", or "improve my agent
  instructions". For SKILL.md files use agent-skills-creator; for general docs
  use docs-writing; for mining session history into instruction suggestions
  use the external cadence-advise skill where installed.
---

# AGENTS.md Setup and Audit

- **IS:** wiring a repo so every agent tool in use reads the same rules, then auditing, scoring, refactoring, and writing the AGENTS.md / CLAUDE.md / CLAUDE.local.md files agents load at session start.
- **IS NOT:** authoring SKILL.md files (use `agent-skills-creator`), project docs or READMEs (use `docs-writing` or `readme-creator`), or mining session history (use the external `cadence-advise` skill where installed; this skill audits the file as-is).

AGENTS.md files are execution contracts, not knowledge bases. Two tests catch the two ways a line fails.

- **Dead weight:** "Would removing this cause the agent to make a mistake?" If no, cut it; bloat makes agents ignore the rules that matter.
- **Harmful precision:** "Is this wrong on any plausible task in this repo?" A prohibition that is wrong one task in ten is still obeyed on that task, and the agent cannot tell that this is the exception. State the outcome you want and let the surrounding code pick the path. `NEVER write comments` becomes `match the comment density of the file you are editing`: shorter, no exception list to maintain, and correct in a densely commented file without being told.

Absolutes still earn their place for safety, data loss, format contracts, and rules this repo's agents have actually been observed to break.

AGENTS.md is the tool-agnostic source of truth: Codex, Cursor, Copilot, and the rest of the agents.md list read it natively. Claude Code is the exception. It reads `CLAUDE.md`, not `AGENTS.md`, so a repo that uses Claude Code needs a `CLAUDE.md` whose first line is `@AGENTS.md` (or a `CLAUDE.md -> AGENTS.md` symlink when there are no Claude-only additions). If only a `CLAUDE.md` exists and another tool is in use, `git mv CLAUDE.md AGENTS.md` and add the pointer file; a copy of either drifts.

## Choose a Mode

- Repo has no agent instructions, or targets a tool it is not wired for -> **Setup**: `references/project-setup.md` decides which files exist and which tool reads each one, then Writing From Scratch below fills the root file, then Audit scores it.
- A file exists and the question is quality -> **Audit**, below.
- A file exists and is bloated, stale, or scored badly -> **Refactor**, `references/refactor-workflow.md`.

## Reference Files

| File | Read when |
|------|-----------|
| `references/project-setup.md` | Setting a repo up for Claude Code, Codex, and Cursor; deciding which files exist and what each tool actually loads |
| `references/quick-checklist.md` | Every audit; default 12-check triage |
| `references/quality-criteria.md` | Quick audit fails, file is high-risk, or full scoring requested |
| `references/refactor-workflow.md` | File is bloated (root over ~150 lines), stale, or below target |
| `references/root-content-guidance.md` | Deciding what stays in root and where moved content goes so it still loads |
| `references/templates.md` | Drafting or rebuilding a file from scratch |

## Writing From Scratch

The content step of Setup, and the whole job when the repo is already wired and only the file is missing. Skip the audit. Gather real commands from the manifest (`package.json`, `Makefile`, CI config), pick a skeleton from `references/templates.md`, fill it with verified commands and known gotchas, then validate against `references/quick-checklist.md` before delivering.

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
find . \( -name "AGENTS.md" -o -name "AGENTS.override.md" -o -name "CLAUDE.md" -o -name "CLAUDE.local.md" \) -not -path "*/node_modules/*" 2>/dev/null | sort
ls -la CLAUDE.md .claude/rules .cursor/rules 2>/dev/null
```

Also check `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`; both load in every repo. `ls -la CLAUDE.md` tells you whether it is a symlink, an `@AGENTS.md` pointer, or a second copy, and a copy is a finding on its own. For monorepos, include workspace-level files. Audit each level independently: root holds universal rules, child files hold directory-specific rules (see the placement hierarchy in `references/root-content-guidance.md`).

### Step 2: Select audit mode

- **Quick** (default): 12 checks from `references/quick-checklist.md`, target >= 10/12.
- **Full**: 49 checks from `references/quality-criteria.md`, target >= 91% of applicable points (grade A). Use when the quick audit fails, the file gates a high-risk repo, or full scoring is requested.

### Step 3: Run audit and score

Score each root file independently; exclude `N/A` checks from the denominator.

### Step 4: Report findings

Output a concise report before any edits:

```markdown
## AGENTS.md Audit Report

| File | Mode | Score | Grade | Key Issues |
|------|------|-------|-------|------------|
| ./AGENTS.md | Quick | 6/10 | Fail | Missing test command, stale path, doc-heavy section |
```

Every issue in the table must map to a Step 5 diff; no vague findings.

### Step 5: Propose minimal diffs

In priority order:

1. Fix broken or stale commands; bugs, not style.
2. Remove generic, duplicate, or obsolete guidance, restatements of what the harness already does, and facts auto-memory owns.
3. Rewrite blanket prohibitions as the outcome they were protecting; keep the absolute only where the harmful-precision test clears it.
4. Move detail needed in fewer than ~30% of tasks to a location that loads on demand: a nested `AGENTS.md` in the directory it concerns, a path-scoped `.claude/rules/*.md`, or a skill. Not an `@import`: imported files load at launch and save nothing.
5. Add emphasis ("IMPORTANT:", "YOU MUST") only on critical rules agents skip, one line at a time.

Show each change as a diff snippet with a one-line rationale. Apply only after the user confirms.

### Step 6: Validate changes

1. Smoke-run core commands (`dev`, `test`, `build`, `lint`/`typecheck`) where the environment allows; otherwise verify the script exists in the manifest and note the limitation.
2. Check every linked and `@import`ed path resolves. In a Claude Code session, `/context` lists the memory files that actually loaded; a file absent from that list is not loaded, whatever the tree looks like.
3. Confirm no contradictory rules remain across levels (home, root, child), against installed skills (`.claude/skills/`, `.agents/skills/`, `~/.claude/skills/`), or against harness defaults. Where the overlap is deliberate, the file must say who wins, so the agent is told precedence instead of arbitrating it every task.
4. Issues found: revise, then validate again. Never proceed on "looks right".

### Step 7: Apply and report

Apply approved edits, re-score with the same checklist, report before/after scores and line counts. Per future PR, add at most one new gotcha, only if it prevented or fixed a real mistake.

## Gotchas

- Claude Code reads `CLAUDE.md`, not `AGENTS.md`. A repo with only `AGENTS.md` gives Claude Code no instructions and nothing warns; `/context` shows an empty Memory files list. Add a `CLAUDE.md` containing `@AGENTS.md`.
- `@import` moves text, not cost. Imported files are expanded into context at launch, so splitting a 400-line `CLAUDE.md` into five imports still loads 400 lines every session. Only nested files, path-scoped `.claude/rules/`, and skills load on demand.
- `@import` reaches Claude Code only. Codex and Cursor pass the line through as text without warning, so an imported safety or format rule is absent from most sessions while the file still looks correct.
- `@import` lines inside backticks or fenced blocks are literal text: a real import wrapped in a code span silently never loads. The same rule makes example imports inside fences safe to show.
- Import chains stop at four hops; deeper content disappears with no error.
- An import that resolves outside the repo (`@~/.claude/my-prefs.md`) in a project-level file triggers a one-time approval dialog in Claude Code. Decline it and the import stays disabled with no further prompt, so the teammate who pressed No runs a different rule set from then on.
- Nested files do not load the same way per tool. Claude Code loads a subdirectory's file when it reads files there; Codex concatenates only the files on the path from repo root to the launch directory. A rule that lives only in `packages/api/AGENTS.md` is invisible to a Codex session started at the root and to any Claude Code task that never opens that subtree. Universal rules go in root.
- Codex stops adding instruction files once the concatenated total reaches `project_doc_max_bytes` (32 KiB by default), root first. A bloated root file silently crowds out every nested file beneath it.
- Project-specific commands in `~/.claude/CLAUDE.md` or `~/.codex/AGENTS.md` load in every repo, so one project's `npm run dev` becomes noise or a wrong command everywhere else.
- Audit `CLAUDE.local.md` only for broken commands and contradictions with the shared file; it's gitignored personal config, and it exists only in the worktree that created it.
- Don't strip emphasis markers (IMPORTANT, YOU MUST) during a density cut; they exist because plain phrasing was already ignored once. When many lines carry them, none stands out, so the fix for a new skipped rule is emphasis on that one line, not another pass over the file.
- Content auto-memory owns (user preferences, personal feedback, evolving project status) collects in `CLAUDE.md` from the old `#`-hotkey habit. It loads every session, isn't repo knowledge, and drifts silently because nothing in the codebase contradicts it. Cut it to memory or `CLAUDE.local.md`.
- A rule duplicating harness behavior isn't free: the agent reconciles it against what the harness already does before it can act, and pays that on every task. "Always read a file before editing it" is a whole reconciliation for zero behavior change.
- A passing quick score doesn't prove commands run; stale commands hide behind checklist passes. Step 6 smoke-runs aren't optional.
- Don't rewrite a whole file when targeted diffs would pass; full rewrites destroy battle-tested wording and inflate review burden.

## Related Skills

- `agent-skills-creator`: authoring and improving SKILL.md files (different format and rules).
- External `cadence-advise` skill where installed: proposes AGENTS.md/CLAUDE.md edits from observed session history; complements this skill's file-first audit.
- `readme-creator` / `docs-writing`: human-facing documentation; AGENTS.md content that belongs in docs should move there.
- `codebase-architecture` (Harden mode): the rest of the repo an agent works in. A rule a linter can enforce belongs there as an exit code, not here as prose, and it owns the docs tree this file indexes.
- Claude Code's `/doctor` checkup: proposes trims for a checked-in `CLAUDE.md`, cutting what Claude can derive from the codebase and migrating always-loaded procedures into skills and nested files. Complementary automated triage; it doesn't run the commands, so it never replaces Step 6.
