# Brand Kit Prompt

## Contents

- [Purpose](#purpose)
- [Source Handling](#source-handling)
- [Attached Images](#attached-images)
- [Workflow](#workflow)
- [Canonical Board Spec](#canonical-board-spec)
- [Page Mockups](#page-mockups)
- [Design-System Rail](#design-system-rail)
- [Creative Direction](#creative-direction)
- [Final Prompt Structure](#final-prompt-structure)
- [Rules](#rules)

## Purpose

Generate one complete, production-ready image prompt for a fixed-structure 4K marketing-site brand case-study image. Output prompt text only; do not generate images.

This skill prioritizes distinctive frontend art direction, production-grade public-facing marketing website mockups, generous whitespace, and consistent side-by-side comparison. Even when the concept is a web app, desktop app, mobile app, SaaS product, or other software interface, the board should show the public marketing site for that product. The final image must feel like two real, spacious website surfaces plus a concise typography/color rail, not a cramped moodboard, component inventory, app UI board, or traditional brand-system sheet.

## Source Handling

- Use only the user's concept, brief, notes, constraints, references, attached images, audience, tone, required pages, and avoid-list items.
- If the input is thin but usable, make careful creative inferences.
- Ask a question only when there is no usable brand, product, company, idea, or concept.
- Preserve user-supplied vocabulary, constraints, page requests, examples, references, attached-image inspiration, and avoid-list items.
- Output only the final prompt, with no preamble, rationale, commentary, follow-up, or setup text.

## Attached Images

If the user attaches images, inspect them and translate their visual qualities into prompt language. Use them as design inspiration only:

- Extract aesthetic direction, composition style, visual density, color atmosphere, type mood, spacing feel, texture, lighting, layout rhythm, and interaction/presentation patterns.
- Do not copy or recreate attached-image content, logos, wordmarks, brand marks, icons, mascots, characters, product names, readable text, photography subjects, proprietary UI, exact layouts, or distinctive artwork.
- Do not treat attached images as mandatory content for the generated brand kit unless the user explicitly says the image is their own brand asset and asks to use it.
- If attached images conflict with the written concept, preserve the written concept and use the images only for visual direction.
- In the final prompt, include a short "Reference Image Use" note when images are attached: describe the style inspiration to borrow and explicitly state that attached images are style references only, not content or logo sources.

## Workflow

1. Infer the purpose, audience, positioning, product context, and brand personality.
2. Choose one clear, memorable aesthetic direction that fits the concept.
3. Choose the two public marketing-site page examples:
   - Page mockup 1 defaults to the homepage.
   - Page mockup 2 defaults to a concept-appropriate supporting page with a different content pattern from the homepage.
   - If the user asks for specific pages, use those instead.
   - If the concept is an app or software product, choose pages that can naturally show product screenshots inside the marketing site.
4. If images are attached, summarize their reusable visual qualities using `Attached Images`.
5. Assemble one internally consistent image-generation prompt using the structure in `Final Prompt Structure`.

## Canonical Board Spec

The generated prompt must request this exact image structure unless the user explicitly asks for a different structure:

- Canvas: one single 3840 x 2160 px, 16:9 landscape, high-quality 4K image.
- Layout: three full-height vertical columns with clean gutters.
- Widths: page mockup 1 = 40%, page mockup 2 = 40%, design-system rail = 20%; equivalent ratio 2 : 2 : 1.
- Left column: page mockup 1.
- Middle column: page mockup 2.
- Right column: design-system details rail.
- The two page mockups must dominate and read as large, inspectable website pages.
- The rail must be quieter than the mockups but legible at full 4K size.
- Keep the page mockups spacious and breathable, with clear margins, open section rhythm, and enough negative space that the design does not feel busy.
- Do not add extra panels, page thumbnails, floating device mockups, moodboard imagery, standalone logo explorations, component inventories, callout overlays, or decorative filler.
- Do not generate a separate design-system board, a two-board split, multiple images, unreadably tiny UI fragments, or a dashboard/workspace/app UI board unless the user explicitly requests an interface-only board instead of a marketing site.

## Page Mockups

The two mockups should be substantial public-facing marketing website pages with generous spacing, strong breathing room, and restrained content density. Treat an app concept as a product that needs a marketing site, not as permission to make the board an app UI study. Product/app UI may appear only as supporting content embedded inside a page mockup.

If the concept is a web app, desktop app, mobile app, SaaS product, marketplace, creator tool, productivity tool, or other software product, include at least one realistic screenshot or framed view of the app inside the marketing pages. These screenshots should help explain the product and provide brand inspiration, while the surrounding page remains the main subject.

Page mockup 1:

- Default to the homepage.
- Make it the clearest expression of the marketing promise.
- Include primary navigation with an appropriate logo, wordmark, or brand mark; a strong hero system; primary CTA; and enough below-the-fold content to show section pacing.
- For app/software concepts, include a prominent but embedded product screenshot, device frame, desktop/webapp frame, mobile screen, or interface crop.

Page mockup 2:

- Default to a supporting page that reveals a different side of the system.
- Prefer pages that add new content patterns: pricing, booking, signup, product/service detail, collection/category, editorial/content, comparison, case study, lead-capture, checkout, account creation, search/results, commerce, structured data, forms, tables, cards, proof blocks, dense typography, or screenshot-led feature explanation.
- Reuse the same logo, wordmark, or mark from the homepage in realistic page chrome when appropriate.

For each page, define:

- Page type and purpose.
- Layout structure, hierarchy, key components, and copy tone.
- Logo/wordmark/mark placement when a real site would include one.
- Product screenshot placement when the concept is an app/software product.
- Visible design behavior: grid/composition, generous spacing feel, low-to-moderate density, type scale, navigation, CTAs, forms, cards, pricing tables, proof blocks, product tiles, filters, commerce modules, editorial modules, or other relevant components.
- Whitespace strategy: wide margins, clear gutters, open hero composition, fewer simultaneous content blocks, and section pacing that feels calm rather than crowded.
- Distinctive frontend composition: asymmetry, overlap, strict grid, dense utility, editorial pacing, diagonal flow, immersive media, tactile states, active/hover states, scroll moments, or another concept-appropriate idea.

## Design-System Rail

The right rail documents only values that are hard to recover from the mockups without OCR.

Include:

- Typography: display/headline, body, and UI/label/numeric/mono typeface names or typeface directions; include brief hierarchy, casing, weight, tracking, or pairing notes only when useful.
- Color: dominant/core colors separated from supporting/accent colors; approximate hex-style values; short role labels such as background, foreground, primary, surface, border, signal, accent, semantic, or category.
- Color hierarchy: dominant/load-bearing colors shown as larger swatches or bars; supporting/accent/signal colors shown as smaller grouped chips.
- Rail text optimized for full-4K readability: short labels, large enough type, clear spacing, no dense captions.

Do not include in the rail:

- Logo, wordmark, mark construction, lockups, logo notes, logo variations, or logo-spec content.
- Spacing scales, border radius, grid specs, motion notes, component inventories, component states, icon notes, elevation/shadow specs, or arbitrary brand copy.
- Slogans, positioning paragraphs, mood words, or any text that does not directly document typography or color values used in the page mockups.

## Creative Direction

Choose a bold but concept-appropriate aesthetic direction, such as brutally minimal, maximalist, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft, industrial, utilitarian, or another direction inferred from the brief.

Define:

- Purpose: what visitors should understand, trust, and do.
- Marketing focus: how the site introduces, explains, proves, and sells the brand.
- Tone: 3-5 strong adjectives, not a neutral default.
- Differentiation: the one visual, typographic, interaction, material, motif, or page-structure idea someone would remember.
- Constraints: production-grade, functional, accessible, plausible for a real frontend.
- Intensity: maximalist systems may be rich; refined systems should rely on restraint, proportion, and precision.
- Spacing: preserve generous whitespace even for expressive or maximalist concepts; use scale, contrast, and composition for impact instead of cramming in more modules.

Avoid:

- Defaulting to Inter, Roboto, Arial, system fonts, or overused neutral typography unless requested.
- Cliche purple-blue gradients on white, generic glassmorphism, bland SaaS dashboards, default rounded cards, cookie-cutter component layouts, unrelated gradient blobs, or decorative effects unrelated to the brand.
- Cramped layouts, busy collages, overfilled sections, dense rows of tiny cards, excessive annotations, or too many simultaneous UI fragments.
- Reusing the same trendy typefaces or color systems across concepts.

## Final Prompt Structure

Assemble the final answer as the image prompt itself, using these sections:

1. Brand Positioning
   - Target audience, market positioning, 3-5 tone adjectives, brand personality, relevant comparables/references, and avoid list.
2. Aesthetic Concept
   - Core frontend art direction in one vivid phrase, why it fits, memorable design idea, intensity/restraint, and what makes it specific to this brand.
3. Reference Image Use
   - Include only when images are attached. Summarize reusable visual qualities and state that references are for style inspiration only, not for copied content, logos, text, exact layouts, or proprietary UI.
4. Board Layout
   - Restate the canonical 3840 x 2160, 40% / 40% / 20%, three-column layout and the prohibition on extra panels or alternate layouts.
5. Page Mockups
   - Define the homepage and supporting page using the `Page Mockups` requirements, or use the user's requested pages.
6. Design-System Rail
   - Define only the typography block and hierarchical color block using the `Design-System Rail` requirements.
7. Visual Style Constraints
   - State what to avoid, what to emphasize, anti-generic constraints, generous whitespace requirements, and that the fixed layout still applies even when the aesthetic is expressive.
8. Rendering / Style Hints
   - End with one concise rendering line: one 3840 x 2160 px 16:9 high-quality 4K presentation image; fixed 40% page mockup 1 / 40% page mockup 2 / 20% typography-and-color rail; crisp readable UI and rail text; production-grade marketing website mockups; bold concept-specific art direction; generous margins, open section rhythm, and calm whitespace; realistic polished visual design.

## Rules

- Be specific and concrete; maintain internal consistency across all sections.
- Make the aesthetic direction memorable and concept-specific.
- Keep the website mockups spacious; do not trade readability and whitespace for extra content.
- Use specific typeface names or precise typeface directions and approximate color values.
- Specify which colors are dominant/load-bearing and which are supporting/rare accents, and require that hierarchy to be visible.
- Keep all visible rail text short enough for image generation to render legibly.
- Do not hardcode examples from one concept into another concept.
- Do not ask for a separate design-system board or two images.
- Do not explain your reasoning.
