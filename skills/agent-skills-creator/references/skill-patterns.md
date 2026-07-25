# Skill Patterns

Four structural patterns. Pick one by what the skill has to do, then copy the shape of the named in-repo example rather than a generic skeleton: a real skill shows how the pattern actually holds up.

## Contents

- Picking a pattern
- Simple/hub
- Workflow
- Rules-based
- Mixed
- Cross-cutting: anti-rationalization tables

## Picking a Pattern

| Pattern | Use when | In-repo example |
|---------|----------|-----------------|
| Simple/hub | Dispatching to 2-5 focused files by track or mode | `ui-design` |
| Workflow | A multi-step process with progressive reference loading | `agents-md`, `pr-reviewer` |
| Rules-based | Auditing or linting against categorized rules | `typography-audit`, `docs-writing` |
| Mixed | Workflow steps with conditional or platform-specific references | `multi-tenant-architecture` |

Decision guide: auditing against a checklist is rules-based; guiding a process is workflow; dispatching by context is simple/hub. Unsure means workflow, the most flexible.

The problem a skill solves suggests its pattern. These are recommendations, not requirements: a runbook could be rules-based with categorized diagnostic checks.

| Problem the skill solves | Typical pattern |
|--------------------------|-----------------|
| Library, API, or CLI reference | Simple/hub or Workflow |
| Product verification with tools | Workflow |
| Data fetching and analysis | Workflow or Mixed |
| Business process automation | Workflow |
| Code scaffolding and templates | Workflow |
| Code quality and review | Rules-based or Workflow |
| CI/CD and deployment | Workflow |
| Runbooks | Workflow or Mixed |
| Infrastructure operations | Workflow |

## Simple/Hub

Dispatch to focused files by track. SKILL.md stays 20-35 lines: a tracks table and nothing else of substance.

```
skills/<name>/
  SKILL.md
  <track-1>.md
  <track-2>.md
```

Root-level track files are exclusive to this pattern; every other pattern keeps supporting files in `references/` or a rules folder.

**Comprehensive-reference variant** (canonical home for this guidance): for broad domains, the hub dispatches into a folder of small files, e.g. `design-guidelines/` with 40 files (`buttons.md`, `colors.md`, `forms.md`), each 50-200 lines, mapped from an `index.md`. One concern per file, named after it; each stands alone with no cross-file reading order; files may run to roughly 450 lines when single-topic and TOC'd. Claude loads what the task needs instead of a 2000-line reference.

## Workflow

A sequential process, 80-130 lines of SKILL.md, with references loaded per step.

```
skills/<name>/
  SKILL.md
  references/<detail>.md
```

Load-bearing parts, in the order they matter: a "Read when" table mapping each reference to its trigger condition, a copyable progress checklist, numbered steps, and a final step that produces evidence. `agents-md` is the reference implementation.

## Rules-Based

An audit or lint against categorized rules, 75-90 lines of SKILL.md.

```
skills/<name>/
  SKILL.md
  rules/
    _sections.md          (categories: prefix, impact, why it matters)
    _template.md          (per-rule schema)
    <prefix>-<slug>.md    (one per rule)
```

SKILL.md carries a priority table (category, impact, prefix, rule count) so a truncated audit still surfaces the worst findings first, plus an output contract fixing the finding format. Rule counts in the description and the table must reconcile with the folder, which `validate.sh` checks. Folder mechanics are in `rules-folder-structure.md`.

## Mixed

Workflow steps where one branch of references applies and the rest do not: platform-specific, framework-specific, or context-specific. The workflow determines context first, then loads only the matching reference. `multi-tenant-architecture` dispatches on Cloudflare versus Vercel this way.

## Cross-Cutting: Anti-Rationalization Tables

Any pattern can include one. Agents and tired engineers generate plausible reasons to skip a step; this table is the pre-written counter. Include it when steps get skipped under time pressure (specs, tests, security review).

```markdown
| Excuse | Rebuttal |
|--------|----------|
| "This task is too simple for a spec." | Acceptance criteria still apply. Five lines is fine. Zero lines is not. |
| "I'll write tests later." | There is no later. Write the failing test first. |
| "Tests pass, ship it." | Passing tests are evidence, not proof. Did you verify user-visible behavior? |
```

Place it after the workflow, before anti-patterns. Each row pairs a specific excuse with a rebuttal that redirects to the skipped step.
