---
name: ui-animation
description: >-
  Designs, implements, reviews, debugs, and reverse-engineers UI motion: CSS
  transitions, keyframes, springs, gestures, drag, easing, timing,
  framer-motion, and animation curves from screen recordings. Use when asked to
  "add animations", "make this feel smooth", "review my animations", "add a
  swipe gesture", "match this easing", "reverse engineer this animation",
  "extract the animation curve", or "what's it called when..." to name a motion
  effect from a vague description. For visual direction use ui-design; for
  page-level UI audit use ui-audit.
---

# UI Animation

- **IS:** designing, implementing, reviewing, debugging UI motion (springs, gestures, drag, easing, CSS transitions, keyframes, framer-motion), measuring motion from a recording (extract frames, track, fit curves) to emit code plus a handoff spec, and naming a described motion effect (reverse-lookup vocabulary).
- **IS NOT:** choosing overall visual direction, palettes, or typography (use `ui-design`), auditing a whole page's UI quality (use `ui-audit`), or named text-effect specs (use the external `animate-text` skill where installed).

Canonical home for reverse-engineering motion from a recording: route "reverse engineer this animation" and "match this easing" here, not to a separate skill. If the input is a screen recording or video, you are MEASURING motion: follow the Reverse-engineer workflow. Otherwise (designing, implementing, reviewing) use the rules and Workflow below.

## Reference files

| File | Read when |
| --- | --- |
| [references/decision-framework.md](references/decision-framework.md) | Default: deciding whether/why to animate, picking easing character |
| [references/spring-animations.md](references/spring-animations.md) | Spring physics, framer-motion useSpring, configuring spring params, Apple damping/response values, interruption mechanics |
| [references/component-patterns.md](references/component-patterns.md) | Buttons, popovers, tooltips, drawers, modals, toasts with animation |
| [references/clip-path-techniques.md](references/clip-path-techniques.md) | clip-path for reveals, tabs, hold-to-delete, comparison sliders |
| [references/gesture-drag.md](references/gesture-drag.md) | Drag, swipe-to-dismiss, momentum, pointer capture, velocity handoff, momentum projection |
| [references/performance-deep-dive.md](references/performance-deep-dive.md) | Jank, CSS vs JS, WAAPI, CSS variables trap, Framer Motion caveats |
| [references/review-format.md](references/review-format.md) | Reviewing animation code: ten standards (each with flag-on-sight triggers), Before/After/Why table, Block/Approve verdict |
| [references/contextual-animations.md](references/contextual-animations.md) | Contextual icon swaps, word-level stagger entrances, fixed-offset exits |
| [references/transition-recipes.md](references/transition-recipes.md) | Installing a CSS transition: card resize, badge, dropdown, modal, panel, page slide, icon swap, number pop-in, text swap, success, avatar hover, error shake |
| [references/measurement-guide.md](references/measurement-guide.md) | Reverse-engineer: what to measure, eye vs script, reading `metrics.json`, choosing an ROI |
| [references/curve-fitting.md](references/curve-fitting.md) | Reverse-engineer: reading `fit_curves.py` output, spring vs bezier, judging fit error, asymmetric open/close |
| [references/code-output.md](references/code-output.md) | Reverse-engineer: emitting code for CSS, Motion/Framer Motion, SwiftUI, React Native, UIKit |
| [references/choreography.md](references/choreography.md) | Reverse-engineer: multi-element/multi-phase motion: staggers, blur-before-move, per-edge settling |
| [references/vocabulary.md](references/vocabulary.md) | Naming a motion effect the user describes vaguely ("what's it called when...") |

## Core rules

