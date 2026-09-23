# Assets API

Covers: placeholder marks, avatars, logos, screenshots, wallpapers, and concrete asset URL parameters.

## Contents

- [Marks](#marks)
- [Avatars](#avatars)
- [Logos](#logos)
- [Screenshots](#screenshots)
- [Wallpapers](#wallpapers)
- [Color Resolution](#color-resolution)

Base URL: `https://assets.ui.sh`

Prefer file extensions whenever the route supports them: `/marks/{id}.svg`, `/avatars/{id}.webp`, `/logos/{id}.svg`, `/screenshots/{id}.webp`, `/wallpapers/{type}.webp?variant={name}`. Image routes (avatars, screenshots, wallpapers) also accept `.jpg`, `.jpeg`, `.png`, but prefer `.webp`.

## Marks

`GET /marks/{id}` returns an SVG mark, optionally with text. IDs: `1`

| Param           | Type   | Default | Notes                                                                    |
| --------------- | ------ | ------: | ------------------------------------------------------------------------ |
| `text`          | string | none | Optional label text                                                      |
| `font`          | string | `inter` | `inter`, `dm-sans`, `sora`, `outfit`, `instrument-sans`, `space-grotesk` |
| `weight`        | number |   `600` | Font weight                                                              |
| `color`         | string | `black` | Mark color                                                               |
| `textColor`     | string | `color` | Text color                                                               |
| `letterSpacing` | number |    `-1` | Spacing between letters in pixels                                        |

## Avatars

`GET /avatars/{id}` returns an avatar image. IDs: `1`-`16`

| Param       | Type   | Default | Notes           |
| ----------- | ------ | ------: | --------------- |
| `size`      | number | none | Square resize   |
| `w`         | number | none | Width           |
| `h`         | number | none | Height          |
| `grayscale` | flag   |     off | Apply grayscale |

## Logos

`GET /logos/{id}` returns an SVG logo. IDs match fuzzily: case-insensitive, ignoring non-alphanumeric characters.

IDs: `align`, `artifact`, `axiom`, `concise`, `looply`, `orbital`, `pinelabs`, `quirk`, `relay`

| Param          | Type   | Default | Notes          |
| -------------- | ------ | ------: | -------------- |
| `color`        | string | none | Primary fill   |
| `accent-color` | string | `color` | Secondary fill |
| `height`       | string | none | SVG height     |
| `width`        | string | none | SVG width      |

## Screenshots

`GET /screenshots/{id}` returns a screenshot image. IDs: `1`

- `1` colors: `mauve`, `mist`, `olive`, `stone`, `taupe`

| Param    | Type   | Default | Notes            |
| -------- | ------ | ------: | ---------------- |
| `color`  | string | none | Variant name     |
| `top`    | number | none | Crop from top    |
| `bottom` | number | none | Crop from bottom |
| `left`   | number | none | Crop from left   |
| `right`  | number | none | Crop from right  |

Crop (positive integers only):

- `top`+`bottom`: height `top + bottom` from `y=0`
- `top` only / `bottom` only: crop that height from that edge
- `left`+`right`: width `left + right` from `x=0`
- `left` only / `right` only: crop that width from that edge

## Wallpapers

`GET /wallpapers/{type}` returns a wallpaper image.

| Param     | Type   |       Default | Notes        |
| --------- | ------ | ------------: | ------------ |
| `variant` | string | type-specific | Variant name |

Aliases: `landscape` -> `landscapes`

### `blend`

Default `arctic-glimmer`. Gradient flows (upper-left to lower-right):

- `arctic-glimmer`: slate/frosted mint to cerulean to deep navy/obsidian (cool)
- `emerald-mist`: forest green/moss to sage/lime to eucalyptus/silver-grey
- `golden-hour-mist`: champagne/cream to apricot glow to honey/sienna
- `midnight-nebula`: indigo/charcoal to violet haze to magenta to turquoise
- `nebula-glow`: rose/lilac to coral/peach to plum/cosmic indigo

### `haze`

Default `default`. All monochrome:

- `dark`: dark charcoal/grey
- `default`: warm off-white/cream
- `mauve-dark`: dark purple-grey
- `mauve`: purple-grey/lavender
- `mist-dark`: dark cool blue-grey
- `mist`: cool blue-grey
- `sage`: sage green/olive-grey
- `taupe-dark`: dark warm taupe
- `taupe`: warm taupe/grey

### `horizon`

Default `arctic-rim`. Format is background, highlights:

- `arctic-rim`: navy/cold-charcoal, cyan/frosted silver
- `calcite-dusk`: charcoal/slate, pearl/bone-white
- `celestial-lead`: lead-gray/charcoal, lilac/frosted zinc
- `jade-corner`: oceanic-gray/charcoal, jade/misty teal
- `obsidian-ember`: mahogany/umber, bronze/ash-gray
- `oxide-center`: graphite/charred-umber, rust/bronze
- `sepia-rim`: umber/warm-charcoal, gold/bronze

### `landscapes`

Default `valley`. Format is scene: palette:

- `arctic-fjord`: glacial fjord, granite cliffs, ice peaks: cerulean, indigo, frosted slate, bone white
- `basalt-plateau`: basalt plateau, volcanic ridges: ash grey, obsidian, pewter, umber
- `coast`: coastal beach, gentle waves: slate blue, teal, pale grey sky, sandy beige
- `dunes`: desert dunes at sunset: dusty rose, terracotta, mauve, peach sky
- `forest`: misty pine forest valley: sage green, cool grey, blue-green
- `fossil-cliffs`: chalk cliffs over pale sea: bone white, oyster grey, sea-foam green, flint blue
- `highland-moors`: highland moor, heather/moss: heather purple, moss green, peat brown, charcoal
- `hills`: pastoral hills, autumn trees: olive, ochre, burnt umber, taupe
- `lake`: lake at twilight, forested shore: slate blue, teal, peach
- `limestone-karst`: limestone pillars in misty bay: lichen green, grey stone, misty blue water
- `meadow`: alpine meadow, distant mountains: sage green, grey-blue mountains, hay
- `misty-marshland`: wetlands, pools, reeds: mossy green, bronze, water grey, foggy lavender
- `pampas-grassland`: pampas plains, open sky: straw, silver, lilac, grey-blue
- `salt-crust-expanse`: salt flats, distant mountains: pearl white, ivory, lilac shadow, silver-grey
- `snow`: snowfield, rolling dunes: off-white, blue-grey shadow, pale sky
- `valley`: misty mountain valley, scattered trees: sage green, soft grey, warm taupe
- `weathered-badlands`: eroded hills/canyons, strata lines: terracotta, clay, sandstone, ochre, charcoal

### `silk`

Default `crimson-surge`. Textures:

- `crimson-surge`: scarlet/ruby
- `cyan-glacier`: turquoise/crystalline
- `emerald-glint`: hunter green/iridescent teal
- `midnight-violet`: obsidian/translucent violet
- `molten-amber`: burnt orange/bronze
- `platinum-flow`: mercury/titanium
- `sapphire-flux`: royal blue/sapphire

## Color Resolution

Color params accept Tailwind names like `red-500` and `blue-600`, resolved to `oklch()`. Other CSS colors pass through unchanged.
