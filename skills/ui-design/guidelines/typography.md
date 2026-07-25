# Typography

Covers: text sizes, line heights, heading styles, font weights, tracking, text width, `text-pretty`, `text-balance`, eyebrow text.

## Design Rules

- Body, paragraph, and general content is `text-base` (16px) at every breakpoint. `text-sm` is for labels, captions, and helper text, never for reading copy; `text-xs` is for neither.
- Never use `font-bold` for headings: use `font-semibold` or `font-medium`.
- Use at most two font weights per view: one for emphasis (headings, labels), one for body; reuse them.
- Don't hand-tune leading below `text-5xl`; Tailwind's defaults are already tight enough. At `text-5xl` and above the default leaves excessive vertical gaps, so set `leading-[1.05]` alongside `tracking-tight`.
- Use `text-balance` on headings, `text-pretty` on paragraph text.
- Add `tracking-tight` to headings larger than `text-xl`, unless the font is a condensed headline font (already tight).
- Large type should not look airy: tighten tracking before adding weight, and constrain line length before shrinking the type.
- Small labels need more air than display type: avoid cramped `tracking-tight` or dense line-height on `text-sm` and below unless the text is numeric or code-like.
- Never use `uppercase` on eyebrow text unless it's a monospace font; with monospace `uppercase`, always add `tracking-wide`.

## Coding Rules

- Constrain text width with `max-w-[*ch]` directly on the element: see [Heading Groups](./heading-groups.md) for values per `text-*` size.
- Always use the official Inter variable font (`InterVariable`) with `font-display: swap`; enable OpenType features via `font-feature-settings` (e.g. `cv02`, `cv03`, `cv04`, `cv11`, `ss01`, `ss03`).
- Always read [Custom Fonts](./custom-fonts.md) when using custom fonts.
