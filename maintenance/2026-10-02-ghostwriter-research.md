# Ghostwriter research pass, 2 October 2026

Baseline: `eb5e208` on main. Four external sources were read in parallel and checked against the skill under the `agent-skills-creator` protocol (keep what changes behaviour, cut what Claude does anyway). Scope was the skill only; the private profiles in the config repository were not touched. Behaviour is unrun; see Verification.

## Sources and what each changed

| Source | Finding | Change |
|---|---|---|
| The Slop Index (theslopindex.com, repo hgaddipati1118/slop-index) | Against pre-2022 human corpora, the classic vocabulary (delve, tapestry, not-just-but, thrilled to announce) no longer separates 2026 models from people. Padding past human length, templated openers, flat paragraph rhythm, and dashes still do; dashes are the only tell valid in all four domains. Higher lexical diversity is a model trait. | `tells.md` leads with structure, adds padding and repeated skeletons, says a word is a tell only in clusters, and tells you never to swap in rarer words. SKILL.md checks length against the profile before the tells pass. |
| blader/humanizer v3.1 and Wikipedia "Signs of AI writing" | Tells missing here: one-line closers, run-ups, re-explaining what the reader has, writing about the document, heading restatement, inline-header lists, inflation, vague attribution, gap-filling, formula endings, chat residue beyond "great question". Rewrite whole points rather than patch phrases. Plain is/has, "very", "perhaps", "in order to" are empirically human. | New Structure, Content, and Chat residue entries; the Keep section names the human habits; Rewrite covers "make this sound less like AI". |
| Echo (echo.fulcrum.inc) | Drafting from facts written as plain notes beats drafting from an outline already in assistant voice; samples chosen by channel beat samples chosen by topic; the model's failure mode is invented quotes, statistics, and attributed words. | Private brief before drafting; excerpts by surface and register; never-invent now names quotes, statistics, citations, and words put in a real person's mouth, with a fact diff against the brief. |
| KONVO (konvo.kirupa.com, github.com/kirupa/KONVO) | A profile is stronger when it records measured traits per channel (median length, opener mix, emoji position, punctuation). The author's edits to a draft are labelled style data: a stated correction is a rule, three repeats are a rule, and a holdout passage catches caricature. Transplant, boring-version, and deletion tests. | Profiles gain `Measured`, `Not me`, and `Edits` sections; a Learn mode; the three tests in `tells.md`; email preview line and LinkedIn hook rules in `surfaces.md`. |
| TICL (arXiv 2502.08972), "Catch Me If You Can? Not Yet" (arXiv 2509.14543) | Rejected drafts with a reason beat more samples; models imitate formal email well and blogs and forums badly, drifting to an average voice. | `Not me` section; a gotcha on casual surfaces. |

## Rejected

- A regex lint script in the skill: the user chose prose only; the private `taste-lint` pack already covers the mechanical rules.
- Detector evasion as a goal: every source that measured it (Echo, humanizer, Slop Index) says detectors flag the best output anyway.
- Lexical-diversity scoring and the full Wikipedia era word lists: the first is wrong-signed, the second dates with each release.

## Evals

`evals/evals.json` grows from 10 to 16 scenarios, with synthetic fixture profiles under `evals/files/` so runs no longer depend on the operator's `~/.config/ghostwriter`. Scenarios 5, 6, and 7 were made runnable under `agent-evals judge` (fixture company profile; no write tool, so the profile is shown, not saved; real sample messages instead of a placeholder). New: email voice fidelity (11), humanizing slop (12), no invented evidence (13), overcorrection against a profile that uses spaced hyphens (14), learning from an edit (15), and padding (16). Routing near-misses grow from 4 to 8, and six hard negatives went into `agent-evals/data/routing/cases-hardneg.jsonl`.

`validate.sh` now exempts Markdown under a skill's `evals/` from the reachability and TOC checks, since the judge copies fixtures into the workspace and never loads them as skill content. While adding its test, `test_retired_name_and_dead_link_fail` turned out to sit under the `if __name__` guard and had never run; it now runs and passes.

## Verification

`validate.sh skills/ghostwriter` and `validate.sh --all` report 0 FAIL; `python3 -m unittest discover -s maintenance/tests` passes (10 tests). In agent-evals, `validate-cases` passes and `judge ghostwriter --dry-run` plans 16 scenarios. Behavioural comparison: not run. `claude --bare` cannot authenticate in the cloud container this pass ran in, so every judge call returned `api_error`. To run it on a machine with a working `--bare` login, check out `eb5e208` with this branch's `evals/` folder as the baseline, then:

```bash
agent-evals judge ghostwriter --skills-dir <baseline> --model <subject> --judge-model <judge> --runs 3
agent-evals judge ghostwriter --skills-dir <this branch> --model <subject> --judge-model <judge> --runs 3
agent-evals compare <baseline>/summary.json <candidate>/summary.json --min-effect 0.05
```
