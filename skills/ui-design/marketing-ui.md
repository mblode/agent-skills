# Marketing / Brand UI

Deliver working code with a clear aesthetic point of view. Avoid generic AI aesthetics.

## Working model (before building)

Write three things before touching code:

- **Visual thesis**: one sentence describing mood, material, and energy.
- **Content plan**: hero, support, detail, final CTA — what each section must communicate.
- **Interaction thesis**: 2-3 motion ideas that change the feel of the page.

Each section gets one job, one dominant visual idea, and one primary takeaway or action.

## Beautiful defaults

- Start with composition, not components.
- Prefer a full-bleed hero or full-canvas visual anchor.
- Make the brand or product name the loudest text.
- Keep copy short enough to scan in seconds.
- Use whitespace, alignment, scale, cropping, and contrast before adding chrome.
- Two typefaces max, one accent color by default.
- Default to cardless layouts. Use sections, columns, dividers, lists, and media blocks instead.
- Treat the first viewport as a poster, not a document.

## Landing page default sequence

1. **Hero**: brand or product, promise, CTA, and one dominant visual.
2. **Support**: one concrete feature, offer, or proof point.
3. **Detail**: atmosphere, workflow, product depth, or story.
4. **Final CTA**: convert, start, visit, or contact.

### Hero rules

- One composition only. Full-bleed image or dominant visual plane.
- On branded landing pages, the hero runs edge-to-edge with no inherited page gutters, framed container, or shared max-width. Constrain only the inner text/action column.
- Brand first, headline second, body third, CTA fourth.
- No hero cards, stat strips, logo clouds, pill soup, or floating dashboards by default.
- Keep headlines to roughly 2-3 lines on desktop and readable in one glance on mobile.
- Keep the text column narrow and anchored to a calm area of the image.
- All text over imagery must maintain strong contrast and clear tap targets.

If the first viewport still works after removing the image, the image is too weak. If the brand disappears after hiding the nav, the hierarchy is too weak.

### Viewport budget

- If the first screen includes a sticky/fixed header, that header counts against the hero. Combined header + hero content must fit within the initial viewport.
- When using `100vh`/`100svh` heroes, subtract persistent UI chrome (`calc(100svh - header-height)`) or overlay the header instead of stacking it.

## Imagery

Imagery must do narrative work.

- Use at least one strong, real-looking image for brands, venues, editorial pages, and lifestyle products.
- Prefer in-situ photography over abstract gradients or fake 3D objects.
- Choose or crop images with a stable tonal area for text.
- Do not use images with embedded signage, logos, or typographic clutter fighting the UI.
- Do not generate images with built-in UI frames, splits, cards, or panels.
- If multiple moments are needed, use multiple images, not one collage.

## Copy

- Write in product language, not design commentary.
- Let the headline carry the meaning.
- Supporting copy should usually be one short sentence.
- Cut repetition between sections.
- Do not include prompt language or design commentary in the UI.
- Give every section one responsibility: explain, prove, deepen, or convert.

If deleting 30 percent of the copy improves the page, keep deleting.

## UX baseline (non-negotiable)

- Ensure full keyboard support and visible focus.
- Hit targets >= 24px (>= 44px on mobile).
- Keep forms accessible (labels, enter-to-submit, inline errors).
- Handle loading/empty/error states and long content.
- Follow `ui-audit` for full a11y and polish checks; use `ui-animation` for motion.

## Aesthetic rules

- Typography: choose distinctive fonts (not Inter/Roboto/Arial/system). Weight >= 400. Use `clamp()`.
- Colour: commit to a palette with CSS variables; avoid pure black/white; use one sharp accent.
- Composition: use asymmetry, contrast, and negative space intentionally.
- Backgrounds: build atmosphere with gradients/noise/patterns, not flat fills.
- Interaction details: set `pointer-events: none` on decorative layers; allow text selection by default.

## Motion

- Ship at least 2-3 intentional motions: one entrance sequence in the hero, one scroll-linked or depth effect, one hover/reveal/layout transition.
- Follow `ui-animation` guidelines for timing, easing, and motion review.

## Hard rules

- No cards by default.
- No boxed or center-column hero when the brief calls for full bleed.
- No more than one dominant idea per section.
- No headline should overpower the brand on branded pages.
- No filler copy.
- No split-screen hero unless text sits on a calm, unified side.
- No more than two typefaces without a clear reason.
- No more than one accent color unless the product already has a strong system.

## Litmus checks

- Is the brand or product unmistakable in the first screen?
- Is there one strong visual anchor?
- Can the page be understood by scanning headlines only?
- Does each section have one job?
- Are cards actually necessary?
- Does motion improve hierarchy or atmosphere?
- Would the design still feel premium if all decorative shadows were removed?

## Reference

- See [aesthetic-direction.md](aesthetic-direction.md) for deeper guidance and examples.
