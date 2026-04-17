---
name: agent-skills-creator
description: Guides creation of best-practice agent skills following the open format specification. Covers frontmatter, directory structure, progressive disclosure, reference files, rules folders, degrees of freedom, content patterns, executable scripts, MCP tool references, evaluations, and cross-model testing. Use when creating a new skill, authoring SKILL.md, setting up a rules-based audit skill, structuring a skill bundle, writing scripts inside a skill, evaluating a skill, or asking "how to write a skill."
---

# Agent Skills Creator

Create skills that follow the Agent Skills open format. Covers the full lifecycle from pattern selection through validation and README update.

## Reference Files

| File | Read When |
|------|-----------|
| `references/format-specification.md` | Default: frontmatter constraints, directory structure, naming rules, advanced features |
| `references/skill-categories.md` | Choosing what type of skill to build (Step 1) |
| `references/skill-patterns.md` | Choosing a structural pattern or need a template for a specific skill type |
| `references/authoring-tips.md` | Writing high-signal content, degrees of freedom, content patterns, setup, storage, hooks |
| `references/executable-code.md` | Skill includes scripts, depends on packages, or invokes MCP tools |
| `references/rules-folder-structure.md` | Building a rules-based audit/lint skill with categorized rule files |
| `references/evaluation-and-iteration.md` | Designing evaluations, testing across models, iterating on a shipped skill |
| `references/quality-checklist.md` | Final validation before shipping |

## Choose a Skill Category

Determine what type of problem the skill solves. Category informs pattern choice.

| Category | What it solves | Common pattern |
|----------|---------------|----------------|
| Library & API Reference | How to use a library/CLI/SDK correctly | Simple/hub |
| Product Verification | Test/verify with tools (Playwright, tmux) | Workflow |
| Data Fetching & Analysis | Connect to data/monitoring stacks | Workflow, Mixed |
| Business Process Automation | Automate repetitive team workflows | Workflow |
| Code Scaffolding & Templates | Generate boilerplate and project structure | Workflow |
| Code Quality & Review | Enforce code quality standards | Rules-based, Workflow |
| CI/CD & Deployment | Fetch, push, deploy code | Workflow |
| Runbooks | Symptom to investigation to structured report | Workflow, Mixed |
| Infrastructure Operations | Maintenance with guardrails | Workflow |

Load `references/skill-categories.md` for detailed guidance per category including authoring tips and examples.

## Choose a Skill Pattern

| Pattern | When to use | Example | Key files |
|---------|-------------|---------|-----------|
| Simple/hub | Dispatch to 2-5 focused files by track | `ui-design` | SKILL.md + track files |
| Workflow | Multi-step process with progressive loading | `agents-md`, `review-pr` | SKILL.md + `references/` |
| Rules-based | Audit/lint with categorized rules | `typography-audit`, `docs-writing` | SKILL.md + `rules/` |
| Mixed | Workflow with conditional references | `multi-tenant-architecture` | SKILL.md + `references/` |

Decision guide:
- Auditing or linting against a checklist: **rules-based**
- Guiding a multi-step process: **workflow**
- Dispatching to different tracks by context: **simple/hub**
- Unsure: start with **workflow** (most flexible)

Load `references/skill-patterns.md` for structural templates and skeletons of each pattern.

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

First determine the category (what problem the skill solves), then pick the structural pattern. Load `references/skill-categories.md` for category guidance and `references/skill-patterns.md` for structural templates.

### Step 2: Create directory and frontmatter

Load `references/format-specification.md` for hard constraints.

- Create `skills/<name>/SKILL.md`
- Folder name must match `name` field (kebab-case)
- `name`: max 64 chars, lowercase letters/numbers/hyphens, no "anthropic" or "claude"
- `description`: max 1024 chars, third-person voice, include "Use when..." triggers with specific keywords

### Step 3: Write SKILL.md body

- Keep under 500 lines; split into reference files if longer
- Only add context Claude does not already have (see "Don't State the Obvious" in `references/authoring-tips.md`)
- Use consistent terminology throughout
- Match degrees of freedom to task fragility — prose for open-ended work, specific scripts for fragile or destructive operations (see "Degrees of Freedom" in `references/authoring-tips.md`)
- Reach for named content patterns when they fit: template for fixed output, examples for format-sensitive output, conditional for decision points
- Include a copyable progress checklist for multi-step workflows
- Include validation/feedback loops for quality-critical tasks
- Build a Gotchas section from observed failure points — this is the highest-signal content
- Load `references/authoring-tips.md` for content strategy guidance on voice, degrees of freedom, content patterns, descriptions, and more

### Step 4: Add reference or rule files

**Workflow/mixed pattern**: add `references/` folder with focused files. Link each from SKILL.md with "Read when..." guidance in a table.

**Rules-based pattern**: add `rules/` folder. Load `references/rules-folder-structure.md` for the `_sections.md`, `_template.md`, file-naming, and priority-table layout.

**Simple/hub pattern**: add track files alongside SKILL.md. Link from a tracks table.

Key constraints:
- References must be one level deep from SKILL.md (no chains)
- Files over 100 lines need a table of contents at the top
- Files are only loaded when explicitly listed in SKILL.md

Advanced options:
- Include executable scripts in `scripts/` for Claude to compose — load `references/executable-code.md` for error handling, constants, plan-validate-execute, runtime environment, package deps, and MCP tool naming
- Add `config.json` for skills needing user-specific setup context across sessions
- Define on-demand hooks (PreToolUse/PostToolUse) for safety gates or observation

### Step 5: Validate

Load `references/quality-checklist.md` and run all applicable checks.

### Step 6: Update README.md

Add a row to the Skills table:

```markdown
| `<skill-name>` | <phase> | <one-line description> |
```

Phases used in this repo: Before coding, Project start, Design, Build, Design/dev, Writing/audit, Pre-ship, Pre-merge, Pre-launch, Architecture, Maintenance, Authoring.

### Step 7: Smoke-test

Install and confirm files appear in the target directory:

```bash
cp -R skills/<name> ~/.claude/skills/
ls ~/.claude/skills/<name>/
```

### Step 8: Evaluate and iterate

Load `references/evaluation-and-iteration.md`. Define 3+ evaluation scenarios, test on each target model, and iterate based on observed Claude behavior — not assumptions about what Claude should need.

## Anti-patterns

- Dumping full specification into SKILL.md body (use reference files)
- Creating reference-to-reference chains (keep one level deep)
- Including time-sensitive content ("before August 2025, use...")
- Restating what Claude already knows (how to write Markdown, general coding advice, standard conventions)
- Using "I audit..." or "Use this to..." voice in descriptions (use third-person)
- Adding README.md, CHANGELOG.md, or INSTALLATION_GUIDE.md to the skill folder
- Dropping files in folders without linking them from SKILL.md
- Over-constraining Claude's approach when specifying outcomes would suffice (railroading)
- Writing the description as a human summary instead of a model trigger with "Use when..." phrases and quoted user phrases
- Skipping a Gotchas section for skills with known failure modes
- Hardcoding absolute paths for persistent data instead of using `${CLAUDE_PLUGIN_DATA}`
- Storing persistent data in the skill directory itself (gets deleted on upgrade)
- Referencing MCP tools without the server prefix (`bigquery_schema` instead of `BigQuery:bigquery_schema`)
- Magic numbers in scripts with no justifying comment (voodoo constants)
- Shipping a skill without testing it on every target model — what reads well to Opus may underspecify for Haiku

## Related Skills

- `agents-md` for auditing AGENTS.md/CLAUDE.md instruction files
- `docs-writing` for documentation quality rules
