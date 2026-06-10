# Skill Patterns

Structural templates for the four skill patterns. Pick one and adapt.

These patterns describe **how** a skill is organized. For **what type of problem** a skill solves, see `skill-categories.md`.

## Contents

- Simple/hub pattern
- Workflow pattern
- Rules-based pattern
- Mixed pattern

## Simple/Hub Pattern

**When:** Dispatch to 2-5 focused files by track or concern.

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

**Example:** `ui-design` (24 lines, dispatches to product-ui.md and marketing-ui.md)

**Category affinity:** Library & API Reference, Business Process Automation

Root-level track files are exclusive to this pattern; in every other pattern, supporting files live in `references/` (or `rules/`).

**Comprehensive-reference variant:** for broad domains (a design system, a full CLI surface), the hub dispatches into a folder of many small focused files, e.g. a `design-guidelines/` folder with 40 files like `buttons.md`, `colors.md`, `forms.md`, each 50-200 lines, mapped from an `index.md`. Claude loads exactly the files a task needs. See "Comprehensive Reference Folders" in `authoring-tips.md`.

## Workflow Pattern

**When:** Multi-step sequential process with progressive reference loading.

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

**Example:** `agents-md` (120 lines, 5 references with conditional loading)

**Category affinity:** Most categories use this pattern: Scaffolding, CI/CD, Verification, Runbooks, Infrastructure Operations

## Rules-Based Pattern

**When:** Audit or lint against categorized rules with priority levels.

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

**When:** Workflow steps with conditional or platform-specific references.

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

**Example:** `multi-tenant-architecture` (103 lines, 5 platform-specific references)

**Category affinity:** Data Fetching & Analysis, Runbooks, Infrastructure Operations

## Cross-Cutting: Anti-Rationalization Tables

Any pattern above can include an anti-rationalization table: pre-written rebuttals to common excuses for skipping the workflow. Agents (and tired engineers) will produce plausible-sounding justifications for skipping steps. Anti-rationalization tables are the counter.

**When to include:** Skills where steps are frequently skipped under time pressure (specs, tests, security review, code review).

**Format:**

```markdown
## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "This task is too simple for a spec." | Acceptance criteria still apply. Five lines is fine. Zero lines is not. |
| "I'll write tests later." | There is no later. Write the failing test first. |
| "Tests pass, ship it." | Passing tests are evidence, not proof. Did you verify user-visible behavior? |
```

Place the table after the workflow section but before anti-patterns. Each row should be a specific excuse the agent might generate, paired with a concrete rebuttal that redirects to the workflow step being skipped.
