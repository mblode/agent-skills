---
name: ui-animation
description: Creates, reviews, and debugs UI motion and animation implementations. Use when designing, implementing, or reviewing motion, easing, timing, reduced-motion behaviour, CSS transitions, keyframes, framer-motion, spring animations, asking "add animations to", or "make this feel smooth".
---

# UI Animation

## Core rules
- Animate to clarify cause/effect or add deliberate delight.
- Keep interactions fast (200-300ms; up to 1s only for illustrative motion).
- Never animate keyboard interactions (arrow-key navigation, shortcut responses, tab/focus).
- Prefer CSS; use WAAPI or JS only when needed.
- Make animations interruptible and input-driven.
- Honor `prefers-reduced-motion` (reduce or disable).

## What to animate
- For movement and spatial change, animate only `transform` and `opacity`.
- For simple state feedback, `color`, `background-color`, and `opacity` transitions are acceptable.
- Never animate layout properties; never use `transition: all`.
- Avoid `filter` animation for core interactions; if unavoidable, keep blur <= 20px.
- SVG: apply transforms on a `<g>` wrapper with `transform-box: fill-box; transform-origin: center`.
- Disable transitions during theme switches.

## Spatial and sequencing
- Set `transform-origin` at the trigger point.
- For dialogs/menus, start around `scale(0.85-0.9)`; avoid `scale(0)`.
- Stagger reveals <= 50ms.

## Easing defaults
- Enter and transform-based hover: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Move: `cubic-bezier(0.25, 1, 0.5, 1)`.
- Simple hover colour/background/opacity: `200ms ease`.
- Avoid `ease-in` for UI (feels slow).

## Accessibility
- If `transform` is used, disable it in `prefers-reduced-motion`.
- Disable hover transitions on touch devices via `@media (hover: hover) and (pointer: fine)`.

## Performance
- Pause looping animations off-screen.
- Toggle `will-change` only during heavy motion and only for `transform`/`opacity`.
- Prefer `transform` over positional props in animation libraries.
- Do not animate drag gestures using CSS variables.

## Anti-patterns

- Using `transition: all` instead of targeting specific properties — triggers layout recalc and animates things you did not intend.
- Animating layout properties (`width`, `height`, `top`, `left`) for interactive feedback — use `transform` and `opacity` instead.
- Forgetting `prefers-reduced-motion` on any new animation — every animation needs a reduced-motion path.
- Using `ease-in` for UI entrances — feels sluggish; use the enter easing curve instead.
- Animating on mount without user trigger — unexpected motion is disorienting, especially for screen reader users.
- Using `will-change` as a permanent style — toggle it only during heavy motion, then remove it.
- Using CSS variables for drag gesture animation — causes repaints on every frame; use transform directly.

## Reference
- Snippets and practical tips: [examples.md](examples.md)

## Workflow
1. Start with the core rules, then pick a reference snippet from [examples.md](examples.md).
2. Keep motion functional; honor `prefers-reduced-motion`.
3. When reviewing, cite file paths and line numbers and propose concrete fixes.
4. Validate:
   - Test with `prefers-reduced-motion: reduce` enabled — animations must degrade gracefully.
   - Verify no layout property animations (`width`, `height`, `top`, `left`).
   - Check that looping animations pause off-screen.
   - Confirm `will-change` is toggled only during animation, not permanently set.