- Animate for feedback, orientation, continuity, or deliberate delight. If it's just "it looks cool" and the user sees it often, don't.
- Never animate keyboard-initiated actions (shortcuts, arrow navigation, tab/focus); they repeat constantly and animation makes them feel slow.
- Prefer CSS transitions for interruptible UI: keyframes restart from zero on interruption, transitions retarget. Use keyframes only for predetermined sequences.
- Implementation priority: CSS transitions > WAAPI > CSS keyframes > JS (`requestAnimationFrame`); under load CSS stays smooth while JS drops frames.
- Asymmetric timing: occasional interactions can enter slightly slower, exit fast. High-frequency ephemeral UI (hover highlights, popovers, panel toggles) inverts this: enter instantly (0ms), exit with a brief fade (100-150ms) so the action feels immediate.
- Use `@starting-style` for DOM entry; fall back to a `data-mounted` attribute where unsupported.
- A small `filter: blur(2px)` hides rough crossfades between swapped content.

## Motion design principles

- **Continuity over teleportation.** Elements visible in both states transition in place; expand from where elements sit rather than fading in a new instance. Never duplicate a persistent element or hard-cut between views that share components; hard cuts lose spatial context.
- **Directional motion matches position.** Tab and carousel transitions animate in the direction matching spatial layout (left-to-right forward, right-to-left back).
- **Emerge from the trigger.** Overlays, trays, and panels animate outward from the element that opened them; generic centre-screen entrances break spatial orientation.
- **Animate paired states together.** If open animates, close animates. If hover has motion, focus and pressed states get equivalent feedback. Do not polish only one half of a repeated interaction.
- **Delight scales inversely with frequency.** Rarer interactions get more personality; high-frequency actions must be invisible.
- **Motion enhances perceived speed.** Smooth transitions feel faster than hard cuts, even at identical load times.

## What to animate

- Movement: `transform` and `opacity` only; they skip layout and paint.
- State feedback: `color`, `background-color`, and `opacity` are acceptable.
- Never animate layout properties (`width`, `height`, `top`, `left`); they trigger layout recalc every frame. (Exception: a deliberate container resize tween, see the card-resize recipe.)
- Never use `transition: all`; it animates unintended properties and silently adopts future ones. List them explicitly.
- Avoid `filter` animation for core interactions; if unavoidable keep blur ≤ 20px (heavy blur is expensive, especially in Safari).
- SVG: apply transforms on a `<g>` wrapper with `transform-box: fill-box; transform-origin: center`; without it they rotate/scale around the canvas origin.
- `transform: scale()` also scales children (icons, text, borders scale proportionally), unlike `width`/`height`: a feature for press feedback, but account for it when an inner element must stay fixed-size.
- Disable transitions during theme switches (`[data-theme-switching] * { transition: none !important }`), or every themed property animates at once.

## Easing defaults

| Element                       | Duration     | Easing                           |
| ----------------------------- | ------------ | -------------------------------- |
| Button press feedback         | 100-160ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Tooltips, small popovers      | 125-200ms    | `ease-out` or enter curve        |
| Dropdowns, selects            | 150-250ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Modals, drawers               | 200-350ms    | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Move/slide on screen          | 200-300ms    | `cubic-bezier(0.25, 1, 0.5, 1)`  |
| Page transitions              | 250-400ms    | enter or move curve              |
| Simple hover (colour/opacity) | 200ms        | `ease`                           |
| Illustrative/marketing        | Up to 1000ms | Spring or custom                 |

Keep routine UI under 300ms; scale duration with distance (a full-screen slide can exceed 300ms, a 6px tooltip shift stays under 150ms).

**Named curves**

- **Enter:** `cubic-bezier(0.22, 1, 0.36, 1)` for entrances and transform-based hover
- **Move:** `cubic-bezier(0.25, 1, 0.5, 1)` for slides, drawers, panels
- **Drawer (iOS-like):** `cubic-bezier(0.32, 0.72, 0, 1)`

Avoid `ease-in` for UI: it starts slow, so the element lags the user's action and feels sluggish. Prefer custom curves from [easing.dev](https://easing.dev/) over built-in `ease`/`ease-out`, whose gentle acceleration reads soft, not decisive.

## Transition decision rules

