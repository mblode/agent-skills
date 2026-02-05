---
name: audit-ui
version: 0.1.0
description: Final UI quality audit for typography, accessibility, and UX polish. Use when reviewing or refining UI before release.
---

# UI Audit Rules

Comprehensive final-pass UI audit guide for web interfaces. Contains 27 rules across 9 categories, prioritized by impact so critical UX and accessibility issues are resolved first.

## When to Apply

Use this skill when:
- Reviewing a feature before release
- Running QA on a new page or flow
- Cleaning up UI polish after implementation
- Checking accessibility, typography, and interaction quality
- Preparing findings for code review with concrete fixes

## Audit Workflow

1. Select only the rule categories relevant to the changed surface.
2. Prioritize `CRITICAL` and `HIGH` findings before medium-priority polish.
3. For motion behavior, also apply `ui-animation` for timing/easing/reduced-motion details.
4. Use `craft-checklist.md` and `typography-checklist.md` for full sweeps and edge-case checks.

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Accessibility and Semantics | CRITICAL | `a11y-` |
| 2 | Keyboard and Interaction | CRITICAL | `interaction-` |
| 3 | Forms and Validation | CRITICAL | `forms-` |
| 4 | Typography and Readability | HIGH | `type-` |
| 5 | Navigation and Feedback | HIGH | `nav-` |
| 6 | Layout and Resilience | HIGH | `layout-` |
| 7 | Performance and Visual Stability | HIGH | `perf-` |
| 8 | Motion and Theme Behavior | HIGH | `motion-` |
| 9 | Content and Microcopy | MEDIUM | `copy-` |

## Quick Reference

### 1. Typography and Readability (`type-`)

- `type-readable-scale` - Keep body text readable across breakpoints
- `type-measure-leading` - Control line length and line-height
- `type-link-distinction-no-shift` - Keep links distinct without layout shift

### 2. Accessibility and Semantics (`a11y-`)

- `a11y-semantic-html-first` - Prefer native semantics before ARIA
- `a11y-icon-controls-labeled` - Add labels to icon-only controls
- `a11y-contrast-and-redundant-cues` - Meet contrast and avoid color-only status
- `a11y-skip-link-heading-order` - Provide skip link and logical heading order

### 3. Keyboard and Interaction (`interaction-`)

- `interaction-focus-visible` - Preserve visible keyboard focus
- `interaction-keyboard-operable` - Ensure controls are keyboard-operable
- `interaction-target-size` - Maintain safe touch target sizes

### 4. Forms and Validation (`forms-`)

- `forms-labels-and-autocomplete` - Label fields and set autocomplete metadata
- `forms-mobile-input-font-size` - Keep mobile form text readable
- `forms-inline-errors-first-focus` - Show inline errors and focus first invalid field
- `forms-dont-block-paste-ime` - Never block paste or IME workflows

### 5. Navigation and Feedback (`nav-`)

- `nav-semantic-links` - Use semantic links for navigation
- `nav-live-region-feedback` - Announce async status updates accessibly
- `nav-loading-state-timing` - Avoid spinner/skeleton flicker

### 6. Layout and Resilience (`layout-`)

- `layout-flex-grid-first` - Prefer flex/grid over JS measurement
- `layout-long-content-safety` - Handle long/unbroken content safely
- `layout-empty-loading-error-states` - Design empty/loading/error states explicitly

### 7. Performance and Visual Stability (`perf-`)

- `perf-image-dimensions-and-priority` - Prevent CLS and optimize above-fold media
- `perf-font-loading-and-preconnect` - Improve font loading critical path
- `perf-virtualize-large-lists` - Virtualize long lists

### 8. Motion and Theme Behavior (`motion-`)

- `motion-respect-reduced-motion` - Respect reduced-motion preferences
- `motion-transform-opacity-only` - Animate compositor-friendly properties

### 9. Content and Microcopy (`copy-`)

- `copy-specific-action-labels` - Use outcome-specific action labels
- `copy-actionable-error-messages` - Write actionable error messages

## How to Use

Read rule files for the issue category you are auditing:

```
rules/a11y-semantic-html-first.md
rules/forms-inline-errors-first-focus.md
rules/_sections.md
```

Each rule file contains:
- Why the rule matters
- Incorrect example
- Correct example

For deep long-form references, use:
- `craft-checklist.md`
- `typography-checklist.md`

## Review Output Contract

- Group findings by file.
- Use `file:line` format.
- State issue + location and propose a concrete fix.
- Mark clean files with `✓ pass`.
