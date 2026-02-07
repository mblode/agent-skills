# Phase 3 Review: Clarity & Code Rules

Reviewer applied the same scrutiny as Phase 2, where 5 low-value voice rules were merged into voice-defaults.md. Each rule evaluated on: token justification, conciseness, example quality, format compliance, overlap, and specificity.

---

## Format Compliance Summary

All 18 rules follow the _template.md pattern: YAML frontmatter (title, impact, tags), H2 heading matching the title, explanation paragraph, Incorrect/Correct examples with descriptive parentheticals, and Reference link. No deviations.

Line counts:
- Clarity rules: 25-37 lines (all within 20-50 target)
- Code rules: 27-46 lines (all within 20-50 target)

---

## Clarity Rules (10 files)

### KEEP as standalone (5 rules) -- codify specific standards Claude would not self-apply

| Rule | Justification |
|------|---------------|
| **clarity-serial-comma** | Codifies Oxford comma as the project standard. Claude uses it inconsistently without instruction. Concise (26 lines). |
| **clarity-no-latin** | Specific ban: no e.g., i.e., etc. in docs. Claude regularly uses these abbreviations. Concise (26 lines). |
| **clarity-no-nominalizations** | Teaches a specific writing technique (un-bury verbs from noun forms) with concrete substitution patterns. Concise (27 lines). |
| **clarity-meaningful-names** | Specific ban on foo/bar/x/data in examples. Overlaps with code-descriptive-variables but targets prose-side naming, not code-side. Concise (26 lines). |
| **clarity-one-idea-per-sentence** | Sets a concrete threshold (25 words max) that Claude would not self-apply. Concise (28 lines). |

### MERGE into clarity-defaults.md (5 rules) -- standard writing advice Claude already follows

| Rule | Problem | Lines |
|------|---------|-------|
| **clarity-plain-language** | "Use simple words" is generic writing advice. The specific substitutions (utilize -> use, facilitate -> help) are things Claude already does. | 27 |
| **clarity-cut-filler** | "Remove filler words" is standard editing. Claude does not produce "basically just" or "it is important to note that" in its own writing. | 26 |
| **clarity-specific-over-vague** | "Be specific, not vague" is generic. Claude already quantifies when data is available. | 27 |
| **clarity-global-audience** | "No idioms or cultural references" is standard technical writing. Claude's default output avoids idioms. | 27 |
| **clarity-short-paragraphs** | "Keep paragraphs short" with a 4-sentence max is generic web writing advice. Claude already produces short paragraphs. | 37 |

**Recommendation:** Merge these 5 into a `clarity-defaults.md` checklist (following the voice-defaults.md pattern). This removes ~144 lines of rules Claude already follows and replaces them with a ~30-line checklist. Net reduction: ~114 lines, 5 files become 1. Clarity rule count drops from 10 to 6.

### Proposed clarity-defaults.md checklist items

- [ ] **Plain words** -- use "use" not "utilize," "start" not "initiate," "help" not "facilitate."
- [ ] **Cut filler** -- remove "very," "just," "basically," "simply," "in order to," "it is important to note."
- [ ] **Be specific** -- replace "fast," "easy," "flexible" with numbers or concrete examples.
- [ ] **Global audience** -- no idioms, sports metaphors, or cultural references. Standard US English.
- [ ] **Short paragraphs** -- max 4 sentences per paragraph on web. One-sentence paragraphs are fine for emphasis.

---

## Code Rules (8 files)

### KEEP as standalone (6 rules) -- codify specific documentation-code standards

| Rule | Justification |
|------|---------------|
| **code-runnable-examples** | "Every concept needs a copy-paste-ready example with imports and expected output" is a specific standard, not generic advice. 33 lines. |
| **code-context-ratio** | Sets specific ratios (40% code for tutorials, 90% for references). Claude would not self-apply these thresholds. 44 lines. |
| **code-isolated-to-full** | "Layer from focused snippet to full context" with link-to-full-file pattern is a specific documentation technique. 46 lines. |
| **code-multiple-languages** | "Show 2-3 languages for multi-language SDKs" is a specific policy decision. 43 lines. |
| **code-error-descriptions** | "Every error needs code, cause, and fix" is a specific three-part structure. 37 lines. |
| **code-named-functions** | "Extract named functions so top-level code reads like pseudocode" in documentation examples is a specific standard. 38 lines. |

