# Aesthetic Direction

Goal: make the UI look human-designed, not AI-default.

## AI slop signals
- Default fonts (Inter/Roboto/Arial/system).
- Purple-on-white gradients and generic cards.
- Predictable layouts and repeated component patterns.
- Excess glow and unnecessary complexity.

## Philosophy
- Delete aggressively; clarity over decoration.
- Restraint plus hierarchy beats noise.

## Study references
- Linear, Stripe, Notion, Raycast, ElevenLabs, Zed.

## Tools (table stakes)
- shadcn/ui, Tailwind CSS, Motion, React, Biome/Ultracite.

## Copy to learn (not to ship)
- Find a tasteful UI.
- Replicate it precisely (layout, type, spacing, motion).
- Inspect code and measure values.
- Iterate until it matches; then adapt to your context.

## Upgrade choices
- Icon sets: Phosphor, Heroicons, Tabler.
- Typography sources: Typewolf, Fonts In Use, commercial foundries.
- Animation study: animations.dev, devouringdetails.com.

## Extra polish
- Match box-shadows to references.
- Dark-mode aware SVG favicon.
- Dynamic OG images and SEO metadata.
- Intentional hover/active states and loading/error/empty states.

## Craft baseline (non-negotiable)
- Full keyboard support; visible focus rings; manage focus in dialogs/menus.
- Hit targets >= 24px (>= 44px on mobile); hover styles gated by `@media (hover: hover)`.
- Forms: labels wired to inputs; Enter submits; textarea uses Cmd/Ctrl+Enter; keep submit enabled until request starts, then disable with spinner.
- Never block paste/typing; inline errors; focus first error; inputs with `value` include `onChange`.
- Follow `audit-ui` motion rules and reduced-motion behaviour.
- Respect safe areas; handle long content with truncation; design empty/error states.
- Locale-aware formatting (`Intl.*`); use `&hellip;` and non-breaking spaces for glued terms.

## Standard
Distinctive, contextual, refined, and memorable.
