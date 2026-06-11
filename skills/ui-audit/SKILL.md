---
name: ui-audit
description: Audits web UI quality at page or feature level across accessibility, keyboard interaction, forms, typography surface checks, navigation feedback, layout resilience, performance, motion, and microcopy. 35 prefix-dispatched rules plus craft and typography sweep checklists; reports findings by file with impact ratings and concrete fixes. Use when reviewing or refining frontend UI before merge or release, asking "check my UI", "is this accessible", "polish this page", "design QA this", or requesting a UI or accessibility audit. For code-level React/Next.js UX bugs in a diff (state coverage, focus management, optimistic UI), use ux-audit. For agentic-app patterns and trust design, use ax-audit. For deep typography (typeface pairing, brand identity, display type), use typography-audit. For motion implementation (springs, easing, gestures), use ui-animation.
---

# UI Audit

Page/feature-level audit of web UI quality. Loads only the rule categories the current surfaces need, reports findings with `file:line` and a concrete fix for each.

- **IS:** a broad quality audit of rendered web UI (accessibility, keyboard, forms, typography surface checks, navigation feedback, layout resilience, performance, motion, microcopy) at the page or feature level.
- **IS NOT:** a diff-level React/Next.js UX bug hunt (use `ux-audit`), an agentic-app pattern review (use `ax-audit`), a typography system design or pairing audit (use `typography-audit`), or motion implementation work (use `ui-animation`).

## Audit Workflow

Copy and track this checklist during the audit:

```text
Audit progress:
- [ ] Step 1: Scope. List the surfaces under audit and the rule prefixes they need
- [ ] Step 2: Load rules. Read rules/<prefix>-*.md for selected prefixes only
- [ ] Step 3: CRITICAL pass. a11y, interaction, forms against every scoped file
- [ ] Step 4: HIGH/MEDIUM pass. Remaining selected prefixes
- [ ] Step 5: Optional sweeps. Craft/typography checklists if polish is in scope
- [ ] Step 6: Report. Findings per file with rule id, impact, and fix; clean files as pass
```

1. **Scope.** Default to changed pages/components only. A full-app sweep must be explicitly requested. Map each surface to the prefixes it can violate (a form screen needs `forms-`, `a11y-`, `interaction-`; a marketing page adds `type-`, `perf-`, `copy-`).
2. **Load rules by prefix.** Read `rules/_sections.md` for the category map, then only the `rules/<prefix>-*.md` files for selected prefixes.
3. **CRITICAL first.** Run `a11y-`, `interaction-`, and `forms-` before anything else. Do not start visual polish while an unlabeled icon button or keyboard trap is open.
4. **HIGH/MEDIUM next.** Then `type-`, `nav-`, `layout-`, `perf-`, `motion-`, `copy-` as scoped.
5. **Optional sweeps.** When the request includes polish, hierarchy, or chrome cleanup, run `references/craft-checklist.md`. When typography is a named concern, run `references/typography-checklist.md`.
6. **Report and verify.** Emit the output contract below. After fixes are applied, rerun the same rule subset on touched files before marking them pass; the rerun output is the evidence the audit is done.

## Rule Categories by Priority

35 rules total. Per-rule frontmatter may override the category impact (e.g. `perf-image-dimensions-and-priority` is CRITICAL inside the HIGH `perf-` category), so report the rule's own impact, not the category's.

| Priority | Prefix | Category | Impact | Rules |
|----------|--------|----------|--------|-------|
| 1 | `a11y-` | Accessibility and Semantics | CRITICAL | 8 |
| 2 | `interaction-` | Keyboard and Interaction | CRITICAL | 3 |
| 3 | `forms-` | Forms and Validation | CRITICAL | 5 |
| 4 | `type-` | Typography and Readability | HIGH | 3 |
| 5 | `nav-` | Navigation and Feedback | HIGH | 3 |
| 6 | `layout-` | Layout and Resilience | HIGH | 3 |
| 7 | `perf-` | Performance and Visual Stability | HIGH | 6 |
| 8 | `motion-` | Motion and Theme Behavior | HIGH | 2 |
| 9 | `copy-` | Content and Microcopy | MEDIUM | 2 |

