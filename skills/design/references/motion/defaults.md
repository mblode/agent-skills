# Motion Defaults

House motion taste: when to animate, the duration and easing defaults, the named curves, the pattern-to-recipe map, and the validation that proves a motion change. Every other motion reference cites the tables here rather than approximating them.

## Contents

- Core rules
- Motion design principles
- What to animate
- Easing defaults
- Transition decision rules
- Spatial and sequencing
- Accessibility
- Performance
- Anti-patterns
- Workflow
- Validation
- Discovery workflow

## Core rules

- Animate for feedback, orientation, continuity, or deliberate delight. If it's just "it looks cool" and the user sees it often, don't.
- Keep keyboard focus and repeated navigation immediate. A state transition may animate if focus and task completion do not wait for it.
- Prefer CSS transitions for interruptible UI: keyframes restart from zero on interruption, transitions retarget. Use keyframes only for predetermined sequences.
- Implementation priority: CSS transitions > WAAPI > CSS keyframes > JS (`requestAnimationFrame`); under load CSS stays smooth while JS drops frames.
- Asymmetric timing: occasional interactions can enter slightly slower, exit fast. High-frequency ephemeral UI (hover highlights, popovers, panel toggles) inverts this: enter instantly (0ms), exit with a brief fade (100-150ms) so the action feels immediate.
- Tappable controls press on `:active` at 0ms and set `touch-action: manipulation`.
- Use `@starting-style` for DOM entry; fall back to a `data-mounted` attribute where unsupported.
- A small `filter: blur(2px)` hides rough crossfades between swapped content.

## Motion design principles

- **Continuity over teleportation.** Elements visible in both states transition in place; expand from where elements sit rather than fading in a new instance. Never duplicate a persistent element or hard-cut between views that share components; hard cuts lose spatial context.
- **Directional motion matches position.** Tab and carousel transitions animate in the direction matching spatial layout (left-to-right forward, right-to-left back).
- **Emerge from the trigger.** Overlays, trays, and panels animate outward from the element that opened them; generic centre-screen entrances break spatial orientation. Better still where the shapes allow: let the trigger *become* the surface (see the container-morph recipe).
- **Confirm in place, not in a corner.** An action's result belongs on the control that caused it: the button becomes "Copied", holds, and reverts. A toast in the far corner makes the user's eye leave the thing they just touched to find out whether it worked. Reserve corner toasts for results with no on-screen origin (a background job finishing, an incoming message).
- **Animate paired states together.** If open animates, close animates. If hover has motion, focus and pressed states get equivalent feedback. Do not polish only one half of a repeated interaction.
- **Delight scales inversely with frequency.** Rarer interactions get more personality; high-frequency actions must be invisible.
- **Motion enhances perceived speed.** Smooth transitions feel faster than hard cuts, even at identical load times.

## What to animate

- Movement: `transform` and `opacity` only; they skip layout and paint.
- State feedback: `color`, `background-color`, and `opacity` are acceptable.
- Never animate layout properties (`width`, `height`, `top`, `left`); they trigger layout recalc every frame. (Exception: a deliberate container tween, see the card-resize and container-morph recipes.)
- Never use `transition: all`; it animates unintended properties and silently adopts future ones. List them explicitly.
- Avoid `filter` animation for core interactions; if unavoidable keep blur ≤ 20px (heavy blur is expensive, especially in Safari).
- SVG: apply transforms on a `<g>` wrapper with `transform-box: fill-box; transform-origin: center`; without it they rotate/scale around the canvas origin. Line drawing, path morphing, and the Motion SVG origin override live in [svg-animation.md](svg-animation.md).
- `transform: scale()` also scales children (icons, text, borders scale proportionally), unlike `width`/`height`: a feature for press feedback, but account for it when an inner element must stay fixed-size.
- Disable transitions during theme switches (`[data-theme-switching] * { transition: none !important }`), or every themed property animates at once. Force a reflow (`void document.body.offsetHeight`) after the flip and remove the override on the next frame, or use `next-themes` `disableTransitionOnChange`.

