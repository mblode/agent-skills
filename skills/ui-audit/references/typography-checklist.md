# Typography Surface Checklist

Surface typography sweep for UI audits: punctuation, sizing, spacing, styles, text-layout, for any web surface. For typeface selection, pairing, brand identity, display type, and logo work, use the `typography-audit` skill (out of scope here).

## Contents

- How to apply
- Punctuation and glyphs
- Capitalization, spacing, and emphasis
- Size, measure, and leading
- Weights, styles, and OpenType
- Letterspacing and casing
- Paragraphs and hierarchy
- Links, contrast, and text on images
- Numerals and tables
- Lists and navigation text

## How to apply

1. Scope changed surfaces (body, headings, links, tables, forms, nav).
2. Run relevant sections; record `file:line` per the SKILL.md output contract.
3. Fix, then rerun the same sections on touched files before pass.

## Punctuation and glyphs

- [ ] Smart quotes/apostrophes, not straight; content UTF-8 at build/render.
- [ ] En dash for ranges, em dash for breaks/attribution; pick spaced-en or unspaced-em, consistently; never double hyphens.
- [ ] Prime/double-prime for measurements (not quotes); real multiplication and fraction glyphs.
- [ ] Ellipsis (`&hellip;`), not three periods, in copy, labels (Rename&hellip;), loading states.
- [ ] Accents stored as Unicode, present in loaded fonts; over-subsetting yields empty boxes.
- [ ] Non-breaking space between glued terms: copyright + year, values + units (10&nbsp;MB), shortcuts (Cmd&nbsp;+&nbsp;K), brand names.
- [ ] Midpoints (hair/thin spaces) for inline separators, not bars or bullets; ampersands only in names or tight UI.
- [ ] No apostrophes in decades (1990s), no periods in acronyms.

## Capitalization, spacing, and emphasis

- [ ] Sentence or title case for headings: one choice, consistent.
- [ ] One space after sentence punctuation; no double spaces.
- [ ] Italics for emphasis (sparingly), not bold-everything, all caps, or quotes.
- [ ] Underlines for links only, never decoration or emphasis.

## Size, measure, and leading

- [ ] Body size first: 16-24px desktop, 15-19px mobile; headings scale down on mobile.
- [ ] Line length 45-75ch (66 ideal), set via `max-width` in `ch` per breakpoint.
- [ ] Line height ~1.45-1.6 unitless; more for large-x-height sans, tighter for large headlines.
- [ ] Fluid sizes via `clamp()`; scale steps either same or clearly different, never near-equal.
- [ ] Widows/orphans: `text-wrap: balance` on headings or non-breaking spaces in headlines/nav.

## Weights, styles, and OpenType

- [ ] Real regular/italic/bold/bold-italic via `@font-face` on one family; no faux bold or italic.
- [ ] Body weight 400-500; never ultra-light or display cuts for body copy.
- [ ] Long body never monospaced; mono for code and short stylistic blocks.
- [ ] Body OpenType on: `kern`, `liga`, `clig`, `calt`; discretionary ligatures off in body and code.
- [ ] Real small caps via `font-feature-settings` (slight tracking), never pseudo.

## Letterspacing and casing

- [ ] No letterspacing on body; add ~0.05-0.2em to all-caps and small labels, more as size shrinks.
- [ ] No multi-line all-caps blocks or uppercase paragraphs.
- [ ] Never letterspace mono or script fonts; keep metric kerning, don't over-kern.
- [ ] Never stretch or squish type; use condensed/extended variants instead.

## Paragraphs and hierarchy

- [ ] Long copy broken into paragraphs with subheads/lists; separate by spacing or indents, never both (`p + p` for indents).
- [ ] Subheads closer to the text they introduce than to preceding text; dividers above headings, not below.
- [ ] Centre alignment rare and intentional; no justified web text without strong hyphenation.
- [ ] Hierarchy one axis at a time (size, weight, caps, colour); shallow levels (h1-h3); descriptive, not generic headings.
- [ ] Heading colour distinct from link colour; large headings may lighten weight/colour, preferring darkened brand hues over flat grey.

## Links, contrast, and text on images

- [ ] Links distinct via colour or underline; link colour never on non-links.
- [ ] Link hover doesn't shift layout (no weight or size change).
- [ ] Contrast passes without pure black on pure white; no low-contrast grey body text.
- [ ] Text over photos has enforced contrast (overlay/scrim or curated images), or avoid the pattern.
- [ ] Dark backgrounds use off-white text; keep light-on-dark passages short.

## Numerals and tables

- [ ] Table numbers right-aligned with tabular figures (`font-variant-numeric: tabular-nums`) or mono/system stack; thousands separators present.
- [ ] Oldstyle figures (`onum`) fine in running text; lining figures (`lnum`) next to uppercase and in UI.
- [ ] Numerals for counts in UI copy ("8 deployments", not "eight").

## Lists and navigation text

- [ ] Proper list markup (`<ul>`/`<ol>`); wrapped text doesn't tuck under bullets; vertical spacing between multi-line items.
- [ ] Lists tested with long content at narrow widths.
- [ ] Nav spacing via CSS padding, not spaces; current item marked selected, never greyed out like a disabled control.
- [ ] Captions/descriptions closer to the images they describe than to surrounding content.
