# Sections

The 10 rule categories: heading order = audit priority. Rule files are named `<prefix>-<slug>.md`. A rule's own frontmatter `impact` may differ from its category impact; report findings with the rule-level value. `_template.md` scaffolds new rule files and is not loaded during an audit.

Counts must reconcile with `ls rules/ | grep -v '^_' | wc -l` (total: 90).

## 1. Punctuation & Special Characters (punct), 12 rules

**CRITICAL.** Most visible sign of amateur typography. Smart quotes, proper dashes, primes, and correct special characters are non-negotiable in rendered copy.

## 2. Font Selection & Weights (font), 11 rules

**CRITICAL.** Appropriate typefaces with correct weights, true italics, vetted quality, fallback stacks, and proper @font-face setup. Missing style files cause faux bold/italic.

## 3. Sizing & Measure (size), 7 rules

**HIGH.** Body size, line length (measure), and line height: the three parameters that most drive body readability.

## 4. Spacing & Rhythm (spacing), 10 rules

**HIGH.** Paragraph spacing, letterspacing (especially uppercase), word spacing, and column gutters control rhythm and breathing room.

## 5. OpenType Features (opentype), 8 rules

**MEDIUM-HIGH.** Kerning, ligatures, small caps, and figure styles via font-feature-settings unlock quality fonts and prevent faux small caps.

## 6. Hierarchy & Scale (hierarchy), 8 rules

**MEDIUM-HIGH.** Size contrast, weight variation, and consistent heading levels make content scannable. Body first; headings derive from it.

## 7. Alignment & Layout (layout), 8 rules

**MEDIUM.** Alignment, justification, list formatting, optical balance, and widow/orphan control affect page-level readability.

## 8. Typeface Pairing (pairing), 10 rules

**MEDIUM.** Combine typefaces by genre-matching, contrast, and superfamilies for harmony; same-genre pairs create confusion.

## 9. Brand & Identity (brand), 8 rules

**LOW-MEDIUM.** Consistent type usage, brand capitalization, licensing, and cross-medium coherence establish typographic identity.

## 10. Display & Headlines (display), 8 rules

**LOW-MEDIUM.** Display cuts, swashes, drop caps, lead paragraphs, and headline-specific OpenType features add polish to large type.
