# Sections

Defines the 10 rule categories: ordering (= audit priority), category impact, filename prefix, and rule count. Rule files are named `<prefix>-<slug>.md`. A rule's own frontmatter `impact` may differ from its category impact, so report findings with the rule-level value.

Counts must reconcile with `ls rules/ | grep -v '^_' | wc -l` (total: 90).

## 1. Punctuation & Special Characters (punct), 12 rules

**Impact:** CRITICAL
**Description:** Incorrect punctuation is the most visible sign of amateur typography. Smart quotes, proper dashes, primes, and correct special characters are non-negotiable in rendered copy.

## 2. Font Selection & Weights (font), 11 rules

**Impact:** CRITICAL
**Description:** Appropriate typefaces with correct weights, true italics, quality vetting, fallback stacks, and proper @font-face setup are the foundation of all web typography. Missing style files cause faux bold/italic.

## 3. Sizing & Measure (size), 7 rules

**Impact:** HIGH
**Description:** Body text size, line length (measure), and line height are the three most important parameters for readable body text.

## 4. Spacing & Rhythm (spacing), 10 rules

**Impact:** HIGH
**Description:** Paragraph spacing, letterspacing (especially on uppercase), word spacing, and column gutters control the rhythm and breathing room of typeset text.

## 5. OpenType Features (opentype), 8 rules

**Impact:** MEDIUM-HIGH
**Description:** Kerning, ligatures, small caps, and figure styles via font-feature-settings unlock the full potential of quality fonts and prevent faux small caps.

## 6. Hierarchy & Scale (hierarchy), 8 rules

**Impact:** MEDIUM-HIGH
**Description:** Size contrast, weight variation, and consistent heading levels create scannable, structured content. Body text first; headings derive from it.

## 7. Alignment & Layout (layout), 8 rules

**Impact:** MEDIUM
**Description:** Text alignment, justification, list formatting, optical balance, and widow/orphan control affect page-level readability.

## 8. Typeface Pairing (pairing), 10 rules

**Impact:** MEDIUM
**Description:** Combining typefaces by genre-matching, contrast principles, and superfamilies creates visual harmony; same-genre pairs create confusion.

## 9. Brand & Identity (brand), 8 rules

**Impact:** LOW-MEDIUM
**Description:** Consistent type usage, brand capitalization, licensing, and cross-medium coherence establish typographic identity.

## 10. Display & Headlines (display), 8 rules

**Impact:** LOW-MEDIUM
**Description:** Display cuts, swashes, drop caps, lead paragraphs, and headline-specific OpenType features add polish to large type.