Match the UI element first, then pick the recipe from [references/transition-recipes.md](references/transition-recipes.md):

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

- Popover `transform-origin` at the trigger (modals stay `center`), dialog/menu entrances from `scale(0.85-0.9)` not `scale(0)`, and 30-50ms staggers (total under 300ms, most important element leading). Full rules and code in [references/component-patterns.md](references/component-patterns.md) and [references/contextual-animations.md](references/contextual-animations.md).
- **Paired elements rule:** elements that animate together (modal + overlay, tooltip + arrow, FAB + label) must share easing and duration. Mismatched timing is the usual cause of "something feels off".

## Accessibility

- Every animation needs a `prefers-reduced-motion: reduce` path: disable transform/keyframe motion, keep instant state changes or opacity-only fades. All recipes include the guard.
- Gate hover animations behind `@media (hover: hover) and (pointer: fine)`, or touch devices replay hover on tap. Tailwind v4 `hover:` utilities apply this automatically; skip the manual query there.
- During direct manipulation, keep the element locked to the pointer with no easing; add easing only after release.

## Performance

- Pause looping animations off-screen with `IntersectionObserver`; they burn GPU even when invisible.
- Toggle `will-change` only during heavy motion and only for `transform`/`opacity`; remove it after. Each promotion costs compositor memory; permanent promotion across many elements is worse than none.
- Do not animate drag via CSS variables on a container; every update recalculates styles for all children. Set `transform` directly on the moving element.
- Motion `x`/`y` values are the default for axis movement and drag (they bypass React re-renders). Use a full `transform` string only when one owner must combine multiple transform functions or interop with non-Motion code.
- See [references/performance-deep-dive.md](references/performance-deep-dive.md) for WAAPI, compositing layers, and the CSS vs JS comparison table.

## Anti-patterns

High-signal failures not covered above:

- Animating on mount without a user trigger: unexpected motion disorients; the user did nothing to cause it.
- Hard stops on drag boundaries feel broken; apply friction/damping so movement diminishes past it (see gesture-drag reference).
- Animating both a container and staggering its children: pick one entrance per container. If the panel slides in, its content should already be visible on arrival.
- Tooltip animation after the first is open: subsequent tooltips in the group open instantly, or the toolbar feels laggy.

(The transform-owner clash and keyframes-on-rapid-fire failures are stated canonically under Performance and Core rules above.)

## Workflow

Copy and track:

```text
Animation progress:
- [ ] Step 1: Decide whether the interaction should animate
- [ ] Step 2: Choose purpose, easing, and duration
- [ ] Step 3: Pick the implementation style
- [ ] Step 4: Load the relevant component or technique reference
- [ ] Step 5: Validate timing, interruption, and device behavior
```

1. Answer the four questions in [references/decision-framework.md](references/decision-framework.md): animate? purpose? easing? speed?
2. Pick duration from the easing defaults table above.
3. Choose implementation: CSS transition > WAAPI > spring > keyframe > JS.
4. Load the reference for your component or technique.
5. When reviewing, apply the strict posture in [references/review-format.md](references/review-format.md): measure against the ten standards, output the Before/After/Why table, then a tiered verdict ending in a Block/Approve decision.

## Validation

Produce evidence for each check (DevTools observations, not "looks fine"):

- Grep the diff for layout property transitions (`width`, `height`, `top`, `left`) and `transition: all`.
- Retoggle components rapidly; confirm transitions retarget instead of restarting from zero.
- Slow to 10% in the DevTools Animations panel to catch timing and `transform-origin` issues invisible at full speed.
- Emulate `prefers-reduced-motion: reduce` (DevTools Rendering panel) and confirm every animation has a reduced path.
- Confirm `will-change` is toggled around animations, not permanently set, and looping animations pause off-screen.
- Test touch interactions on real devices; simulators under-report gesture and hover-on-tap issues.
- Review again with fresh eyes the next day; imperfections missed during development stand out.

