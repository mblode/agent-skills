# Phase 5 Review

Review of 17 rule files: 6 scan-*, 6 hygiene-*, 5 review-*.

## Rule Count Verification

SKILL.md claims 57 rules. Actual rule files (excluding _sections.md and _template.md): **58**.

Breakdown by prefix:
| Prefix | SKILL.md claims | Actual |
|--------|----------------|--------|
| voice | 4 | 4 |
| structure | 10 | 10 |
| clarity | 6 | 6 |
| code | 7 | 7 |
| format | 8 | 8 |
| nav | 6 | 6 |
| scan | 6 | 6 |
| hygiene | 6 | 6 |
| review | 5 | 5 |
| **Total** | **57** | **58** |

**No discrepancy.** SKILL.md already says 58 (fixed in Phase 6). The per-category counts all match (4+10+6+7+8+6+6+6+5 = 58). The NOTES.md Phase 5 Observations entry still contains the stale claim "57 existing + 17 new = 74 rules" but the Phase 6 Observations entry already corrects this to 58.

## 1. Token Justification

### Rules that add value Claude does not already have

| Rule | Justification |
|------|---------------|
| scan-three-column-api | Specific layout convention (nav/description/code columns) for API reference; not a general writing principle |
| scan-descriptive-headings | Overlaps heavily with nav-searchable-headings (see Overlap section) |
| hygiene-docs-directory | Project-specific policy: all docs in docs/, READMEs as exception |
| hygiene-no-temporal | Project policy: ban status reports and dated plans from docs |
| hygiene-delete-outdated | Operational standard: delete rather than annotate stale docs |
| hygiene-experimental-label | Specific callout format for experimental/preview features |
| hygiene-retcon-label | Specific [PLANNED] marker convention for document-driven development |
| hygiene-update-metadata | Policy: include last_updated or applies_to frontmatter |
| review-readability-score | Specific threshold: Flesch-Kincaid grade 8-10 |
| review-verify-links | Specific tool recommendation (markdown-link-check) and CI integration advice |

### Rules that are generic writing advice Claude already follows

| Rule | Issue |
|------|-------|
| scan-front-load | "Put the most important information first" is the inverted pyramid / BLUF principle. Already covered by structure-bluf ("Start with the bottom line"). The scan-front-load rule applies the same idea at the sentence and section level, but structure-bluf already says "State the problem and the outcome in the opening paragraph." This is a **significant overlap**. |
| scan-white-space | "Use white space to separate logical groups" and "keep paragraphs short" -- already covered in clarity-defaults checklist item "Short paragraphs -- max 4 sentences per paragraph." The white-space grouping angle adds slight value but is mostly common formatting sense. |
| scan-vary-sentence-length | "Mix short and long sentences for rhythm" is generic writing advice. Claude already varies sentence length naturally. No specific threshold or project convention is codified. |
| scan-visual-aids | "Replace text with diagrams and tables when possible" is standard writing guidance. The specific diagram-for-flows, table-for-comparisons breakdown is useful but borders on advice Claude already follows. |
| review-reader-test | "Test docs with a fresh reader" is process advice, not a writing rule Claude can apply. Claude cannot summon a fresh reader. |
| review-edit-ruthlessly | "Read aloud, cut redundancies, check logic gaps" -- this is the most generic of all 17 rules. Claude already edits for conciseness. The "20% word reduction" target is the only specific element. |
| review-accuracy-check | "Verify docs match the current implementation" is fundamental QA advice. Claude already checks code examples against implementations when it has access. |

**Summary:** 7 of 17 rules are generic advice or process guidance. 10 of 17 add operational specificity Claude cannot infer.

## 2. Conciseness

All 17 files are within the 20-40 line target:
- Range: 26-39 lines
- Shortest: scan-vary-sentence-length (26 lines)
- Longest: scan-three-column-api (39 lines)
- All explanations are 1-2 sentences

This is the tightest line range of any phase. No trimming needed.

## 3. Example Quality

- **Good examples:** hygiene-no-temporal (Q3 2025 migration status vs. evergreen version), hygiene-retcon-label ([PLANNED] marker with tracking link), review-readability-score (grade 16 vs. grade 9 contrast), scan-three-column-api (inline code blocks vs. two-column table).
- **Weak example:** scan-visual-aids Correct example uses a text arrow diagram (`Client -> API Gateway -> Backend Service -> Database`) which is barely more visual than prose. A Mermaid diagram or an actual table would demonstrate the principle better.
- **Shared scenario concern:** hygiene-experimental-label and hygiene-retcon-label use the same "Batch processing endpoint" scenario with the same Incorrect example text. This was noted in NOTES.md Phase 5 Observations as intentional (different angles), but it creates a sense of redundancy when reading both rules. Different scenarios would make each rule more distinct.

## 4. Format Compliance

