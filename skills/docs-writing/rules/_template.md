---
title: Rule Title Here
impact: MEDIUM
tags: tag1, tag2
---

## Rule Title Here

Brief explanation of the rule and why it matters for documentation quality, readability, or discoverability.

**Incorrect (description of what's wrong):**

```markdown
Bad documentation example showing the problem.
```

**Correct (description of what's right):**

```markdown
Good documentation example showing the solution.
```

Reference: [Link to documentation or resource](https://example.com)

<!--
Conventions:
- Filename: <prefix>-<slug>.md where <prefix> matches a section in _sections.md
- impact: must match the section's impact level (CRITICAL, HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM)
- H2 title matches the frontmatter title
- The Incorrect/Correct parentheticals name the specific failure/fix, not just "bad"/"good"
- Use ````markdown fences (four backticks) when the example itself contains code fences
- Adding or removing a rule: update the count in _sections.md, the SKILL.md priority table, and the SKILL.md description
-->
