# Colors

Covers: brand colors, accent colors, neutral palettes, text colors, default color families, and semantic color scales.

- Never default to indigo as the brand/accent color: only use indigo if the project already uses it or the user explicitly requests it
- Never default to `gray-*` or `slate-*` for neutral/text colors: only use them if the project already uses them or the user explicitly requests them; prefer `zinc-*` or `neutral-*` instead

## Semantic color scales

When defining a custom multi-step palette, assign each step a role so component states are derivable, not hand-picked. Steps should encode intent, not just lightness. For a 10-step scale (scale the mapping to the project's actual step count):

- `100` background, `200` hover background, `300` active background
- `400` border, `500` hover border, `600` active border
- `700` solid fill (high contrast), `800` solid fill hover
- `900` secondary text and icons, `1000` primary text and icons

With roles assigned, derive states by stepping up the scale: a fill moves `700` to `800` on hover; a background moves `100` to `200` on hover and `300` on active; a border moves `400` to `500` to `600`. Build the scale once, then reference roles instead of picking a new color per state.
