---
name: agent-skills-creator
description: Guides creation and improvement of best-practice agent skills following the open format specification. Covers frontmatter, directory structure, progressive disclosure, reference files, rules folders, degrees of freedom, content patterns, executable scripts, MCP tool references, evaluations, cross-model testing, and a ten-dimension audit protocol for existing skills. Use when creating a new skill, authoring SKILL.md, setting up a rules-based audit skill, structuring a skill bundle, writing scripts inside a skill, evaluating a skill, improving or rewriting an existing skill, or asking "how to write a skill", "improve this skill", "audit my skill", or "review this SKILL.md".
---

# Agent Skills Creator

Create and improve skills in the Agent Skills open format: full lifecycle from pattern selection through validation and README update.

- **IS:** creating new agent skills and auditing or rewriting existing ones: SKILL.md, references, rules folders, scripts, evaluations.
- **IS NOT:** AGENTS.md/CLAUDE.md instruction files (use `agents-md`) or general documentation quality (use `docs-writing`).

## Choose a Mode

- New skill → Creation Workflow below.
- Audit, improve, or rewrite an existing skill → load `references/improving-existing-skills.md` (scores ten audit dimensions, runs an ordered rewrite, then reuses Steps 5-8 for validation and shipping).

## Reference Files

| File | Read When |
|------|-----------|
| `references/format-specification.md` | Default: frontmatter constraints, directory structure, naming rules, advanced features |
| `references/skill-categories.md` | Choosing what type of skill to build (Step 1) |
| `references/skill-patterns.md` | Choosing a structural pattern or a template for a skill type |
| `references/authoring-tips.md` | Writing high-signal content, degrees of freedom, content patterns, setup, storage, hooks |
| `references/executable-code.md` | Skill includes scripts, depends on packages, or invokes MCP tools |
| `references/rules-folder-structure.md` | Building a rules-based audit/lint skill with categorized rule files |
| `references/improving-existing-skills.md` | Auditing, scoring, or rewriting an existing skill |
| `references/evaluation-and-iteration.md` | Designing evaluations, testing across models, iterating on a shipped skill |
| `references/quality-checklist.md` | Final validation before shipping |

## Choose a Skill Category

Determine what problem the skill solves; category informs pattern choice.

| Category | What it solves | Common pattern |
|----------|---------------|----------------|
| Library & API Reference | How to use a library/CLI/SDK correctly | Simple/hub |
| Product Verification | Test/verify with tools (Playwright, tmux) | Workflow |
| Data Fetching & Analysis | Connect to data/monitoring stacks | Workflow, Mixed |
| Business Process & Team Automation | Automate repetitive team workflows | Workflow |
| Code Scaffolding & Templates | Generate boilerplate and project structure | Workflow |
| Code Quality & Review | Enforce code quality standards | Rules-based, Workflow |
| CI/CD & Deployment | Fetch, push, deploy code | Workflow |
| Runbooks | Symptom to investigation to structured report | Workflow, Mixed |
| Infrastructure Operations | Maintenance with guardrails | Workflow |

Load `references/skill-categories.md` for per-category guidance, tips, and examples.

## Choose a Skill Pattern

| Pattern | When to use | Example | Key files |
|---------|-------------|---------|-----------|
| Simple/hub | Dispatch to 2-5 focused files by track | `ui-design` | SKILL.md + track files |
| Workflow | Multi-step process with progressive loading | `agents-md`, `pr-reviewer` | SKILL.md + `references/` |
| Rules-based | Audit/lint with categorized rules | `typography-audit`, `docs-writing` | SKILL.md + `rules/` |
| Mixed | Workflow with conditional references | `multi-tenant-architecture` | SKILL.md + `references/` |

Decision guide:
- Auditing or linting against a checklist: **rules-based**
- Guiding a multi-step process: **workflow**
- Dispatching to different tracks by context: **simple/hub**
- Unsure: start with **workflow** (most flexible)

Load `references/skill-patterns.md` for each pattern's templates and skeletons.

## Creation Workflow

Copy this checklist to track progress:

```text
Skill creation progress:
- [ ] Step 1: Choose skill category and pattern
- [ ] Step 2: Create directory and frontmatter
- [ ] Step 3: Write SKILL.md body
- [ ] Step 4: Add reference or rule files
- [ ] Step 5: Validate with quality checklist
- [ ] Step 6: Update README.md
- [ ] Step 7: Smoke-test installation
- [ ] Step 8: Evaluate and iterate
```

### Step 1: Choose skill category and pattern

Determine the category (what problem it solves), then the structural pattern. Load `references/skill-categories.md` and `references/skill-patterns.md`.

### Step 2: Create directory and frontmatter

Load `references/format-specification.md` for hard constraints.

- Create `skills/<name>/SKILL.md`
- Folder name must match `name` field (kebab-case)
- `name`: max 64 chars, lowercase letters/numbers/hyphens, no "anthropic" or "claude"
- `description`: max 1024 chars, third-person voice, include "Use when..." triggers with specific keywords

### Step 3: Write SKILL.md body

Load `references/authoring-tips.md` for voice, degrees of freedom, content patterns, and descriptions. Apply:

