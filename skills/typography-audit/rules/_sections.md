# Sections

The 10 rule categories: heading order = audit priority. Rule files are named `<prefix>-<slug>.md`. `_template.md` scaffolds new rule files and is not loaded during an audit.

Category impact is the impact of the category's worst-case rules, not an average. A rule's own frontmatter `impact` is the authoritative value and often differs from its category, so report findings with the rule-level value. The rules that most diverge from their category are `brand-color` and `brand-licensing` (HIGH inside MEDIUM), `pairing-ui-fonts` (HIGH inside MEDIUM), `opentype-tabular-figures` (HIGH inside MEDIUM), `punct-daggers` and `punct-midpoints` (LOW-MEDIUM inside CRITICAL), and `font-rendering` (MEDIUM inside CRITICAL).

Counts must reconcile with `ls rules/ | grep -v '^_' | wc -l` (total: 78).

## 1. Font Selection & Weights (font), 11 rules

**CRITICAL.** Faux bold and italic, broken `@font-face` mappings, and missing fallback stacks make text render wrong or not at all. Also covers weight, width, optical size, and font quality.

## 2. Sizing & Measure (size), 6 rules

**CRITICAL.** Body size, line height, and measure decide whether the text is readable at all, and a fixed-px line height inherited by a heading overlaps lines outright. Also covers responsive scaling and emphasis.

## 3. Punctuation & Special Characters (punct), 12 rules

**CRITICAL.** The most visible sign of amateur typography: straight quotes, double hyphens for dashes, and missing diacritics are non-negotiable in rendered copy. The rest of the category (footnote marks, symbols, fractions, separators) is refinement, priced MEDIUM and below per rule.

## 4. Spacing & Rhythm (spacing), 8 rules

**HIGH.** Letterspaced body text, cramped gutters, and text touching a phone bezel cost readability directly. Uppercase tracking, subhead proximity, and paragraph separation control rhythm.

## 5. Hierarchy & Scale (hierarchy), 8 rules

**MEDIUM-HIGH.** Size contrast, weight variation, and shallow semantic heading levels make content scannable and navigable by screen reader. Body first; headings derive from it.

## 6. Alignment & Layout (layout), 6 rules

**MEDIUM.** Justified text without hyphenation and centered body copy break the left reading edge; list markup, proximity, and widow control affect page-level readability.

## 7. OpenType Features (opentype), 7 rules

**MEDIUM.** Mostly refinement, since browsers enable `kern` and `liga` by default. The exceptions carry real cost: misaligned figures in a data table, and ligatures inside code blocks that obscure individual characters.

## 8. Brand & Identity (brand), 8 rules

**MEDIUM.** Mostly consistency and recognition, but this is where the WCAG contrast floor (`brand-color`) and font licensing exposure (`brand-licensing`) live, both HIGH.

## 9. Typeface Pairing (pairing), 5 rules

**MEDIUM.** Combine typefaces by matching stress and skeleton, by deliberate contrast, or via superfamilies; same-category pairs read as accidents. `pairing-ui-fonts` is HIGH: ambiguous l/I/1 glyphs cause real data-entry errors.

## 10. Display & Headlines (display), 7 rules

**LOW-MEDIUM.** Headline spacing, drop caps, swashes, lead paragraphs, and headline-specific OpenType features add polish to large type.
