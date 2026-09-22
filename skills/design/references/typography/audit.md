# Typography Audit

78 rules in 10 categories in `rules-typography/`: font loading, sizing and measure, punctuation, spacing, hierarchy, text layout, OpenType, brand type, pairing, and display type. Every finding names file, rule, and fix. Proposing new typefaces or scales is Direction mode, not this audit.

## Contents

- Workflow
- Scoping signals
- Categories by priority
- Output contract
- Gotchas

## Workflow

1. Scope to changed files unless a full sweep is requested. For a PR, diff against the actual base merge-base including committed changes, filtered to `.css`, `.scss`, `.html`, `.tsx`/`.jsx`, and template files.
2. Map code to categories with the signal table; skip categories with no signal.
3. Load rule files by prefix (`rules-typography/font-*.md` and so on) only for the selected categories.
4. Run categories in priority order so CRITICAL findings surface even if the pass is cut short.
5. After fixes, re-run only the rules that produced findings.

## Scoping signals

| Signal in code | Categories to load |
|--------------------|--------------------|
| `@font-face`, `font-family`, font files, variable fonts, `font-stretch`, `transform: scaleX` on text | `font-` |
| `font-size`, `clamp()`, media-query type changes, `max-width` on text, `<em>`/`<strong>`, `text-decoration` | `size-` |
| Copy in HTML/JSX (headings, paragraphs, labels) | `punct-` |
| `line-height`, `letter-spacing`, `word-spacing`, `margin` on text, `text-transform: uppercase` | `spacing-` |
| Heading elements, type scale tokens, `--text-*` properties | `hierarchy-` |
| `text-align`, lists, blockquotes, multi-column text | `layout-` |
| `font-feature-settings`, `font-variant-*`, figures or fractions in copy | `opentype-` |
| Logo or wordmark styles, brand tokens, text colour tokens, licence comments | `brand-` |
| Two or more distinct `font-family` values | `pairing-` |
| Hero or display sizes, drop caps, `initial-letter` | `display-` |

## Categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Font Selection & Weights | CRITICAL | `font-` |
| 2 | Sizing & Measure | CRITICAL | `size-` |
| 3 | Punctuation & Special Characters | CRITICAL | `punct-` |
| 4 | Spacing & Rhythm | HIGH | `spacing-` |
| 5 | Hierarchy & Scale | MEDIUM-HIGH | `hierarchy-` |
| 6 | Alignment & Layout | MEDIUM | `layout-` |
| 7 | OpenType Features | MEDIUM | `opentype-` |
| 8 | Brand & Identity | MEDIUM | `brand-` |
| 9 | Typeface Pairing | MEDIUM | `pairing-` |
| 10 | Display & Headlines | LOW-MEDIUM | `display-` |

Rule counts and impact rationale: `rules-typography/_sections.md`. Report each finding with the rule's own frontmatter `impact`, which often differs from its category's.

## Output contract

Inside a full Audit report, typography findings are ordinary findings. Standalone, report as:

```markdown
## Typography Audit Findings

### path/to/file.css
- [CRITICAL] `punct-smart-quotes` (file.css:42): Straight quotes in heading copy.
  - Fix: Replace `"` with `&ldquo;`/`&rdquo;` (or UTF-8 curly quotes).
- [CRITICAL] `size-line-height` (file.css:18): `line-height: 20px`, a fixed value the 48px `h1` inherits, so its lines overlap.
  - Fix: Use unitless `line-height: 1.5`.

### path/to/clean-file.css
- pass
```

Group by file, order by impact within file, include clean files as `pass` so coverage is visible, and end with counts per impact level.

## Gotchas

- Report the rule's frontmatter `impact`, never the category's. `brand-color` is HIGH (a WCAG contrast floor, not a brand nicety) and `punct-daggers` is LOW-MEDIUM despite sitting in a CRITICAL category.
- Punctuation rules apply to rendered copy only. Straight quotes or `--` inside `<code>`, `<pre>`, or JS/TS string literals are a false positive; "fixing" them breaks the code.
- A CSS declaration does not prove which face loaded. Confirm the rendered font and computed styles in Verify mode when a finding depends on them.
- Do not flag missing OpenType features without confirming the loaded font ships them: browsers silently ignore unsupported `font-feature-settings` tags, so the fix does nothing.
- Do not equalize priorities. A LOW-MEDIUM `display-` nit above a CRITICAL faux-bold finding buries what actually looks broken.