- Keep under 500 lines; split into reference files if longer
- Open with an IS/IS-NOT pair when adjacent skills exist or scope creep is likely ("Open with Boundaries")
- Add only context Claude lacks ("Don't State the Obvious"); use consistent terminology
- Match degrees of freedom to fragility: prose for open-ended work, specific scripts for fragile/destructive ops ("Degrees of Freedom")
- Reach for named content patterns: template for fixed output, examples for format-sensitive output, conditional for decision points
- Add a copyable progress checklist for multi-step workflows; validation/feedback loops for quality-critical tasks
- Build a Gotchas section from observed failures: the highest-signal content

### Step 4: Add reference or rule files

- **Workflow/mixed**: `references/` folder of focused files, each linked from SKILL.md via a "Read when..." table.
- **Rules-based**: `rules/` folder; load `references/rules-folder-structure.md` for `_sections.md`, `_template.md`, file-naming, and priority-table layout.
- **Simple/hub**: track files alongside SKILL.md, linked from a tracks table.

Key constraints:
- References one level deep from SKILL.md (no chains); loaded only when explicitly listed
- Files over 100 lines need a table of contents
- Long files (up to ~450 lines) are fine when TOC'd and single-topic; split by loading condition, not line count
- Broad domains: prefer a comprehensive-reference folder of many small files over monoliths (see the comprehensive-reference variant in `references/skill-patterns.md`)
- `agents/` is a sanctioned optional folder for subagent prompt definitions the skill dispatches to

Advanced:
- `scripts/` for executable utilities Claude composes; load `references/executable-code.md` for error handling, constants, plan-validate-execute, runtime, package deps, MCP tool naming
- `config.json` for skills needing user-specific setup context across sessions
- On-demand hooks (PreToolUse/PostToolUse) for safety gates or observation

### Step 5: Validate

Load `references/quality-checklist.md` and run all applicable checks. Copyable local validation block:

```bash
ruby -ryaml -e 'path=ARGV.fetch(0); s=File.read(path); m=s.match(/\A---\n(.*?)\n---\n/m) or abort("missing frontmatter"); y=YAML.safe_load(m[1]); abort("missing name") if y["name"].to_s.empty?; d=y["description"].to_s; abort("missing Use when") unless d.include?("Use when"); abort("description too long #{d.length}") if d.length>1024; abort("body too long #{s.lines.size}") if s.lines.size>=500; puts "OK #{path}"' skills/<name>/SKILL.md
wc -l skills/<name>/SKILL.md
perl -CSD -ne 'print "$ARGV:$.:$_" if /\x{2014}/' skills/<name>/SKILL.md README.md docs/skills.mdx
rg -n "references/|scripts/|assets/" skills/<name>/SKILL.md
find skills/<name> -maxdepth 2 -type f | sort
rg -n "^- \\*\\*\\[<name>\\]" README.md docs/skills.mdx
```

### Step 6: Update README.md

Add a bullet under the matching category heading and bump the skill count near the top of the README:

```markdown
- **[<skill-name>](./skills/<skill-name>/SKILL.md)**: <one-line description>
```

Categories used in this repo: Architecture, Design, Writing, Quality, Shipping, Authoring.

### Step 7: Smoke-test

Install via the skills CLI, never `cp -R` into `~/.claude/skills/` (bypasses the `~/.agents/skills` symlink chain):

```bash
npx skills add mblode/agent-skills -g --skill <name> -y
ls ~/.claude/skills/<name>/
```

Deploy chain: `skills add` writes to `~/.agents/skills/<name>/`, symlinked into `~/.claude/skills/<name>/` for Claude Code to pick up.

For local iteration without reinstalling, symlink the repo folder directly; unlink when done:

```bash
ln -s /path/to/agent-skills/skills/<name> ~/.claude/skills/<name>
```

### Step 8: Evaluate and iterate

Load `references/evaluation-and-iteration.md`. Define 3+ scenarios, test on each target model, and iterate on observed Claude behavior, not assumptions.

## Anti-patterns

- Dumping the full specification into the SKILL.md body (use reference files)
- Reference-to-reference chains (keep one level deep)
- Time-sensitive content ("before August 2025, use...")
- Restating what Claude already knows (Markdown, general coding advice, standard conventions)
- Description written as a human summary or in "I audit..."/"Use this to..." voice instead of a third-person model trigger with "Use when..." phrases and quoted user phrases
- Adding README.md, CHANGELOG.md, or INSTALLATION_GUIDE.md to the skill folder
- Dropping files in folders without linking them from SKILL.md
- Installing with `cp -R` into `~/.claude/skills/` (bypasses the `~/.agents/skills` symlink chain); use `npx skills add`
- Leaving supporting files at the skill root for a non-simple/hub skill (move them to `references/`)
- Over-constraining the approach when specifying outcomes would suffice (railroading)
- Enumerating many tool or library options instead of giving one sensible default with an escape hatch for the known exception
- Vague or generic skill names (`helper`, `utils`, `tools`, `documents`, `data`) that give the model nothing to route on
- Skipping a Gotchas section for skills with known failure modes
- Storing persistent data in the skill directory (deleted on upgrade) or via hardcoded absolute paths instead of `${CLAUDE_PLUGIN_DATA}`
- Referencing MCP tools without the server prefix (`bigquery_schema` instead of `BigQuery:bigquery_schema`)
- Magic numbers in scripts with no justifying comment (voodoo constants)
- Shipping without testing on every target model; what reads well to Opus may underspecify for Haiku

## Related Skills

- `agents-md` for auditing AGENTS.md/CLAUDE.md instruction files
- `docs-writing` for documentation quality rules
