# Visual Foundations

House defaults for colour, type, depth, surfaces, materials, radius, dark mode, and UI copy punctuation. Load for any Build or Direction pass; these are the defaults a build is audited against.

## Contents

- Colors
- Typography
- Shadows
- Surfaces
- Materials
- Border Radius
- Dark Mode
- Copywriting

## Colors

Covers: brand colors, accent colors, neutral palettes, text colors, default color families, semantic color scales.

- Never default to indigo as the brand/accent color: use it only if the project already does or the user requests it.
- Never default to `gray-*` or `slate-*` for neutral/text colors: use them only if the project already does or the user requests them; prefer `zinc-*` or `neutral-*`.
- Prefer near-black and near-white over pure `#000` and `#fff` for large surfaces and text-heavy UI. Pure extremes are reserved for deliberate contrast moments.
- When a palette has a clear warm or cool bias, tint neutrals slightly in the same direction. Do not mix warm-neutral backgrounds with cool-neutral foregrounds unless the brand system already does.
- On saturated fills, soften secondary text with a lighter tint of the fill hue or transparency rather than generic grey. Verify the resulting contrast in the rendered component.
- Give palette colors distinct brightness roles as well as different hues. Similar-brightness accents compete, especially in charts, badges, and status-heavy UIs.
- Increase contrast for primary tasks and important content; lower contrast for structural support like dividers, shadows, inactive chrome, and decorative marks.

### Semantic color scales

