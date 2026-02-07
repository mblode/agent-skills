# Phase 2 Review: CRITICAL Rules

## Summary

The 18 CRITICAL rule files are well-structured, consistently formatted, and use realistic documentation examples. The quality bar is generally high. However, applying the Anthropic principle -- "only add context Claude doesn't already have" -- reveals that roughly a third of these rules codify standard writing advice Claude already follows by default. Several files could be tightened significantly, and a few overlap enough to consider merging.

Compared to the benchmark (`punct-smart-quotes.md`, 43 lines), the docs-writing rules are in a similar range (26-52 lines) but several spend too many tokens on explanations that restate the rule title. The best rules here are the ones that make a *specific, non-obvious choice* (e.g., "must" not "should," Diataxis one-type-per-file). The weakest are generic writing advice Claude already internalizes (active voice, contractions).

**Overall verdict:** 5 rules are strong and justify their tokens. 8 are adequate but verbose. 5 are questionable -- they tell Claude things it already knows and could be condensed to 2-3 lines each or folded into a "voice basics" summary file.

## Conciseness Audit

### Rules that tell Claude things it already knows (low token justification)

| File | Issue |
|------|-------|
| `voice-active-voice.md` | Claude already defaults to active voice. The explanation paragraph restates basic grammar. |
| `voice-contractions.md` | Claude already uses contractions in informal/docs contexts. This is standard LLM behavior. |
| `voice-address-reader.md` | Claude already uses second person in documentation. The "one sounds academic" explanation is unnecessary. |
| `voice-professional-friendly.md` | Claude already avoids marketing hype in documentation. The examples are good but the explanation is generic. |
| `structure-hierarchical-headings.md` | Sequential heading levels is basic Markdown knowledge. Claude already does this. |

### Rules that are strong and justify their tokens

| File | Why it works |
|------|-------------|
| `voice-requirements-language.md` | Makes a *specific choice* ("must" not "should," "we recommend" not "please"). Non-obvious. |
| `voice-no-anthropomorphism.md` | The verb list (returns, sends, rejects vs. thinks, wants, knows) is actionable and specific. |
| `structure-diataxis.md` | Codifies a specific framework decision. Claude knows Diataxis but wouldn't default to one-type-per-file without instruction. |
| `structure-conditions-first.md` | Non-obvious ordering rule with clear before/after. |
| `structure-bluf.md` | The BLUF principle is specific enough to justify inclusion, though the explanation could be shorter. |

## Issues Found

### Critical

1. **Five rules have low token justification.** `voice-active-voice`, `voice-contractions`, `voice-address-reader`, `voice-professional-friendly`, and `structure-hierarchical-headings` all describe standard writing practices Claude already follows. Options:
   - **Preferred:** Merge all five into a single `voice-basics.md` file with a checklist (5-10 lines total instead of ~150 lines across 5 files). Keep only the examples that demonstrate a *non-obvious choice*.
   - **Alternative:** Cut each explanation paragraph to one sentence and remove the "why it matters" framing. Keep just the incorrect/correct examples.

2. **Overlap between `voice-reader-centric` and `voice-professional-friendly`.** Both address the same core issue: don't write marketing copy, focus on the reader. The reader-centric file says "write about what the reader can accomplish." The professional-friendly file says "replace subjective claims with measurable facts." These are two sides of the same coin. Merge into one rule.

3. **Overlap between `voice-address-reader` and `voice-reader-centric`.** "Address the reader as you" and "focus on reader needs" overlap significantly. The address-reader file is about pronouns; the reader-centric file is about framing. But the correct examples are almost interchangeable. Consider whether both are needed.

4. **All 18 rules are marked CRITICAL.** If everything is critical, nothing is. The `_sections.md` file presumably assigns CRITICAL to the voice and structure categories as a whole, but within those categories, some rules matter more than others. `voice-requirements-language` (ambiguous "should" causes real bugs) is more critical than `voice-contractions` (stylistic preference). Consider a secondary ranking or dropping the per-file impact field since it's inherited from the category.

### Minor

1. **Missing Reference links on 4 files.** The template includes a `Reference:` line, but these files omit it:
   - `structure-heading-overview.md` -- no Reference line
   - `structure-hierarchical-headings.md` -- no Reference line
   - `structure-numbered-vs-bullets.md` -- no Reference line
   - `structure-one-idea-per-section.md` -- no Reference line
   - `structure-conditions-first.md` -- no Reference line
   - `structure-next-steps.md` -- no Reference line

   The Phase 2 notes say "most structure-* rules also include references except where the principle is self-evident" but the template has it as a standard element. Either drop Reference from the template or add it consistently.

