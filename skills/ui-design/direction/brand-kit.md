# Brand Kit

> **Model requirement:** rendering the final board needs the `imagegen` skill (Codex, gpt-image-2). In agents without it (such as Claude Code), run the workflow through the prompt-generation step, then deliver the direction as text (typography, color palette, mockup descriptions) and the generated image prompt so the user can render the board themselves.

## Overview

Run the brand kit workflow from concept to one finished 3840 x 2160 image. This skill wraps [Brand Kit Prompt](./brand-kit-prompt.md) and then renders the generated prompt directly through the `imagegen` skill.

Use this workflow when the output should emphasize memorable frontend art direction, distinctive website composition, production-grade public-facing marketing pages, and avoidance of generic AI aesthetics. The final image should follow the fixed structure defined by [Brand Kit Prompt](./brand-kit-prompt.md): two large website page mockups plus a narrow design-system rail that documents only typography and hierarchical color values.

## Load First

- Read [Brand Kit Prompt](./brand-kit-prompt.md) before generating the intermediate image prompt.
- Load and follow the `imagegen` skill before rendering the final image.

## Workflow

1. Treat the user's concept, brief, notes, constraints, references, audience, tone, avoid-list items, and attached images as the source input.
2. Use [Brand Kit Prompt](./brand-kit-prompt.md) with the source input to generate one production-ready mockup-first image prompt. If images are attached, describe them as visual inspiration only using the rules in `Attached Images`.
3. Capture the full prompt text from step 2 as intermediate working content. Do not present it as the final answer unless the user explicitly asks to see it.
4. Use the `imagegen` skill with the full generated prompt from step 2 as its input, including any attached images as visual references when the imagegen interface supports reference images.
5. Generate exactly one high-quality 3840 x 2160 px 16:9 landscape image: a fixed three-column marketing-site case-study board with page mockup 1 in the left 40%, page mockup 2 in the middle 40%, and a right-side design-system details rail in the final 20%.
6. Return the rendered image. Keep final commentary minimal.

## Attached Images

If the user attaches images, use them as design inspiration only:

- Use attached images to infer aesthetic direction, composition style, visual density, color atmosphere, type mood, spacing feel, texture, lighting, layout rhythm, and interaction/presentation patterns.
- Do not copy or recreate attached-image content, logos, wordmarks, brand marks, icons, mascots, characters, product names, readable text, photography subjects, proprietary UI, exact layouts, or distinctive artwork.
- Do not treat attached images as mandatory content for the generated brand kit unless the user explicitly says the image is their own brand asset and asks to use it.
- When passing the generated prompt to `imagegen`, explicitly state that attached images are style references only and must not be replicated.
- If attached images conflict with the user's written concept, preserve the written concept and use the images only for visual direction.

## Routing Rules

- If the user provides only a thin but usable concept, make careful creative inferences in the prompt-generation step.
- Ask a follow-up only when there is no usable brand, product, company, idea, or concept information.
- Preserve all user-supplied constraints through both steps, especially names, audience, positioning, tone, visual references, attached-image inspiration, required deliverables, and avoid-list items.
- If the user asks for the image plus the generated prompt, render the image first, then include the prompt text afterward.
- If the prompt-generation step produces multiple boards, extra alternatives, a flexible metadata placement, or any output shape other than the fixed structure, normalize the result to match `brand-kit-prompt` before passing it to `imagegen`.

## Output Discipline

- Do not stop after producing the intermediate prompt.
- Do not summarize or rewrite the intermediate prompt so heavily that brand details are lost.
- Treat [Brand Kit Prompt](./brand-kit-prompt.md) as the source of truth for image structure and content. If this wrapper conflicts with that file, follow [Brand Kit Prompt](./brand-kit-prompt.md).
- Do not generate a separate design-system board.
- Do not generate multiple images, a contact sheet, or a two-board split.
- Do not copy attached images or import their content, logos, text, brand marks, exact layouts, or proprietary UI into the generated image.
- Do not generate a 2:1 board, a 4096 x 2048 board, or a flexible metadata strip/sidebar/footer/overlay layout.
- Make the final image exactly two large public-facing website page mockups plus the right-side design-system rail.
- Include a consistent logo, wordmark, or brand mark inside the page mockups where a production website would naturally show one.
- Keep the design-system rail compact but legible at full 4K size, preserving only font names/typeface directions, dominant color values, supporting color values, palette hierarchy, and short color role labels.
- In the rail, distinguish dominant/load-bearing colors from infrequent supporting accents. Dominant colors should appear larger, grouped as the main palette, and labeled by role; supporting/accent/signal colors should appear as smaller chips.
- Do not put logo notes, spacing scales, border radius, grid specs, motion notes, component inventories, component state details, icon notes, elevation/shadow specs, or arbitrary brand copy in the design-system rail.
- Do not create extra files or resource directories for this wrapper skill.
