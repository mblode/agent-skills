# Sections

All 9 categories with ordering, impact, and rules. The ID in parentheses is the filename prefix. 51 rules total. To add a rule, copy `_template.md` and update the three counts it lists.

---

## 1. Voice & Tone (voice)

**Impact:** CRITICAL
**4 rules:** voice defaults (active voice, contractions, second person with the tutorial "we" allowance, professional tone, reader-centric framing), no jargon, no anthropomorphism, requirements language (must for requirements, should only for recommendations, no please).

## 2. Structure & Organization (structure)

**Impact:** CRITICAL
**9 rules:** Diataxis one-type-per-file (with the compass), bottom line up front, conditions before instructions, heading followed by an orienting sentence, next steps, one idea per section (and per page), every section earns its place, clear procedures, quick start for getting-started docs.

## 3. Clarity & Language (clarity)

**Impact:** HIGH
**5 rules:** clarity defaults (plain language, cut filler, be specific, global audience, short paragraphs; the source of truth for paragraph length), serial comma, no Latin abbreviations, no nominalizations, one idea per sentence.

## 4. Code Examples (code)

**Impact:** HIGH
**8 rules:** runnable examples (with why-not-what comments and a language tag on every fence), code-to-context ratio, isolated-to-full layering, multiple languages, error descriptions, named functions, realistic example names, placeholders and test credentials.

## 5. Formatting & Syntax (format)

**Impact:** MEDIUM-HIGH
**7 rules:** sentence case headings, bold UI elements and code font for commands, descriptive link text, image alt text, lowercase filenames, periods inside quotes, semantic HTML.

## 6. Navigation & Linking (nav)

**Impact:** MEDIUM-HIGH
**7 rules:** every doc linked from at least one other doc, opening context where the site renders no breadcrumb, don't repeat content covered elsewhere, layered content depth, relative paths, searchable headings, agent-readable docs (llms.txt and Markdown page variants).

## 7. Scanability & Readability (scan)

**Impact:** MEDIUM
**2 rules:** scan defaults (white space between logical groups, diagrams and tables over prose), request and response examples beside each API reference entry.

## 8. Content Hygiene (hygiene)

**Impact:** MEDIUM
**6 rules:** delete outdated content, dedicated docs directory, experimental-feature labels, no temporal content (status reports, dated plans), planned-feature labels for docs written ahead of code, freshness metadata sourced from the build.

## 9. Review & Testing (review)

**Impact:** LOW-MEDIUM
**3 rules:** review defaults (fresh-reader test, read aloud and cut, verify against implementation), verify links, docs change with the code (same PR, prose lint in CI).