2. **Explanation paragraphs are often two paragraphs when one would suffice.** Most rules have a main explanation paragraph plus a secondary "also/avoid" paragraph. Compare to `punct-smart-quotes.md` which packs its guidance into two tight paragraphs covering both the rule AND practical implementation (UTF-8, build pipeline). Many docs-writing rules use their second paragraph for a caveat that could be a single trailing sentence.

3. **`voice-professional-friendly` Reference link is wrong.** It links to Microsoft's "Bias-free communication" guide, which is about inclusive language, not about avoiding marketing hype. The correct Microsoft reference would be the "Word choice" or "Top 10 tips" page, or the Google "Some things to avoid" page (which is already used by `voice-reader-centric`).

4. **`structure-diataxis` Incorrect example uses HTML comments for filenames.** The Correct example uses `<!-- filename.md -->` as a visual separator. This works but is non-standard in Markdown documentation. Consider using a heading or bold text for the filename instead to stay within normal Markdown patterns.

5. **`structure-procedures` heading example uses gerund vs imperative inconsistently.** The Incorrect example has `## Changing the port` (gerund) and the Correct has `## Change the port` (imperative). This is good -- it demonstrates the heading pattern. But the rule title says "Write steps with imperative verbs" which focuses on step content, not headings. The heading fix is a bonus but could confuse the scope. Consider noting the heading change explicitly.

6. **`voice-no-jargon` is long (34 lines) for a straightforward rule.** The Correct example is thorough (defining RBAC, ACL, IdP, SSO all in one passage) but could be shorter. The second paragraph about stacking terms adds little.

## File-by-File Notes

### Voice Rules

**`voice-address-reader.md`** (30 lines)
- Token justification: LOW. Claude already uses "you" in docs.
- The "Reserve 'the user' for..." sentence is the only non-obvious guidance here. Keep that, cut the rest.
- Examples are clean and realistic.
- Format: compliant.

**`voice-active-voice.md`** (30 lines)
- Token justification: LOW. Active voice is Claude's default.
- The passive-voice exception ("actor is genuinely unknown") is the only useful addition.
- Examples are realistic but generic.
- Format: compliant.

**`voice-professional-friendly.md`** (32 lines)
- Token justification: MEDIUM. The "replace superlatives with measurable facts" principle is useful as a reminder, but Claude already avoids marketing language in docs.
- Wrong Reference link (bias-free communication != anti-marketing).
- The Correct example (50ms, benchmarks link) is excellent and specific.
- Format: compliant.

**`voice-no-jargon.md`** (34 lines)
- Token justification: MEDIUM. The "define on first use" pattern is something Claude generally does, but the specific guidance about not stacking undefined terms is useful.
- Slightly verbose. The second paragraph adds little.
- Examples are strong -- the RBAC/ACL/IdP/SSO passage is realistic.
- Format: compliant.

**`voice-contractions.md`** (32 lines)
- Token justification: LOW. Claude uses contractions by default in conversational writing.
- The "avoid unusual contractions" guidance (mightn't, shan't) is the only non-obvious piece.
- Examples are correct but don't add much over what Claude already does.
- Format: compliant.

**`voice-no-anthropomorphism.md`** (33 lines)
- Token justification: HIGH. This is a genuine blind spot. Claude sometimes anthropomorphizes software ("the system tries to..."). The verb replacement list is actionable.
- Tight, specific, well-constructed.
- One of the best rules in the set.
- Format: compliant.

**`voice-requirements-language.md`** (32 lines)
- Token justification: HIGH. "Must" vs "should" is a specific editorial choice. The "no please in requirements" guidance is non-obvious and useful.
- Concise and actionable.
- The two-correct-example approach (requirement + suggestion) is justified by the rule's dual nature.
- Format: compliant (minor template deviation noted in Phase 2 observations).

**`voice-reader-centric.md`** (31 lines)
- Token justification: MEDIUM. Overlaps with `voice-professional-friendly`. The "lead with benefit, not feature" reframing is useful but partially redundant.
- Examples are good -- the "Acme CLI supports" vs "Run up to 16 tasks" contrast is clear.
- Consider merging with `voice-professional-friendly`.
- Format: compliant.

