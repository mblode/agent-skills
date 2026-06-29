# Flexbox Layout

Covers: flex containers, flexible children, fixed-size icons/images, truncation, sidebars, layouts using `flex-1`, `min-w-0`, or `shrink-0`.

- Add `min-w-0` (or `min-width: 0`) to flex children that must shrink below their content size: flex items default to `min-width: auto` and won't shrink past their content without it. Applies at every scale, from page-level layouts (a fluid content area next to a fixed-width sidebar using `flex-1`) down to small UI pieces (a truncated text label in a row, a flexible input next to a fixed button).
- Add `shrink-0` to flex children that should never shrink: icons, SVGs, images, logos, avatars, and any element that would become visually distorted if compressed.
