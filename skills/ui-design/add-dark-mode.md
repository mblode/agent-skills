# Add Dark Mode

Use when the user wants to add dark mode support to an existing UI.

## Load First

- [guidelines/dark-mode.md](./guidelines/dark-mode.md) for the dark-mode design rules.
- [dark-mode-image.md](./dark-mode-image.md) for raster image work (auditing flagged images or a standalone "dark version of this image" request).

## Workflow

1. Inspect the UI and project Tailwind conventions.
2. Add dark-mode classes to the markup.
3. Audit raster images for dark-mode variants.
4. For each raster image needing a variant, follow [dark-mode-image.md](./dark-mode-image.md), which requires the `imagegen` skill before creating or editing image assets.
5. Save dark-mode images beside the originals and wire them in.

## Guardrails

- Never generate, edit, or replace raster image assets without first loading [dark-mode-image.md](./dark-mode-image.md) and the `imagegen` skill it requires, even when the change seems simple, decorative, or incidental.

## Verify

- Check both modes for contrast, missing variants, and images still assuming a light background.
