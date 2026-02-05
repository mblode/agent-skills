---
name: audit-typography
version: 0.1.0
description: Comprehensive web typography rules covering punctuation, font selection, sizing, spacing, OpenType features, hierarchy, layout, typeface pairing, brand identity, and display type. Use when writing CSS/HTML for text, selecting or pairing typefaces, reviewing typography in web designs, configuring font-feature-settings, building a type system, or auditing typographic quality. Triggers on tasks involving font-family, font-size, line-height, letter-spacing, @font-face, font pairing, or typographic correctness.
---

# Audit Typography

Comprehensive typography guide for web design and development, based on the Typewolf Flawless Typography Checklist. Contains 89 rules across 10 categories, prioritized by impact on readability and professionalism.

## When to Apply

Reference these guidelines when:
- Writing CSS for body text, headings, or any typographic element
- Selecting and pairing typefaces for a project
- Implementing @font-face declarations and font loading
- Reviewing content for correct punctuation and special characters
- Building a typographic scale or design system
- Setting up OpenType features in CSS
- Designing responsive typography across breakpoints
- Auditing existing typography for quality issues

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Punctuation & Special Characters | CRITICAL | `punct-` |
| 2 | Font Selection & Weights | CRITICAL | `font-` |
| 3 | Sizing & Measure | HIGH | `size-` |
| 4 | Spacing & Rhythm | HIGH | `spacing-` |
| 5 | OpenType Features | MEDIUM-HIGH | `opentype-` |
| 6 | Hierarchy & Scale | MEDIUM-HIGH | `hierarchy-` |
| 7 | Alignment & Layout | MEDIUM | `layout-` |
| 8 | Typeface Pairing | MEDIUM | `pairing-` |
| 9 | Brand & Identity | LOW-MEDIUM | `brand-` |
| 10 | Display & Headlines | LOW-MEDIUM | `display-` |

## Quick Reference

### 1. Punctuation & Special Characters (CRITICAL)

- `punct-smart-quotes` - Use smart quotes, never straight
- `punct-dashes` - Em dash vs en dash vs hyphen
- `punct-primes` - Prime marks for measurements, not quotes
- `punct-symbols` - Copyright, trademark, registered marks
- `punct-ampersands` - Use ampersands sparingly, proper names only
- `punct-midpoints` - Midpoint separators with thin spaces
- `punct-abbreviations` - Clean up decades and acronyms
- `punct-single-space` - One space after periods
- `punct-fractions` - Proper fraction and math entities
- `punct-diacritics` - Support accented characters and UTF-8
- `punct-daggers` - Daggers and special footnote marks
- `punct-case-rules` - Sentence or title case, applied consistently

### 2. Font Selection & Weights (CRITICAL)

- `font-body-selection` - Choose body fonts for legibility (low contrast, large x-height)
- `font-true-styles` - Load real italic and bold styles
- `font-face-setup` - Correct @font-face declarations per weight/style
- `font-weight-body` - Body weight 400-500, avoid ultra-light
- `font-optical-sizes` - Text vs display vs caption cuts
- `font-variable-fonts` - Prefer WOFF2 and variable fonts
- `font-monospaced` - Reserve monospace for short blocks
- `font-quality` - Evaluate font quality before use
- `font-fallbacks` - Define strong fallback font stacks
- `font-condensed-extended` - Condensed for headlines only

### 3. Sizing & Measure (HIGH)

- `size-body-text` - Desktop 16-24px, mobile 15-19px
- `size-line-length` - Keep 45-75 characters (66 ideal)
- `size-line-height` - Set 1.45-1.5 unitless, adjust per context
- `size-responsive` - Adapt typography across breakpoints
- `size-emphasis` - Use italics for emphasis, not bold/caps
- `size-underlines` - Never underline for emphasis
- `size-hanging-punctuation` - Implement only where feasible

### 4. Spacing & Rhythm (HIGH)