All 17 files match _template.md:
- [x] YAML frontmatter with title, impact, tags
- [x] H2 heading matching title
- [x] 1-2 sentence explanation
- [x] Incorrect example with descriptive parenthetical
- [x] Correct example with descriptive parenthetical
- [x] Reference link to authoritative source

No format issues found.

## 5. Overlap with Prior Phases

### Critical overlaps

1. **scan-descriptive-headings vs. nav-searchable-headings**: These two rules are nearly identical. Both ban generic headings ("Overview," "More info," "Common issues"). Both prescribe specific, descriptive alternatives. The only difference is the frame: scan- focuses on "readers scan headings" while nav- focuses on "readers search for headings." The Incorrect examples overlap (both list "Overview" and "More info" as bad headings). **Recommend merge or removal of one.**

2. **scan-front-load vs. structure-bluf**: Both codify the inverted pyramid. structure-bluf says "State the problem and the outcome in the opening paragraph. Save backstory for later." scan-front-load says "Lead sentences with key information. Push caveats to the end." The scan- rule operates at the sentence level while structure-bluf operates at the document level, but the principle and the examples are the same pattern. **Recommend merging scan-front-load into structure-bluf as a sentence-level addendum**, or demoting scan-front-load to a cross-reference.

3. **scan-white-space vs. clarity-defaults "Short paragraphs"**: The clarity-defaults checklist already says "max 4 sentences per paragraph." scan-white-space says "3-5 sentences maximum" and adds "blank lines between conceptual groups." The paragraph-length overlap is direct. The conceptual-grouping angle is the only net-new content.

### Minor overlaps

4. **review-edit-ruthlessly vs. clarity-defaults "Cut filler"**: clarity-defaults already bans filler words. review-edit-ruthlessly adds a process layer ("read aloud," "aim to remove 20%") but the Incorrect/Correct example is essentially a filler-cutting transformation.

## 6. Merge Candidates

### Recommend merging into defaults files

The following 4 rules are generic writing/review advice that Claude already follows. They should be merged into a **scan-defaults.md** and a **review-defaults.md** checklist, following the voice-defaults.md and clarity-defaults.md pattern from Phases 2 and 3:

**scan-defaults.md** (merge targets):
- scan-front-load (overlaps structure-bluf; the sentence-level angle is a one-liner)
- scan-white-space (overlaps clarity-defaults "short paragraphs"; the grouping angle is a one-liner)
- scan-vary-sentence-length (generic rhythm advice with no specific threshold)
- scan-visual-aids (generic "use diagrams" advice)

This would reduce scan from 6 standalone rules to 3: scan-defaults, scan-descriptive-headings, scan-three-column-api.

**review-defaults.md** (merge targets):
- review-reader-test (process advice Claude cannot directly execute)
- review-edit-ruthlessly (generic editing advice, overlaps clarity-defaults)
- review-accuracy-check (fundamental QA Claude already does)

This would reduce review from 5 standalone rules to 3: review-defaults, review-verify-links, review-readability-score.

### Recommend removing or merging across categories

- **scan-descriptive-headings**: Should be removed or merged into nav-searchable-headings. The two rules address the same problem from the same angle with overlapping examples. If kept, add a cross-reference to nav-searchable-headings and differentiate the examples.

### Net effect of recommended merges

| Category | Before | After |
|----------|--------|-------|
| scan | 6 | 3 (scan-defaults, scan-descriptive-headings or removed, scan-three-column-api) |
| hygiene | 6 | 6 (no changes) |
| review | 5 | 3 (review-defaults, review-verify-links, review-readability-score) |
| **Total rules** | 58 | 53 (or 52 if scan-descriptive-headings is merged into nav-searchable-headings) |

## Summary of Findings

| Criterion | Result |
|-----------|--------|
| Rule count discrepancy | SKILL.md says 57; actual is 58. Table rows are correct but totals text is stale. |
| Token justification | 10 of 17 rules pass; 7 are generic advice or process guidance |
| Conciseness | All files 26-39 lines. No trimming needed. |
| Example quality | Mostly strong. scan-visual-aids Correct example is weak. hygiene-experimental-label and hygiene-retcon-label share the same Incorrect scenario. |
| Format compliance | All 17 pass. |
| Overlap | 3 critical overlaps (scan-descriptive-headings/nav-searchable-headings, scan-front-load/structure-bluf, scan-white-space/clarity-defaults) |
| Merge candidates | 7 rules into 2 defaults files; 1 cross-category merge |

## Blocking Issues

1. **SKILL.md total**: Already fixed to 58 in Phase 6. No action needed.
2. **Resolve scan-descriptive-headings / nav-searchable-headings overlap**: These are near-duplicates.

## Non-Blocking Improvements

3. Replace scan-visual-aids Correct example with a Mermaid diagram or actual markdown table.
4. Give hygiene-experimental-label and hygiene-retcon-label different Incorrect example scenarios.
5. Apply the defaults-checklist merge pattern (scan-defaults.md, review-defaults.md) as done in Phases 2 and 3.
