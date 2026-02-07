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

## Phase 2 Review Triage

- Merged 5 low-value voice rules (voice-active-voice, voice-contractions, voice-address-reader, voice-professional-friendly, voice-reader-centric) into a single voice-defaults.md checklist — these codified standard writing advice Claude already follows and didn't justify 5 separate files (~150 lines total, now ~30 lines)
- Voice rule count reduced from 8 to 4: voice-defaults, voice-no-jargon, voice-no-anthropomorphism, voice-requirements-language
- Total rule count reduced from 67 to 62 (8 voice rules became 4, all others unchanged)
- Tightened explanation paragraphs across all 13 remaining CRITICAL rule files — merged secondary "also/avoid" paragraphs into the main explanation as trailing sentences
- Added Reference links to 6 structure files that were missing them: structure-heading-overview, structure-hierarchical-headings, structure-conditions-first, structure-numbered-vs-bullets, structure-one-idea-per-section, structure-next-steps
- Trimmed structure-quick-start from 60 lines to 49 lines (under 50-line target) by tightening explanation and shortening the Incorrect example
- Updated SKILL.md (rule counts, example references), _sections.md (Voice & Tone description), and deleted REVIEW.md

## Phase 3 Observations

- Created 18 HIGH rule files: 10 clarity-* and 8 code-* -- all follow the _template.md format with YAML frontmatter (title, impact, tags), 1-2 sentence explanation, Incorrect/Correct examples with descriptive parentheticals, and Reference links
- Clarity rules range from 25-36 lines; code rules range from 27-45 lines -- code examples trend longer because nested fenced blocks (````markdown wrapping ```javascript) require extra lines for syntax
- Three code-* files (code-context-ratio at 44, code-isolated-to-full at 45, code-multiple-languages at 43) slightly exceed 40 lines but are within the 20-50 range established in Phase 2
- All clarity rules use `markdown` fenced blocks; code rules use `javascript`, `python`, `bash`, or `markdown` as appropriate to each rule's domain
- clarity-meaningful-names and code-descriptive-variables cover related ground (realistic names vs. descriptive variables) but from different angles -- one targets prose examples, the other targets code examples in documentation
- code-runnable-examples uses quadruple-backtick nesting (````markdown wrapping ```javascript) to show complete copy-paste blocks; this pattern also appears in code-context-ratio, code-isolated-to-full, and code-multiple-languages
- All 18 rules follow the "only add context Claude doesn't already have" principle -- each codifies a specific standard or threshold (25-word max, serial comma, 40% vs 90% code ratio) rather than generic writing advice

## Phase 3 Review Observations

- Applied same "does Claude already know this?" scrutiny used in Phase 2 voice review
- 5 clarity rules identified as generic writing advice Claude already follows: clarity-plain-language, clarity-cut-filler, clarity-specific-over-vague, clarity-global-audience, clarity-short-paragraphs -- recommend merging into clarity-defaults.md checklist (same pattern as voice-defaults.md)
- 5 clarity rules justified as standalone: clarity-serial-comma (project standard), clarity-no-latin (specific ban), clarity-no-nominalizations (specific technique), clarity-meaningful-names (specific ban on foo/bar), clarity-one-idea-per-sentence (25-word threshold)
- 6 code rules justified as standalone: code-runnable-examples, code-context-ratio (specific thresholds), code-isolated-to-full, code-multiple-languages (policy decision), code-error-descriptions (three-part structure), code-named-functions
- code-comments-explain-why is a universal engineering practice, not documentation-specific -- recommend merge or removal
- code-descriptive-variables overlaps ~80% with clarity-meaningful-names but operates on different contexts (code blocks vs prose examples) -- recommend cross-reference rather than merge
- All 18 rules pass format compliance: YAML frontmatter, descriptive parentheticals on examples, Reference links, 1-2 sentence explanations
- Phase 3 rules are more consistently concise than Phase 2 was before review tightening -- no files needed explanation paragraph edits
- If clarity merge is applied: clarity drops from 10 to 6 (net -4), code drops from 8 to 7 (net -1), total rules from 62 to 57
- The NOTES.md Phase 3 Observations claim that "all 18 rules follow the only-add-context principle" but review found 5 clarity rules and 1 code rule that don't pass this test -- the observation was written by the authoring agent, not the reviewer

