---
name: frontend-design
description: Build distinctive, brand-forward UI for marketing pages, creative sites, and experiential interfaces. Use when the user asks for a strong aesthetic point of view.
---

# Frontend Design

Deliver working code with a clear aesthetic point of view. Avoid generic AI aesthetics.

## Scope
- Use for marketing sites, brand pages, and creative experiences.
- For dashboards/admin/SaaS, use `design-principles` instead.

## Decide the direction (before coding)
- Identify purpose, audience, and constraints.
- Choose a bold tone (minimal, maximal, retro, editorial, brutalist, organic, luxury, etc).
- Define a single memorable signature detail.
- Match implementation complexity to the chosen direction.

## Non-negotiables (UX baseline)
- Full keyboard support, visible focus, and focus management in dialogs/menus.
- Hit targets >= 24px (>= 44px on mobile); hover styles only on hover-capable devices.
- Never disable browser zoom; use `touch-action: manipulation` for tap targets.
- Forms: labels wired to inputs; Enter submits; textarea uses Cmd/Ctrl+Enter; validate after input; errors inline; focus first error.
- Do not block paste or typing; keep submit enabled until request starts, then disable with spinner.
- Correct `type`, `name`, `autocomplete`, `inputmode`; disable spellcheck only when appropriate.
- Use links for navigation; URL reflects state; Back/Forward restores scroll.
- Respect safe areas; avoid unwanted scrollbars; prefer flex/grid over JS measurement.
- Handle long content and empty/error states; use `min-w-0` for truncation.
- Locale-aware formatting (`Intl.*`); use `&hellip;` and non-breaking spaces where needed.
- Preload above-the-fold images; set image dimensions; virtualize large lists; preload/subset fonts.
- Theme: `color-scheme` and `<meta name="theme-color">` match.
- Hydration: inputs with `value` must have `onChange`; guard date/time rendering.

## Aesthetic rules
- Typography: choose distinctive fonts (not Inter/Roboto/Arial/system). Weight >= 400. Use `clamp()`; tabular nums for data; enable font smoothing and legibility.
- Color: commit to a palette with CSS variables; avoid pure black/white; use one sharp accent.
- Composition: use asymmetry, contrast, and negative space intentionally.
- Backgrounds: build atmosphere with gradients/noise/patterns, not flat fills.
- Interaction details: set `pointer-events: none` on decorative layers; allow text selection by default and use `user-select: none` only on drag handles or non-text UI chrome.

## Motion
- Follow `animation-guidelines` for timing, easing, and reduced-motion behavior.

## Avoid AI slop
- Do not reuse the same font stack, purple gradients, or default layouts.
- Vary fonts, palettes, spacing systems, and visual language per project.
- Make every decision context-specific and intentional.

## Reference
- See `aesthetic-direction.md` for deeper guidance and examples.
