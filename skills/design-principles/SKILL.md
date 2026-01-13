---
name: design-principles
description: Minimal, precise design system for dashboards, admin tools, SaaS, and data-heavy UIs. Use when the UI must feel clean, crafted, and enterprise-grade.
---

# Design Principles

## Scope
- Use for SaaS/admin/dashboards and data-heavy tools.
- For marketing or creative experiences, use `frontend-design`.

## Commit to a direction
- Define product context, user type, and emotional goal.
- Pick one dominant personality: precision/density, warm/approachable, trust/financial, bold/modern, utility/dev, data/analytics.
- Choose a color foundation (warm, cool, neutral, tinted), light or dark, and a single accent.
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

## Color and contrast
- Use a 4-level contrast hierarchy (primary, secondary, muted, faint).
- Use color only for meaning (status, action).

## Navigation context
- Show navigation, page location, and user/workspace context.
- In dark mode, prefer borders over shadows; adjust semantic colors.

## Motion
- Follow `animation-guidelines` and keep motion subtle for enterprise UI.

## Interaction baseline
- Use `craft-checklist` for UX/a11y polish and `animation-guidelines` for motion.

## Anti-patterns
- Heavy shadows, large radii on small controls, thick borders, gradients for decoration, multiple accents, glowing borders, excessive spacing, visual noise.

## Standard
Aim for precise, minimal, and context-specific design.
