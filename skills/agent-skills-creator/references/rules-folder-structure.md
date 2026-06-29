# Rules Folder Structure

For rules-based skills (audits, lints, checklists), create a `rules/` folder: a section map, a rule template, one file per rule.

## `rules/_sections.md`

Category map with impact levels:

```markdown
# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Category Name (prefix)

**Impact:** CRITICAL | HIGH | MEDIUM-HIGH | MEDIUM | LOW-MEDIUM
**Description:** One sentence explaining why this category matters.
```

## `rules/_template.md`

Per-rule file template:

```markdown
---
title: Rule Title Here
impact: MEDIUM
tags: tag1, tag2
---

## Rule Title Here

Brief explanation of the rule and why it matters.

**Incorrect (description of what's wrong):**

[code block with bad example]

**Correct (description of what's right):**

[code block with good example]
```

## Individual rule files

- Named `<prefix>-<slug>.md`; prefix matches the section ID
- One rule per file
- Each follows `_template.md`

## Tier-based audit variant

Audit skills may use a richer rule schema when `SKILL.md` explains it and `_sections.md` reconciles counts and categories. Common fields: `defaultTier`, `category`, `surfaces`, plus rule-specific override fields. Do not force `title`/`impact`/`tags` onto these skills if their template and dispatch instructions document the alternate schema.

## SKILL.md priority table

Map categories to prefixes and rule counts:

```markdown
| Priority | Category | Impact | Prefix | Rules |
|----------|----------|--------|--------|-------|
| 1 | Category Name | CRITICAL | `prefix-` | N |
```

## Large rule sets

At 30+ rules, maintenance shifts from writing rules to keeping the set consistent:

- Every rule has frontmatter that follows the documented schema, plus the example or detection structure required by that schema
- Every filename prefix matches a `_sections.md` section
- Rule counts reconcile everywhere (description, priority table, prose): `ls rules/ | grep -v '^_' | wc -l`

## Multi-layer variant

A skill may carry more than one rules folder (e.g. a stable `rules/` plus a newer `rules-modern/`) **only when** SKILL.md dispatches to each layer with its own loading condition. Otherwise consolidate into a single `rules/` folder.
