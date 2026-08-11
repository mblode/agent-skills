# Typography

Covers: text sizes, line heights, heading styles, font weights, tracking, text width, `text-pretty`, `text-balance`, eyebrow text.

## Design Rules

- Body, paragraph, and general content is `text-base` (16px) at every breakpoint. `text-sm` is for labels, captions, and helper text, never for reading copy; `text-xs` is for neither.
- Never use `font-bold` for headings: use `font-semibold` or `font-medium`.
- Use at most two font weights per view: one for emphasis (headings, labels), one for body; reuse them.
- Make hierarchy levels identical or clearly different, never nearly the same. Merge almost-equal sizes or separate them enough to create a visible rank.
- Don't hand-tune leading on display type. Tailwind ships `line-height: 1` from `text-5xl` up, which is already correct; overriding it with `leading-[1.05]` or similar loosens type that should stay tight. Hand-tune leading on body copy instead, where the default is set for a measure your layout may not have.
- Use `text-balance` on short headings, `text-pretty` on paragraph text and on any title long enough to wrap past two lines (article and blog titles: see [Prose Content](./prose-content.md)).
- Add `tracking-tight` to headings larger than `text-xl`, unless the font is a condensed headline font (already tight).
- Large type should not look airy: tighten tracking before adding weight, and constrain line length before shrinking the type.
- Small labels need more air than display type: avoid cramped `tracking-tight` or dense line-height on `text-sm` and below unless the text is numeric or code-like.
- Never use `uppercase` on eyebrow text unless it's a monospace font; with monospace `uppercase`, always add `tracking-wide`.

- For displayed data, omit labels when format, position, or context makes the value self-explanatory. Keep explicit labels for forms, specifications, and views people scan by field name.
- In dense product UI, links need not all use the accent colour. Preserve affordance through context, ink, weight, underline, hover, and focus; reserve bright link colour for sparse actions that need emphasis.

## Coding Rules

- Constrain text width with `max-w-[*ch]` directly on the element: see [Heading Groups](./heading-groups.md) for values per `text-*` size.
- When a project uses Inter, use the official variable font (`InterVariable`) with `font-display: swap`; enable useful OpenType features through `font-feature-settings` (for example `cv02`, `cv03`, `cv04`, `cv11`, `ss01`, `ss03`). Do not introduce Inter merely because it is a familiar UI default.
- Always read [Custom Fonts](./custom-fonts.md) when using custom fonts.
