# Marketing / Brand UI

Commit to a clear aesthetic point of view before writing code. Avoid generic AI aesthetics.

## Contents

- Working model
- Beautiful defaults
- Landing page default sequence (Hero rules, Viewport budget)
- Imagery
- Copy
- UX baseline
- Aesthetic rules
- Motion
- Hard rules
- Litmus checks
- Conversion strategy

## Working model (before building)

Write three things before touching code:

- **Visual thesis**: one sentence on mood, material, and energy.
- **Content plan**: hero, support, detail, final CTA, with what each must communicate.
- **Interaction thesis**: 2-3 motion ideas that change the page's feel.

Each section gets one job, one dominant visual idea, one primary takeaway or action.

## Beautiful defaults

- Start with composition, not components.
- Prefer a full-bleed hero or full-canvas visual anchor.
- Make the brand or product name the loudest text.
- Keep copy scannable in seconds.
- Use whitespace, alignment, scale, cropping, and contrast before chrome.
- Two typefaces max, one accent color by default.
- Default to cardless layouts: sections, columns, dividers, lists, media blocks.
- Treat the first viewport as a poster, not a document.

## Landing page default sequence

1. **Hero**: brand or product, promise, CTA, one dominant visual.
2. **Support**: one concrete feature, offer, or proof point.
3. **Detail**: atmosphere, workflow, product depth, or story.
4. **Final CTA**: convert, start, visit, or contact.

### Hero rules

- One composition only. Full-bleed image or dominant visual plane.
- On branded pages the hero runs edge-to-edge: no inherited gutters, framed container, or shared max-width. Constrain only the inner text/action column.
- Brand first, headline second, body third, CTA fourth.
- No hero cards, stat strips, logo clouds, pill soup, or floating dashboards by default.
- Headlines roughly 2-3 lines on desktop, readable in one glance on mobile.
- Keep the text column narrow, anchored to a calm area of the image.
- All text over imagery: strong contrast, clear tap targets.

If the first viewport still works without the image, the image is too weak. If the brand disappears with the nav hidden, the hierarchy is too weak.

### Viewport budget

- A sticky/fixed header counts against the hero; header + hero content must fit the initial viewport.
- For `100vh`/`100svh` heroes, subtract persistent chrome (`calc(100svh - header-height)`) or overlay the header instead of stacking it.

## Imagery

Imagery must do narrative work.

- Use at least one strong, real-looking image for brands, venues, editorial pages, lifestyle products.
- Prefer in-situ photography over abstract gradients or fake 3D objects.
- Choose or crop images with a stable tonal area for text.
- No embedded signage, logos, or typographic clutter fighting the UI.
- No images with built-in UI frames, splits, cards, or panels.
- For multiple moments, use multiple images, not one collage.

## Copy

- Write in product language, not design commentary.
- Let the headline carry the meaning.
- Supporting copy is usually one short sentence.
- Cut repetition between sections.
- No prompt language or design commentary in the UI.
- Each section has one job: explain, prove, deepen, or convert.

If deleting 30 percent of the copy improves the page, keep deleting.

## UX baseline (non-negotiable)

- Full keyboard support and visible focus.
- Hit targets 44x44px on touch (WCAG 2.5.5). 24x24px is the floor only for dense desktop UI under `pointer: fine` (WCAG 2.5.8).
- Accessible forms (labels, enter-to-submit, inline errors).
- Handle loading/empty/error states and long content.

## Aesthetic rules

- Typography: distinctive fonts (not Inter/Roboto/Arial/system). Weight >= 400. Use `clamp()`.
- Colour: commit to a palette via CSS variables; avoid pure black/white; one sharp accent.
- Composition: intentional asymmetry, contrast, and negative space.
- Backgrounds: atmosphere via gradients/noise/patterns, not flat fills.
- Interaction: set `pointer-events: none` on decorative layers; allow text selection by default.

## Motion

- Ship 2-3 intentional motions: a hero entrance sequence, one scroll-linked or depth effect, one hover/reveal/layout transition.
- Follow `ui-animation` guidelines for timing, easing, and motion review.

## Hard rules

- No cards by default.
- No boxed or center-column hero when the brief calls for full bleed.
- No more than one dominant idea per section.
- No headline overpowering the brand on branded pages.
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
- Would the design still feel premium with all decorative shadows removed?

## Conversion strategy

For conversion-goal pages, load [cro.md](cro.md) (persuasion, social proof, benchmarks, page length), [testing.md](testing.md) (experiment planning), and [modern.md](modern.md) (mobile, speed, personalisation, microcopy). Below are the track-level layout decisions; the references cover the psychology and the numbers.

### Conversion-aware layout

- **One CTA, repeated.** Primary CTA appears after hero, after proof, and at bottom. No competing actions.
- **Strip navigation** on landing pages. Every link that isn't the CTA is a leak.
- **Every section must earn its place.** Each builds confidence, handles an objection, or drives toward the CTA. Sections that just describe the company are furniture; cut them.
- **Message match.** The hero headline must echo the promise that brought the reader (ad, email, referral). If the ad said "Cut your AWS bill in half" and the page opens with "Welcome to CloudSave", the reader bounces.
- **Proof near every conversion point:** within one scroll of each CTA, with 3-5 logos or one credibility stat above the fold. Placement and the proof credibility hierarchy are in [cro.md](cro.md).
- **Mobile is a separate design**, not a reflow: sticky above-the-fold CTA, proof within two scroll-lengths, single-column 16px+ forms. Full rules in [modern.md](modern.md).
