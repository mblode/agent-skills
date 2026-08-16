---
name: typography-audit
description: >-
  Audits web typography against 78 rules in 10 categories: font selection and
  @font-face setup, sizing and measure, punctuation, spacing and rhythm,
  hierarchy, alignment and layout, OpenType features, brand identity, typeface
  pairing, and display type. Reports file:line findings with concrete CSS/HTML
  fixes ordered by impact. Use when writing or reviewing CSS/HTML for text,
  selecting or pairing typefaces, configuring font-feature-settings or
  @font-face, building a type scale, or asking "audit my typography", "fix the
  fonts", "review my type system", "why does this text look off". Triggers on
  font-family, font-size, line-height, letter-spacing, smart quotes, em dashes,
  faux bold or italic, variable fonts, widows and orphans. For whole-UI audits
  beyond type (accessibility, forms, navigation), use ui-design Audit mode; for
  choosing a visual direction or designing a new type system, use ui-design
  Direction mode.
---

# Typography Audit

78 rules in 10 categories for web typography. Every finding names file, rule, and fix.

- **IS:** typography only: font loading, sizing, punctuation, spacing, hierarchy, text layout, OpenType features, typeface pairing, brand type, display type.
- **IS NOT:** broad UI review (accessibility, forms, navigation: use `ui-design` Audit mode), or a redesign (new typefaces, scales: use `ui-design` Direction mode).

## Audit Workflow

Track this checklist:

```text
Audit progress:
- [ ] Step 1: Scope. List changed files (or full sweep), map signals to categories
- [ ] Step 2: Run CRITICAL rules in scope (font-, size-, punct-)
- [ ] Step 3: Run HIGH rules in scope (spacing-)
- [ ] Step 4: Run remaining in-scope categories by descending priority
- [ ] Step 5: Report per the contract; every finding has file:line, rule ID, fix
```

1. Scope to changed files unless a full sweep is requested. For a PR: `git diff --name-only` filtered to `.css`, `.scss`, `.html`, `.tsx`/`.jsx`, and template files.
2. Map code to categories via the signal table; skip categories with no signal.
3. Load rule files by prefix (`rules/font-*.md`, etc.), only for the categories the signals selected.
4. Run categories in priority order so CRITICAL findings surface even if the audit is cut short.
5. After fixes, re-run only the rules that produced findings, then finalize the report.

## Scoping Signals → Categories

| Signal in code | Categories to load |
|--------------------|--------------------|
| `@font-face`, `font-family`, font files, variable fonts, `font-stretch`, `transform: scaleX` on text | `font-` |
| `font-size`, `clamp()`, media-query type changes, `max-width` on text, `<em>`/`<strong>`, `text-decoration` | `size-` |
| Copy in HTML/JSX (headings, paragraphs, labels) | `punct-` |
| `line-height`, `letter-spacing`, `word-spacing`, `margin` on text, `text-transform: uppercase` | `spacing-` |
| Heading elements, type scale tokens, `--text-*` properties | `hierarchy-` |
| `text-align`, lists, blockquotes, multi-column text | `layout-` |
| `font-feature-settings`, `font-variant-*`, figures/fractions in copy | `opentype-` |
| Logo/wordmark styles, brand tokens, text color tokens, license comments | `brand-` |
| Two or more distinct `font-family` values | `pairing-` |
| Hero/display sizes, drop caps, `initial-letter` | `display-` |

## Rule Categories by Priority

| Priority | Category | Impact | Prefix | Rules |
|----------|----------|--------|--------|-------|
| 1 | Font Selection & Weights | CRITICAL | `font-` | 11 |
| 2 | Sizing & Measure | CRITICAL | `size-` | 6 |
| 3 | Punctuation & Special Characters | CRITICAL | `punct-` | 12 |
| 4 | Spacing & Rhythm | HIGH | `spacing-` | 8 |
| 5 | Hierarchy & Scale | MEDIUM-HIGH | `hierarchy-` | 8 |
| 6 | Alignment & Layout | MEDIUM | `layout-` | 6 |
| 7 | OpenType Features | MEDIUM | `opentype-` | 7 |
| 8 | Brand & Identity | MEDIUM | `brand-` | 8 |
| 9 | Typeface Pairing | MEDIUM | `pairing-` | 5 |
| 10 | Display & Headlines | LOW-MEDIUM | `display-` | 7 |

Category map and impact rationale: `rules/_sections.md`. Each rule file gives why it matters plus an incorrect and a correct example. Category impact reflects the category's worst-case rules; report findings with the rule's own frontmatter `impact`, which frequently differs (e.g. `brand-color` is HIGH inside the MEDIUM `brand-` category because it holds the WCAG contrast floor).

## Review Output Contract

Report findings as:

```markdown
## Typography Audit Findings

### path/to/file.css
- [CRITICAL] `punct-smart-quotes` (file.css:42): Straight quotes in heading copy.
  - Fix: Replace `"` with `&ldquo;`/`&rdquo;` (or UTF-8 curly quotes).
- [CRITICAL] `size-line-height` (file.css:18): `line-height: 20px`, a fixed value the 48px `h1` inherits, so its lines overlap.
  - Fix: Use unitless `line-height: 1.5`.

### path/to/clean-file.css
- ✓ pass
```

- Group by file; order by impact within file.
- Every finding: impact tag, rule ID, `file:line`, one-line issue, fix.
- Include clean files as `✓ pass` so coverage is visible.
- End with a summary: counts per impact level.


## Gotchas

- Don't preload all 78 rule files. Load only the prefixes the signal table selects.
- Report the rule's frontmatter `impact`, never the category's. Two rules get misreported most: `brand-color` is HIGH (an accessibility floor, not a brand nicety) and `punct-daggers` is LOW-MEDIUM (decoration, despite sitting in a CRITICAL category).
- Punctuation rules apply to rendered copy only. Flagging straight quotes or `--` inside `<code>`, `<pre>`, or JS/TS string literals is a false positive; "fixing" them breaks the code.
- Don't flag missing OpenType features without confirming the loaded font ships them. Browsers silently ignore unsupported `font-feature-settings` tags, so the fix does nothing.
- Every finding needs `file:line` and a concrete fix; an unactionable finding forces a redo.
- An audit is not a redesign. Proposing new pairings or scales turns a 10-minute review into a design project; flag the issue and route redesign asks to `ui-design`.
- Don't equalize priorities. A LOW-MEDIUM `display-` nit above a CRITICAL faux-bold finding buries what actually looks broken.

## Related Skills

- `ui-design` Audit mode: broad frontend quality (accessibility, forms, navigation, motion); its typography coverage is shallower.
- `ui-design` Direction mode: choosing typefaces, scales, and visual direction from scratch; run when a finding becomes a redesign request.
- `copywriting`: heading and label wording. This skill governs only the casing of that copy (`punct-case-rules`).
- Taste Training (blode.co/taste-training): trains the eye these rules encode, across type, copy, craft, interaction, and motion.
