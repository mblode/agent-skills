# Brand Kit

> **Model requirement:** rendering the final board needs the `imagegen` skill (Codex, gpt-image-2). In agents without it (such as Claude Code), run the workflow through the prompt-generation step, then deliver the direction as text (typography, color palette, mockup descriptions) and the generated image prompt so the user can render the board themselves.

Thin wrapper: [Brand Kit Prompt](./brand-kit-prompt.md) is the source of truth for the board structure, attached-image rules, creative direction, and prompt format. If anything here conflicts with it, follow the prompt file.

## Workflow

1. Treat the user's concept, brief, constraints, references, audience, tone, avoid-list items, and attached images as the source input.
2. Read [Brand Kit Prompt](./brand-kit-prompt.md) and generate one production-ready mockup-first image prompt from the source input. Treat the prompt as intermediate working content; do not present it as the final answer unless asked.
3. Render the prompt through the `imagegen` skill, passing attached images as style references when supported. Generate exactly one 3840 x 2160 px 16:9 board.
4. Return the rendered image with minimal commentary.

## Wrapper rules

- Make careful creative inferences from a thin concept; ask a follow-up only when there is no usable brand, product, or idea information at all.
- Do not stop after producing the intermediate prompt, and do not summarize it so heavily that brand details are lost.
- If the prompt-generation step produces multiple boards, alternatives, or any output shape other than the fixed structure, normalize it to match the prompt file before rendering.
- If the user asks for the image plus the prompt, render the image first, then include the prompt text.
