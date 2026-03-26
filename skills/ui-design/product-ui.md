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
- **Concentric border radius:** `outer-radius = inner-radius + padding`. Mismatched radii on nested elements (a card containing an inner component, a button containing an icon badge) are the most common unnoticed visual error in production UIs.
- Choose one depth strategy: borders-only, subtle shadow, layered shadow, or surface tint. When elements sit on non-white backgrounds, prefer `box-shadow` over `border` — rgba transparency adapts to any surface; solid colors don't.
- **Layered shadow formula** for cards, inputs, and containers:
  ```css
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 1px 2px -1px rgba(0, 0, 0, 0.06),
    0 2px 4px 0 rgba(0, 0, 0, 0.04);
  ```
  Hover state: increase each opacity by `0.02`. Transition with `transition: box-shadow 200ms ease`.
- **Image outlines:** add a 1px inset outline to images for depth. Use `outline` (not `border`) so layout dimensions are unaffected:
  ```css
  img {
    outline: 1px solid rgba(0, 0, 0, 0.1);
    outline-offset: -1px;
  }
  .dark img { outline-color: rgba(255, 255, 255, 0.1); }
  ```
- Keep surface treatment consistent across cards, even if internal layouts differ.

## Calm dense interfaces

Default to Linear-style restraint: calm surface hierarchy, strong typography and spacing, few colors, dense but readable information, minimal chrome. Cards only when the card is the interaction.

- Make the work surface dominant; navigation and orientation chrome should recede after the user arrives.
- Separate location/context, view controls, and page actions so each bar has one job.
- Keep shared header actions in predictable slots across comparable views.
- Use compact tabs and secondary bars; avoid full-width chrome when a smaller group communicates the same state.
- Reduce brightness, saturation, and icon size on supporting chrome before shrinking the content area itself.
- Audit every border, icon, and tint. If it does not clarify meaning, remove or soften it.
- If a panel can become plain layout without losing meaning, remove the card treatment.

## Controls

- Prefer native selects/date inputs by default for accessibility and mobile UX.
- Use custom controls only when product requirements justify the added complexity.
- Preserve keyboard navigation, semantics, and screen-reader support when custom controls are necessary.
- For select triggers, use `inline-flex` + `white-space: nowrap`.

## Type and data

- Create a clear hierarchy (headline, body, label).
- Use tabular numbers or monospace for data tables and IDs.
- Icons must add meaning; remove decorative icons and unnecessary icon backgrounds.
- Use sentence case and follow the project locale/style guide.

## Colour and contrast

- Use a 4-level contrast hierarchy (primary, secondary, muted, faint).
- Use colour only for meaning (status, action).
- Prefer restrained neutrals for core surfaces; keep warm or cool bias subtle.

## Navigation context

- Show navigation, page location, and user/workspace context.
- Keep supporting bars and inactive navigation a step quieter than the main surface.
- In dark mode, prefer borders over shadows; adjust semantic colours.

## Motion

- Keep motion subtle and functional.
- Follow `ui-animation` guidelines.

## Interaction baseline

- Use `ui-audit` for UX/a11y polish and QA.

## Utility copy

When the work is a dashboard, app surface, admin tool, or operational workspace, default to utility copy over marketing copy.

- Prioritize orientation, status, and action over promise, mood, or brand voice.
- Start with the working surface itself: KPIs, charts, filters, tables, status, or task context. Do not introduce a hero section unless explicitly requested.
- Section headings should say what the area is or what the user can do there (e.g., "Selected KPIs", "Plan status", "Search metrics", "Last sync").
- Avoid aspirational hero lines, metaphors, or campaign-style language on product surfaces.
- Supporting text should explain scope, behavior, freshness, or decision value in one sentence.
- If a sentence could appear in a homepage hero or ad, rewrite it until it sounds like product UI.
- Litmus check: if an operator scans only headings, labels, and numbers, can they understand the page immediately?

## Anti-patterns

- Heavy shadows, large radii on small controls, thick borders, gradients for decoration, glowing borders, excessive spacing, visual noise.
- Dashboard-card mosaics as the primary layout strategy.
- Decorative gradients behind routine product UI.
- Multiple competing accent colors.
- Ornamental icons that do not improve scanning.
- Stacked cards instead of plain layout when the card boundary adds no meaning.

## Standard

Aim for precise, minimal, and context-specific design.
