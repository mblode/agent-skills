# ui-animation sources

Provenance for `skills/ui-animation`. Never loads during a task.

- Interface SFX gating: Craft (gustavo-fior) and Raphael Salaja's web-sound writing.
- Novelty 90/10 split, one-shot intro gating, and `animation-play-state` on loops: Rauno Freiberg.
- Clip-path and proportional scale already lived here before those imports.

## Rejected

- Vendoring `emilkowalski/skills` and `gustavo-fior/craft`: same trigger as this skill, so installing them would reconcile two owners.

## 2026-10 deepening pass

- `references/discovery-workflow.md` folded into `references/decision-framework.md` (Discovery sweep). Its "include rejected candidates only when the reason clarifies" line contradicted the framework's required rejected list and was dropped.
- `references/live-tuning.md` cut: generic DevTools knowledge. The one load-bearing line (dial contested curves in the bezier editor, paste the literal back; Safari has no editor) moved into the SKILL.md workflow.
- `references/component-patterns.md` popovers, tooltips, drawers, and modals merged into `references/transition-recipes.md`.
