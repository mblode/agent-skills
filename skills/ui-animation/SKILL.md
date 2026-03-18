---
name: ui-animation
description: Creates, reviews, and debugs UI motion and animation implementations. Covers springs, gestures, drag interactions, clip-path reveals, easing, timing, and animation review. Use when designing, implementing, or reviewing motion, CSS transitions, keyframes, framer-motion, spring animations, asking "add animations to", "make this feel smooth", "review my animations", "should this animate", or "add a swipe gesture".
---

# UI Animation

## Reference files

| File | Read when |
|---|---|
| [references/decision-framework.md](references/decision-framework.md) | Default: animation decisions, easing, and duration |
| [references/spring-animations.md](references/spring-animations.md) | Using spring physics, framer-motion useSpring, configuring spring params |
| [references/component-patterns.md](references/component-patterns.md) | Building buttons, popovers, tooltips, drawers, modals, toasts with animation |
| [references/clip-path-techniques.md](references/clip-path-techniques.md) | Using clip-path for reveals, tabs, hold-to-delete, comparison sliders |
| [references/gesture-drag.md](references/gesture-drag.md) | Implementing drag, swipe-to-dismiss, momentum, pointer capture |
| [references/performance-deep-dive.md](references/performance-deep-dive.md) | Debugging jank, CSS vs JS, WAAPI, CSS variables trap, Framer Motion caveats |
| [references/review-format.md](references/review-format.md) | Reviewing animation code — Before/After/Why table and issue checklist |

## Core rules

- Animate for feedback, orientation, continuity, or deliberate delight.
- Never animate keyboard-initiated actions (shortcuts, arrow navigation, tab/focus).
- Prefer CSS transitions for interruptible UI; use keyframes only for predetermined sequences.
- CSS transitions > WAAPI > CSS keyframes > JS (requestAnimationFrame).
- Make animations interruptible and input-driven.
- Asymmetric timing: enter can be slightly slower; exit should be fast.
- Use `@starting-style` for DOM entry animations; fall back to `data-mounted`.
- A small `filter: blur(2px)` can hide rough crossfades.

## What to animate

- Movement: `transform` and `opacity` only.
- State feedback: `color`, `background-color`, and `opacity` are acceptable.
- Never animate layout properties (`width`, `height`, `top`, `left`); never use `transition: all`.
- Avoid `filter` animation for core interactions; keep blur <= 20px if unavoidable.
- SVG: apply transforms on a `<g>` wrapper with `transform-box: fill-box; transform-origin: center`.
- Disable transitions during theme switches (`[data-theme-switching] * { transition: none !important }`).

## Easing defaults

| Element | Duration | Easing |
|---|---|---|
| Button press feedback | 100–160ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Tooltips, small popovers | 125–200ms | `ease-out` or enter curve |
| Dropdowns, selects | 150–250ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Modals, drawers | 200–350ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Move/slide on screen | 200–300ms | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Simple hover (colour/opacity) | 200ms | `ease` |
| Illustrative/marketing | Up to 1000ms | Spring or custom |

**Named curves**
- **Enter:** `cubic-bezier(0.22, 1, 0.36, 1)` — entrances and transform-based hover
- **Move:** `cubic-bezier(0.25, 1, 0.5, 1)` — slides, drawers, panels
- **Drawer (iOS-like):** `cubic-bezier(0.32, 0.72, 0, 1)`

Avoid `ease-in` for UI. Prefer custom curves from [easing.dev](https://easing.dev/).

## Spatial and sequencing

- Set `transform-origin` at the trigger point for popovers; keep `center` for modals.
- For dialogs/menus, start around `scale(0.85–0.9)`. Never `scale(0)`.
- Stagger reveals at 30–50ms per item; total stagger under 300ms.

## Accessibility

- Gate hover animations behind `@media (hover: hover) and (pointer: fine)` to avoid false positives on touch.
- During direct manipulation, keep the element locked to the pointer. Add easing only after release.

## Performance

- Only animate `transform` and `opacity` — these skip layout and paint.
- Pause looping animations off-screen with `IntersectionObserver`.
- Toggle `will-change` only during heavy motion and only for `transform`/`opacity` — remove after.
- Do not animate drag gestures using CSS variables (triggers recalc on all children).
- Motion `x`/`y` values are the normal choice for axis-based movement and drag. Use full `transform` strings when you need one transform owner for combined transforms or interop.
- See [references/performance-deep-dive.md](references/performance-deep-dive.md) for WAAPI, compositing layers, and CSS vs JS comparison.

## Anti-patterns

- `transition: all` — triggers layout recalc and animates unintended properties.
- Animating layout properties (`width`, `height`, `top`, `left`) for interactive feedback.
- Using `ease-in` for UI entrances — feels sluggish.
- Animating from `scale(0)` — nothing in the real world appears from nothing. Use `scale(0.85–0.95)`.
- Animating on mount without user trigger — unexpected motion is disorienting.
- Permanent `will-change` — toggle it only during heavy motion.
- CSS variables for drag gesture animation — repaints every frame.
- Symmetric enter/exit timing — exit should be faster (user expects instant response).
- Hard stops on drag boundaries — use friction/damping instead.
- Mixing Motion `x`/`y` props with a handwritten `transform` string on the same element.
- Keyframes on rapidly-triggered elements — use CSS transitions for interruptibility.

## Workflow

Copy and track this checklist:

```text
Animation progress:
- [ ] Step 1: Decide whether the interaction should animate
- [ ] Step 2: Choose purpose, easing, and duration
- [ ] Step 3: Pick the implementation style
- [ ] Step 4: Load the relevant component or technique reference
- [ ] Step 5: Validate timing, interruption, and device behavior
```

1. Answer the four questions from [references/decision-framework.md](references/decision-framework.md): should it animate? What purpose? What easing? What speed?
2. Pick duration from the easing defaults table above.
3. Choose implementation: CSS transition > WAAPI > spring > keyframe > JS.
4. Load the relevant reference for your component type or technique.
5. When reviewing, use the Before/After/Why table format from [references/review-format.md](references/review-format.md).

## Validation

- Verify no layout property animations (`width`, `height`, `top`, `left`).
- Check that looping animations pause off-screen.
- Confirm `will-change` is toggled only during animation, not permanently set.
- Retoggle components quickly to confirm transitions retarget cleanly instead of restarting from zero.
- Slow animations to 0.1x in DevTools to catch timing issues invisible at full speed.
- Record and play back frame-by-frame for coordinated property timing.
- Test touch interactions on real devices (not just simulators).
