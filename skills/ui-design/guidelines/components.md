# Components

Short rule sets, one section per component. The index in `../design-guidelines.md` links each section; load this file when any of them applies and read only the matching sections.

## Contents

- [Avatars](#avatars)
- [Badges](#badges)
- [Border Radius](#border-radius)
- [Custom Fonts](#custom-fonts)
- [Description Lists](#description-lists)
- [Feature Lists](#feature-lists)
- [Flexbox Layout](#flexbox-layout)
- [Headers](#headers)
- [Login Pages](#login-pages)
- [Logo Clouds](#logo-clouds)
- [Pagination](#pagination)
- [SVG](#svg)

## Avatars

- See [Assets API](./assets-api.md) for avatar URLs and query parameters
- Prefer extension-suffixed avatar URLs like `/avatars/1.webp`
- `outline-1 -outline-offset-1 outline-black/5` or `outline-black/10` on light surfaces; `outline-white/10` on dark surfaces
- Give stacked/overlapping groups a 2px `ring` matching the background (e.g. `ring-2 ring-white`)

## Badges

- Badges with a leading/trailing icon: never use symmetric `px-*`; use `pl-*`/`pr-*` with the icon side's padding equal to the vertical padding: `py-1 pr-2 pl-1` (left icon), `py-1 pr-1 pl-2` (right icon)

## Border Radius

- Use concentric radii on closely nested rounded elements: define the relationship with CSS variables and `calc()` so the math is enforced, e.g. `rounded-(--radius) p-(--padding)` on the outer element, `rounded-[calc(var(--radius)-var(--padding))]` on the inner. Past roughly 24px of padding, or when the inset is deliberately asymmetric, treat the layers as independent surfaces and keep each component's radius token instead of forcing the math.
- Use `min()` with viewport units for image/screenshot radii instead of fixed `rounded-*`: e.g. `rounded-[min(1vw,12px)]`; match the intended value at full desktop width and scale down proportionally as the screen shrinks.
- Keep one radius family per view: don't mix rounded and sharp corners on sibling elements; pick a small set of radii (controls, cards, fullscreen surfaces) and apply them consistently.
- Continuous corners (squircles) belong on app icons, avatars, and iOS-like tiles where a circular arc looks pinched at large sizes. Use `corner-shape: squircle` where supported, otherwise a superellipse mask. Nested cards, inputs, and buttons stay on CSS `border-radius` so concentric math still holds. Do not mix squircle and circular-arc siblings in one toolbar.

## Custom Fonts

- Load custom fonts before using them: add `<link>` tags in the HTML `<head>` (preferred); if no `<head>` exists, use `@import url('…');` at the top of the CSS file instead.
- Register frequently used custom fonts in the CSS `@theme` block: e.g. `--font-display: "Oswald", sans-serif;`; optionally set `--font-display--font-feature-settings` and `--font-display--font-variation-settings` for fine-tuning.
- Register headline/display fonts as `--font-display` (creates a `font-display` utility): use `--font-sans` for body/UI fonts and `--font-display` for fonts used only on headings and display text; apply `font-display` on headings alongside `font-sans` on the body.

## Description Lists

- Style `<dt>` with higher-contrast text and slightly heavier weight (e.g. `font-medium`); style `<dd>` with regular weight and lower-contrast color, so links inside `<dd>` use the higher-contrast color to stand out

## Feature Lists

- Use `<dl>`/`<dt>`/`<dd>` for feature sections listing multiple features, not `<ul>`/`<li>` or plain `<div>` groups

## Flexbox Layout

- Add `min-w-0` (or `min-width: 0`) to flex children that must shrink below their content size: flex items default to `min-width: auto` and won't shrink past their content without it. Applies at every scale, from page-level layouts (a fluid content area next to a fixed-width sidebar using `flex-1`) down to small UI pieces (a truncated text label in a row, a flexible input next to a fixed button).
- Add `shrink-0` to flex children that should never shrink: icons, SVGs, images, logos, avatars, and any element that would become visually distorted if compressed.

## Headers

- Wrap the main logo in `<a href="/">` with `aria-label="Homepage"`
- Navbar buttons must feel secondary to the hero's primary CTA: use ghost, outline, subtle, or a smaller solid button; matching the hero color is fine if the navbar button is noticeably smaller

## Login Pages

- Never use light-tinted backgrounds (e.g. `bg-gray-50`, `bg-gray-100`, `bg-slate-50`) on login/sign-in pages: use solid white (`bg-white`) or dark (`bg-gray-900`, `bg-gray-950`, `bg-black`), unless the form is in a distinct panel or card

## Logo Clouds

- Distribute logos evenly across rows when wrapping; never an unbalanced last row. Use a grid that splits as evenly as possible (e.g. 3+3, not 5+1, for 6 logos)
- A logo cloud directly beneath a hero extends the hero: match its alignment; left-aligned hero → left-aligned label and logos

## Pagination

- Hide page numbers on mobile when pagination includes both page numbers and previous/next buttons

## SVG

- Omit `xmlns` on inline `<svg>` in HTML/JSX: only needed for standalone `.svg` files
- Style SVG colors with Tailwind classes (`fill-*`, `stroke-*`, `text-*` with `fill="currentColor"`/`stroke="currentColor"`), not hardcoded attributes or ternaries: use `data-*`/`aria-*` variants or conditional classes to switch colors
- Never combine `fill="currentColor"`/`stroke="currentColor"` attributes with `fill-*`/`stroke-*` classes on one element (they conflict): use `fill-current`/`stroke-current` to inherit text color, or drop the attribute when using a specific class like `fill-zinc-400`
