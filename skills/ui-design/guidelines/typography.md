# Typography

Covers: text sizes, line heights, heading styles, font weights, tracking, text width, `text-pretty`, `text-balance`, eyebrow text.

## Design Rules

- Never use `text-xs` for body, paragraph, or general content: the smallest body size is `text-sm`, only at `sm:` or larger; the mobile default is at least `text-base` (16px).
- Never use `font-bold` for headings: use `font-semibold` or `font-medium`.
- Use at most two font weights per view: one for emphasis (headings, labels), one for body; reuse them.
- Never add `leading-*` or line-height modifiers to headings: use Tailwind's default (e.g. `text-6xl`, not `text-6xl/tight`).
- Use `text-balance` on headings, `text-pretty` on paragraph text.
- Add `tracking-tight` to headings larger than `text-xl`, unless the font is a condensed headline font (already tight).
- Large type should not look airy: tighten tracking before adding weight, and constrain line length before shrinking the type.
- Small labels need more air than display type: avoid cramped `tracking-tight` or dense line-height on `text-sm` and below unless the text is numeric or code-like.
- Never use `uppercase` on eyebrow text unless it's a monospace font; with monospace `uppercase`, always add `tracking-wide`.

## Coding Rules

- Constrain text width with `max-w-[*ch]` directly on the element: see [Heading Groups](./heading-groups.md) for values per `text-*` size.
- Always use the official Inter variable font (`InterVariable`) with `font-display: swap`; enable OpenType features via `font-feature-settings` (e.g. `cv02`, `cv03`, `cv04`, `cv11`, `ss01`, `ss03`).
- Always read [Custom Fonts](./custom-fonts.md) when using custom fonts.
