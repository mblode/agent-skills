---
name: flawless-typography
description: Comprehensive typography checklist for UI implementation and reviews. Use when auditing or implementing typography, punctuation, type pairing, and readability.
---

# Flawless Typography

Apply a disciplined typography audit for UI/web work.

## Workflow
- Use `typography-checklist.md` as the source of truth.
- Start with legibility: size, line length, line height, and contrast.
- Enforce punctuation and numerals in user-facing copy.
- Ensure real italics and required glyphs are loaded; avoid faux styles.
- When reviewing, cite file paths and line numbers and propose concrete fixes.

## Quick triage
- Replace straight quotes; use correct dashes and prime symbols.
- Set base size and line length (45-75 chars) with line-height ~1.45.
- Make link styling distinct and accessible.
- Use tabular numbers for tables and data-heavy UI.
- Avoid all-caps body; add tracking only to uppercase labels.
- Prevent widows/orphans with `text-wrap: balance` or non-breaking spaces.

## Reference
- See `typography-checklist.md` for the full checklist.
