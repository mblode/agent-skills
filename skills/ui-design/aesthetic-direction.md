# Aesthetic Direction

Goal: make the UI look human-designed, not AI-default.

## AI slop signals

- Default fonts (Inter/Roboto/Arial/system).
- Purple-on-white gradients and generic cards.
- Predictable layouts and repeated component patterns.
- Excess glow and unnecessary complexity.

## Philosophy

- Delete aggressively; clarity over decoration.
- Do not compete for attention you have not earned.
- Structure should be felt, not seen.
- Prune extra icons, controls, and separators before styling what remains.
- Restraint plus hierarchy beats noise.

## Study references

- Linear, Stripe, Notion, Raycast, ElevenLabs, Zed.

## Tools (table stakes)

- shadcn/ui, Tailwind CSS, Motion, React, Ultracite.

## Copy to learn (not to ship)

- Find a tasteful UI.
- Replicate it precisely (layout, type, spacing, motion).
- Inspect code and measure values.
- Iterate until it matches; then adapt to your context.

## Upgrade choices

- Icon sets: Phosphor, Heroicons, Tabler.
- Typography sources: Typewolf, Fonts In Use, commercial foundries.
- Animation study: animations.dev, devouringdetails.com.

## Polish details

- Match box-shadows to references.
- Dark-mode aware SVG favicon.
- Intentional hover/active states and loading/error/empty states.

## Craft baseline

- Full keyboard support with visible focus rings.
- Hit targets >= 24px (>= 44px mobile).
- Accessible forms: labels, Enter-to-submit, inline errors.
- See `ui-audit` for complete interaction and accessibility standards.

## Reject these failures

- Generic SaaS card grid as the first impression.
- Beautiful image with weak brand presence.
- Strong headline with no clear action.
- Busy imagery behind text.
- Sections that repeat the same mood statement.
- Carousel with no narrative purpose.
- App UI made of stacked cards instead of layout.

## Standard

Distinctive, contextual, refined, and memorable.