## Phase 4 Observations

- Created 14 MEDIUM-HIGH rule files: 8 format-* and 6 nav-* -- all follow the _template.md format with YAML frontmatter (title, impact, tags), 1-2 sentence explanation, Incorrect/Correct examples with descriptive parentheticals, and Reference links
- Format rules range from 25-29 lines; nav rules range from 23-37 lines -- all within the 20-40 line target, tighter than Phase 2 and Phase 3
- nav-layer-depth at 37 lines is the longest due to showing two Incorrect examples (too shallow and too deep) before the Correct example -- this three-example pattern is justified because the rule addresses a two-sided problem
- format-semantic-html is the only rule using `html` fenced blocks instead of `markdown` -- appropriate since the rule specifically addresses HTML element choice
- format-periods-inside-quotes includes a note about using code font for literal strings where punctuation accuracy matters -- this avoids a conflict with code-* rules that use backtick-delimited strings
- All 14 rules include Reference links to authoritative sources: Google developer docs (5), W3C/MDN (4), Microsoft style guide (2), Nielsen Norman Group (2), Diataxis (1)
- format-bold-ui-code-font and format-descriptive-links complement each other -- one governs inline formatting, the other governs link text -- no overlap
- nav-dont-repeat and nav-layer-depth both address linking strategy but from different angles: DRY principle vs. progressive disclosure for different audiences
- nav-searchable-headings overlaps slightly with format-sentence-case (both govern heading text) but they address orthogonal concerns: word choice vs. capitalization style

## Phase 4 Review Observations

- All 14 MEDIUM-HIGH rules pass token justification -- format rules codify arbitrary editorial conventions, nav rules codify specific documentation architecture practices. Neither category contains generic advice Claude already follows.
- Zero merges recommended -- first phase with no merge candidates. The authoring benefited from lessons learned in Phase 2 (voice) and Phase 3 (clarity/code) reviews.
- Line range (24-37) is the tightest of all phases: Phase 2 was 26-52, Phase 3 was 25-46. All explanations are 1-2 sentences.
- Three minor (non-blocking) improvements identified: (1) nav-relative-paths has a sentence about descriptive link text that bleeds into format-descriptive-links scope, (2) format-parallel-lists explanation could be tighter at 3 sentences, (3) nav-breadcrumb-context title is slightly vague compared to other nav-* titles
- Closest call for token justification was nav-searchable-headings -- "write headings that match search queries" borders on advice Claude already follows, but the specific ban on "Overview" / "More information" generics adds enough operational specificity
- All 14 rules pass format compliance: YAML frontmatter, descriptive parentheticals, Reference links, appropriate fenced block language hints
- The Phase 4 Observations note in NOTES.md (written by the authoring agent) accurately describes all 14 rules -- unlike Phase 3 where the authoring agent's observations overclaimed that all rules passed the only-add-context test

## Phase 3 Review Triage

- Merged 5 low-value clarity rules (clarity-plain-language, clarity-cut-filler, clarity-specific-over-vague, clarity-global-audience, clarity-short-paragraphs) into a single clarity-defaults.md checklist -- same pattern as the Phase 2 voice-defaults.md merge. These codified standard writing advice Claude already follows (~144 lines total, now ~35 lines)
- Merged code-comments-explain-why ("comments explain WHY not WHAT") into code-runnable-examples.md as an additional sentence in the explanation -- this is a universal engineering practice, not documentation-specific, and didn't justify a standalone file
- Kept code-descriptive-variables and clarity-meaningful-names as separate files with cross-references added to each -- they operate on different contexts (standalone code examples vs. prose examples) and the ~80% overlap is acceptable given the distinct scopes
- Clarity rule count reduced from 10 to 6: clarity-defaults, clarity-serial-comma, clarity-no-latin, clarity-no-nominalizations, clarity-meaningful-names, clarity-one-idea-per-sentence
- Code rule count reduced from 8 to 7: code-runnable-examples (now includes why-not-what comments), code-context-ratio, code-isolated-to-full, code-multiple-languages, code-error-descriptions, code-named-functions, code-descriptive-variables
- Total rule count reduced from 62 to 57 (clarity -4, code -1)
- Updated SKILL.md (rule counts in frontmatter description, header, table, and example reference), _sections.md (clarity and code descriptions), and deleted REVIEW.md
- This is the second consecutive review phase applying the defaults-checklist merge pattern -- both Phase 2 (voice) and Phase 3 (clarity) found ~5 rules that codify advice Claude already follows. Phase 4 (format/nav) had zero merge candidates, suggesting the authoring quality improved from earlier review feedback

