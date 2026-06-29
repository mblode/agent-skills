# Custom Fonts

Covers: loading custom fonts, registering font theme variables, applying display/body font utilities.

- Load custom fonts before using them: add `<link>` tags in the HTML `<head>` (preferred); if no `<head>` exists, use `@import url('…');` at the top of the CSS file instead.
- Register frequently used custom fonts in the CSS `@theme` block: e.g. `--font-display: "Oswald", sans-serif;`; optionally set `--font-display--font-feature-settings` and `--font-display--font-variation-settings` for fine-tuning.
- Register headline/display fonts as `--font-display` (creates a `font-display` utility): use `--font-sans` for body/UI fonts and `--font-display` for fonts used only on headings and display text; apply `font-display` on headings alongside `font-sans` on the body.
