# Product UI (SaaS/Admin/Data-heavy)

For dashboards, admin tools, and data-dense workflows.

## Contents

- Commit to a direction
- Core craft rules
- Calm dense interfaces
- Controls
- Type and data
- Colour and contrast
- Navigation context
- Motion
- Utility copy
- Anti-patterns
- Litmus checks

## Commit to a direction

- Define context, user type, emotional goal.
- Pick a personality: precision/density, warm/approachable, trust/financial, bold/modern, utility/dev, data/analytics.
- Pick a colour foundation (warm/cool/neutral/tinted), light or dark, one accent.
- Pick a layout: dense grid, spacious, sidebar, top nav, or split list-detail.
- Match typography to the product (system, geometric sans, humanist, mono).

## Core craft rules

- 4px spacing grid.
- Keep padding symmetrical unless there's a clear visual reason.
- Use one radius system everywhere.
- **Concentric border radius:** `outer-radius = inner-radius + padding`. Mismatched radii on nested elements (a card around an inner component, a button around an icon badge) are the most common unnoticed visual error in production UIs.
- Choose one depth strategy: borders-only, subtle shadow, layered shadow, or surface tint. On non-white backgrounds, prefer `box-shadow` over `border`: rgba transparency adapts to any surface; solid colors don't.
- **Layered shadow formula** for cards, inputs, and containers:
  ```css
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 1px 2px -1px rgba(0, 0, 0, 0.06),
    0 2px 4px 0 rgba(0, 0, 0, 0.04);
  ```
  Hover: increase each opacity by `0.02`; transition `box-shadow 200ms ease`.
- **Image outlines:** add a 1px inset outline for depth. Use `outline` (not `border`) so layout dimensions are unaffected:
  ```css
  img {
    outline: 1px solid rgba(0, 0, 0, 0.1);
    outline-offset: -1px;
  }
  .dark img { outline-color: rgba(255, 255, 255, 0.1); }
  ```
- Keep surface treatment consistent across cards, even when internal layouts differ.

## Calm dense interfaces

Default to Linear-style restraint: calm hierarchy, strong typography and spacing, few colors, dense but readable, minimal chrome. Cards only when the card is the interaction.

- Make the work surface dominant; navigation and orientation chrome recede after the user arrives.
- Separate location/context, view controls, and page actions so each bar has one job.
- Keep shared header actions in predictable slots across comparable views.
- Use compact tabs and secondary bars; avoid full-width chrome when a smaller group conveys the same state.
- Reduce brightness, saturation, and icon size on supporting chrome before shrinking the content area.
- Audit every border, icon, and tint; if it doesn't clarify meaning, remove or soften it.
- If a panel works as plain layout, drop the card treatment.

## Controls

- Default to native selects/date inputs for accessibility and mobile UX.
- Use custom controls only when product requirements justify the complexity.
- Preserve keyboard navigation, semantics, and screen-reader support in any custom control.
- For select triggers, use `inline-flex` + `white-space: nowrap`.

## Type and data

- Clear hierarchy (headline, body, label).
- Tabular numbers or monospace for data tables and IDs.
- Icons must add meaning; remove decorative icons and unnecessary icon backgrounds.
- Sentence case; follow the project locale/style guide.

## Colour and contrast

- 4-level contrast hierarchy (primary, secondary, muted, faint).
- Colour only for meaning (status, action).
- Restrained neutrals for core surfaces; keep warm/cool bias subtle.

## Navigation context

- Show navigation, page location, and user/workspace context.
- Keep supporting bars and inactive nav a step quieter than the main surface.
- In dark mode, prefer borders over shadows; adjust semantic colours.

## Motion

- Keep motion subtle and functional.
- Follow `ui-animation` guidelines.

## Utility copy

On dashboards, app surfaces, admin tools, or operational workspaces, default to utility copy over marketing copy.

- Prioritize orientation, status, and action over promise, mood, or brand voice.
- Start with the working surface: KPIs, charts, filters, tables, status, or task context. No hero section unless explicitly requested.
- Section headings should say what the area is or what the user can do there (e.g. "Selected KPIs", "Plan status", "Search metrics", "Last sync").
- Avoid aspirational hero lines, metaphors, or campaign language on product surfaces.
- Supporting text explains scope, behavior, freshness, or decision value in one sentence.
- If a sentence could be a homepage hero or ad, rewrite it to sound like product UI.

## Anti-patterns

- Heavy shadows, glowing or thick borders on routine controls: everything shouts, so nothing reads as primary.
- Large radii on small controls: buttons and inputs look toy-like next to dense data.
- Dashboard-card mosaics as the primary layout: a wall of boxes where hierarchy comes from the grid, not the data.
- Decorative gradients behind routine product UI: they cut text contrast and read as marketing on a work surface.
- Multiple competing accent colors: status colours stop carrying meaning when accents are everywhere.
- Ornamental icons and icon backgrounds: each costs a fixation without aiding scanning.
- Excessive spacing on data-dense surfaces: operators scroll instead of scan.
- Stacked cards instead of plain layout when the card boundary adds no meaning.

## Litmus checks

- Is the work surface louder than its navigation and chrome?
- Does every border, icon, and tint clarify meaning? Is everything else removed?
- Is colour reserved for status and action?
- Do nested elements follow the concentric radius rule (outer = inner + padding)?
- Can an operator scanning only headings, labels, and numbers understand the page?
