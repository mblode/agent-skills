---
name: agent-skills-creator
description: Guides creation and improvement of best-practice agent skills following the open format specification. Covers frontmatter, progressive disclosure, reference files, rules folders, degrees of freedom, constraint calibration, executable scripts, MCP tool references, evaluations, constraint ablation, whether to adopt or author a skill someone else already wrote, and an eleven-dimension audit protocol for existing skills. Use when creating a new skill, authoring SKILL.md, setting up a rules-based audit skill, structuring a skill bundle, writing scripts inside a skill, evaluating a skill, improving or rewriting an existing skill, or asking "how to write a skill", "improve this skill", "audit my skill", "review this SKILL.md", "simplify this skill", "is this skill over-constrained", "rightsize this skill", or "should I install this skill or write my own".
---

# Agent Skills Creator

Create and improve skills in the Agent Skills open format: full lifecycle from pattern selection through validation and README update.

- **IS:** creating new agent skills and auditing or rewriting existing ones: SKILL.md, references, rules folders, scripts, evaluations.
- **IS NOT:** AGENTS.md/CLAUDE.md instruction files (use `agents-md`) or general documentation quality (use `docs-writing`).

## Choose a Mode

- New skill → Creation Workflow below.
- Audit, improve, or rewrite an existing skill → `references/improving-existing-skills.md`, which scores eleven audit dimensions, runs an ordered rewrite, then reuses Steps 5-8 for validation and shipping.
- Simplify, rightsize, or cut an over-constrained skill → same reference. Run `/doctor` first: the harness ships skill and CLAUDE.md rightsizing, and this skill's audit is the deeper per-skill pass that follows it, not a replacement.

## Reference Files

| File | Read When |
|------|-----------|
| `references/authoring-tips.md` | Default when writing or cutting body content: judgement over rules, constraint calibration, degrees of freedom, content patterns, descriptions |
| `references/skill-patterns.md` | Choosing a structural pattern |
| `references/format-specification.md` | Directory layout, optional frontmatter fields, loading semantics, naming |
| `references/rules-folder-structure.md` | Building a rules-based audit/lint skill |
| `references/improving-existing-skills.md` | Auditing, scoring, simplifying, or rewriting an existing skill |
| `references/executable-code.md` | Skill includes scripts, depends on packages, or invokes MCP tools |
| `references/evaluation-and-iteration.md` | Designing evaluations, ablating constraints, testing across models |
| `references/adopt-adapt-author.md` | A public skill already covers this ground, or deciding whether to vendor, adapt, or replace a third-party skill |

Mechanical rules are not in any of these. `scripts/validate.sh` is their single statement:

```bash
scripts/validate.sh skills/<name>   # one skill
scripts/validate.sh --all           # every skill in the repo
```

## Creation Workflow

Copy this checklist to track progress:

```text
Skill creation progress:
- [ ] Step 1: Choose a pattern
- [ ] Step 2: Create directory and frontmatter
- [ ] Step 3: Write SKILL.md body
- [ ] Step 4: Add reference or rule files
- [ ] Step 5: Validate
- [ ] Step 6: Update README.md (and docs/skills.mdx where the repo has one)
- [ ] Step 7: Smoke-test installation
- [ ] Step 8: Evaluate and iterate
```

### Step 1: Choose a pattern

Simple/hub, workflow, rules-based, or mixed. `references/skill-patterns.md` has the shapes, the in-repo example for each, and the problem-to-pattern affinity table.

### Step 2: Create directory and frontmatter

Create `skills/<name>/SKILL.md` with `name` and `description`. Write the description as a model trigger, not a human summary: what it does, what it covers, then "Use when..." with the phrases users actually say. `validate.sh` enforces the limits, so write for routing and let the script police the constraints.

### Step 3: Write SKILL.md body

`references/authoring-tips.md` carries the judgement. Apply:

- Open with an IS/IS-NOT pair when adjacent skills exist or scope creep is likely ("Open with Boundaries")
- Add only context Claude lacks ("Don't State the Obvious"); use consistent terminology
- Phrase guidance as an outcome, reserving absolutes for safety, data loss, format contracts, and observed failures ("Judgement Over Rules")
- Check nothing here contradicts the harness, a sibling skill, or the repo AGENTS.md; route instead of restate ("Don't Fight the Harness or a Sibling")
- Keep the opinions that make the skill worth invoking; cut only what Claude already does unprompted ("Cut Constraints, Keep Opinions")
- Match degrees of freedom to fragility: prose for open-ended work, exact commands for fragile or destructive ops ("Degrees of Freedom")
- Reach for named content patterns: template for fixed output, examples only where style is the deliverable, conditional for decision points
- Add a copyable progress checklist for multi-step workflows; validation loops for quality-critical tasks
- Build a Gotchas section from observed failures: the highest-signal content in any skill

### Step 4: Add reference or rule files

