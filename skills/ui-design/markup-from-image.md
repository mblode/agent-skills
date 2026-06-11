# Markup From Image

Use this when the user wants to turn a UI image into semantic, unstyled HTML or JSX markup as a scaffold before styling.

## Workflow

1. Inspect the source image and prompt for intended output format, target file, insertion location, and source scope (`full page`, `page section`, `component`, or `embedded media`).
2. If the user wants repository edits but did not provide a clear insertion target, ask one focused clarifying question before editing.
3. Inspect the target file or surrounding component before inserting markup.
4. Identify landmarks and content groups: headers, navigation, main content, sections, articles, asides, footers, headings, lists, forms, tables, buttons, links, media, and embedded app/interface screenshots.
5. Draft one contiguous unstyled markup block in the target syntax.
6. Use existing project components only when the user explicitly names them or asks for reuse; inspect their API first and keep them inline in the markup block.
7. Insert the markup at the requested location, or return one standalone markup block when the user asks for a snippet only.

## Rules

- Use semantic HTML first: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, heading levels, `ul`/`ol`, `dl`, `table`, `form`, `label`, `button`, and `a` where they match the image.
- Always add a logical kebab-case `id` to every `<section>` element based on its content or purpose, such as `id="hero"`, `id="features"`, `id="pricing"`, or `id="testimonials"`.
- Classify source scope before drafting; default to the narrowest visible scope when the prompt or image is ambiguous.
- Use prompt wording, requested file/component names, and insertion target as scope evidence; names like `hero.jsx`, `pricing-card.jsx`, `feature-section.jsx`, or "insert this section" imply section/component output unless the user explicitly asks for a full page.
- Use page-level `<main>` only for full-page outputs; use page-level `<header>` and `<footer>` only when the visible content is clearly a site-wide header/footer, not because it is the first or last band in a crop.
- Keep markup completely unstyled: no `class`, `className`, `style`, Tailwind utilities, styling props, layout wrappers, decorative wrappers, inline dimensions except placeholder icon `<svg>` dimensions, or presentational attributes.
- Keep everything in one block; do not create new components, helper functions, data arrays, maps, slots, or partials.
- Represent repeated UI as semantic lists, description lists, table rows, fieldsets, or repeated inline markup instead of abstracting it.
- Preserve visible copy from the image; use concise placeholder copy only when text is unreadable.
- Write copy in normal written casing; never preserve all-caps, small-caps, or all-lowercase visual styling in text content: assume casing transforms belong in CSS. Preserve real acronyms and brand capitalization.
- Use `<a href="#">` for navigation, destinations, page changes, route changes, downloads, external links, and button-looking CTAs such as "Get started", "Learn more", "View details", "Pricing", "Sign in", or "Sign up" when they are not visibly submitting a form.
- Use `<button type="button">` only for same-page actions that mutate, toggle, open, close, dismiss, or control visible UI state; use `<button type="submit">` only for visible form submission controls.
- Pair form controls with visible `label` elements when the image shows labels; use `aria-label` when a control has no visible label; use `fieldset` and `legend` for grouped controls.
- Represent icons as a 20px by 20px `<svg>` with `role="img"` and only a comment naming the source icon's inferred meaning; never use `<img>` for icon placeholders.
- Treat app screenshots, UI mockups, interface previews, dashboards, charts, maps, code editors, device screens, browser windows, and product screenshots as media; represent them with placeholder image elements instead of recreating their internal UI as markup.
- Represent meaningful images, logos, avatars, screenshots, and thumbnails with placeholder media elements when needed; use empty `alt` text only for decorative or unidentified imagery.
- Avoid ARIA roles when native HTML already provides the semantics.
- Existing components requested by the user may replace raw elements, but do not pass styling props or classes unless the user explicitly asks for that component API.

## Guardrails

- Do not style the UI, infer colors, recreate spacing, add responsiveness, or add Tailwind classes.
- Do not turn the scaffold into a finished implementation.
- Do not componentize the scaffold; preserve a single editable markup block.
- Do not choose an insertion location by guesswork when repository edits are requested.
- Keep screenshot interpretation conservative; do not invent large sections, copy, data, or behavior that is not visible or requested.

## Verify

- Confirm the inserted or returned block has no new `class`, `className`, `style`, Tailwind utilities, or styling props unless the user explicitly requested existing styled components.
- Confirm lists, tables, forms, navigation, buttons, links, headings, landmarks, and media use appropriate native semantics, including accessible form control names.
- Confirm every `<section>` has a logical kebab-case `id` based on its content or purpose.
- Confirm the chosen scope matches the prompt, requested file/component name, insertion target, and visible image context; isolated sections/components must not be wrapped in page-level `<main>`.
- Confirm text content uses normal written casing rather than screenshot casing that should be expressed with CSS.
- Confirm every `<a>` has an `href`, using `href="#"` as the placeholder when no real destination is known, and no `<button>` is used only because the source image visually styles a link like a button.
- Confirm icon placeholders use 20px by 20px `<svg>` elements with only an inferred-meaning comment, no `<title>`, and no `<img>` elements.
- Confirm embedded app/interface screenshots are represented as placeholder media, not recreated as nested controls, tables, charts, browser chrome, or device UI markup.
- Confirm the markup is one contiguous block and no new components, helpers, data arrays, or mapping abstractions were introduced.
- Confirm the markup was inserted at the requested location when editing files.