When defining a custom multi-step palette, give each step a role so component states are derivable, not hand-picked: steps encode intent, not just lightness. For a 10-step scale (scale the mapping to the project's actual step count):

- `100` background, `200` hover background, `300` active background
- `400` border, `500` hover border, `600` active border
- `700` solid fill (high contrast), `800` solid fill hover
- `900` secondary text and icons, `1000` primary text and icons

Derive states by stepping up the scale: fill `700`→`800` on hover; background `100`→`200` (hover), `300` (active); border `400`→`500`→`600`. Build the scale once; reference roles, never pick a new color per state.

Hold chroma as high as the gamut allows at each step rather than letting it fade toward neutral through the middle of the ramp, which is what makes a scale look chalky. Chroma has to fall away at the extremes because the gamut narrows there, so that is expected, not drift. When lightness alone leaves a difficult hue muddy, rotate the hue slightly as you step: toward yellow as the scale lightens, toward blue as it darkens, keeping the total shift within about 15 degrees end to end so the colour keeps its identity. Author the ramp in `oklch()` so equal lightness steps stay perceptually even across hues; HSL lightness is not perceptual.

## Typography

Covers: text sizes, line heights, heading styles, font weights, tracking, text width, `text-pretty`, `text-balance`, eyebrow text.

### Design Rules

- Body, paragraph, and general content is `text-base` (16px) at every breakpoint. `text-sm` is for labels, captions, and helper text, never for reading copy; `text-xs` is for neither.
- Never use `font-bold` for headings: use `font-semibold` or `font-medium`.
- Use at most two font weights per view: one for emphasis (headings, labels), one for body; reuse them.
- Make hierarchy levels identical or clearly different, never nearly the same. Merge almost-equal sizes or separate them enough to create a visible rank.
- Don't hand-tune leading on display type. Tailwind ships `line-height: 1` from `text-5xl` up, which is already correct; overriding it with `leading-[1.05]` or similar loosens type that should stay tight. Hand-tune leading on body copy instead, where the default is set for a measure your layout may not have.
- Use `text-balance` on short headings, `text-pretty` on paragraph text and on any title long enough to wrap past two lines (article and blog titles: Prose Content in `sections.md`).
- Add `tracking-tight` to headings larger than `text-xl`, unless the font is a condensed headline font (already tight).
- Large type should not look airy: tighten tracking before adding weight, and constrain line length before shrinking the type.
- Small labels need more air than display type: avoid cramped `tracking-tight` or dense line-height on `text-sm` and below unless the text is numeric or code-like.
- Never use `uppercase` on eyebrow text unless it's a monospace font; with monospace `uppercase`, always add `tracking-wide`.

- For displayed data, omit labels when format, position, or context makes the value self-explanatory. Keep explicit labels for forms, specifications, and views people scan by field name.
- In dense product UI, links need not all use the accent colour. Preserve affordance through context, ink, weight, underline, hover, and focus; reserve bright link colour for sparse actions that need emphasis.

### Coding Rules

- Constrain text width with `max-w-[*ch]` directly on the element: Heading Groups in `sections.md` has the values per `text-*` size.
- When a project uses Inter, use the official variable font (`InterVariable`) with `font-display: swap`; enable useful OpenType features through `font-feature-settings` (for example `cv02`, `cv03`, `cv04`, `cv11`, `ss01`, `ss03`). Do not introduce Inter merely because it is a familiar UI default.
- Custom fonts load and register per Custom Fonts in `tailwind.md`.
- Do not change `font-weight` on hover or selected states of controls or nav items: the width shift reflows adjacent text. Change color, opacity, or underline instead. Audit rule: `type-hover-weight-shift`.

## Shadows

Covers: cards, modals, popovers, dropdowns, buttons, elevated surfaces, shadow/border pairings.

- Never pair shadows with solid gray borders. Use `ring-1 ring-black/5` or `ring-1 ring-black/10` (or `950` of your neutral).
- Never make elevated elements (cards, modals, popovers with `shadow-*`) darker than their canvas: use `white` or the lightest neutral, not `gray-100`/`gray-50`. Inset panels/wells without outer shadows can be darker.
- Use one depth technique per view: borders-only, tint, soft shadow, or layered shadow. Mixing hard shadows, soft shadows, borders, and tints makes hierarchy feel accidental.
- Use one top light source across the view: raised surfaces catch light above and cast shadow below, inset wells reverse that edge relationship, and a surface that is neither gets no edge lighting at all.
- Map depth to semantic z-order. Dialogs sit above menus, menus above routine controls, and routine controls above or within the work surface. A larger shadow is not decoration for a more important label.
- For close-view surfaces, combine a tight contact layer with a wider soft wash. As elevation rises, the contact layer weakens while the wash grows.
- In dark UI, avoid shadows as the main depth cue. Use surface brightness, borders, or subtle tint because dark shadows either disappear or become too harsh.
- For custom shadows, make blur roughly twice the offset and lower opacity as elevation increases, e.g. `0 4px 8px rgba(...)` reads cleaner than a hard 4px shadow.

## Surfaces

Covers: cards, wells, borders, dividers, white space, recessed backgrounds, content grouping.

- Don't default to white cards on gray backgrounds: prefer content directly on white, or white cards with just a `border`
- Choose surface treatments by information hierarchy: white space alone for tightly related items; subtle borders/dividers for sibling content needing separation; wells (recessed backgrounds like `bg-gray-50`) for secondary or nested content; cards with borders or shadows for standalone, interactive, or highly distinct items
- Use the lightest separation that works: whitespace, then subtle borders/dividers, then cards; never jump straight to cards
- Reserve cards for independently interactive content (clickable to navigate) or fundamentally different content types
- Make semantic roles look different. Context, references, previews, and captions must not receive the same card or action treatment as selectable or clickable peers; if five items look equally interactive, users will assume five choices.
- Container borders must contrast with both adjacent surfaces. On dark-on-darker UI the border is lighter than both surfaces; on light-on-lighter UI it is darker than both.
- Avoid two hard divides touching: a background transition plus a card edge plus a divider creates visual noise. Remove one layer or soften it with whitespace.
- Put simple foregrounds on complex backgrounds, and complex foregrounds on simple backgrounds. Avoid complex-on-complex unless the content is intentionally decorative and low-stakes.
- In containers, outer padding is at least equal to inner gaps between child elements. Related children sit closer to each other than to the container edge.
- Subtle top borders or vertical dividers for sibling items in shared context: stat grids, metric rows, dashboard KPIs
- Divider-separated items: middle items get equal padding on both sides of the divider (`px-*`); the first item in a row gets only `pr-*` (no `pl-*`), the last gets only `pl-*` (no `pr-*`); for horizontal dividers: first item only `pb-*` (no `pt-*`), last only `pt-*` (no `pb-*`); when grid columns change at a breakpoint, reset padding per the new first/last, e.g. a 4-column grid becoming 2-column: items 1 and 3 are now row-starts (no `pl-*`), items 2 and 4 are now row-ends (no `pr-*`); use responsive prefixes like `sm:pl-0` or `lg:pr-0` to override at each breakpoint
- Reconfigure dividers at each breakpoint when grid columns change: use `nth-child` to target items not in the first column: 2 columns use `[&:nth-child(2n)]:border-l-*`; 4 columns use `[&:not(:nth-child(4n+1))]:border-l-*`; adjust the pattern per breakpoint to match the column count; when collapsing to a single column, remove vertical dividers and add horizontal dividers between rows (`border-t-*` on all items except the first)
- Whitespace alone suffices when content has inherent contrast (large numbers vs small labels, bold headings vs body text)
- Never use solid divider colors: use opacity-based like `divide-gray-950/5` or `border-gray-950/10`, not `divide-gray-200` or `border-gray-300`
- When a faint divider disappears at its rendered size, add weight before adding contrast. A soft 2px rule separates without repeating a harsh dark line.

## Materials

Covers: translucent chrome, backdrop-filter layers, material weight as hierarchy, vibrancy text legibility, scroll edge effects, grain against banding, and reduced-transparency fallbacks. Approximates Apple-style materials on the web.

- Build nav bars, toolbars, and sheets as translucent layers, `backdrop-filter: blur() saturate()` over a semi-transparent background, with content scrolling underneath, rather than opaque bars that consume a fixed strip. A bright top border reads as light catching the material.
- Material weight encodes hierarchy: darker, heavier materials separate structural regions (sidebars); lighter materials draw attention to interactive elements (buttons). Never stack a light translucent surface on another translucent surface: legibility collapses.
- Bigger surfaces read as thicker: give them stronger blur and a deeper shadow than small chips. Consider context-aware shadow, heavier over busy or text content for separation, lighter over plain backgrounds.
- Dim to focus, separate to keep flow. A modal task pairs the surface with a dimming scrim and pushes the background back. A parallel, non-blocking panel uses translucency and offset without a scrim so the flow isn't broken. For stacked sheets, progressively dim and push back each parent layer.
- Vibrancy keeps text legible over changing backgrounds. Over blurred or translucent surfaces, don't use flat gray text: use higher contrast, a slightly heavier weight, and a small letter-spacing bump. Put color on a solid layer, not the translucent foreground.
- Scroll edge effects, not hard dividers. Instead of a 1px border under a sticky header, fade a small blur or gradient mask where content meets floating chrome, only where floating UI actually overlaps content.
- Materialize, don't just fade. For glass or blur surfaces, animate blur radius and scale together on enter and exit, so the surface reads as a real material arriving rather than a plain opacity fade.
- Provide fallbacks: `@media (prefers-reduced-transparency: reduce)` raises background opacity and drops the blur; `@media (prefers-contrast: more)` uses a near-solid background with a defined, contrasting border.
- Grain vs banding: a very faint noise overlay (`pointer-events-none`, `aria-hidden`) hides banding from large blurs and stretched gradients. One layer, low opacity. Do not stack multiple noise layers (see `slop-decoration-no-role`).
- Large `blur()` / `backdrop-filter` values are expensive; prefer smaller blur plus a solid or gradient underlay.

```css
.toolbar {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.4); /* bright top edge = light catching the material */
}

@media (prefers-reduced-transparency: reduce) {
  .toolbar { background: white; backdrop-filter: none; }
}
```

## Border Radius

Covers: rounded cards, panels, buttons, images, screenshots, nested surfaces, any UI element where radius consistency matters.

- Use concentric radii on closely nested rounded elements: define the relationship with CSS variables and `calc()` so the math is enforced, e.g. `rounded-(--radius) p-(--padding)` on the outer element, `rounded-[calc(var(--radius)-var(--padding))]` on the inner. Past roughly 24px of padding, or when the inset is deliberately asymmetric, treat the layers as independent surfaces and keep each component's radius token instead of forcing the math.
- Use `min()` with viewport units for image/screenshot radii instead of fixed `rounded-*`: e.g. `rounded-[min(1vw,12px)]`; match the intended value at full desktop width and scale down proportionally as the screen shrinks.
- Keep one radius family per view: don't mix rounded and sharp corners on sibling elements; pick a small set of radii (controls, cards, fullscreen surfaces) and apply them consistently.
- Continuous corners (squircles) belong on app icons, avatars, and iOS-like tiles where a circular arc looks pinched at large sizes. Use `corner-shape: squircle` where supported, otherwise a superellipse mask. Nested cards, inputs, and buttons stay on CSS `border-radius` so concentric math still holds. Do not mix squircle and circular-arc siblings in one toolbar.

## Dark Mode

Covers: dark-mode styling, light-to-dark conversion, contrast audits, dark-mode images, dark-mode SVGs.

### Design Rules

- Dark mode maintains the same contrast ratios as light mode, not a simple color inversion
- Dark mode needn't preserve every detail of the light design: it just needs to look good
- Default dark mode to the OS `prefers-color-scheme` setting (Tailwind's built-in `dark:` behavior); add a manual toggle only when the user explicitly asks
- Remove all shadows in dark mode: use `dark:shadow-none`
- On dark-mode-only sites, add `scheme-only-dark` to `<html>` or the top-level element: ensures native elements (scrollbars, form controls, `color-scheme`) render in dark mode
- Optical compensation: light text on dark reads heavier than the same weight on light. Prefer the existing face at the same weight with `-webkit-font-smoothing: antialiased` (owned by `font-rendering` in `rules-typography/`) rather than dropping below 400. If a display line still looks overweight, tighten tracking slightly instead of inventing a lighter cut.

### Component Rules

- Never keep large branded/colored panels in dark mode; use the same background color and add a light divider between sections
- Style cards only slightly lighter than the page background (e.g. `dark:bg-gray-900` on a `dark:bg-gray-950` page); add `dark:inset-ring dark:inset-ring-white/5` for definition
- Make decorative testimonial quote marks very faint (e.g. `dark:text-white/5`)
- Never use multiple heading colors in dark mode (e.g. dark gray + brand); use one light color like `white` or `gray-100` for all headings

### Raster Image Rules

- When adding or improving dark mode, audit the page for rasterized images needing dark-mode versions: photos, screenshots, product mockups, decorative backgrounds, textures, rasterized illustrations
- Never use CSS filters (`invert`, `brightness`, `contrast`, `opacity`) as the final raster dark-mode treatment; always create real dark-mode image files
- Generate dark-mode raster variants per Dark-mode raster variants below.

### Dark-mode raster variants

Adding dark mode to existing UI: add the `dark:` classes, then audit raster images and give each one that assumes a light background a real variant.

- Generating or editing an image needs an image-generation tool (the `imagegen` skill where installed). Without one, list each image that needs a variant with its target background colour and hand the list to the user; never substitute CSS filters.
- Same dimensions as the original, saved beside it with a `-dark` suffix (`bg.jpg`, `bg-dark.jpg`), and wired in by the caller.
- Background: black or dark gray for white, dark gray for off-white, or the dark site background when the original matched the light one.
- Preserve composition, relative contrast, blur and softness, fades, and foreground hues (adjust only saturation and lightness). Bright stays bright; muted stays muted.
- Verify both modes for contrast, missing variants, and images still assuming a light background.

### SVG Rules

- For inline `<svg>`, style dark mode with Tailwind `dark:*` classes (e.g. `dark:fill-*`, `dark:stroke-*`, `dark:text-*`)
- For external SVGs referenced via `<img>`, always create a dark version alongside the original (e.g. `logo.svg` and `logo-dark.svg`); never substitute CSS filters (`invert`, `brightness`) or opacity for a true dark variant

## Copywriting

Covers: headings, taglines, subtitles, descriptions, labels, list items, button text, other UI copy.

- Headings: periods or none, but stay consistent within a page.
- Use proper ending punctuation on full sentences and paragraphs.
- Use a period on standalone descriptive text: taglines, subtitles, tier descriptions like "For professionals and growing teams.", single-line descriptions like "For organizations that need more power and control."
- Omit periods only on list items (e.g. feature bullets in pricing cards).
- Never use emojis anywhere: headings, descriptions, buttons, labels, or any text.

### UI microcopy

- Name actions verb + noun ("Delete member", "Deploy project"), never bare "Confirm", "OK", or a lone verb.
- Write errors as what happened + what to do next: "Build failed. Bundle exceeds 50 MB. Reduce it or raise the limit."
- Toasts name the specific thing changed, no trailing period, never say "successfully": "Project deleted", not "Successfully deleted the project."
- Empty states point to the first action: "No deployments yet. Push to your Git repository to create one."
- In-progress states use the present participle plus a real ellipsis character: "Deploying…", "Saving…", never three periods.
- Sentence case everywhere: labels, buttons, titles, tabs, body, helper text, and toasts. Final wording belongs to `ghostwriter`.
