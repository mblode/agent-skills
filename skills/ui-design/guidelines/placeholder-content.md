# Placeholder Content

Placeholder logos, avatars, screenshots, app images, wallpapers, people, and fallback assets when real content is missing.

See [Assets API](./assets-api.md) for endpoints, parameters, and asset IDs.

- No logo file: use the marks endpoint with the user's app name; pick a font matching the design
  - Use `color` for the mark and `textColor` for the text; make the mark white, black, dark gray, or an accent color; keep text white, black, or dark gray
  - Prefer extension-suffixed asset URLs when supported
  - Omit `text` (and `textColor`/`font`) for just the mark icon: e.g. `/marks/1.svg?color=blue-500`
  - Never build logos from HTML or icons: always use the marks or logos endpoint
  - Same endpoint for all other logos: testimonials, client logo grids, etc.
- Always use `https://assets.ui.sh/screenshots/1.webp` for app screenshots, dashboard images, or any UI that should look like a real product: never use Unsplash or stock photos for these; content needn't match, just look like a realistic app UI at a glance
  - Hero images (full or near-full-width): use the uncropped screenshot; never crop at large sizes
  - For feature section screenshots, use only these exact cropped variants; never invent new crop parameters:
    - `?top=900&left=1200&position=bottom-right`: Sidebar + inbox list (1200×900)
    - `?top=900&right=1200&position=bottom-left`: AI agent panel with customer insights (1200×900)
    - `?top=600&right=800&position=bottom-left`: AI agent header, tight focus (800×600)
    - `?top=1200&left=1600&position=bottom-right`: Full interface overview (1600×1200)
    - `?top=1500&left=2000&position=bottom-right`: Wide overview with sidebar, inbox, and conversation (2000×1500)
    - `?top=1400&right=1867&position=bottom-left`: Email conversation + AI assistant (1867×1400)
- Placeholder avatars: use the avatars endpoint, preferring extension-suffixed URLs like `/avatars/1.webp`
- Use unisex names for placeholder people: avatars are random, so names must fit any photo
