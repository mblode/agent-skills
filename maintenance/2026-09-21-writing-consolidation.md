# Writing consolidation, 21 September 2026

Baseline: `24f4fd8` on main. Four writing skills across three repositories (`ghostwriter`, brandwriter's `copywriting`, and this repository's `docs-writing` and `readme-creator`) became one `ghostwriter` skill, which now lives in this repository at `skills/ghostwriter`. The decision was Matthew's: one writing skill, brandwriter deleted, the model doing the writing, and in a final pass the skill moved here and the ghostwriter repository was retired. This is a static retention decision made with the `agent-skills-creator` protocol (read everything, classify each section under `capability-delta.md`, rewrite in order, validate). Behaviour is unrun; the scenarios in `skills/ghostwriter/evals/evals.json` are specifications. A second pass the same day retired `train-ghostwriter` and `evaluate-ghostwriter` (a profile is now written from pasted samples), replaced the `brand.json` company manifest with a plain company profile file, and halved every reference, so the skill is about 5,000 words and nothing to build; it then moved into this repository and the ghostwriter repository became a tombstone.

## Why one skill

The four skills carried three banned-word lists that were ~96% the same list, four copies of "cut it in half", nine separate em-dash bans, and two incompatible review formats. Each repository's AGENTS.md forbids runtime references across skills, so the duplication could not be shared, only removed. The config layout was never the problem, and it got simpler still: a company is now a profile file beside the personal ones.

## Disposition

| Source | Retained payload | Where it went |
|---|---|---|
| `ghostwriter` SKILL.md (2,625 words) | Voice resolution and fallback ladder, modes, never-invent, the humanizer-derived tells, what not to strip, strategy layer | `skills/ghostwriter/SKILL.md` (~900 words) plus `references/tells.md`; `references/strategy.md` halved |
| `ghostwriter` review mode | Diagnosis | Renamed critique: findings by cost to the reader with the rewrite attached; the mandated "what works" praise is cut |
| `ghostwriter` "shorter, simpler, more natural, try halving" | The halving habit, which is the user's own | Reworded as halve once, then check what the cut lost; the blog profile's competing 400-word floor is gone |
| brandwriter `copywriting` SKILL.md (3,147 words), `frameworks.md`, `page-types.md`, `ui-states.md`, `transactional-emails.md` | Brief fields, awareness-stage table, why-before-what, show-don't-tell, CTA rule, product-state wording, transactional email parts, edit postures, hyphenation rule | `references/copy.md` (~1,600 words) |
| brandwriter `ai-patterns.md`, `word-lists.md`, `sweeps.md` | Structural and drafting tells, the drift note, the voice-outranks-lists clause | Merged into `references/tells.md`; tiers, P0/P1/P2, the 49-row word table, the seven sweeps, the 13-label step, and the Copy Audit template are cut |
| brandwriter `voice-chart.md`, `terminology.md`, `branding`, `product-judgment` | None unique to writing | Retired with the repository; a missing company voice is named as a setup gap |
| `ui-states.md` `rule/*` IDs | Nine shared copy rule IDs cited by `product-design` | `product-design/references/rules.md` now owns them: all nine in its ID table, the four with full entries gained a `Rule` line; ghostwriter writes against them |
| `docs-writing` SKILL.md and 51 rules | Diataxis compass, type gating, the checks by category, audit contract, gotchas | `references/docs.md` (~1,400 words) as a compact rubric; the Incorrect/Correct pairs are cut. Fixed on the way: the example that invented a latency figure, the "remove 20% each pass" quota, the orienting sentence mandated under every heading, the 2-4 link and 3-5 step quotas |
| `readme-creator` SKILL.md and three references | The reader, type detection, audience gate, spine, section menu, badge rule, render gotchas, check commands | `references/readme.md` (~1,500 words); the 8-16 word tagline, the mandatory second line, the line-count budgets, the scored checklist, and "infer the why" are cut. House markup moved to a private `readme` profile |
| `docs-writing` and `readme-creator` routing cases (24 auto, 8 hard-negative) | Provenance | relabelled to `ghostwriter` in `agent-evals/data/routing/` |

## Repository changes here

- `skills/docs-writing/` and `skills/readme-creator/` deleted; `skills/ghostwriter/` added; the Writing section lists it.
- Every routing pointer to the three retired names now names `ghostwriter`: `dx-audit`, `agent-ready`, `presentation-creator`, `ui-design`, `typography-audit`, `eli5`, `scaffold-cli`, `product-design`, `seo`, `agents-md`, `agent-skills-creator`, and the near-miss labels in their `evals/evals.json`.
- `validate.sh`: the catalogue step's ruby call gained `-E UTF-8`, matching the frontmatter step; with `LANG` unset it raised on the README's curly quotes and every `--all` run reported a false catalogue failure.

## Review pass

`pr-reviewer`, `tidy`, and `codebase-architecture` ran over the five branch diffs after the move. Applied: PR descriptions belong to `pr-creator` and slide copy to `presentation-creator`, so ghostwriter's `github` row is review and PR comments and its slides row is a voice pass plus the talk script; `copy.md` cites the nine `rule/*` IDs it writes against; one precedence sentence in SKILL.md (user's text, platform profile, soul, reference defaults, plain); the private company name left the public skill; rules stated twice (em dash, halving, no praise, profile wins, never-invent-a-motive) now live once; the Self-check section and the strategy symptom table went as restatements; dead pointers to `product-judgment`, `branding`, and a verb table that did not exist were removed; the routing corpus relabelled ten long-form `none` cases to `ghostwriter` and one llms.txt case to `agent-ready`. Two validator checks were added, `no-retired-names` (from `maintenance/retired-names.tsv`) and `md-links-resolve`, with tests, plus `test_ghostwriter_router.py` for the Surfaces table. agent-evals CI now checks out the same-named agent-skills branch when one exists. Deferred: a word-budget check via `metadata`, running `validate-cases` from this repository's CI, and the dormant `readme-skill-count` check.

## pr-reviewer folded into tidy

The two skills were one workflow split at the wrong seam: pr-reviewer wrote its `Fix:` lines for tidy to apply, tidy's first step was to reuse pr-reviewer's findings, and their review angles overlapped enough that the review pass above reported the same findings twice. `tidy` now carries the whole thing: report-only by default (the pr-reviewer body, modes, references, and launcher metadata moved under `skills/tidy/`), and an apply mode with tidy's five angles and constraints. `pr-reviewer` is retired; its routing cases carry the `tidy` label and `retired-names.tsv` fails any pointer to the old name.

## Verification

`validate.sh --all` reports 0 FAIL with and without a UTF-8 locale. `python3 -m unittest discover -s maintenance/tests` passes. `agentskills validate skills/ghostwriter` passes and `validate.sh skills/ghostwriter` reports 0 FAIL. In agent-evals, `validate-cases --skills-dir` passes (368 cases, 26 skills) and `vitest` passes (25 tests). Behavioural comparison: not run.
