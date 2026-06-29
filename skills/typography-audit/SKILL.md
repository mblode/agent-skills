---
name: typography-audit
description: >-
  Audits web typography against 90 rules in 10 categories: punctuation, font
  selection and @font-face setup, sizing and measure, spacing and rhythm,
  OpenType features, hierarchy, alignment and layout, typeface pairing, brand
  identity, and display type. Reports file:line findings with concrete
  CSS/HTML fixes ordered by impact. Use when writing or reviewing CSS/HTML for
  text, selecting or pairing typefaces, configuring font-feature-settings or
  @font-face, building a type scale, or asking "audit my typography", "fix the
  fonts", "review my type system", "why does this text look off". Triggers on
  font-family, font-size, line-height, letter-spacing, smart quotes, em dashes,
  faux bold or italic, variable fonts, widows and orphans. For whole-UI audits
  beyond type (accessibility, forms, navigation), use ui-audit; for choosing a
  visual direction or designing a new type system, use ui-design.
---

# Typography Audit

90 rules in 10 categories for web typography. Every finding names file, rule, and fix.

- **IS:** typography only: punctuation, font loading, sizing, spacing, OpenType features, hierarchy, text layout, typeface pairing, brand type, display type.
- **IS NOT:** broad UI review (accessibility, forms, navigation: use `ui-audit`), or a redesign (new typefaces, scales: use `ui-design`).

## Audit Workflow

Track this checklist:

```text
Audit progress:
- [ ] Step 1: Scope. List changed files (or full sweep), map signals to categories
- [ ] Step 2: Run CRITICAL rules in scope (punct-, font-)
- [ ] Step 3: Run HIGH rules in scope (size-, spacing-)
- [ ] Step 4: Run remaining in-scope categories by descending priority
- [ ] Step 5: Report per the contract; every finding has file:line, rule ID, fix
```

1. Scope to changed files unless a full sweep is requested. For a PR: `git diff --name-only` filtered to `.css`, `.scss`, `.html`, `.tsx`/`.jsx`, and template files.
2. Map code to categories via the signal table; skip categories with no signal.
3. Load rule files progressively by prefix (`rules/punct-*.md`, etc.). Never preload all 90.
4. Run categories in priority order so CRITICAL findings surface even if the audit is cut short.
5. After fixes, re-run only the rules that produced findings, then finalize the report.

## Scoping Signals → Categories

| Signal in code | Categories to load |
|--------------------|--------------------|
| Copy in HTML/JSX (headings, paragraphs, labels) | `punct-` |
| `@font-face`, `font-family`, font files, variable fonts | `font-` |
| `font-size`, `clamp()`, media-query type changes, `max-width` on text | `size-` |
| `line-height`, `letter-spacing`, `margin` on text, `text-transform: uppercase` | `spacing-` |
| `font-feature-settings`, `font-variant-*`, figures/fractions in copy | `opentype-` |
| Heading elements, type scale tokens, `--text-*` properties | `hierarchy-` |
| `text-align`, lists, blockquotes, multi-column text | `layout-` |
| Two or more distinct `font-family` values | `pairing-` |
| Logo/wordmark styles, brand tokens, license comments | `brand-` |
| Hero/display sizes, drop caps, `initial-letter` | `display-` |

## Rule Categories by Priority

| Priority | Category | Impact | Prefix | Rules |
|----------|----------|--------|--------|-------|
| 1 | Punctuation & Special Characters | CRITICAL | `punct-` | 12 |
| 2 | Font Selection & Weights | CRITICAL | `font-` | 11 |
| 3 | Sizing & Measure | HIGH | `size-` | 7 |
| 4 | Spacing & Rhythm | HIGH | `spacing-` | 10 |
| 5 | OpenType Features | MEDIUM-HIGH | `opentype-` | 8 |
| 6 | Hierarchy & Scale | MEDIUM-HIGH | `hierarchy-` | 8 |
| 7 | Alignment & Layout | MEDIUM | `layout-` | 8 |
| 8 | Typeface Pairing | MEDIUM | `pairing-` | 10 |
| 9 | Brand & Identity | LOW-MEDIUM | `brand-` | 8 |
| 10 | Display & Headlines | LOW-MEDIUM | `display-` | 8 |

Category map and impact rationale: `rules/_sections.md`. Each rule file gives why it matters plus an incorrect and a correct example. Report findings with the rule's own frontmatter `impact`, which may differ from its category (e.g., `font-rendering` is MEDIUM inside the CRITICAL `font-` category).

## Review Output Contract

Report findings as:

```markdown
## Typography Audit Findings

### path/to/file.css
- [CRITICAL] `punct-smart-quotes` (file.css:42): Straight quotes in heading copy.
  - Fix: Replace `"` with `&ldquo;`/`&rdquo;` (or UTF-8 curly quotes).
- [HIGH] `size-line-height` (file.css:18): `line-height: 20px`, a fixed value that breaks at larger font sizes.
  - Fix: Use unitless `line-height: 1.5`.

### path/to/clean-file.css
- ✓ pass
```

- Group by file; order by impact within file.
- Every finding: impact tag, rule ID, `file:line`, one-line issue, fix.
- Include clean files as `✓ pass` so coverage is visible.
- End with a summary: counts per impact level.

## Gotchas

- Don't preload all 90 rule files (~90 KB before the audit starts). Load only the prefixes the signal table selects.
- Punctuation rules apply to rendered copy only. Flagging straight quotes or `--` inside `<code>`, `<pre>`, or JS/TS string literals is a false positive; "fixing" them breaks the code.
- Don't flag missing OpenType features without confirming the loaded font ships them. Browsers silently ignore unsupported `font-feature-settings` tags, so the fix does nothing.
- Every finding needs `file:line` and a concrete fix; an unactionable finding forces a redo.
- An audit is not a redesign. Proposing new pairings or scales turns a 10-minute review into a design project; flag the issue and route redesign asks to `ui-design`.
- Don't equalize priorities. A LOW-MEDIUM `display-` nit above a CRITICAL faux-bold finding buries what actually looks broken.

## Related Skills

- `ui-audit`: broad frontend quality (accessibility, forms, navigation, motion); its typography coverage is shallower.
- `ui-design`: choosing typefaces, scales, and visual direction from scratch; run when a finding becomes a redesign request.