### MERGE candidates (2 rules) -- overlap with each other and with clarity-meaningful-names

| Rule | Problem | Lines |
|------|---------|-------|
| **code-descriptive-variables** | "Use descriptive variable names, not x/y/data" overlaps heavily with clarity-meaningful-names. The code examples differ but the principle is identical. | 28 |
| **code-comments-explain-why** | "Comments explain why, not what" is a universal engineering best practice Claude already follows. Not specific to documentation writing. | 33 |

**Recommendation:** Merge these 2 into the existing clarity-meaningful-names rule or a new code-defaults.md. However, the overlap is less severe than the clarity cases -- code-descriptive-variables operates on code blocks while clarity-meaningful-names operates on prose examples. If keeping both, add a cross-reference note to disambiguate.

**Preferred approach:** Keep code-descriptive-variables but add a one-line cross-reference to clarity-meaningful-names. Merge code-comments-explain-why into a code-defaults.md checklist, or simply remove it -- Claude already follows this principle without instruction.

---

## Overlap Analysis

### clarity-meaningful-names vs code-descriptive-variables

Both say "don't use foo/bar/x/data." The distinction is:
- clarity-meaningful-names: targets variable names in **prose examples** (markdown code blocks within explanatory text)
- code-descriptive-variables: targets variable names in **standalone code examples**

This is a legitimate split but the overlap is ~80%. **Recommendation:** Keep both but add cross-references. Alternatively, merge into a single rule that covers both prose and code contexts.

### clarity-plain-language vs clarity-cut-filler

Both target word-level editing. Plain-language says "use simpler synonyms," cut-filler says "delete empty words." These are two sides of the same coin. **Recommendation:** Merge into clarity-defaults.md checklist as separate items.

### clarity-specific-over-vague vs clarity-global-audience

No significant overlap -- one targets vague adjectives, the other targets idioms. Both are still merge candidates because they are generic advice.

---

## Example Quality Assessment

All 18 rules use realistic documentation examples (API keys, JWT tokens, Express servers, Stripe charges, user profiles). No foo/bar placeholders in any Correct examples. The Incorrect examples in clarity-meaningful-names and code-descriptive-variables intentionally use foo/bar to demonstrate the anti-pattern -- this is appropriate.

The code rules use appropriate language hints: javascript, python, bash. The quadruple-backtick nesting pattern (````markdown wrapping ```javascript) in code-runnable-examples, code-context-ratio, code-isolated-to-full, and code-multiple-languages renders correctly.

---

## Conciseness Assessment

All explanations are 1-2 sentences. No verbose files. Phase 3 rules are consistently more concise than Phase 2 rules were before review tightening.

---

## Action Items

1. **Create clarity-defaults.md** by merging 5 generic clarity rules (plain-language, cut-filler, specific-over-vague, global-audience, short-paragraphs) into a checklist following the voice-defaults.md pattern
2. **Delete the 5 merged clarity files** after creating the checklist
3. **Remove or merge code-comments-explain-why** -- it codifies a universal engineering practice, not a documentation-specific standard
4. **Add cross-reference** between clarity-meaningful-names and code-descriptive-variables
5. **Update SKILL.md** rule counts: clarity drops from 10 to 6 (5 merged into 1), code drops from 8 to 7 (1 merged/removed)
6. **Update _sections.md** clarity description to reflect merged defaults
7. **Total rule count:** 62 - 4 (net reduction from clarity merge) - 1 (code merge) = 57 rules

---

## Verdict

Phase 3 is well-executed. The rules are concise, follow the template, and use realistic examples. The main issue is the same one found in Phase 2: ~5 clarity rules codify writing advice Claude already follows. Applying the same merge pattern used for voice-defaults.md will keep the skill focused on rules that actually change Claude's behavior.
