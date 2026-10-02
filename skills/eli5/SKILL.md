---
name: eli5
description: "Applies the house explanation style and picks the form that explains best: plain prose, controlled English modelled on ASD-STE100, a diagram, an interactive HTML page, or a narrated explainer video. Concrete terms, optional analogy, no minimizers or promotional vocabulary, verbatim technical identifiers. Use when asked for \"ELI5\", \"plain English\", \"re-pitch that\", \"stop using jargon\", \"explain it in STE100\", \"draw me a diagram of how this works\", \"make an interactive explainer\", or \"make a 3b1b style video on X\". For product copy and documentation use ghostwriter; for slide decks use presentation-creator."
---

# Plain-language house style

Use this style for the explanation requested. Keep it for later replies only when the user asks for an ongoing mode; a single ELI5 request does not change the session permanently.

- Preserve exact identifiers, paths, commands, errors, numbers, and quoted source text. Explain around them.
- Avoid minimizers: simply, obviously, just, easy, of course, as you know.
- House vocabulary excludes promotional uses of: delve, leverage, robust, seamless, holistic, paradigm, game-changing, cutting-edge, innovative, synergy, revolutionary, effortless, world-class, powerful, showcase, unlock. Do not ban literal technical uses or quotations.
- No em dashes in authored prose. Do not substitute a spaced hyphen. (`ghostwriter/references/tells.md` is the canonical tells list; this shorter one covers session prose.)
- Use an analogy only when it clarifies the mechanism; identify its limit if that affects the answer. If an explanation did not land, change the framing instead of making the same analogy longer.
- Put the explanation or result first. Include a next action only when the reader needs to act. Do not assign the user work the agent is already authorized to complete.

Return the explanation itself. No activation announcement, fixed sentence count, compulsory recap, or pre-send checklist.

## Pick the form

Prose is the default. Move up a rung when the user names the form, or when the content has a shape that prose hides. Each rung costs more to make and to check, so take the lowest one that carries the idea.

| Form | Use when | Cost |
| --- | --- | --- |
| Plain prose | Most answers | None |
| Controlled English | User asks for STE100 or "Simplified Technical English", or the answer is a procedure or a dense mechanism a non-native reader must follow | None |
| Diagram | Parts and the links between them, a sequence over time, states, or a data path | Low |
| HTML page | The reader learns by changing an input and seeing the result, or the topic needs several linked views | Medium |
| Explainer video | User asks for a video, or the idea is motion (an algorithm stepping, a curve changing) | High: render, narration, review |

When the user names a form, use it; do not argue down to prose. When choosing on your own, never go past a diagram without asking, and offer the next rung in one line only when it would clearly help.

"80% STE100", "soft STE100", or similar means the relaxed profile in `references/formats.md`, not the full specification. Diagram, HTML, and video mechanics (tool choice, narration keys, review steps) are in the same file; load it before making any form other than plain prose.

## Boundaries

This changes assistant prose and the explanations it makes. Product copy, technical docs, and README structure belong to `ghostwriter`, PR bodies to `pr-creator`, slide decks to `presentation-creator`, and data charts to an installed `dataviz` skill where one exists.

## Maintenance

`evals/evals.json` contains behavior and routing scenarios for changes to this skill; do not load it during an explanation.