## Reference Files

Load on condition, not by default:

- `rules/_sections.md`: category map with impact rationale. Read at Step 2 of every audit.
- `rules/<prefix>-*.md`: rule-level guidance and examples. Read only the prefixes selected in Step 1.
- `references/craft-checklist.md`: final polish sweep (hit targets, hover states, chrome hierarchy, optical alignment, concentric radii, anti-patterns). Read when the request includes "polish", visual hierarchy, or pre-release sign-off.
- `references/typography-checklist.md`: typography surface sweep (punctuation, measure, leading, OpenType basics, link styling, table numerals). Read when typography is explicitly in scope. For typeface pairing, brand identity, or display type, route to the `typography-audit` skill instead.

## Review Output Contract

Report findings in this format:

```markdown
## UI Audit Findings

### path/to/file.tsx
- [CRITICAL] `a11y-image-alt-text` (line 42): `<img src="/chart.png" />` has no alt attribute.
  - Fix: Add `alt="Revenue grew 40% from Q1 to Q2"` (or `alt=""` if decorative).
- [HIGH] `a11y-icon-controls-labeled` (line 58): Icon button has no accessible name.
  - Fix: Add `aria-label="Close dialog"` (or a visible text label).
- [HIGH] `layout-long-content-safety` (line 87): `.card-title` uses `white-space: nowrap` with no overflow handling.
  - Fix: Add `min-width: 0` on the flex parent and `overflow: hidden; text-overflow: ellipsis` on the title.

### path/to/clean-file.tsx
- ✓ pass
```

- Group findings by file; include `file:line` when line numbers are available.
- Every finding states the issue and a concrete fix, never just "improve accessibility".
- Use the rule's own impact from its frontmatter.
- Include every scoped file, clean ones as `✓ pass`.

## Gotchas

- Do not load all 35 rule files for a scoped audit; the context cost flattens finding quality. Load only the prefixes mapped in Step 1; a typical component audit needs 3-4 prefixes.
- Do not invent rule ids. Citing a nonexistent id (e.g. `a11y-focus-trap`) breaks the user's ability to look up the rule; cite only filenames that exist under `rules/`, and describe id-less issues in prose.
- Do not widen scope unprompted. Auditing the whole app when one component changed buries the real findings in noise; a full sweep requires an explicit request.
- Do not reorder priorities for convenience. Reporting border-radius polish while an unlabeled form input (`forms-labels-and-autocomplete`) or keyboard-inoperable control (`interaction-keyboard-operable`) ships inverts the table's load-bearing order; CRITICAL categories always run first.
- Do not mark `✓ pass` on a file you did not read against the loaded rules. An assumed pass that later surfaces a contrast or label failure costs more trust than a slower audit.
- Do not report findings at category impact when the rule frontmatter says otherwise: `perf-image-dimensions-and-priority` is CRITICAL (CLS) even though `perf-` is a HIGH category.
- The anti-patterns list in `references/craft-checklist.md` describes UI code being audited, not this skill's execution; do not flag the skill's own report format against it.

## Related Skills

- `ux-audit`: diff-aware React/Next.js UX bug hunt (state coverage, form data loss, focus management); use it for code-level review of a PR.
- `ax-audit`: agentic application patterns and trust design.
- `typography-audit`: deep typography, covering pairing, OpenType systems, brand and display type.
- `ui-animation`: motion implementation and review (springs, easing, gestures); apply it when audit findings require motion work.
- `ui-design`: visual direction and rebuilding the UI when the fix is "redesign", not "repair"; its Responsive and Dark mode modes cover breakpoint repairs and dark-mode contrast work.
