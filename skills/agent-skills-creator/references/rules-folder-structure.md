# Rules Folder Structure

For rules-based skills (audits, lints, checklists), create a `rules/` folder with a section map, a rule template, and one file per rule.

## `rules/_sections.md`

Category map with impact levels. Format:

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

Template for individual rule files:

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

- Named `<prefix>-<slug>.md` where prefix matches the section ID
- One rule per file
- Each file follows the `_template.md` structure

## SKILL.md priority table

Include a table mapping categories to prefixes and rule counts:

```markdown
| Priority | Category | Impact | Prefix | Rules |
|----------|----------|--------|--------|-------|
| 1 | Category Name | CRITICAL | `prefix-` | N |
```
