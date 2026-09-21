# Writing consolidation, 21 September 2026

Baseline: `24f4fd8` on main. Four writing skills across three repositories (`ghostwriter`, brandwriter's `copywriting`, and this repository's `docs-writing` and `readme-creator`) became one `ghostwriter` skill in the ghostwriter repository. The decision was Matthew's: one writing skill, in the ghostwriter repo, brandwriter deleted, the model doing the writing. This is a static retention decision made with the `agent-skills-creator` protocol (read everything, classify each section under `capability-delta.md`, rewrite in order, validate). Behaviour is unrun; the scenarios in `ghostwriter/skills/ghostwriter/evals/evals.json` are specifications. A second pass the same day retired `train-ghostwriter` and `evaluate-ghostwriter` (a profile is now written from pasted samples), replaced the `brand.json` company manifest with a plain company profile file, and halved every reference, so the ghostwriter repository is one skill of about 5,000 words and nothing to build.

## Why one skill

The four skills carried three banned-word lists that were ~96% the same list, four copies of "cut it in half", nine separate em-dash bans, and two incompatible review formats. Each repository's AGENTS.md forbids runtime references across skills, so the duplication could not be shared, only removed. The config layout was never the problem, and it got simpler still: a company is now a profile file beside the personal ones.

## Disposition

| Source | Retained payload | Where it went |
|---|---|---|
| `ghostwriter` SKILL.md (2,625 words) | Voice resolution and fallback ladder, modes, never-invent, the humanizer-derived tells, what not to strip, strategy layer | Router `SKILL.md` (~1,300 words) plus `references/tells.md`; `references/strategy.md` unchanged |
| `ghostwriter` review mode | Diagnosis | Renamed critique: findings by cost to the reader with the rewrite attached; the mandated "what works" praise is cut |
| `ghostwriter` "shorter, simpler, more natural, try halving" | The halving habit, which is the user's own | Reworded as halve once, then check what the cut lost; the blog profile's competing 400-word floor is gone |
| brandwriter `copywriting` SKILL.md (3,147 words), `frameworks.md`, `page-types.md`, `ui-states.md`, `transactional-emails.md` | Brief fields, awareness-stage table, why-before-what, show-don't-tell, CTA rule, product-state wording, transactional email parts, edit postures, hyphenation rule | `references/copy.md` (~1,600 words) |
| brandwriter `ai-patterns.md`, `word-lists.md`, `sweeps.md` | Structural and drafting tells, the drift note, the voice-outranks-lists clause | Merged into `references/tells.md`; tiers, P0/P1/P2, the 49-row word table, the seven sweeps, the 13-label step, and the Copy Audit template are cut |
| brandwriter `voice-chart.md`, `terminology.md`, `branding`, `product-judgment` | None unique to writing | Retired with the repository; a missing company voice is named as a setup gap |
| `ui-states.md` `rule/*` IDs | Nine shared copy rule IDs cited by `product-design` | `product-design/references/rules.md` now owns them, with a `Rule` line each; ghostwriter writes against them |
| `docs-writing` SKILL.md and 51 rules | Diataxis compass, type gating, the checks by category, audit contract, gotchas | `references/docs.md` (~1,400 words) as a compact rubric; the Incorrect/Correct pairs are cut. Fixed on the way: the example that invented a latency figure, the "remove 20% each pass" quota, the orienting sentence mandated under every heading, the 2-4 link and 3-5 step quotas |
| `readme-creator` SKILL.md and three references | The reader, type detection, audience gate, spine, section menu, badge rule, render gotchas, check commands | `references/readme.md` (~1,500 words); the 8-16 word tagline, the mandatory second line, the line-count budgets, the scored checklist, and "infer the why" are cut. House markup moved to a private `readme` profile |
| `docs-writing` and `readme-creator` routing cases (24 auto, 8 hard-negative) | Provenance | `agent-evals/archive/2026-09-21-writing-consolidation/` |

## Repository changes here

- `skills/docs-writing/` and `skills/readme-creator/` deleted; README bullets removed; the Writing section points at ghostwriter for docs, READMEs, personal voice, brand copy, and blog posts.
- Every routing pointer to the three retired names now reads "the external `ghostwriter` skill where installed": `dx-audit`, `agent-ready`, `presentation-creator`, `ui-design`, `typography-audit`, `eli5`, `scaffold-cli`, `product-design`, `seo`, `agents-md`, `agent-skills-creator`, and the near-miss labels in their `evals/evals.json`.
- `validate.sh`: the catalogue step's ruby call gained `-E UTF-8`, matching the frontmatter step; with `LANG` unset it raised on the README's curly quotes and every `--all` run reported a false catalogue failure.

## Verification

`validate.sh --all` reports 0 FAIL with and without a UTF-8 locale. `python3 -m unittest discover -s maintenance/tests` passes. In ghostwriter, `agentskills validate skills/ghostwriter` passes and `validate.sh skills/ghostwriter` run from this repository reports 0 FAIL. In agent-evals, `validate-cases --skills-dir` passes (327 cases, 25 skills) and `vitest` passes (25 tests). Behavioural comparison: not run.