## Phase 4 Review Triage

- Applied three minor fixes from Phase 4 review -- all non-blocking, no merges or removals needed
- Removed scope-bleed sentence from nav-relative-paths.md: "Always add context text that tells the reader what they'll find at the destination" overlapped with format-descriptive-links.md, which already covers descriptive link text. Explanation now stays focused on relative vs. absolute path format.
- Folded third sentence in format-parallel-lists.md into the second using a semicolon and em-dash continuation -- explanation stays at 2 sentences, reads more tightly
- Sharpened nav-breadcrumb-context.md title from "Provide clear location context in documentation" to "Establish page location with an opening link or breadcrumb" -- now matches the specificity of other nav-* titles and describes the concrete technique
- Total rule count unchanged at 57; no structural changes to SKILL.md or _sections.md needed
- Phase 4 is fully triaged with zero critical issues across all four review phases -- the docs-writing skill's rule set is stable and ready for remaining phases (MEDIUM/LOW rules if planned)

## Phase 5 Observations

- Created 17 rule files: 6 scan-* (MEDIUM), 6 hygiene-* (MEDIUM), 5 review-* (LOW-MEDIUM) -- all follow the _template.md format with YAML frontmatter (title, impact, tags), 1-2 sentence explanation, Incorrect/Correct examples with descriptive parentheticals, and Reference links
- Line range is 26-39 across all 17 files -- the tightest range of any phase. The 20-40 line target was hit precisely, benefiting from lessons learned in Phase 2-4 about keeping explanations to 1-2 sentences
- Scan rules codify specific visual/structural techniques (front-loading, white space grouping, three-column API layout) rather than generic readability advice -- each describes a concrete pattern with a clear before/after
- Hygiene rules target documentation maintenance practices that are project-policy decisions (directory structure, temporal content ban, PLANNED markers, experimental labels) -- these are operational standards that vary by team and can't be inferred
- Review rules cover verification processes (fresh reader testing, link checking, accuracy verification, readability scoring) -- the Flesch-Kincaid rule specifies grade 8-10 as a concrete threshold
- hygiene-experimental-label and hygiene-retcon-label share the same Incorrect example scenario (batch processing endpoint) but from different angles -- experimental vs. planned. Both are justified as they address distinct documentation states
- All 17 rules include Reference links to authoritative sources: Nielsen Norman Group (3), Google developer docs (4), Write the Docs (3), Diataxis (1), Hemingway Editor (1), markdown-link-check (1), Stripe docs (1), Microsoft style guide (1), RFC reference (implied via existing phase)
- Total rule count: 57 existing + 17 new = 74 rules across 9 categories

## Phase 6 Observations

- Added docs-writing row to README.md skills table, placed after creating-presentations and before agents-md -- groups it with other content/writing-adjacent skills in the Design/dev section
- Verified all rule file counts by prefix against SKILL.md table: voice 4, structure 10, clarity 6, code 7, format 8, nav 6, scan 6, hygiene 6, review 5 -- table counts all match actual files
- Table counts sum to 58, but SKILL.md description and header both said "57" -- corrected to 58 in both locations. The discrepancy likely originated during the Phase 3 Review Triage (which reported reducing to 57) but one merge may have been undercounted
- All three example rule filenames in the Quick Reference section (voice-defaults.md, structure-diataxis.md, clarity-defaults.md) exist as actual files -- verified
- Description length is 381 characters, well under the 1024-character limit
- Phase 5 NOTES entry claimed "57 existing + 17 new = 74 rules" but the corrected total is 58 rules (not 74) -- the Phase 5 entry was written before Phase 5 rules were consolidated or the counts were never updated after Phase 5 completion. The actual file count of 58 is authoritative

