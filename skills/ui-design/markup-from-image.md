# Markup From Image

Use when turning a UI image into semantic, unstyled HTML or JSX markup as a scaffold before styling.

## Workflow

1. Inspect the image and prompt for output format, target file, insertion location, and source scope (`full page`, `page section`, `component`, or `embedded media`).
2. If the user wants repository edits but gave no clear insertion target, ask one focused question first.
3. Inspect the target file or surrounding component before inserting.
4. Identify landmarks and content groups: headers, navigation, main content, sections, articles, asides, footers, headings, lists, forms, tables, buttons, links, media, and embedded app/interface screenshots.
5. Draft one contiguous unstyled markup block in the target syntax.
6. Use existing project components only when the user names them or asks for reuse; inspect their API first and keep them inline.
7. Insert at the requested location, or return one standalone block for a snippet-only request.

## Rules

- Semantic HTML first: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, heading levels, `ul`/`ol`, `dl`, `table`, `form`, `label`, `button`, and `a` where they match the image.
- Add a logical kebab-case `id` to every `<section>` based on content or purpose: `id="hero"`, `id="features"`, `id="pricing"`, `id="testimonials"`.
- Classify source scope before drafting; default to the narrowest visible scope when ambiguous.
- Use prompt wording, requested file/component names, and insertion target as scope evidence: names like `hero.jsx`, `pricing-card.jsx`, `feature-section.jsx`, or "insert this section" imply section/component output unless the user explicitly asks for a full page.
- Page-level `<main>` only for full-page output; page-level `<header>`/`<footer>` only when the content is clearly site-wide, not because it's the first or last band in a crop.
- Fully unstyled: no `class`, `className`, `style`, Tailwind utilities, styling props, layout or decorative wrappers, inline dimensions (except placeholder icon `<svg>` dimensions), or presentational attributes.
- One block only: no new components, helper functions, data arrays, maps, slots, or partials.
- Represent repeated UI as semantic lists, description lists, table rows, fieldsets, or repeated inline markup, not abstractions.
- Preserve visible copy; use concise placeholder copy only when text is unreadable.
- Normal casing; never preserve all-caps, small-caps, or all-lowercase visual styling (casing belongs in CSS). Preserve real acronyms and brand capitalization.
- Use `<a href="#">` for navigation, destinations, page/route changes, downloads, external links, and button-looking CTAs ("Get started", "Learn more", "View details", "Pricing", "Sign in", "Sign up") when not visibly submitting a form.
- Use `<button type="button">` only for same-page actions that mutate, toggle, open, close, dismiss, or control visible UI state; `<button type="submit">` only for visible form-submission controls.
- Pair controls with visible `label`s when the image shows labels; use `aria-label` when there's no visible label; `fieldset`/`legend` for grouped controls.
- Represent icons as a 20px by 20px `<svg>` with `role="img"` and only a comment naming the inferred meaning; never `<img>` for icon placeholders.
- Treat app screenshots, UI mockups, interface previews, dashboards, charts, maps, code editors, device screens, browser windows, and product screenshots as media: use placeholder image elements, don't recreate their internal UI.
- Represent meaningful images, logos, avatars, screenshots, and thumbnails with placeholder media; use empty `alt` only for decorative or unidentified imagery.
- Avoid ARIA roles when native HTML provides the semantics.
- User-requested existing components may replace raw elements, but pass no styling props or classes unless the user explicitly asks for that component API.

## Guardrails

- Keep interpretation conservative: don't invent sections, copy, data, or behavior that isn't visible or requested.

## Verify

- No new `class`, `className`, `style`, Tailwind utilities, or styling props (unless the user requested existing styled components).
- Lists, tables, forms, navigation, buttons, links, headings, landmarks, and media use native semantics, including accessible form-control names.
- Every `<section>` has a logical kebab-case `id` based on content or purpose.
- Scope matches the prompt, requested file/component name, insertion target, and image context; isolated sections/components aren't wrapped in page-level `<main>`.
- Text uses normal casing, not screenshot casing that belongs in CSS.
- Every `<a>` has an `href` (`href="#"` when no destination is known); no `<button>` used only because the image styles a link like a button.
- Icon placeholders use 20px by 20px `<svg>` with only an inferred-meaning comment, no `<title>`, no `<img>`.
- Embedded app/interface screenshots are placeholder media, not recreated controls, tables, charts, browser chrome, or device UI.
- Markup is one contiguous block with no new components, helpers, data arrays, or mapping abstractions.
- Markup was inserted at the requested location when editing files.