## Easing defaults

| Element                       | Duration     | Easing                           |
| ----------------------------- | ------------ | -------------------------------- |
| Button press feedback         | 100-160ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Tooltips, small popovers      | 125-200ms    | `ease-out` or enter curve        |
| Dropdowns, selects            | 150-250ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Modals, drawers               | 200-350ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Move/slide on screen          | 200-300ms    | `cubic-bezier(0.25, 1, 0.5, 1)`  |
| Page transitions              | 250-400ms    | enter or move curve              |
| Hover (colour/opacity)        | 200ms        | `ease`                           |
| Hover (transform/scale)       | 100-150ms    | enter curve                      |
| Illustrative/marketing        | Up to 1000ms | Spring or custom                 |

Keep routine UI under 300ms; scale duration with distance (a full-screen slide can exceed 300ms, a 6px tooltip shift stays under 150ms).

**Named curves**

- **Enter:** `cubic-bezier(0.22, 1, 0.36, 1)` for entrances and transform-based hover
- **Move:** `cubic-bezier(0.25, 1, 0.5, 1)` for slides, drawers, panels
- **Drawer (iOS-like):** `cubic-bezier(0.32, 0.72, 0, 1)` (extremely steep start; the reason its 500ms doesn't read as slow)
- **Expo out:** `cubic-bezier(0.19, 1, 0.22, 1)` for dramatic reveals, card hovers, text reveals
- **Press:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for button press feedback
- **On-screen move:** `cubic-bezier(0.645, 0.045, 0.355, 1)` for back-and-forth movement that stays on screen

Avoid `ease-in` for UI: it starts slow, so the element lags the user's action and feels sluggish. Prefer custom curves from [easing.dev](https://easing.dev/) over built-in `ease`/`ease-out`, whose gentle acceleration reads soft, not decisive.

## Transition decision rules

Match the UI element first, then pick the recipe from [transition-recipes.md](transition-recipes.md):

| UI pattern | Recipe |
|---|---|
| Trigger + floating dot/count | Notification badge |
| Trigger grows into the surface it opens | Container morph |
| Trigger + anchored surface | Menu dropdown |
| Centred surface on top of page | Modal dialog |
| Panel sliding into existing container | Panel reveal |
| List ↔ detail or wizard steps | Page side-by-side slides |
| Element dimension changes | Card resize |
| Text updating in place | Text state swap |
| Two icons in same slot | Icon swap |
| Number arriving on its own | Number pop-in |
| Number the user is driving | Odometer digit roll |
| Confirmation / success moment | Success celebration |
| Hovering item in horizontal stack | Avatar group hover |
| Form validation error | Error state shake |

Prefer lower-overhead transitions (CSS-only) unless the design requires JS orchestration.

## Spatial and sequencing

- Popover `transform-origin` at the trigger (modals stay `center`), dialog/menu entrances from `scale(0.9-0.96)` not `scale(0)` (small popovers at the low end, full dialogs at the high end: a large surface already travels far in absolute pixels), and 30-50ms staggers (total under 300ms, most important element leading). Full rules and code in [component-patterns.md](component-patterns.md) and [contextual-animations.md](contextual-animations.md).
- **Paired elements rule:** elements that animate together (modal + overlay, tooltip + arrow, FAB + label) must share easing and duration. Mismatched timing is the usual cause of "something feels off".

## Accessibility

- Gate hover (motion and paint) behind `@media (hover: hover) and (pointer: fine)`, or touch devices replay hover on tap. Inspect the generated CSS before adding a gate; Tailwind v4 already wraps `hover:` in `@media (hover: hover)`.
- During direct manipulation, keep the element locked to the pointer with no easing; add easing only after release.
- Optional interface SFX: sparse, gesture-unlocked, additive confirmation only. See [interface-sfx.md](interface-sfx.md).

## Performance

- Pause looping animations off-screen with `IntersectionObserver`; they burn GPU even when invisible.
- Toggle `will-change` only during heavy motion and only for `transform`/`opacity`; remove it after. Each promotion costs compositor memory; permanent promotion across many elements is worse than none.
- Do not animate drag via CSS variables on a container; every update recalculates styles for all children. Set `transform` directly on the moving element.
- Motion `x`/`y` values are the default for axis movement and drag (they bypass React re-renders). Use a full `transform` string when one owner must combine multiple transform functions, interop with non-Motion code, or survive a busy main thread: the shorthands run on `requestAnimationFrame` and drop frames when motion coincides with navigation, data loading, or hydration; CSS/WAAPI stay smooth there.
- Motion that janks only sometimes (on open, during navigation, while data lands) is usually a long task sharing the tick, not a costly animation. Don't start an animation and expensive work in the same tick: start the motion, let a frame land, then do the work, or defer it to `transitionend`.
- See [performance-deep-dive.md](performance-deep-dive.md) for WAAPI, compositing layers, long tasks during animation, and the CSS vs JS comparison table.

## Anti-patterns

High-signal failures not covered above:

- Animating on mount without a user trigger: unexpected motion disorients; the user did nothing to cause it.
- Hard stops on drag boundaries feel broken; apply friction/damping so movement diminishes past it (see gesture-drag reference).
- Animating both a container and staggering its children: pick one entrance per container. If the panel slides in, its content should already be visible on arrival.
- Tooltip animation after the first is open: subsequent tooltips in the group open instantly, or the toolbar feels laggy.
- Scroll-revealing product UI, above-the-fold content, or every section of a page: scroll reveals belong to a few chosen moments on marketing surfaces, run once, and never re-animate on scroll-up (see [scroll-animations.md](scroll-animations.md)).
- Easing or duration on scrubbed (scroll-driven) motion: scroll position is the clock, so any curve or duration makes it lag the scrollbar. `linear` and no duration is correct there, and only there.
- Installing `framer-motion` for new work: the package is now `motion` and React imports come from `motion/react`. The old package still resolves, so a mixed codebase compiles while shipping two copies of the library.

## Workflow

1. Answer the four questions in [decision-framework.md](decision-framework.md): animate? purpose? easing? speed?
2. Pick duration from the easing defaults table above. If the value is contested or the component is hard to reach, dial it live in the DevTools bezier editor rather than guessing, then bake the result into source ([live-tuning.md](live-tuning.md)).
3. Choose implementation: CSS transition > WAAPI > spring > keyframe > JS.
4. Load the reference for your component or technique.
5. When reviewing, apply the strict posture in [review-format.md](review-format.md): measure against the ten standards, output the Before/After/Why table, then a tiered verdict ending in a Block/Approve decision.

## Validation

Produce evidence for each check (DevTools observations, not "looks fine"):

- Grep the diff for layout property transitions (`width`, `height`, `top`, `left`) and `transition: all`.
- Retoggle components rapidly; confirm transitions retarget instead of restarting from zero.
- Slow to 10% in the DevTools Animations panel to catch timing and `transform-origin` issues invisible at full speed.
- Confirm `will-change` is toggled around animations, not permanently set, and looping animations pause off-screen.
- Test touch interactions on real devices; simulators under-report gesture and hover-on-tap issues.
- Honor `prefers-reduced-motion`: replace spatial travel with immediate state changes or restrained fades. Pause looping decorations with `animation-play-state: paused` (do not yank them with `display: none`). Keep explicit user-triggered feedback. Exercise the same task in that mode.

## Discovery workflow

For "where should this animate", load `discovery-workflow.md` and `decision-framework.md`. Report opportunities supported by purpose and usage frequency. Implement a suggestion only when implementation is in scope.
