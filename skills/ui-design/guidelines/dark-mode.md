# Dark Mode

Covers: dark-mode styling, light-to-dark conversion, contrast audits, dark-mode images, dark-mode SVGs.

## Design Rules

- Dark mode maintains the same contrast ratios as light mode, not a simple color inversion
- Dark mode needn't preserve every detail of the light design: it just needs to look good
- Default dark mode to the OS `prefers-color-scheme` setting (Tailwind's built-in `dark:` behavior); add a manual toggle only when the user explicitly asks
- Remove all shadows in dark mode: use `dark:shadow-none`
- On dark-mode-only sites, add `scheme-only-dark` to `<html>` or the top-level element: ensures native elements (scrollbars, form controls, `color-scheme`) render in dark mode

## Component Rules

- Never keep large branded/colored panels in dark mode; use the same background color and add a light divider between sections
- Style cards only slightly lighter than the page background (e.g. `dark:bg-gray-900` on a `dark:bg-gray-950` page); add `dark:inset-ring dark:inset-ring-white/5` for definition
- Make decorative testimonial quote marks very faint (e.g. `dark:text-white/5`)
- Never use multiple heading colors in dark mode (e.g. dark gray + brand); use one light color like `white` or `gray-100` for all headings

## Raster Image Rules

- When adding or improving dark mode, audit the page for rasterized images needing dark-mode versions: photos, screenshots, product mockups, decorative backgrounds, textures, rasterized illustrations
- Never use CSS filters (`invert`, `brightness`, `contrast`, `opacity`) as the final raster dark-mode treatment; always create real dark-mode image files
- Generate dark-mode raster variants by following [../dark-mode-image.md](../dark-mode-image.md), which requires the `imagegen` skill before creating or editing raster assets

## SVG Rules

- For inline `<svg>`, style dark mode with Tailwind `dark:*` classes (e.g. `dark:fill-*`, `dark:stroke-*`, `dark:text-*`)
- For external SVGs referenced via `<img>`, always create a dark version alongside the original (e.g. `logo.svg` and `logo-dark.svg`); never substitute CSS filters (`invert`, `brightness`) or opacity for a true dark variant
