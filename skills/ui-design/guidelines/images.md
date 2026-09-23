# Images

Covers: photos, thumbnails, screenshots, app mockups, product images, media frames, and image borders/outlines.

## Design Rules

- Never border photos or thumbnails: use `outline-1 -outline-offset-1 outline-black/5` or `outline-black/10` if a visible edge is needed
- For screenshots and app UI mockups: `outline-1 -outline-offset-1 outline-black/5` or `outline-black/10` on light surfaces, `outline-white/10` on dark
- When the screenshot is proof people must inspect, keep it straight-on, legible, and large enough to read. Avoid perspective, depth-of-field, aggressive crops, and fake device or browser chrome that obscure product detail.
- Put the shadow and outline on the same element that clips, not on a child of it. A rounded `overflow-hidden` parent clips its descendants, so a child carrying `shadow-*` loses the shadow at the corners; the clipping element's own outline and shadow are never clipped.

## Coding Rules

- Use `alt=""` when adjacent visible text identifies the subject
