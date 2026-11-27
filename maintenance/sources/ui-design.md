# ui-design sources

Provenance for `skills/ui-design`. Never loads during a task.

Taken as compact audit rules and build bullets, not as vendored skills:

- Rauno Freiberg, [Web Interface Guidelines](https://interfaces.rauno.me): disabled-control tooltips, hover tooltips without interactive content, overlaid input affixes, stable hover weight, immediate toggles, `user-select` on controls.
- Jakub Krehel and Gustavo Fior craft notes: OKLCH ramps, optical compensation on dark surfaces, faint grain against banding, squircles on icon tiles only. Nested radius, hit areas, interruptible motion, and image outlines already lived in this collection.
- Paco Coursey: theme-toggle transition gating already lived in `ui-animation`. SVG-plus-backdrop blur stays in `materials.md`.

## Rejected

Same trigger as skills already in this repo, so installing them would reconcile two owners:

- `npx skills add jakubkrehel/skills` (`better-ui`, `better-typography`, `better-interface`)
- `npx skills add emilkowalski/skill` (`emil-design-eng`, `animate`, `review-animations`)
- `npx skills add gustavo-fior/craft` (`craft-design-engineering`)

Taste essays (Developing Taste, The Concept of Taste) and Disney's 12 principles were left out: they are generic coaching the model already has. Benji Taylor's Agentation belongs with `ax-audit` when a product is annotating a UI for agents, not with visual polish.

## 2026-10 deepening pass

- Deleted `a11y-document-language` and `perf-lazy-load-offscreen`: attribute presence and offscreen lazy-loading are jsx-a11y, axe, and Lighthouse checks (`references/defer-to-other-tools.md`). Inline `lang` on foreign passages moved to `a11y-semantic-html-first`; "never lazy-load the hero" moved to `perf-image-dimensions-and-priority`.
- `a11y-image-alt-text` narrowed to alt quality; presence is `jsx-a11y/alt-text` and axe `image-alt`.
- Undated vendor conversion statistics removed from `direction/testing.md` and `direction/modern.md`.
- `evaluations/` merged into `evals/`.

## 2026-11 Back to Basics and taste talk pass

From [gobacktobasics.com](https://gobacktobasics.com/) and its [behind the scenes](https://gobacktobasics.com/bts) page, kept only where the lesson holds without the site:

- Conceptual integrity as managing a "brand motif bag": the motif inventory and "will not" list in the Direction decision set, and the Quality Bar's reach to unbriefed surfaces. Stated once in SKILL.md; `aesthetic-direction.md` does not repeat it.
- Subtraction that still leaves something new ("I will not make it boring"): one clause on the "Delete aggressively" bullet.
- "Pulled the next section above the fold for scroll affordance": the scroll-cue bullet in `direction/marketing-ui.md`. Independent support: NN/g's illusion of completeness.
- Quotes that start and are signed in the same spot on every cycle: the rotating-quote bullet in `guidelines/testimonials.md`, with the WCAG 2.2.2 pause requirement the site's lesson leaves out.
- Translucent chrome demoted from default in `guidelines/materials.md`. The old wording read as a default whenever `materials.md` loaded; making translucency opt-in keeps opaque bars as the baseline.

From Matthew Blode's talk [Claude doesn't have taste. You do.](https://blode.co/you-have-taste), most of which presents rules already here (slides 5, 6, 17, 18):

- "Know what you're optimising for" (slide 11): the answer-engine furniture slop signal in `aesthetic-direction.md`.
- "Steal from the best. Copy it precisely. Then work out why it's good" (slide 9): the copy-what-works bullet in `direction/design-in-code.md`.

Rejected:

- Primary colours, geometric shapes, and Helvetica as a house default or worked example. They are one site's inventory; the lesson kept is having a closed one.
- "I will not use progressive blur", "I will not make glass liquid", and "I will not use gradients" as bans. They are one designer's refusals. Blur and glass as atmosphere were already a slop signal, cost is already in `materials.md`, and `slop-decoration-no-role` keeps its threshold. A first draft of this pass added the bans and was cut back.
- "Polish is free now" as its own philosophy bullet: taste coaching the model already has, and time-sensitive.
- Editing quotes to fit the mantra. That is copy (`ghostwriter`), and the site shows each edit openly, which a rule would have to require.
- "No dialogs", "no layout shift", and "test mobile" already lived in `product-design` `rule/inline-before-modal`, `states-layout-shift`, and Verify.
- The talk's "collect four references before you prompt" and "the taste loop" are advice to the person prompting, and the loop already lives in `agent-skills-creator` (gotchas from observed failures).