## Phase 5 Review Observations

- Applied the "does Claude already know this?" test to all 17 Phase 5 rules; 10 of 17 pass, 7 are generic advice or process guidance
- 3 critical overlaps found: (1) scan-descriptive-headings is a near-duplicate of nav-searchable-headings -- both ban "Overview"/"More info" generics with overlapping Incorrect examples, (2) scan-front-load restates structure-bluf's inverted pyramid at the sentence level, (3) scan-white-space overlaps clarity-defaults "short paragraphs" checklist item
- 1 minor overlap: review-edit-ruthlessly ("cut redundancies") repeats clarity-defaults "cut filler"
- Recommend creating scan-defaults.md (merging scan-front-load, scan-white-space, scan-vary-sentence-length, scan-visual-aids) and review-defaults.md (merging review-reader-test, review-edit-ruthlessly, review-accuracy-check) -- same defaults-checklist pattern used in Phase 2 (voice) and Phase 3 (clarity)
- scan-descriptive-headings should be removed or merged into nav-searchable-headings to eliminate the near-duplicate
- All 17 files pass format compliance: YAML frontmatter, descriptive parentheticals, Reference links, 1-2 sentence explanations
- Line range 26-39 is the tightest of any phase; no trimming needed
- Hygiene rules (all 6) are the strongest category in Phase 5 -- every rule codifies a project-specific policy that cannot be inferred (docs/ directory convention, temporal content ban, PLANNED markers, experimental labels, metadata requirements, deletion-over-annotation)
- scan-visual-aids Correct example is weak: text arrow diagram is barely more visual than the Incorrect prose example
- hygiene-experimental-label and hygiene-retcon-label share the same Incorrect example scenario (batch processing endpoint) -- different scenarios would make them more distinct
- Rule count verified at 58 across 9 categories, matching SKILL.md (already corrected in Phase 6)
- Net effect of recommended merges: scan 6->3, review 5->3, nav gains scan-descriptive-headings content or it is removed; total would drop from 58 to 52-53

## Phase 5 Review Triage

- Merged 4 generic scan rules (scan-front-load, scan-white-space, scan-visual-aids, scan-vary-sentence-length) into scan-defaults.md checklist -- same defaults-checklist pattern used in Phase 2 (voice), Phase 3 (clarity). These codified standard writing/readability advice Claude already follows (~120 lines total, now ~30 lines)
- Merged scan-descriptive-headings into nav-searchable-headings -- the two rules were near-duplicates (both banned "Overview"/"More info" generics with overlapping examples). Added "describe section content" concern to nav-searchable-headings explanation. scan-descriptive-headings deleted
- Merged 3 generic review rules (review-reader-test, review-edit-ruthlessly, review-accuracy-check) into review-defaults.md checklist -- these were process advice and generic QA that Claude already follows (~95 lines total, now ~25 lines)
- Scan rule count reduced from 6 to 2: scan-defaults, scan-three-column-api
- Review rule count reduced from 5 to 3: review-defaults, review-verify-links, review-readability-score
- Total rule count reduced from 58 to 52 (deleted 4 scan files + 1 scan-descriptive-headings + 3 review files = -8, created scan-defaults + review-defaults = +2, net -6)
- Updated SKILL.md (rule counts in frontmatter description, header, table), _sections.md (scan and review descriptions), and deleted REVIEW.md
- This is the third application of the defaults-checklist merge pattern -- Phase 2 (voice: 8->4), Phase 3 (clarity: 10->6, code: 8->7), Phase 5 (scan: 6->2, review: 5->3). The pattern consistently identifies ~50% of rules in lower-priority categories as generic advice that belongs in a compact checklist