## Reverse-engineer workflow

Use this branch to measure an existing animation from a screen recording, then emit code and a handoff spec that reproduce it. The scripts under `scripts/` are the canonical, deterministic path; run them rather than reconstructing their logic.

**Dependencies:** `ffmpeg` for frame extraction (`brew install ffmpeg`); Python with `pip install opencv-python numpy scipy` for tracking and curve fitting. Degrades gracefully: with only ffmpeg you can extract frames and reason visually; tracking and fitting need the Python packages.

```text
Reverse-engineer progress:
- [ ] Step 1: Extract frames + contact sheet (per direction if open differs from close)
- [ ] Step 2: Vision pass: identify element, effects, phases
- [ ] Step 3: Decide precision (eye-only vs scripted)
- [ ] Step 4: Track motion and fit curves (if escalating)
- [ ] Step 5: Annotate choreography (delays, asymmetry)
- [ ] Step 6: Emit code for the target(s)
- [ ] Step 7: Validate against the recording
```

1. **Extract.** Run `python3 scripts/extract_frames.py <video> <outdir>`. Trim to just the transition with `--start`/`--duration`; if the interaction has both an open and a close, trim two windows and run the pipeline once per direction (they are almost never mirror images). Match `--fps` to the source (probe with `ffprobe`), never sampling above the source rate. Open `contact_sheet.png` first.
2. **Vision pass.** Name the element(s) that move, every effect (translate, scale often anisotropic, opacity, blur, corner radius, shadow, color), and the phases, noting which property leads and lags. Use the checklist in `references/measurement-guide.md`.
3. **Decide precision.** Simple fade or linear slide: read timing off the contact sheet, skip to step 5. Elastic, springy, or multi-property motion: escalate to step 4 (eyeballing a spring is unreliable).
4. **Track and fit.** Run `python3 scripts/track_motion.py <outdir>` for `metrics.json` (pass `--bbox X,Y,W,H` to isolate one element), then `python3 scripts/fit_curves.py <outdir>/metrics.json` for spring params, cubic-bezier, and per-property fit error. Pass the same `--fps` you extracted with. Read `references/curve-fitting.md` to pick the model; high error on both means multi-phase motion (split and fit each segment).
5. **Annotate.** Load `references/choreography.md`. Build the timing-offset table (when each property starts and settles); lead/lag gaps and over-stretch carry more feel than any single curve.
6. **Emit.** Substitute fitted parameters into the templates in `references/code-output.md` for the target. Keep movement on `transform`/`opacity`. Emit two transitions when open and close differ, plus the consolidated handoff spec so it can be implemented without the video.
7. **Validate.** Re-derive: play the emitted animation, screen-record it, run it back through `extract_frames.py`, and compare contact sheets side by side. Slow to 0.1x to confirm phase order and over-stretch survive. Confirm the code only animates `transform`, `opacity`, and `filter`.

**Reverse-engineer gotchas:**

- `fit_curves.py` defaults to `--fps 30`: extract at 60 but fit at the default and every `duration_ms` doubles while fitted stiffness drops to a quarter. Always pass the extraction fps to the fit.
- Sampling above the source rate duplicates frames: a 24 fps GIF extracted at 60 inflates fit error with plateaued runs in `metrics.json`. Probe and match the source rate.
- Screen recordings drop frames and iOS/QuickTime captures are variable-frame-rate; consecutive identical rows are duplicated frames, not a pause. Re-record at a steadier rate if plateaus dominate.
- Measure open and close as separate clips and report two curves; never fit one and reuse it reversed (see `references/choreography.md`). Treat a fit `error` above 0.08 as suspect.

## Related skills

- `ui-design`: visual direction, palettes, typography; settle the visual system before tuning motion.
- `ui-audit`: page/feature-level UI quality audit; its motion findings route back here for fixes.
- Optional external `animate-text` skill where installed: curated named text effects (typewriter, line reveal, stagger builds) with exact JSON specs.
