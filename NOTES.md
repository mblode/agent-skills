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

## Phase 1 Review Observations

- SKILL.md is actually 80 lines (not 82 as noted above), confirmed with `wc -l`
- `pass` marker in the output contract uses `- pass` but audit-typography uses `- ✓ pass` — should align for cross-skill consistency
- _template.md is missing two elements from the audit-typography template: descriptive parentheticals on Incorrect/Correct labels and the trailing `Reference:` link line — adding these would make the template more self-documenting for rule authors
- All 9 category prefixes and rule counts cross-check correctly between SKILL.md table and _sections.md
- Frontmatter passes all CLAUDE.md constraints (name 12 chars, description ~382 chars, third-person voice, no forbidden words)
- No critical issues found; Phase 1 is ready for Phase 2 rule authoring after the three minor template/format fixes
