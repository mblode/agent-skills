# Clean-slate catalogue, 22 September 2026

Baseline: `c263f55` on main, 26 skills. Result: 15 skills. This records a static retention decision made with the `agent-skills-creator` protocol. It is not a measurement. Every scenario added or moved here is a specification. The no-skill, old-skill and new-skill behavioural matrix has not been run on any model.

## Why now

In three weeks the hosts took over much of what this collection did. Plan modes write single-feature plans. Bundled `/code-review` and `/security-review` exist. Hosts subscribe to PRs and follow CI and review threads. AGENTS.md is read natively. Claude Projects and Cursor Projects add coordinators with shared memory. Model releases (GPT-6 Astra on 4 Sep; GPT-6 Sol and Luna, Opus 5.5 and Grok 4.7 around 22 Sep) change which models to use for what faster than a skill body can be edited.

What stayed hard is the thing the talk research in `mblode/beyond-the-hype` points to:
- Review capacity: AI PRs wait about 5x longer for pickup and are about 2.6x larger at p75.
- Checks that cannot fail: a scorer that checked for 20 characters, an eval with `failureMode: 'skip'`, cached-green tests that fail on a cold clone.
- Brakes: nothing fired when main went red.
- Taste written down once.

Community reports from the same weeks add orchestration failures:
- Orchestrators that say "the next step is" and then stop.
- A `/goal` that ran for 48 hours.
- 87 concurrent verify steps.
- Test gaming.
- Drift away from long step lists.

The collection had no skill for driving a backlog or for installing brakes.

## Principles applied

1. A skill holds only what the model and host cannot supply: taste, product policy, operational contracts, and observed failures.
2. Brakes over prose. When a check can decide a rule, ship the check. `capability-delta.md` gained a "Compile to a gate" section.
3. State the outcome and the scope of done, not steps.
4. Few, fat skills. Merge where triggers or rule IDs overlap, and keep the IDs stable.
5. No model names in skill bodies. `backlog/references/routing.md` is the one dated exception.
6. Evidence decides tenure. That comes in the next pass (below).

## Disposition

| Skill now | Absorbed | Retained payload | New in this pass |
|---|---|---|---|
| architecture | codebase-architecture, multi-tenant-architecture | Design, Deepen and Harden contracts; tenancy, RLS roles, domain lifecycle, platform dispatch; plan limits as live-checked sources, not numbers | `references/greenfield.md`: walking skeleton, the seven-hop vertical slice, a pass/fail/unknown production-eligibility gate, decision records with flip conditions, and the audit failures as checks |
| backlog | planning (split, interview, handoff, claim verification) | Splitting, self-contained handoffs, interrogation protocol | Ledger as source of truth, WIP capped at review capacity, stall and budget rules, dated model lanes in `routing.md`, weekly retro |
| gates | ci-speedup, agents-md, Harden wiring from codebase-architecture | Measured CI critical path with a ledger; AGENTS.md audit rubric and command verification | Hooks, check-the-check detection recipes, review capacity, the Risk and Proof block |
| scaffold | scaffold-nextjs, scaffold-cli | House web and CLI templates | SaaS monorepo profile and `scripts/cold-clone.sh`; versions resolved at scaffold time |
| ship | pr-creator, autoship, pr-babysitter | House PR style, changesets release loop, review-thread accounting | Risk and Proof body; `merge-ready.sh`; the polling ladder is cut because hosts watch PRs |
| design | product-design, ui-design, ui-verification, ui-animation, typography-audit | Every rule ID, house visual, type and motion defaults, browser probes | One owner for the IDs these five cited across skill boundaries |
| ghostwriter | eli5 | Explain mode | |
| tidy, presentation-creator, seo, agent-ready, ax-audit, dx-audit, chat-history | | Unchanged except sibling routing | |
| agent-skills-creator | | Unchanged except doctrine | "Compile to a gate" and the no-model-names rule |
| save-md | retired, no replacement | | |

Moved to git history rather than kept:
- pr-babysitter's watch ladder, monitor script and CI-platform coaching.
- planning's generic plan-quality rubric and questioning framework.
- agents-md's per-tool wrapper and migration setup, now obsolete.
- save-md's endpoint table.

`retired-names.tsv` fails any backticked pointer to the seventeen retired names.

## agent-evals

The routing corpus was relabelled on the same-named branch of `mblode/agent-evals`:
- 190 cases now carry their successor label.
- Plain single-feature planning and save-md cases now expect `none`.
- Slash cases for retired names were archived, and each new skill keeps one.
- 18 cases were added for backlog, gates and architecture.

On main, `validate-cases` failed before this pass because ci-speedup had no automatic cases. `gates` now covers them.

## Next: evidence

- Run routing on the new descriptions with the models the collection targets, through `claude -p` and `codex exec`. Compare against the pre-change baseline with McNemar.
- Run the none, old and new behavioural matrix for backlog, gates and architecture: two or three scenarios each, recording model, host, effort, loaded files and artifacts.
- Retire whatever does not beat no-skill.
- Later candidates: merging agent-ready into seo, and compiling design and typography rules into lint checks (see `mblode/taste-lint`).
