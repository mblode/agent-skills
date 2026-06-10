# Typography Surface Checklist

Surface-level typography sweep for UI audits: punctuation, sizing, spacing, styles, and text-layout checks that apply to any web surface. For typeface selection, pairing, brand identity, display type, and logo work, route to the `typography-audit` skill; those are out of this checklist's scope.

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

1. Scope the typography surfaces being changed (body text, headings, links, data tables, forms, nav).
2. Run only the relevant sections; record findings with `file:line` per the SKILL.md output contract.
3. Apply fixes, then rerun the same sections on touched files before marking pass.

## Punctuation and glyphs

- [ ] Smart quotes and apostrophes, not straight ones; content normalised as UTF-8 at build/render time.
- [ ] En dash for ranges, em dash for breaks/attribution; pick spaced-en or unspaced-em style and keep it consistent; never double hyphens.
- [ ] Prime/double-prime glyphs for measurements (not quote characters); multiplication sign and real fraction glyphs where they appear.
- [ ] Ellipsis character (`&hellip;`), not three periods, in copy, follow-up labels (Rename&hellip;), and loading states.
- [ ] Accented characters stored as Unicode and present in loaded fonts; over-subsetting produces empty glyph boxes.
- [ ] Non-breaking space between glued terms: copyright + year, values + units (10&nbsp;MB), shortcut keys (Cmd&nbsp;+&nbsp;K), brand names.
- [ ] Midpoints (with hair/thin spaces as needed) for inline separators, not bars or bullets; ampersands only in proper names or space-constrained UI.
- [ ] No apostrophes in decades (1990s), no periods in acronyms.

## Capitalization, spacing, and emphasis

- [ ] Sentence case or title case for headings: one choice, applied consistently.
- [ ] Exactly one space after sentence-ending punctuation; no double spaces anywhere.
- [ ] Italics for emphasis, not bold-everything, all caps, or quote marks; emphasis used sparingly.
- [ ] Underlines reserved for links only, never decoration or emphasis.

## Size, measure, and leading

- [ ] Body size set first: 16-24px desktop, 15-19px mobile; headings scale down on mobile.
- [ ] Line length 45-75 characters (66 ideal), adjusted per breakpoint via `max-width` in `ch` units.
- [ ] Line height ~1.45-1.6, unitless; a bit more for large-x-height sans faces; tighter for large headlines.
- [ ] Fluid sizes via `clamp()`; no near-equal sizes in the scale, either same or clearly different.
- [ ] Widows/orphans managed: `text-wrap: balance` on headings or non-breaking spaces in headlines/nav.

## Weights, styles, and OpenType

- [ ] Real regular/italic/bold/bold-italic loaded via `@font-face` mapped to one family, with no faux bold or faux italic.
- [ ] Body weight 400-500; ultra-light weights and display cuts never used for body copy.
- [ ] Long body text never monospaced; mono reserved for code and short stylistic blocks.
- [ ] Body OpenType features on: `kern`, `liga`, `clig`, `calt`; discretionary ligatures off in body (and in code).
- [ ] Real small caps via `font-feature-settings` (with slight tracking), never pseudo small caps.

## Letterspacing and casing

- [ ] No letterspacing on body text; add ~0.05-0.2em tracking to all-caps and small labels, more as size shrinks.
- [ ] No multi-line all-caps blocks or uppercase paragraphs.
- [ ] Never letterspace monospaced or script fonts; keep metrics kerning, do not over-kern.
- [ ] Never stretch or squish type; use condensed/extended variants if a narrow style is needed.

## Paragraphs and hierarchy

- [ ] Long copy broken into paragraphs with subheads/lists; separated by spacing or indents, never both (`p + p` for indents).
- [ ] Subheads sit closer to the text they introduce than to the preceding text; dividers go above headings, not below.
- [ ] Centre alignment rare and intentional; no justified text on the web without strong hyphenation support.
- [ ] Hierarchy built one axis at a time (size, weight, caps, colour); heading levels shallow (h1-h3); headings descriptive, not generic.
- [ ] Heading colour distinct from link colour; large headings may lighten weight/colour for balance, but prefer darkened brand hues over flat grey.

## Links, contrast, and text on images

- [ ] Links distinct from body via colour or underline; link colour never used on non-links.
- [ ] Link hover states do not shift layout (no weight or size changes on hover).
- [ ] Text/background contrast passes without pure black on pure white; no low-contrast light grey body text.
- [ ] Text over photos has enforced contrast (overlay/scrim or curated images), or the pattern is avoided.
- [ ] Dark backgrounds use off-white text; long light-on-dark passages kept short.

## Numerals and tables

- [ ] Table numbers right-aligned with tabular figures (`font-variant-numeric: tabular-nums`) or a mono/system stack; thousands separators present.
- [ ] Oldstyle figures (`onum`) acceptable in running text; lining figures (`lnum`) next to uppercase and in UI.
- [ ] Numerals for counts in UI copy ("8 deployments", not "eight").

## Lists and navigation text

- [ ] Proper list markup (`<ul>`/`<ol>`); wrapped item text does not tuck under bullets; vertical spacing between multi-line items.
- [ ] Lists tested with long content at narrow widths.
- [ ] Nav spacing via CSS padding, not space characters; current item marked as selected, never greyed out like a disabled control.
- [ ] Captions/descriptions placed closer to the images they describe than to surrounding content.
