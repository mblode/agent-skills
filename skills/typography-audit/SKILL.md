---
name: typography-audit
description: Audits web typography against 90 rules in 10 categories: punctuation, font selection and @font-face setup, sizing and measure, spacing and rhythm, OpenType features, hierarchy, alignment and layout, typeface pairing, brand identity, and display type. Reports file:line findings with concrete CSS/HTML fixes ordered by impact. Use when writing or reviewing CSS/HTML for text, selecting or pairing typefaces, configuring font-feature-settings or @font-face, building a type scale, or asking "audit my typography", "fix the fonts", "review my type system", "why does this text look off". Triggers on font-family, font-size, line-height, letter-spacing, smart quotes, em dashes, faux bold or italic, variable fonts, widows and orphans. For whole-UI audits beyond type (accessibility, forms, navigation), use ui-audit; for choosing a visual direction or designing a new type system, use ui-design.
---

# Typography Audit

90 rules across 10 categories for web typography quality. Every finding names a file, a rule, and a concrete fix.

- **IS:** auditing typography only: punctuation characters, font loading, sizing, spacing, OpenType features, hierarchy, text layout, typeface pairing, brand type usage, display type.
- **IS NOT:** a broad UI quality review (accessibility, forms, navigation, all of which use `ui-audit`), or a redesign that picks new typefaces and scales (use `ui-design`).

## Audit Workflow

Copy and track this checklist during the audit:

```text
Audit progress:
- [ ] Step 1: Scope. List changed files (or full sweep if requested) and map code signals to categories
- [ ] Step 2: Load and run CRITICAL rules in scope (punct-, font-)
- [ ] Step 3: Load and run HIGH rules in scope (size-, spacing-)
- [ ] Step 4: Load and run remaining in-scope categories by descending priority
- [ ] Step 5: Report per the output contract; every finding has file:line, rule ID, and a fix
```

1. Audit only changed files unless a full sweep is requested. For a PR, scope with `git diff --name-only` filtered to `.css`, `.scss`, `.html`, `.tsx`/`.jsx`, and template files.
2. Map what the code actually contains to rule categories using the signal table below; skip categories with no signal.
3. Read rule files progressively by prefix (`rules/punct-*.md`, etc.). Never preload all 90.
4. Run categories in priority order so CRITICAL findings surface even if the audit is cut short.
5. After applying fixes, re-run only the rules that produced findings, then finalize the report.

## Scoping Signals → Categories

| Signal in the code | Categories to load |
|--------------------|--------------------|
| Visible copy in HTML/JSX (headings, paragraphs, labels) | `punct-` |
| `@font-face`, `font-family`, font files, variable fonts | `font-` |
| `font-size`, `clamp()`, media-query type changes, `max-width` on text | `size-` |
| `line-height`, `letter-spacing`, `margin` on text elements, `text-transform: uppercase` | `spacing-` |
| `font-feature-settings`, `font-variant-*`, figures/fractions in copy | `opentype-` |
| Heading elements, type scale tokens, `--text-*` custom properties | `hierarchy-` |
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

Category map and impact rationale: `rules/_sections.md`. Each rule file contains why the rule matters, an incorrect example, and a correct example. Rule frontmatter carries the rule's own `impact`, so report findings with the rule's impact, which may differ from its category (e.g., `font-rendering` is MEDIUM inside the CRITICAL `font-` category).

## Review Output Contract

Report findings in this format:

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

- Group findings by file; order by impact within each file.
- Every finding: impact tag, rule ID, `file:line`, one-line issue, concrete fix.
- Include audited-but-clean files as `✓ pass` so coverage is visible.
- End with a one-line summary: counts per impact level.

## Gotchas

- Don't preload all 90 rule files; that's ~90 KB of context before the audit starts. Load only the prefixes the signal table selects.
- Punctuation rules apply to rendered copy only. Flagging straight quotes or `--` inside `<code>`, `<pre>`, or string literals in JS/TS is a false positive, and "fixing" them breaks the code.
- Don't flag missing OpenType features without confirming the loaded font ships them. Browsers silently ignore unsupported `font-feature-settings` tags, so the suggested fix would do nothing.
- Don't report a finding without `file:line` and a concrete fix; an unactionable finding forces the reader to redo the audit.
- An audit is not a redesign. Proposing new pairings or a new scale turns a 10-minute review into a design project; flag the issue and route redesign asks to `ui-design`.
- Don't equalize priorities. A LOW-MEDIUM `display-` nit listed above a CRITICAL faux-bold finding buries the issue that actually looks broken in production.

## Related Skills

- `ui-audit`: broad UI quality (accessibility, forms, navigation, motion); its typography coverage is shallower than this skill's.
- `ui-design`: choosing typefaces, scales, and visual direction from scratch; run it when an audit finding becomes a redesign request.
