# Animation Review Format

## Contents
- [Operating posture](#operating-posture)
- [Ten non-negotiable standards](#ten-non-negotiable-standards)
- [Remedial preference hierarchy](#remedial-preference-hierarchy)
- [Before/After/Why table](#beforeafterwhy-table)
- [Review checklist](#review-checklist)
- [Verdict output](#verdict-output)
- [Component design principles](#component-design-principles)
- [Debugging animations](#debugging-animations)

## Operating posture

Senior motion reviewer with a brutal eye for craft. Bias toward motion that feels right, not motion that merely runs. A transition that works but feels sluggish, lands from the wrong origin, fires too often, or drops frames is a regression, not a pass. Default to flagging; approval is earned, not assumed.

## Ten non-negotiable standards

Measure every animation in the diff against these; a violation is a finding. For exact values (curves, durations, spring config), cite the easing/duration tables in `SKILL.md` rather than approximating. Each standard ends with a **Flag on sight** clause: hard findings to catch without deliberation.

1. **Justified motion.** Every animation answers "why animate this?": feedback, orientation, continuity, state, or deliberate delight. "Looks cool" on a frequently-seen element is a block.
2. **Frequency-appropriate.** Keyboard-initiated and 100+/day actions get no animation; tens/day gets reduced motion; occasional gets standard; rare or first-time can carry delight. Flag on sight: animation on a keyboard shortcut, command-palette toggle, or 100+/day action.
3. **Responsive easing.** Entering/exiting elements use `ease-out` or a strong custom curve; built-in CSS easings are too weak for deliberate animation. Flag on sight: `ease-in` on any UI interaction, or weak built-in easing on a deliberate animation (it delays the moment the user watches most).
4. **Sub-300ms UI.** UI animations stay under 300ms; scale duration with distance traveled. Flag on sight: UI duration > 300ms with no stated reason.
5. **Origin and physical correctness.** Popovers, dropdowns, and tooltips scale from their trigger (`transform-origin`), not center; modals stay centered. Flag on sight: `transform-origin: center` on a trigger-anchored popover/dropdown/tooltip, or `scale(0)`/pure-fade entrances with no initial transform (start at `scale(0.85-0.97)` plus opacity).
6. **Interruptibility.** Rapidly-triggered or gesture-driven motion (toasts, toggles, drags) must retarget from its current state; prefer CSS transitions or springs over keyframes, which restart from zero. Flag on sight: keyframes on toasts, toggles, or anything added/triggered rapidly.
7. **GPU-only properties.** Animate `transform` and `opacity` only. Flag on sight: animating `width`/`height`/`margin`/`padding`/`top`/`left`; `transition: all` (unbounded property animation); Framer Motion `x`/`y`/`scale` props on motion that runs while the page is busy; updating a CSS variable on a parent to drive a child transform (style recalc storm).
8. **Accessibility.** `prefers-reduced-motion` is honored (gentler, not zero: keep opacity/color, drop movement); hover animations gated behind `@media (hover: hover) and (pointer: fine)`. Flag on sight: missing reduced-motion handling on movement, or ungated `:hover` motion.
9. **Asymmetric enter/exit.** Deliberate actions (a press, a hold, a destructive confirm) animate slower; system responses snap. Flag on sight: symmetric enter/exit timing on a press-and-release or hold interaction.
10. **Cohesion.** Motion matches the component's personality and the rest of the product: playful can be bouncier, a dashboard stays crisp. When unsure whether motion feels right, the strongest move is often to delete it. Flag on sight: mismatched personality, a jarring crossfade where a subtle blur would bridge two states, or an everything-at-once entrance where a 30-50ms stagger belongs.

## Remedial preference hierarchy

Prefer earlier moves over later ones:

1. **Delete the animation** (high-frequency, no purpose, or keyboard-triggered).
2. **Reduce it**: shorter duration, smaller transform, fewer animated properties.
3. **Fix the easing**: swap `ease-in` to `ease-out` or a strong custom curve.
4. **Fix the origin and physicality**: correct `transform-origin`; replace `scale(0)` with `scale(0.95)` plus opacity.
5. **Make it interruptible**: keyframes to transitions, or a spring for gesture-driven motion.
6. **Move it to the GPU**: layout props to `transform`/`opacity`; shorthand to a full `transform` string; WAAPI for programmatic CSS.
7. **Asymmetric timing**: slow the deliberate phase, snap the response.
8. **Polish**: blur to mask crossfades, stagger for groups, `@starting-style` for entry, spring for "alive" elements.
9. **Accessibility and cohesion**: add reduced-motion and hover gating; tune to match the component's personality.

## Before/After/Why table

Required first part of every review. Markdown table, one row per issue; never a "Before:/After:" list on separate lines.

| Before | After | Why |
|---|---|---|
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; `all` animates unintended properties off-GPU |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing in the real world appears from nothing |
| `ease-in` on dropdown | `ease-out` with custom curve | `ease-in` feels sluggish; `ease-out` gives instant feedback |
| No `:active` state on button | `transform: scale(0.97)` on `:active` | Buttons must feel responsive to press |
| `transform-origin: center` on popover | `transform-origin: var(--radix-popover-content-transform-origin)` | Popovers scale from trigger (modals stay centered) |

## Review checklist

Rows add recipe-specific signal beyond the ten standards; for the standard violations (`transition: all`, layout props, `ease-in`, `scale(0)`, hover guard, symmetric timing, keyboard action, >300ms, rapid-fire keyframes) see the Flag-on-sight clauses above.

| Issue | Fix |
|---|---|
| CSS variable drag animation | Use `transform` directly on the element |
| Missing `setPointerCapture` on drag | Add pointer capture for reliable tracking |
| Motion `x`/`y` mixed with a handwritten `transform` | Pick one transform owner |
| Hard cut between views sharing elements | Add shared-element transition; animate persistent components in place |
| Contextual overlay enters from centre | Set `transform-origin` to trigger; animate outward from source |
| Elements all appear at once | Add stagger delay (30-50ms between items) |
| Touch target under 44px on interactive element | Add `::before` pseudo-element sized to 44x44px minimum (WCAG 2.5.5) |
| Hover scale > 1.03 or hover duration > 150ms | Use `scale(1.01-1.02)` and 100-150ms transition |
| Container animates AND children stagger | Pick one entrance: animate the container OR stagger children, not both |
| Missing close-state cleanup after `setTimeout` | Add `is-closing` class, remove after transition duration |
| Missing reflow (`void el.offsetWidth`) between class changes | Force reflow before re-adding classes to restart transitions |
| Animating container instead of inner pieces | Apply transitions to child elements, not the wrapper |
| Hardcoded `stroke-dasharray` on SVG success path | Use `path.getTotalLength()` to measure the path |
| `.is-error` and `.is-shaking` merged into one class | Keep them separate: `.is-shaking` controls animation only, `.is-error` controls visual state |

## Verdict output

Required second part of every review. Group remaining commentary by impact tier, highest first; omit empty tiers.

1. **Feel-breaking regressions**: sluggish easing, comes-from-nowhere entrances, motion on high-frequency or keyboard actions.
2. **Missed simplifications**: animations to remove or drastically reduce.
3. **Performance**: non-GPU properties, dropped-frame risks, recalc storms.
4. **Interruptibility and timing**: keyframes where transitions/springs belong; symmetric timing that should be asymmetric.
5. **Origin, physicality, and cohesion**: wrong origin, mismatched personality, jarring crossfades.
6. **Accessibility**: reduced-motion and pointer/hover gating.

Close with a decision, citing `file:line`:

- **Block**: any feel-breaking regression, animation on a keyboard or high-frequency action, `scale(0)` or `ease-in` on UI, or a non-GPU animation with an easy GPU fix.
- **Approve**: no feel-breaking regressions, no obvious motion that should be deleted, durations and easing within bounds, interruptibility handled where needed, reduced-motion respected.

## Component design principles

Authoring-adjacent, not review. For reusable components the polish that earns adoption lives mostly outside the motion: excellent defaults over options, drop-in DX (Sonner: insert `<Toaster />` once, call `toast()` anywhere), transitions over keyframes for dynamic UI, personality-matched cohesion, invisible edge cases (pause timers on hidden tabs, fill gaps with pseudo-elements for hover, capture pointer on drag), memorable naming over descriptive, and a touchable docs site with copyable snippets.

## Debugging animations

- **Slow motion:** Increase duration 2-5x or use the browser animation inspector; check colour timing, easing, and transform-origin.
- **Frame-by-frame:** Step through the Chrome DevTools Animations panel to reveal timing issues between coordinated properties.
- **Real devices:** Test touch interactions (drawers, swipe gestures) on physical hardware; the Xcode Simulator works but real hardware is better for gestures.
- **Review next day:** Fresh eyes catch imperfections you missed during development.
