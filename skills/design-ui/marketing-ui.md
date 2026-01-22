# Marketing / Brand UI

Deliver working code with a clear aesthetic point of view. Avoid generic AI aesthetics.

## Decide the direction (before coding)
- Identify purpose, audience, and constraints.
- Choose a bold tone (minimal, maximal, retro, editorial, brutalist, organic, luxury, etc).
- Define a single memorable signature detail.
- Match implementation complexity to the chosen direction.

## UX baseline (non-negotiable)
- Ensure full keyboard support and visible focus.
- Hit targets >= 24px (>= 44px on mobile).
- Keep forms accessible (labels, enter-to-submit, inline errors).
- Handle loading/empty/error states and long content.
- Follow `audit-ui` for full a11y and polish checks; use `ui-animation` for motion.

## Aesthetic rules
- Typography: choose distinctive fonts (not Inter/Roboto/Arial/system). Weight >= 400. Use `clamp()`.
- Colour: commit to a palette with CSS variables; avoid pure black/white; use one sharp accent.
- Composition: use asymmetry, contrast, and negative space intentionally.
- Backgrounds: build atmosphere with gradients/noise/patterns, not flat fills.
- Interaction details: set `pointer-events: none` on decorative layers; allow text selection by default.

## Motion
- Follow `ui-animation` guidelines for timing, easing, and reduced-motion behaviour.

## Avoid AI slop
- Do not reuse default font stacks, purple gradients, or default layouts.
- Vary fonts, palettes, spacing systems, and visual language per project.
- Make every decision context-specific and intentional.

## Reference
- See `aesthetic-direction.md` for deeper guidance and examples.
