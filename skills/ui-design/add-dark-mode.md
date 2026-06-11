# Add Dark Mode

Use this when the user wants to add dark mode support to an existing UI.

## Load First

- Load [guidelines/dark-mode.md](./guidelines/dark-mode.md) for the dark-mode design rules.
- For raster image work (auditing flagged images or a standalone "dark version of this image" request), load [dark-mode-image.md](./dark-mode-image.md).

## Workflow

1. Inspect the existing UI and project Tailwind conventions.
2. Convert markup to include appropriate dark-mode classes.
3. Audit rasterized images for dark-mode variants.
4. For each rasterized image that needs a dark-mode variant, follow [dark-mode-image.md](./dark-mode-image.md), which requires the `imagegen` skill before creating or editing image assets.
5. Save generated dark-mode images alongside the originals and wire them into the dark-mode UI.

## Guardrails

- Do not generate, edit, or replace raster image assets without first loading [dark-mode-image.md](./dark-mode-image.md) and the `imagegen` skill it requires.
- Require the dark-mode-image + `imagegen` workflow even when the image change seems simple, decorative, or incidental.

## Verify

- Check light and dark modes for contrast, missing variants, and images that still assume a light background.