- **Workflow/mixed**: a `references/` folder, each file linked from SKILL.md with a "Read when" condition
- **Rules-based**: a `rules/` folder; `references/rules-folder-structure.md` covers `_sections.md`, `_template.md`, and file naming
- **Simple/hub**: track files alongside SKILL.md, linked from a tracks table

Prefer a reference that is code. An existing implementation or a test suite pins a contract better than prose describing it ("Reference-as-Spec"). Split by loading condition, not line count: two topics read at different moments are two files.

Advanced: `scripts/` for executables Claude composes (see `references/executable-code.md`), `config.json` for setup context that would otherwise be re-asked every session, and on-demand PreToolUse/PostToolUse hooks for safety gates.

### Step 5: Validate

```bash
scripts/validate.sh skills/<name>
```

Output separates **format** (the spec) from **house style** (this repo's taste). Fix every FAIL; a SKIP always states why it did not apply.

### Step 6: Update README.md

Add a bullet under the matching category heading, and bump the skill count near the top of the README:

```markdown
- **[<skill-name>](./skills/<skill-name>/SKILL.md)**: <one-line description>
```

Categories: Architecture, Design, Writing, Quality, Shipping, Authoring. `validate.sh` verifies the bullet and the count. A repo that also ships `docs/skills.mdx` needs the same bullet there; the check is conditional on that file existing, so it stays silent in a repo without one.

### Step 7: Smoke-test

```bash
npx skills add mblode/agent-skills -g --skill <name> -y
ls ~/.claude/skills/<name>/
```

`skills add` writes to `~/.agents/skills/<name>/`, symlinked into `~/.claude/skills/<name>/` for Claude Code to pick up. For local iteration without reinstalling, symlink the repo folder directly and unlink when done:

```bash
ln -s /path/to/agent-skills/skills/<name> ~/.claude/skills/<name>
```

### Step 8: Evaluate and iterate

`references/evaluation-and-iteration.md`. Define 3+ scenarios, test on each target model, and iterate on observed behavior rather than assumptions. Ablate any rule you suspect is dead weight: delete it, rerun the scenarios, keep it only if one regresses.

## Gotchas

- The installed copy under `~/.agents/skills/<name>/` is a copy, not a symlink to your repo. Editing the repo changes nothing in a running session, and the stale copy loads silently, so a skill can be several commits behind while appearing correct. Reinstall, or symlink the repo folder per Step 7, before testing a change.
- `no-reference-chains` fires on the words "load" or "read" appearing near another reference's filename. Naming a sibling reference for context passes; telling Claude to go read it does not. Rephrase rather than deleting the pointer.
- `toc-over-100-lines` wants `## Contents` inside the first 20 lines of any reference over 100 lines. A TOC further down does not count, and the file fails while looking fine.
- `readme-skill-count` compares the README's stated count against `find skills -maxdepth 2 -name SKILL.md`. Adding a reference file to an existing skill does not change it; only adding or removing a skill does.
- `--agent` on `skills add` is variadic and space-separated (`--agent codex cursor`); it consumes arguments until the next one starting with `-`. A comma-separated list is validated element-wise and rejected whole as one invalid name. Do not conclude from an empty `~/.codex/skills` that the install failed: any agent whose `skillsDir` is `.agents/skills` is treated as universal and installed to `~/.agents/skills/`, which those agents read directly.
- A description that omits "Use when" fails `description-triggers` outright, but a description that has the phrase and the wrong trigger words fails nothing and simply never routes. The validator cannot see this; only an eval can.

## Anti-patterns

- Absolute prohibitions where outcome phrasing would do; the rule gets followed on the one prompt in ten where you would have wanted a pivot
- Directives restating or contradicting the harness, a sibling skill, or the repo AGENTS.md, forcing the model to reconcile before it can act
- Cutting a skill's opinions during a simplification pass, leaving something that validates clean and changes no behavior
- Usage examples standing in for an expressive interface; name the parameters and enums instead
- A rule stated in SKILL.md and again in a script's `--help`, a tool description, or a rule file
- Telling users to hand-write memories into CLAUDE.md; auto-memory owns user, feedback, and project facts
- Describing a contract in prose when the code or test suite that defines it could be pointed at
- Dumping the full specification into the SKILL.md body instead of a reference file
- Time-sensitive content ("before August 2025, use...")
- Restating what Claude already knows (Markdown, general coding advice, standard conventions)
- A description written as a human summary or in "I audit..." voice instead of a third-person trigger with "Use when..." phrases
- Vague names (`helper`, `utils`, `tools`, `documents`, `data`) that give the model nothing to route on
- Skipping a Gotchas section for skills with known failure modes
- Magic numbers in scripts with no justifying comment
- Shipping without testing on every target model; what reads well to Opus may underspecify for Haiku

## Related Skills

- `agents-md` for auditing AGENTS.md/CLAUDE.md instruction files
- `docs-writing` for documentation quality rules
