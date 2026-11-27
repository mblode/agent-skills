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

## 2026-11 Back to Basics pass

- Word reveals timed to spoken cadence, from [gobacktobasics.com/bts](https://gobacktobasics.com/bts): the page reveals Scorsese's line at 120ms a word with an extra 400ms after the comma (read from the inline `animation-delay` values), matched to his GQ interview audio. That one measurement gives the principle and the comma pause of about three beats in `references/contextual-animations.md`. The 80-120ms beat keeps this skill's earlier 80ms; the five-beat full-stop pause is a starting value to tune, not a measurement. The old `key={word}` example, which collides on repeated words, was fixed in the same edit.
- "I will not animate icons": the flair-icon anti-pattern in SKILL.md and the illustration-only scope on ambient loops in `references/svg-animation.md`. The reason is the existing frequency rule, so it stands without the site. The icon swap stays, because it reports a state change.