### Structure Rules

**`structure-diataxis.md`** (49 lines)
- Token justification: HIGH. Diataxis one-type-per-file is a specific architectural decision Claude wouldn't make unprompted.
- Longest rule file. The multi-file Correct example is necessarily longer.
- The HTML comment filenames are slightly odd but functional.
- Format: compliant.

**`structure-bluf.md`** (39 lines)
- Token justification: MEDIUM-HIGH. BLUF is a specific principle. Claude generally leads with context but doesn't always lead with the bottom line.
- The "save the backstory" guidance is useful.
- Explanation could lose a sentence without losing clarity.
- Format: compliant.

**`structure-heading-overview.md`** (37 lines)
- Token justification: MEDIUM. This is a specific structural rule (never follow heading with subheading/list/code). Claude sometimes violates this.
- Missing Reference link.
- The trailing paragraph after the Correct example is good but breaks the template pattern (content after the Correct block).
- Format: mostly compliant (trailing paragraph, missing Reference).

**`structure-hierarchical-headings.md`** (50 lines)
- Token justification: LOW. Sequential heading levels is basic Markdown knowledge.
- The H5/H6 tip at the end is the only non-obvious guidance.
- Missing Reference link.
- Could be 15 lines instead of 50.
- Format: mostly compliant (missing Reference).

**`structure-procedures.md`** (39 lines)
- Token justification: MEDIUM-HIGH. The imperative verb pattern is something Claude generally follows, but the "one action per step" and "lettered sub-steps" guidance is specific.
- The nested code block in the Correct example is a nice realistic touch.
- Format: compliant.

**`structure-conditions-first.md`** (36 lines)
- Token justification: HIGH. This is genuinely non-obvious. Many writers (and Claude) put the instruction first and the condition second. The "if/when/on/in" scanning tip is actionable.
- Well-constructed examples.
- Missing Reference link but the principle is self-evident enough.
- Format: mostly compliant (missing Reference).

**`structure-numbered-vs-bullets.md`** (46 lines)
- Token justification: MEDIUM. Claude generally gets this right, but the explicit "numbering implies priority or order" framing is worth stating.
- Missing Reference link.
- Could be shorter -- the two Incorrect examples (platforms + features) make the same point.
- Format: mostly compliant (missing Reference).

**`structure-one-idea-per-section.md`** (47 lines)
- Token justification: MEDIUM. The "summarize in one sentence" test is useful.
- Missing Reference link.
- Examples are good -- the auth setup + troubleshooting split is realistic.
- Format: mostly compliant (missing Reference).

**`structure-next-steps.md`** (44 lines)
- Token justification: MEDIUM. Claude doesn't always add next steps. The "describe what each link helps the reader do" guidance is specific.
- Missing Reference link.
- The 2-4 items guideline is useful and specific.
- Format: mostly compliant (missing Reference).

**`structure-quick-start.md`** (60 lines)
- Token justification: MEDIUM-HIGH. Quick Start as a structural requirement for getting-started docs is a specific choice.
- Longest rule file at 60 lines (above the 20-50 target noted in Phase 2 observations). The Correct example with nested code blocks inflates the line count.
- Could trim the Incorrect example (just say "10 sections before first command" without showing 6 section headings).
- Format: compliant.

## Recommendations

1. **Merge low-value rules.** Combine `voice-active-voice`, `voice-contractions`, and `voice-address-reader` into a single `voice-basics.md` that lists these as a quick checklist with one shared example block. This saves ~60 lines of tokens for rules Claude already follows.

2. **Merge overlapping rules.** Combine `voice-reader-centric` and `voice-professional-friendly` into one `voice-reader-first.md` rule covering both "no marketing hype" and "lead with reader outcomes."

3. **Fix the Reference link** on `voice-professional-friendly.md` -- point to Google's "Some things to avoid" or Microsoft's "Word choice" page, not the bias-free communication guide.

4. **Add missing Reference links** to the 6 structure files that omit them, or remove Reference from `_template.md` to make it explicitly optional.

5. **Trim explanations to one paragraph** across all files. The second "also/avoid" paragraph can usually be a trailing sentence in the first paragraph.

6. **Reconsider per-file impact field.** If all rules in CRITICAL categories are tagged `impact: CRITICAL`, the field adds no information. Either vary it within categories or drop it from rule files (keep it only on `_sections.md`).
