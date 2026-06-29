# Skill Patterns

Structural templates for the four skill patterns. Pick one and adapt. These cover **how** a skill is organized; for **what problem** it solves, see `skill-categories.md`.

## Contents

- Simple/hub pattern
- Workflow pattern
- Rules-based pattern
- Mixed pattern

## Simple/Hub Pattern

**When:** dispatch to 2-5 focused files by track or concern.

```
skills/<name>/
  SKILL.md          (20-35 lines)
  <track-1>.md
  <track-2>.md
```

**SKILL.md skeleton:**

```markdown
---
name: <name>
description: <what it does>. Use when <triggers>.
---

# Title

Choose the right track and follow its guidance.

## Tracks

- **Track A**: See [track-a.md](track-a.md)
- **Track B**: See [track-b.md](track-b.md)

## Related skills

- `skill-name` for related concern
```

**Example:** `ui-design` (a mode hub dispatching to root-level track files: `design-guidelines.md`, `add-dark-mode.md`, `componentize.md`, and a `direction/` folder)

**Category affinity:** Library & API Reference, Business Process & Team Automation

Root-level track files are exclusive to this pattern; other patterns keep supporting files in `references/` (or `rules/`).

**Comprehensive-reference variant (canonical home for this guidance):** for broad domains (design system, full CLI surface, style guide), the hub dispatches into a folder of small files, e.g. `design-guidelines/` with 40 files (`buttons.md`, `colors.md`, `forms.md`), each 50-200 lines, mapped from an `index.md`. One concern per file, named after it; each stands alone (no cross-file reading order); files may run to ~450 lines when single-topic and TOC'd. Claude loads only what a task needs, not a 2000-line reference.

## Workflow Pattern

**When:** multi-step sequential process with progressive reference loading.

```
skills/<name>/
  SKILL.md          (80-130 lines)
  references/
    <detail-1>.md
    <detail-2>.md
```

**SKILL.md skeleton:**

```markdown
---
name: <name>
description: <what it does>. Use when <triggers>.
---

# Title

One-line summary.

## Reference Files

| File | Read When |
|------|-----------|
| `references/<file>.md` | <condition> |

## Workflow

Copy this checklist to track progress:

[checklist]

### Step 1: ...
### Step 2: ...

## Anti-patterns
- ...

## Related skills
- ...
```

**Example:** `agents-md` (workflow SKILL dispatching to 5 references with conditional loading)

**Category affinity:** most categories: Scaffolding, CI/CD, Verification, Runbooks, Infrastructure Operations

## Rules-Based Pattern

**When:** audit or lint against categorized rules with priority levels.

```
skills/<name>/
  SKILL.md          (75-90 lines)
  rules/
    _sections.md
    _template.md
    <prefix>-<slug>.md  (one per rule)
```

**SKILL.md skeleton:**

```markdown
---
name: <name>
description: <what it does>. N rules across M categories covering A, B, C. Use when <triggers>.
---

# Title

N rules across M categories for [domain] quality.

## Audit Workflow

Copy and track this checklist during the audit:

[checklist with steps: scope, load by category, prioritize, fix, recheck]

## Rule Categories by Priority

| Priority | Category | Impact | Prefix | Rules |
|----------|----------|--------|--------|-------|
| 1 | Category Name | CRITICAL | `prefix-` | N |

## Quick Reference

Read only what is needed for the current scope:
- Category map and impact rationale: `rules/_sections.md`
- Rule-level guidance and examples: `rules/<prefix>-*.md`

Each rule file contains:
- Why the rule matters
- Incorrect example
- Correct example

## Review Output Contract

Report findings in this format:

[finding format template with severity, rule ID, issue, fix]
```

**Example:** `typography-audit` (90 rules in 10 categories)

**Category affinity:** Code Quality & Review

## Mixed Pattern

**When:** workflow steps with conditional or platform-specific references.

```
skills/<name>/
  SKILL.md          (50-105 lines)
  references/
    <context-1>.md
    <context-2>.md
```

**SKILL.md skeleton:**

```markdown
---
name: <name>
description: <what it does>. Use when <triggers>.
---

# Title

## Workflow

1. Determine context
2. If context A, load [references/a.md](references/a.md)
3. If context B, load [references/b.md](references/b.md)
4. Execute based on loaded reference
5. Validate output

## References

Load only the reference matching your context:
- **Context A**: [references/a.md](references/a.md)
- **Context B**: [references/b.md](references/b.md)
```

**Example:** `multi-tenant-architecture` (workflow with 5 platform-specific references loaded by context)

**Category affinity:** Data Fetching & Analysis, Runbooks, Infrastructure Operations

## Cross-Cutting: Anti-Rationalization Tables

Any pattern can include an anti-rationalization table: pre-written rebuttals to excuses for skipping the workflow. Agents (and tired engineers) generate plausible justifications; this table is the counter.

**When to include:** steps get skipped under time pressure (specs, tests, security review, code review).

**Format:**

```markdown
## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "This task is too simple for a spec." | Acceptance criteria still apply. Five lines is fine. Zero lines is not. |
| "I'll write tests later." | There is no later. Write the failing test first. |
| "Tests pass, ship it." | Passing tests are evidence, not proof. Did you verify user-visible behavior? |
```

Place it after the workflow section, before anti-patterns. Each row: a specific excuse plus a rebuttal redirecting to the skipped step.
