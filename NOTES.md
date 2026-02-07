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

## Phase 1 Review Fixes Applied

- Fixed pass marker in SKILL.md output contract: `- pass` changed to `- ✓ pass` on line 74 and `pass` changed to `✓ pass` in the instruction on line 80, matching audit-typography pattern
- Added descriptive parentheticals to _template.md labels: `**Incorrect:**` became `**Incorrect (description of what's wrong):**` and `**Correct:**` became `**Correct (description of what's right):**`
- Added `Reference:` link placeholder to the bottom of _template.md, matching audit-typography's template structure
- REVIEW.md deleted after all three minor issues resolved; no critical issues were found
- SKILL.md remains at 81 lines after fix; _template.md grew from 22 to 24 lines — both well within limits

## Phase 2 Observations

- Created 18 CRITICAL rule files: 8 voice-* and 10 structure-* — all follow the _template.md format with YAML frontmatter (title, impact, tags), explanation paragraph, Incorrect/Correct examples with descriptive parentheticals
- All rule files use realistic documentation examples (API keys, deployment configs, CLI commands) instead of foo/bar placeholders
- Rule files range from 26-52 lines, within the 20-50 target range — structure-diataxis and structure-quick-start trend slightly longer due to multi-file code block examples
- Every voice-* rule includes a Reference link to Google developer docs, Microsoft style guide, or RFC 2119; most structure-* rules also include references except where the principle is self-evident (heading-overview, numbered-vs-bullets, one-idea-per-section)
- Markdown fenced blocks use `markdown` or `bash` language hints consistently; no HTML or CSS blocks needed for documentation-focused rules
- The voice-requirements-language rule includes two Correct examples (requirement vs. suggestion) to demonstrate the "must" vs. "we recommend" distinction — this deviates slightly from the one-incorrect-one-correct template pattern but matches the rule's two-part nature
- structure-procedures uses a nested code block inside a numbered list step, testing that renderers handle this correctly
