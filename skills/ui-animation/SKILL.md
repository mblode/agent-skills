---
name: ui-animation
description: Creates, reviews, and debugs UI motion and animation implementations. Covers springs, gestures, drag interactions, clip-path reveals, easing, timing, CSS transition recipes, and animation review. Use when designing, implementing, or reviewing motion, CSS transitions, keyframes, framer-motion, spring animations, asking "add animations to", "make this feel smooth", "review my animations", "should this animate", "add a swipe gesture", or "add a transition"
---

# UI Animation

## Reference files

| File                                                                       | Read when                                                                    |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [references/decision-framework.md](references/decision-framework.md)       | Default: animation decisions, easing, and duration                           |
| [references/spring-animations.md](references/spring-animations.md)         | Using spring physics, framer-motion useSpring, configuring spring params     |
| [references/component-patterns.md](references/component-patterns.md)       | Building buttons, popovers, tooltips, drawers, modals, toasts with animation |
| [references/clip-path-techniques.md](references/clip-path-techniques.md)   | Using clip-path for reveals, tabs, hold-to-delete, comparison sliders        |
| [references/gesture-drag.md](references/gesture-drag.md)                   | Implementing drag, swipe-to-dismiss, momentum, pointer capture               |
| [references/performance-deep-dive.md](references/performance-deep-dive.md) | Debugging jank, CSS vs JS, WAAPI, CSS variables trap, Framer Motion caveats  |
| [references/review-format.md](references/review-format.md)                 | Reviewing animation code — Before/After/Why table and issue checklist        |
| [references/contextual-animations.md](references/contextual-animations.md) | Implementing contextual icon swaps, word-level stagger entrances, or fixed-offset exit animations |
| [references/transition-recipes.md](references/transition-recipes.md)       | Installing a CSS transition — card resize, badge, dropdown, modal, panel, page slide, icon swap, number pop-in, text swap, success animation, avatar hover, error shake |

## Core rules

- Animate for feedback, orientation, continuity, or deliberate delight.
- Never animate keyboard-initiated actions (shortcuts, arrow navigation, tab/focus).
- Prefer CSS transitions for interruptible UI; use keyframes only for predetermined sequences.
- CSS transitions > WAAPI > CSS keyframes > JS (requestAnimationFrame).
- Make animations interruptible and input-driven.
- Asymmetric timing: for occasional interactions, enter can be slightly slower and exit should be fast. For high-frequency ephemeral UI (hover highlights, popovers, panel toggles), invert this — enter instantly (0ms), exit with a brief fade (100–150ms).
- Use `@starting-style` for DOM entry animations; fall back to `data-mounted`.
- A small `filter: blur(2px)` can hide rough crossfades.

## Motion design principles

- **Continuity over teleportation.** Elements visible in both states transition in place. Use shared element transitions — expand from where elements sit rather than fading in a new instance. Never duplicate a persistent element or hard-cut between views that share components.
- **Directional motion matches position.** Tab and carousel transitions animate in the direction matching spatial layout (left-to-right for forward, right-to-left for back).
- **Emerge from the trigger.** Overlays, trays, and panels animate outward from the element that opened them. Generic centre-screen entrances break spatial orientation.
- **Consistent polish everywhere.** Under-animated areas make the entire product feel unpolished. Motion quality must be uniform across all surfaces.
- **Delight scales inversely with frequency.** Rarer interactions have more room for personality and surprise. High-frequency actions must be invisible.
- **Motion enhances perceived speed.** Smooth transitions between states feel faster than hard cuts, even at identical load times.

## What to animate

- Movement: `transform` and `opacity` only.
- State feedback: `color`, `background-color`, and `opacity` are acceptable.
- Never animate layout properties (`width`, `height`, `top`, `left`); never use `transition: all`.
- Avoid `filter` animation for core interactions; keep blur <= 20px if unavoidable.
- SVG: apply transforms on a `<g>` wrapper with `transform-box: fill-box; transform-origin: center`.
- Disable transitions during theme switches (`[data-theme-switching] * { transition: none !important }`).

## Easing defaults

| Element                       | Duration     | Easing                           |
| ----------------------------- | ------------ | -------------------------------- |
| Button press feedback         | 100–160ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Tooltips, small popovers      | 125–200ms    | `ease-out` or enter curve        |
| Dropdowns, selects            | 150–250ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Modals, drawers               | 200–350ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Move/slide on screen          | 200–300ms    | `cubic-bezier(0.25, 1, 0.5, 1)`  |
| Simple hover (colour/opacity) | 200ms        | `ease`                           |
| Illustrative/marketing        | Up to 1000ms | Spring or custom                 |

**Named curves**

- **Enter:** `cubic-bezier(0.22, 1, 0.36, 1)` — entrances and transform-based hover
- **Move:** `cubic-bezier(0.25, 1, 0.5, 1)` — slides, drawers, panels
- **Drawer (iOS-like):** `cubic-bezier(0.32, 0.72, 0, 1)`

Avoid `ease-in` for UI. Prefer custom curves from [easing.dev](https://easing.dev/).

## Transition decision rules

Match the UI element first, then choose the recipe from [references/transition-recipes.md](references/transition-recipes.md):

| UI pattern | Recipe |
|---|---|
| Trigger + floating dot/count | Notification badge |
| Trigger + anchored surface | Menu dropdown |
| Centred surface on top of page | Modal dialog |
| Panel sliding into existing container | Panel reveal |
| List ↔ detail or wizard steps | Page side-by-side slides |
| Element dimension changes | Card resize |
| Text updating in place | Text state swap |
| Two icons in same slot | Icon swap |
| Number updating | Number pop-in |
| Confirmation / success moment | Success celebration |
| Hovering item in horizontal stack | Avatar group hover |
| Form validation error | Error state shake |

Prefer lower-overhead transitions (CSS-only) unless the design requires JS orchestration.

## Spatial and sequencing

- Set `transform-origin` at the trigger point for popovers; keep `center` for modals.
- For dialogs/menus, start around `scale(0.85–0.9)`. Never `scale(0)`.
- Stagger reveals at 30–50ms per item; total stagger under 300ms. Vary timing by visual importance — the most important element should lead. Uniform stagger (identical delays between all items) removes hierarchy and feels mechanical.
- **Paired elements rule:** Elements that animate together (modal + overlay, tooltip + arrow, FAB + label) must share the same easing curve and duration. Mismatched timing between paired elements is a common source of "something feels off" bugs.

## Accessibility

- Gate hover animations behind `@media (hover: hover) and (pointer: fine)` to avoid false positives on touch. Tailwind v4 `hover:` utilities apply this guard automatically — skip the manual media query in Tailwind v4 projects.
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
- Standard enter animation on high-frequency ephemeral UI (hover highlights, quick popovers, panel toggles) — use instant enter (0ms) with animated exit (100–150ms) so the user's action feels immediate.
- Hard stops on drag boundaries — use friction/damping instead.
- Mixing Motion `x`/`y` props with a handwritten `transform` string on the same element.
- Keyframes on rapidly-triggered elements — use CSS transitions for interruptibility.
- Static cuts between related views — if views share elements, hard cuts lose spatial context. Transition shared elements in place.
- Duplicating persistent elements across states — animate the same element from its current position to its next, rather than hiding one and showing another.
- Generic centre-screen entrance for contextual content — overlays and trays should emerge from their trigger, not fade in from nowhere.
- Animating both a container and staggering its children — pick one entrance per container. If the panel slides in, its content should already be visible when it arrives.

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
