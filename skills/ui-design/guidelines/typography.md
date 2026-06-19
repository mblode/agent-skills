# Typography

Covers: text sizes, line heights, heading styles, font weights, tracking, text width, `text-pretty`, `text-balance`, and eyebrow text.

## Design Rules

- Never use `text-xs` for body text, paragraph text, or general page content: the smallest acceptable body text size is `text-sm` and only at `sm:` or larger breakpoints; the mobile default must be at least `text-base` (16px)
- Never use `font-bold` for headings: use `font-semibold` or `font-medium` instead
- Use at most two font weights in a single view: pick a weight for emphasis (headings, labels) and one for body, and reuse them
- Never add `leading-*` or line-height modifiers to headings: use Tailwind's default line-height (e.g. `text-6xl`, not `text-6xl/tight`)
- Use `text-balance` on headings; use `text-pretty` on paragraph text
- Add `tracking-tight` to headings larger than `text-xl`: unless the font is a condensed headline font (tracking is already tight)
- Never use `uppercase` on eyebrow text unless it uses a monospace font; when using `uppercase` with a monospace font, always add `tracking-wide`

## Coding Rules

- Constrain text width with `max-w-[*ch]` directly on the element: see [Heading Groups](./heading-groups.md) rules for values per `text-*` size
- Always use the official Inter variable font (`InterVariable`) with `font-display: swap`; enable OpenType features via `font-feature-settings` (e.g. `cv02`, `cv03`, `cv04`, `cv11`, `ss01`, `ss03`)
- Always read [Custom Fonts](./custom-fonts.md) when using custom fonts
