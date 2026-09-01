# Improving Existing Skills

Audit-then-rewrite protocol for a shipped skill. Use when asked to improve, audit, rewrite, review, simplify, or rightsize one.

## Contents

- Relationship to the Creation Workflow
- Audit Dimensions
- Rewrite Procedure
- Structure Normalization Decision Table
- Large Rule-Set Scoping
- Validation

## Relationship to the Creation Workflow

Improvement replaces Steps 1-4 of the Creation Workflow with audit and rewrite phases, then reuses Steps 5-8 (validate, README, smoke-test, evaluate). Never skip validation: an unvalidated rewrite is a regression risk, not an improvement.

Copy this checklist to track progress:

```text
Skill improvement progress:
- [ ] Phase A: Read everything (SKILL.md, every linked file, repo AGENTS.md, README entry)
- [ ] Phase B: Score the eleven audit dimensions (before)
- [ ] Phase C: Rewrite in the ordered procedure
- [ ] Phase D: Validate (scripts/validate.sh + re-score)
- [ ] Phase E: Re-score dimensions (after), update README one-liner, ship
```

### Phase A: Read everything first

- Read SKILL.md fully, then every linked file (references, tracks, rules layers).
- Rules-based skills: read `_sections.md`, `_template.md`, and 2+ sample rules per category.
- Read the repo AGENTS.md and the skill's README entry; source of truth for install commands and conventions.
- `ls -R` the folder; `validate.sh` reports orphan files, so run it here to seed the audit.

Do not edit during Phase A; mid-edit findings cause inconsistent half-rewrites.

## Audit Dimensions

Score each 1-5 before editing; the lowest scores dictate rewrite effort. Report before/after. These are the judgement calls, so none of them is scriptable; everything mechanical is already a check.

| # | Dimension | What 5/5 looks like |
|---|-----------|---------------------|
| 1 | Trigger coverage | Third-person description; "Use when..." with quoted user phrases; disambiguated from siblings |
| 2 | Boundary clarity | IS/IS-NOT opener present and accurate where sibling skills exist |
| 3 | Structure conformity | Pattern matches content; files in pattern-correct folders |
| 4 | Signal density | Every line passes "would removing this cause Claude to make a mistake?"; one term per concept |
| 5 | Gotchas quality | Each gotcha names a concrete command/value and consequence; from observed failures |
| 6 | Freshness | No stale commands, paths, version pins, or model names; frontmatter fields valid for every place the skill is meant to run |
| 7 | Progressive disclosure | Every reference earns its load condition and adds value SKILL.md does not already carry |
| 8 | Workflow integrity | Copyable checklist; terminal step produces evidence, never "seems right" |
| 9 | Cross-skill coherence | Related Skills accurate; no trigger overlap with sibling descriptions |
| 10 | Content patterns | Template, examples, and conditional patterns used where they fit; examples confined to style-sensitive output |
| 11 | Constraint calibration | Absolutes confined to safety, data loss, and format contracts; other guidance phrased as an outcome; no directive duplicating or contradicting the harness, a sibling skill, or a script's own interface |

## Rewrite Procedure

Execute in order: correctness, then triggers, then structure, then deletion, then polish. Reordering causes rework, for example density-cutting a section you later move.

1. **Stale fixes.** Anything contradicting repo AGENTS.md or reality (install commands, paths, rule counts, CLI flags, frontmatter fields the target runtime rejects). Bugs; fix before stylistic work.
2. **Description.** Third-person opener of what it does, capability summary, "Use when..." triggers with quoted user phrases, key use case first. Disambiguate from siblings: if two descriptions could route the same prompt, both need an edge ("For X, use `other-skill`"). Check with a should-trigger and near-miss prompt set, not by rereading.
3. **Boundary opener.** Add or repair the IS/IS-NOT pair after the H1.
4. **Structure.** Apply the decision table below. After a move, update every link and grep all SKILL.md repo-wide for the old path.
5. **Signal-density cut.** Delete lines Claude would do anyway; dedupe SKILL.md/reference overlap; merge near-duplicate sections.
6. **Constraint cut.** Same pass over the same text, different target. Convert absolutes to outcome phrasing, delete rules the current model honors unsupervised, and delete anything an interface, sibling, or the harness already states.

   **Stop condition:** an opinion particular to this repo, team, or product is the skill's payload. Never cut it for being opinionated, only for being wrong or already the model's default. The test is "would Claude do this unprompted", not "is this strongly worded". A skill stripped of its opinions validates clean and helps nobody.

7. **Gotchas.** Rewrite vague warnings into concrete-failure format (command/value plus consequence); delete hypotheticals nobody has observed.
8. **Workflow integrity.** Multi-step workflows need a copyable progress checklist; the final step produces evidence (command output, score table, file listing).

## Structure Normalization Decision Table

| Situation | Action |
|-----------|--------|
| Supporting .md files at skill root, skill is simple/hub with a tracks table | Keep: sanctioned hub track files |
| Supporting .md files at skill root, any other pattern | Move to `references/`, update all links |
| Multiple rules folders (`rules-arch/` + `rules-ax/` in `ax-audit`), SKILL.md dispatches to each layer explicitly | Keep: sanctioned layered design |
| Multiple rules folders, no explicit dispatch | Consolidate into one `rules/` folder |
| `agents/` folder with subagent prompts dispatched from SKILL.md | Keep: sanctioned |
| A bundle file whose stated load condition is "do not load in normal use" (launcher metadata for external runners, e.g. `agents/openai.yaml`) | Keep: the condition is the point. State it in the reference table so nobody re-litigates it per skill |
| A folder whose only load condition is "when changing this skill" (`evals/evals.json`, fixtures) | Keep, but say so explicitly: it never loads during a user task, so it is not dead weight and not progressive disclosure either |
| File in the folder but never linked from SKILL.md | Link it with a read-when condition, or delete it |

After any rename or move: `grep -rn "<old-path>" <repo>/skills/*/SKILL.md` must return nothing.

## Large Rule-Set Scoping

For rules-based skills with 30+ rule files, don't rewrite every rule. Drift concentrates in SKILL.md, `_sections.md`, and `_template.md`: rewrite those fully, then let `validate.sh` handle the mechanical sweep over the rule files (frontmatter, prefix-to-section match, count reconciliation).

Sample-read roughly 10% of rules per category and deep-rewrite only those that fail on substance. Rewriting a correct rule can only stay equal or get worse.

## Validation

1. `scripts/validate.sh skills/<name>` passes clean. Every mechanical constraint is a check there, so a clean run replaces reading a checklist.
2. Re-score the eleven dimensions; report before/after with files moved and anything deferred.
3. Rerun the skill's evaluations before shipping. Better dimension scores with worse eval results is a regression: dimensions measure form, evals measure behavior.
4. Install smoke-test: `npx skills add <repo-slug> -g --skill <name> -y && ls ~/.claude/skills/<name>/`.
