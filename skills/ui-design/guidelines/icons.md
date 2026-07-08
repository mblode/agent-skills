# Icons

Covers: SVG icons, Heroicons, inline checkmarks, icon buttons, icon sizing, icon alignment with text.

## Design Rules

- Never generate raw SVG icons: import from the project's icon library, or Heroicons if none is established.
- Never wrap icons in decorative containers (colored squares, circles with backgrounds): use the icon directly.
- Never scale icons: `viewBox="0 0 24 24"` uses `size-6`, `viewBox="0 0 20 20"` uses `size-5`, `viewBox="0 0 16 16"` uses `size-4`. If an icon looks too small, switch icon sets, don't bump the size class.
- Use 16px/micro icons (`size-4`) inline with `text-sm` text (checklists, feature items, comparison tables, inline labels); use 20px/mini (`size-5`) only for navigation list icons.
- Aligning an icon next to a text group (label + supporting text): align it to the first line/label with `items-start` or `items-baseline`, never `items-center` on the group.
- Application UIs (dashboards, settings, admin, sidebar nav, forms): use only Heroicons Micro (16px, `size-4`); never 20px/mini or 24px/outline.
- Icons paired with text should usually be visually quieter than the label: lower opacity, use the secondary text color, or reduce emphasis so the icon supports recognition without becoming the focal point.
- Optically center asymmetric icons in icon-only buttons. If geometry looks off, adjust the SVG viewBox or wrapper alignment rather than trusting mathematical centering.

## Coding Rules

- Use `size-{n} h-lh` on SVG icons to vertically center them with adjacent text; set `font-size` on a wrapper instead of top margins or manual alignment.
- Use `fill-{color}` for filled icons and `stroke-{color}` for stroked icons; never `text-{color}` with `currentColor` (legacy v2 hack).
- Always add `shrink-0` to icons inside flex containers.
