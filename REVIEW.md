# Phase 4 Review: Format & Navigation Rules

Reviewed 14 MEDIUM-HIGH rule files: 8 format-* and 6 nav-*. Applied the same "does Claude already know this?" scrutiny used in Phase 2 (voice) and Phase 3 (clarity/code) reviews.

---

## Verdict: No critical issues. All 14 rules justified. No merges needed.

Phase 4 is the cleanest batch so far. Format rules codify arbitrary editorial conventions that vary between style guides. Nav rules codify specific documentation architecture practices. Neither category contains generic writing advice Claude already follows.

---

## Token Justification

### Format rules (8): ALL KEEP

Format rules codify arbitrary editorial conventions -- exactly the kind of thing Claude does NOT know by default because reasonable people disagree on them.

| Rule | Justification |
|------|---------------|
| **format-sentence-case** | Sentence case vs. title case is an editorial choice. Claude defaults to title case for headings without instruction. |
| **format-bold-ui-code-font** | Distinct formatting for UI elements (bold) vs. code/commands (code font). Claude inconsistently applies these. |
| **format-parallel-lists** | Parallelism standard with a clear pattern. Claude can drift on mixed lists. |
| **format-descriptive-links** | "Click here" ban is a specific a11y convention with a concrete anti-pattern. |
| **format-semantic-html** | HTML element choice when docs use raw HTML. Niche but the only HTML rule in the set. |
| **format-image-alt-text** | Alt text quality standard (describe what it shows, not what it is). Concrete technique. |
| **format-lowercase-filenames** | Kebab-case filename convention with cross-OS rationale. Arbitrary convention that needs codifying. |
| **format-periods-inside-quotes** | US English punctuation placement. The code-font escape hatch note avoids conflict with code-* rules. |

### Nav rules (6): ALL KEEP

Nav rules codify specific documentation architecture practices, not generic "write good docs" advice.

| Rule | Justification |
|------|---------------|
| **nav-every-doc-linked** | Zero orphaned pages is a testable requirement, not generic advice. |
| **nav-relative-paths** | Relative vs. absolute paths has real deployment consequences. Specific convention. |
| **nav-dont-repeat** | DRY for documentation with a concrete webhook example. Policy decision. |
| **nav-layer-depth** | Progressive disclosure with two-sided incorrect examples (too shallow AND too deep). Concrete technique. |
| **nav-searchable-headings** | Heading text optimized for search queries. Bans "Overview" and "More information" generics. |
| **nav-breadcrumb-context** | Opening-sentence wayfinding pattern ("This guide is part of..."). Gives Claude a specific template. |

**Closest call:** nav-searchable-headings borders on "write good headings" which Claude already does. However, the specific directive to match user search terms and the ban on generic headings like "Overview" and "More information" add enough operational specificity to justify keeping.

---

## Conciseness

All 14 files fall within 24-37 lines. Tighter than Phase 2 (26-52) and Phase 3 (25-46).

- Shortest: nav-relative-paths (24 lines)
- Longest: nav-layer-depth (37 lines) -- justified by three-example pattern
- All explanations are 1-2 sentences. No bloat.

---

## Example Quality

All examples use realistic documentation scenarios:
- Database configs, API keys, OAuth flows, webhook setups
- Real filenames (config.yaml, auth-flow.png, advanced-config.md)
- No foo/bar/baz placeholders

Standout examples:
- **format-periods-inside-quotes**: Minimal "active." / "production," example is unambiguous
- **nav-layer-depth**: Two incorrect examples (too shallow AND too deep) effectively bracket the correct approach
- **nav-dont-repeat**: Webhook re-explanation scenario is exactly the kind of drift that happens in real doc sets

---

## Format Compliance

All 14 files match _template.md:
- YAML frontmatter with title, impact, tags
- H2 heading matching the title
- Descriptive parentheticals on Incorrect/Correct labels
- Reference link to authoritative source
- Appropriate fenced block language hints (markdown, html)

---

## Overlap Analysis

No merges needed. Checked all pairwise relationships:

- **format-sentence-case vs. nav-searchable-headings**: Orthogonal -- capitalization style vs. word choice for findability.
- **format-descriptive-links vs. nav-relative-paths**: Different link dimensions -- text quality vs. path format.
- **nav-dont-repeat vs. nav-layer-depth**: Different linking strategies -- DRY principle vs. progressive disclosure.
- **format-bold-ui-code-font vs. format-descriptive-links**: Inline formatting vs. link text. No overlap.
- **nav-relative-paths line 9 vs. format-descriptive-links**: Minor scope bleed noted below.

---

## Minor Improvements (non-blocking)

1. **nav-relative-paths line 9**: Third sentence ("Always add context text that tells the reader what they'll find at the destination") bleeds into format-descriptive-links territory. Consider removing to keep scope tight to path format only.
2. **format-parallel-lists line 9**: Explanation is 3 sentences -- the third ("Mixed structures force the reader to re-parse each item") could fold into the second for tighter prose.
3. **nav-breadcrumb-context title**: "Provide clear location context in documentation" is slightly vague compared to other nav titles. "Establish page location with an opening link" would be sharper.

---

## Summary

| Metric | Phase 2 (post-review) | Phase 3 | Phase 4 |
|--------|----------------------|---------|---------|
| Rules reviewed | 18 | 18 | 14 |
| Keep standalone | 13 | 11 | 14 |
| Merge/remove | 5 | 7 | 0 |
| Line range | 26-52 | 25-46 | 24-37 |
| Format compliance | 100% | 100% | 100% |

Phase 4 benefits from lessons learned in earlier phases -- the authoring was tighter from the start, and every rule codifies a specific convention or technique that Claude would not self-apply.
