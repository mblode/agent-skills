---
name: craft-checklist
description: Production polish checklist for UI work. Use when refining components, typography, accessibility, performance, or release readiness.
---

# Craft Checklist

Run a final polish pass before shipping UI.

## Workflow
- Apply the detailed checklist in `craft-checklist.md`.
- Prioritize legibility, keyboard access, forms, navigation/feedback, resilience, performance, and accessibility.
- Enforce only items relevant to the surface; avoid unnecessary polish.
- When reviewing, cite file paths and line numbers and propose concrete fixes.

## Quick triage
- Verify readable type sizes, line length, contrast, and distinct link styling.
- Confirm keyboard access, visible focus, and hit targets >= 24px (>= 44px mobile).
- Validate forms: labels, Enter/Cmd+Enter behavior, inline errors, no paste/typing blocks.
- Check loading/empty/error states and avoid spinner flicker.
- Ensure long content truncation (`min-w-0`, `line-clamp`) and safe-area handling.
- Ensure motion follows `animation-guidelines` and respects reduced motion.

## Reference
- See `craft-checklist.md` for the full checklist.
