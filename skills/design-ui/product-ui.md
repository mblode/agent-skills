# Product UI (SaaS/Admin/Data-heavy)

Use for dashboards, admin tools, and data-dense workflows.

## Commit to a direction
- Define product context, user type, and emotional goal.
- Pick one dominant personality: precision/density, warm/approachable, trust/financial, bold/modern, utility/dev, data/analytics.
- Choose a colour foundation (warm, cool, neutral, tinted), light or dark, and a single accent.
- Pick a layout approach: dense grid, spacious, sidebar, top nav, or split list-detail.
- Choose typography that matches the product (system, geometric sans, humanist, mono).

## Core craft rules
- Use a 4px spacing grid.
- Keep padding symmetrical unless there is a clear visual reason.
- Choose one radius system and use it everywhere.
- Choose one depth strategy: borders-only, subtle shadow, layered shadow, or surface tint.
- Keep surface treatment consistent across cards, even if internal layouts differ.

## Controls
- Build custom selects/date pickers for styled UIs; avoid native styled controls.
- For select triggers, use `inline-flex` + `white-space: nowrap`.

## Type and data
- Create a clear hierarchy (headline, body, label).
- Use tabular numbers or monospace for data tables and IDs.
- Icons must add meaning; remove decorative icons.
- Use sentence case and British/Australian spelling in UI copy.

## Colour and contrast
- Use a 4-level contrast hierarchy (primary, secondary, muted, faint).
- Use colour only for meaning (status, action).

## Navigation context
- Show navigation, page location, and user/workspace context.
- In dark mode, prefer borders over shadows; adjust semantic colours.

## Motion
- Keep motion subtle and functional.
- Follow `ui-animation` guidelines.

## Interaction baseline
- Use `audit-ui` for UX/a11y polish and QA.

## Anti-patterns
- Heavy shadows, large radii on small controls, thick borders, gradients for decoration, multiple accents, glowing borders, excessive spacing, visual noise.

## Standard
Aim for precise, minimal, and context-specific design.
