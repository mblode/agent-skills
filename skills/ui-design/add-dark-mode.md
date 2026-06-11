# Add Dark Mode

Use this when the user wants to add dark mode support to an existing UI.

## Activation

### Use For

- adding dark mode to a page, section, component, or site
- improving an existing dark mode treatment
- converting a light-mode-only UI to support dark mode
- creating a dark-mode variant of a standalone raster image (screenshot, illustration, photo, texture)

### Do Not Use For

- brand-new design or layout work (use Build mode in `SKILL.md`)
- responsive behavior, component organization, or general visual polish without dark mode (use the Responsive, Componentize, or Build modes in `SKILL.md`)

## Load First

- Dark-mode design guidance for UI code is inline below.
- For raster image work (auditing flagged images or a standalone "dark version of this image" request), load [dark-mode-image.md](./dark-mode-image.md).

## Workflow

1. Inspect the existing UI and project Tailwind conventions.
2. Convert markup to include appropriate dark-mode classes.
3. Audit rasterized images for dark-mode variants.
4. For each rasterized image that needs a dark-mode variant, follow [dark-mode-image.md](./dark-mode-image.md), which requires the `imagegen` skill before creating or editing image assets.
5. Save generated dark-mode images alongside the originals and wire them into the dark-mode UI.

## Dark Mode Rules

Load [guidelines/dark-mode.md](./guidelines/dark-mode.md) for the full rule set (design, component, raster image, and SVG rules). It is the single source of truth; do not restate or improvise dark-mode rules here.

## Guardrails

- Do not generate, edit, or replace raster image assets without first loading [dark-mode-image.md](./dark-mode-image.md) and the `imagegen` skill it requires.
- Require the dark-mode-image + `imagegen` workflow even when the image change seems simple, decorative, or incidental.

## Verify

- Check light and dark modes for contrast, missing variants, and images that still assume a light background.
