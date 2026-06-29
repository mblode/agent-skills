# Colors

Covers: brand colors, accent colors, neutral palettes, text colors, default color families, semantic color scales.

- Never default to indigo as the brand/accent color: use it only if the project already does or the user requests it.
- Never default to `gray-*` or `slate-*` for neutral/text colors: use them only if the project already does or the user requests them; prefer `zinc-*` or `neutral-*`.

## Semantic color scales

When defining a custom multi-step palette, give each step a role so component states are derivable, not hand-picked: steps encode intent, not just lightness. For a 10-step scale (scale the mapping to the project's actual step count):

- `100` background, `200` hover background, `300` active background
- `400` border, `500` hover border, `600` active border
- `700` solid fill (high contrast), `800` solid fill hover
- `900` secondary text and icons, `1000` primary text and icons

Derive states by stepping up the scale: fill `700`→`800` on hover; background `100`→`200` (hover), `300` (active); border `400`→`500`→`600`. Build the scale once; reference roles, never pick a new color per state.
