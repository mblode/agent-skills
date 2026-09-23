# SVG

Covers: inline SVG, SVG color styling, `fill`, `stroke`, `currentColor`, and SVG markup conventions.

- Omit `xmlns` on inline `<svg>` in HTML/JSX: only needed for standalone `.svg` files
- Style SVG colors with Tailwind classes (`fill-*`, `stroke-*`, `text-*` with `fill="currentColor"`/`stroke="currentColor"`), not hardcoded attributes or ternaries: use `data-*`/`aria-*` variants or conditional classes to switch colors
- Never combine `fill="currentColor"`/`stroke="currentColor"` attributes with `fill-*`/`stroke-*` classes on one element (they conflict): use `fill-current`/`stroke-current` to inherit text color, or drop the attribute when using a specific class like `fill-zinc-400`
