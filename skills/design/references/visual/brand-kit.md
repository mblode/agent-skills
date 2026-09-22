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
- [Rendering](#rendering)
- [Rules](#rules)

## Purpose

Generate one production-ready image prompt for a fixed-structure 4K marketing-site brand case-study image. Output prompt text only; do not generate images.

Prioritize distinctive frontend art direction and production-grade public marketing-site mockups. Even for a web/desktop/mobile/SaaS product, the board shows that product's public marketing site, not an app-UI board or brand-system sheet: two real website surfaces plus a concise typography/color rail, not a cramped moodboard or component inventory.

Whitespace is non-negotiable across every mockup and section (stated once): generous margins, open rhythm, low-to-moderate density, calm, never cramped. Use scale, contrast, and composition for impact, not more modules.

## Source Handling

- Use only the user's inputs: concept, brief, notes, constraints, references, attached images, audience, tone, required pages, avoid-list.
- Thin but usable input: make careful creative inferences.
- Ask a question only when there is no usable brand, product, company, idea, or concept.
- Preserve user-supplied vocabulary, constraints, page requests, examples, references, attached-image inspiration, and avoid-list items.
- Output only the final prompt: no preamble, rationale, commentary, follow-up, or setup text.

## Attached Images

Inspect attached images and translate their visual qualities into prompt language. Inspiration only:

- Extract: aesthetic direction, composition, visual density, color atmosphere, type mood, spacing, texture, lighting, layout rhythm, interaction/presentation patterns.
- Do not copy or recreate their content, logos, wordmarks, marks, icons, mascots, characters, product names, readable text, photography subjects, proprietary UI, exact layouts, or distinctive artwork.
- Do not treat them as mandatory content unless the user says the image is their own brand asset and asks to use it.
- On conflict with the written concept, keep the concept; use images only for visual direction.
- When images are attached, add a short "Reference Image Use" note in the prompt: the style inspiration to borrow, plus an explicit statement that attached images are style references only, not content or logo sources.

## Workflow

1. Infer purpose, audience, positioning, product context, brand personality.
2. Choose one memorable aesthetic direction that fits the concept.
3. Choose the two public marketing-site pages (see Page Mockups). For an app/software product, choose pages that can naturally show product screenshots inside the marketing site.
4. If images are attached, summarize their reusable visual qualities per `Attached Images`.
5. Assemble one internally consistent prompt using `Final Prompt Structure`.

## Canonical Board Spec

The prompt must request this exact structure unless the user explicitly asks for a different one:

- Canvas: one single 3840 x 2160 px, 16:9 landscape, high-quality 4K image.
- Layout: three full-height vertical columns with clean gutters.
- Widths: page mockup 1 = 40%, page mockup 2 = 40%, design-system rail = 20% (ratio 2 : 2 : 1).
- Left = page mockup 1; middle = page mockup 2; right = design-system rail.
- The two mockups dominate as large, inspectable website pages; the rail is quieter but legible at full 4K.
- No extra panels, page thumbnails, floating device mockups, moodboard imagery, standalone logo explorations, component inventories, callout overlays, or decorative filler.
- No separate design-system board, two-board split, multiple images, unreadably tiny UI fragments, or dashboard/workspace/app UI board unless the user explicitly requests an interface-only board.

## Page Mockups

Two substantial public-facing marketing pages. Treat an app concept as a product needing a marketing site; product/app UI appears only as supporting content embedded inside a page. For any software product (web/desktop/mobile app, SaaS, marketplace, creator or productivity tool), embed at least one realistic screenshot or framed view that explains the product while the surrounding page stays the main subject.

Defaults (use the user's requested pages instead when given): mockup 1 = homepage; mockup 2 = a supporting page with a different content pattern (pricing, signup, product/service detail, collection/category, editorial, comparison, case study, lead-capture, checkout, search/results, commerce, dense typography, or screenshot-led feature explanation).

For each page, define:

- Page type and purpose; layout structure, hierarchy, key components, copy tone.
- Primary navigation with an appropriate logo/wordmark/mark (same mark across both pages); a strong hero and primary CTA on the homepage.
- Product screenshot or device-frame placement for a software product.
- Visible design behavior: grid/composition, type scale, navigation, CTAs, forms, cards, pricing tables, proof blocks, product tiles, filters, commerce or editorial modules.
- Distinctive frontend composition: asymmetry, overlap, strict grid, dense utility, editorial pacing, diagonal flow, immersive media, tactile/active/hover states, or scroll moments.

## Design-System Rail

Document only values hard to recover from the mockups without OCR.

Include:

- Typography: display/headline, body, and UI/label/numeric/mono typeface names or directions; brief hierarchy, casing, weight, tracking, or pairing notes only when useful.
- Color: dominant/core colors separated from supporting/accent; approximate hex-style values; short role labels (background, foreground, primary, surface, border, signal, accent, semantic, category).
- Color hierarchy: dominant/load-bearing colors as larger swatches or bars; supporting/accent/signal colors as smaller grouped chips.
- Rail text for full-4K readability: short labels, large enough type, clear spacing, no dense captions.

Do not include:

- Logo, wordmark, mark construction, lockups, logo notes, variations, or specs.
- Spacing scales, border radius, grid specs, motion notes, component inventories or states, icon notes, elevation/shadow specs, or arbitrary brand copy.
- Slogans, positioning paragraphs, mood words, or any text not directly documenting typography or color values used in the mockups.

## Creative Direction

Choose a bold but concept-appropriate aesthetic direction (brutally minimal, maximalist, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft, industrial, utilitarian, or another inferred from the brief).

Define:

- Purpose: what visitors should understand, trust, and do.
- Marketing focus: how the site introduces, explains, proves, and sells the brand.
- Tone: 3-5 strong adjectives, not a neutral default.
- Differentiation: the one visual, typographic, interaction, material, motif, or page-structure idea someone remembers.
- Constraints: production-grade, functional, accessible, plausible for a real frontend.
- Intensity: maximalist systems may be rich; refined systems rely on restraint, proportion, precision.

Avoid: the AI-slop signals from aesthetic-direction.md (default Inter/Roboto/Arial/system fonts, purple-blue gradients on white, generic glassmorphism, bland SaaS dashboards, default rounded cards), plus cramped or overfilled layouts and reusing the same trendy typefaces or color systems across concepts.

## Final Prompt Structure

Assemble the answer as the image prompt itself, in these eight sections. Pull each from the section named above; do not restate spec already defined there.

1. Brand Positioning (audience, the tone adjectives, comparables, avoid list).
2. Aesthetic Concept (`Creative Direction`).
3. Reference Image Use (only when images are attached; `Attached Images`).
4. Board Layout (`Canonical Board Spec`).
5. Page Mockups (`Page Mockups`, or the user's requested pages).
6. Design-System Rail (`Design-System Rail`).
7. Visual Style Constraints (the Creative Direction avoid list; the fixed layout holds even when the aesthetic is expressive).
8. Rendering line: one closing line: 3840 x 2160 px 16:9 4K, fixed 40 / 40 / 20 columns, crisp readable UI and rail text, production-grade marketing mockups, concept-specific art direction, generous whitespace, realistic polished design.

## Rendering

Rendering the final board needs the `imagegen` skill (Codex, gpt-image-2), passing attached images as style references when supported; generate exactly one 3840 x 2160 px 16:9 board, then return it with minimal commentary. In agents without `imagegen` (such as Claude Code), stop at the prompt and deliver the direction as text (typography, palette, mockup descriptions) plus the prompt for the user to render. Treat the prompt as intermediate working content: do not present it as the final answer unless asked, and do not over-summarize it so brand details are lost. If the user asks for the image plus the prompt, render the image first, then include the prompt text. If generation yields multiple boards or any shape other than the fixed structure, normalize to the fixed structure before rendering.

## Rules

- Be specific and concrete; keep internal consistency across all sections.
- Make the aesthetic direction memorable and concept-specific.
- Use specific typeface names or precise typeface directions and approximate color values.
- Specify which colors are dominant/load-bearing vs supporting/rare accents, and require that hierarchy to be visible.
- Keep all visible rail text short enough to render legibly.
- Do not hardcode examples from one concept into another.
- Do not ask for a separate design-system board or two images.
- Do not explain your reasoning.
