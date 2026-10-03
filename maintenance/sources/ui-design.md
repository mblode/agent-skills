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
