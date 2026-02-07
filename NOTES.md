# Implementation Notes

Cross-agent notes for the docs-writing skill implementation. Read before starting work. Append observations.

## Key Patterns to Follow

- Follow `audit-typography` pattern exactly for SKILL.md structure
- Each rule file: YAML frontmatter (title, impact, tags) + explanation + incorrect/correct examples
- Rule files should be ~20-50 lines each, concise and actionable
- Use realistic documentation examples (not foo/bar)
- Forward slashes only in file paths
- Sentence case for headings in rule files

## Phase 1 Observations

- SKILL.md landed at 82 lines, just over the ~80 target — the review output contract example adds a few lines but keeps the pattern consistent with audit-typography
- _template.md uses markdown fenced blocks instead of CSS since this skill targets documentation files
- _sections.md descriptions are self-contained summaries that double as rationale for each category's impact level — useful for progressive loading decisions
- The checklist adds a "determine doc type and audience" step (Step 1) that doesn't exist in audit-typography; this reflects that docs-writing needs an up-front framing decision before rules can be selected