- `spacing-paragraph-separation` - Line breaks OR indents, not both
- `spacing-paragraph-indent` - Apply indent after first paragraph only
- `spacing-paragraph-margins` - Add adequate margins around text
- `spacing-subhead-proximity` - Place subheads closer to following content
- `spacing-letterspacing-body` - Never letterspace body text
- `spacing-letterspacing-uppercase` - Add 0.05-0.2em to uppercase
- `spacing-word-spacing` - Adjust word spacing with letterspacing
- `spacing-hair-thin-spaces` - Hair/thin spaces for fine adjustments
- `spacing-columns-gutters` - Ensure adequate column padding
- `spacing-nav-items` - Space navigation with CSS padding

### 5. OpenType Features (MEDIUM-HIGH)

- `opentype-body-features` - Enable kern, liga, clig, calt for body
- `opentype-ligatures` - Standard on, discretionary off in body
- `opentype-kerning` - Use metrics kerning, adjust tracking first
- `opentype-small-caps` - Real small caps via font-feature-settings
- `opentype-tabular-figures` - tnum for tables, right alignment
- `opentype-oldstyle-figures` - onum for running text, lnum for UI
- `opentype-faux-styles` - Avoid faux bold, italic, and small caps
- `opentype-monoscript-kerning` - Never adjust mono/script spacing

### 6. Hierarchy & Scale (MEDIUM-HIGH)

- `hierarchy-modular-scale` - Use scale as guide, not constraint
- `hierarchy-size-contrast` - Same or clearly different sizes
- `hierarchy-weight-contrast` - Build with weight/italics/caps/color
- `hierarchy-heading-levels` - Keep h1-h3, descriptive headings
- `hierarchy-heading-color` - Lighten headings as they grow
- `hierarchy-caps-subheads` - Letterspaced caps for subheadings
- `hierarchy-consistent-system` - Define and document a type system
- `hierarchy-body-first` - Start layout with body text

### 7. Alignment & Layout (MEDIUM)

- `layout-center-alignment` - Center-align sparingly
- `layout-justified-text` - Avoid on web, require hyphenation
- `layout-widows-orphans` - Non-breaking spaces in headlines
- `layout-no-distortion` - Never stretch or squish type
- `layout-lists` - Proper markup and vertical spacing
- `layout-hanging-bullets` - Choose hanging vs indented bullets
- `layout-optical-balance` - Center slightly above true center
- `layout-proximity-dividers` - Captions near images, dividers above headings

### 8. Typeface Pairing (MEDIUM)

- `pairing-limit-typefaces` - Limit to two typefaces
- `pairing-superfamilies` - Use superfamilies for easy pairing
- `pairing-no-two-sans` - Avoid pairing two sans-serifs
- `pairing-no-two-serifs` - Avoid pairing two serifs
- `pairing-contrast-harmony` - Pair by contrast or harmony, not similarity
- `pairing-stress-skeleton` - Match stress angles when pairing
- `pairing-geometric-modern` - Geometric sans with modern serifs
- `pairing-grotesque-transitional` - Grotesques with transitional serifs
- `pairing-humanist-oldstyle` - Humanist sans with old-style serifs
- `pairing-ui-fonts` - Choose UI fonts with distinct l/I/1 glyphs

### 9. Brand & Identity (LOW-MEDIUM)

- `brand-capitalization` - Consistent brand name casing
- `brand-logo-typeface` - Choose logo typeface based on specific letters
- `brand-cross-medium` - Consistent type across web/print/app
- `brand-identifiable-body` - Make body text distinctive
- `brand-color` - Use color intentionally, tinted blacks
- `brand-licensing` - License fonts properly
- `brand-equity` - Protect brand typographic equity
- `brand-dark-backgrounds` - Handle dark backgrounds carefully

### 10. Display & Headlines (LOW-MEDIUM)

- `display-large-type` - Use large type as a design element
- `display-cuts` - Display cuts only at large sizes
- `display-swashes` - Swashes and alternates sparingly
- `display-headline-opentype` - Extra OpenType features for headlines
- `display-headline-spacing` - Tighten spacing for large headlines
- `display-drop-caps` - Implement drop caps or initial caps
- `display-lead-paragraph` - Style a lead paragraph
- `display-grid-breaking` - Break the grid intentionally

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/punct-smart-quotes.md
rules/font-body-selection.md
rules/size-line-length.md
rules/_sections.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect example (CSS, HTML, or typographic text)
- Correct example with proper implementation
- Additional context and references
