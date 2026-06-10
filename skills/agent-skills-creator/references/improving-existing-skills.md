# Improving Existing Skills

Audit-then-rewrite protocol for an existing skill. Use when asked to improve, audit, rewrite, or review a skill that already ships.

## Contents

- Relationship to the Creation Workflow
- Audit Dimensions
- Rewrite Procedure
- Structure Normalization Decision Table
- Large Rule-Set Scoping
- Validation

## Relationship to the Creation Workflow

Improvement replaces Steps 1-4 of the Creation Workflow with the audit and rewrite phases below, then reuses Steps 5-8 (validate, README, smoke-test, evaluate) unchanged. Never skip Step 5: a rewrite that was never validated against the quality checklist is a regression risk, not an improvement.

Copy this checklist to track progress:

```text
Skill improvement progress:
- [ ] Phase A: Read everything (SKILL.md, every linked file, repo AGENTS.md, README entry)
- [ ] Phase B: Score the ten audit dimensions (before)
- [ ] Phase C: Rewrite in the ordered procedure
- [ ] Phase D: Validate (quality checklist + lint + counts)
- [ ] Phase E: Re-score dimensions (after), update README one-liner, commit
```

### Phase A: Read everything first

- Read SKILL.md fully, then every file it links (references, tracks, rules layers).
- For rules-based skills: read `_sections.md`, `_template.md`, and at least 2 sample rules per category.
- Read the repo's AGENTS.md and the skill's current README entry; these are the source of truth for install commands and conventions.
- `ls -R` the skill folder and list orphan files not referenced from SKILL.md.

Do not start editing during Phase A. Findings discovered mid-edit cause inconsistent half-rewrites.

## Audit Dimensions

Score each dimension 1-5 before touching anything. The lowest scores dictate where rewrite effort goes; report before/after scores when done.

| # | Dimension | What 5/5 looks like |
|---|-----------|---------------------|
| 1 | Trigger coverage | Third-person description, "Use when..." with quoted user phrases, disambiguated from adjacent skills |
| 2 | Boundary clarity | IS/IS-NOT opener present and accurate where sibling skills exist |
| 3 | Structure conformity | Pattern matches content; files in pattern-correct folders; zero orphan files |
| 4 | Signal density | Every line passes "would removing this cause Claude to make a mistake?" |
| 5 | Gotchas quality | Each gotcha names a concrete command/value and its consequence; grounded in observed failures |
| 6 | Freshness | No stale commands, paths, version pins, or counts (rule counts match `ls rules*/`) |
| 7 | Progressive disclosure | Every reference linked with a read-when condition; >100-line files have TOCs |
| 8 | Workflow integrity | Copyable checklist; terminal validation step that produces evidence |
| 9 | Cross-skill coherence | Related Skills section accurate; no trigger overlap with sibling descriptions |
| 10 | Format compliance | Frontmatter constraints met; body <500 lines; references one level deep |

## Rewrite Procedure

Execute in this order, correctness before triggers, triggers before structure, structure before polish. Reordering causes rework (e.g., density-cutting a section you later move).

1. **Stale-path/command/count fixes.** Anything contradicting the repo AGENTS.md or observable reality (install commands, file paths, rule counts, CLI flags). These are bugs; fix them before any stylistic work.
2. **Description sharpening.** Third-person opener stating what the skill does, capability summary, "Use when..." triggers with quoted user phrases. Explicitly disambiguate from sibling skills: if two descriptions could route the same prompt, both need an edge ("For X, use `other-skill`").
3. **Boundary opener.** Add or repair the IS/IS-NOT pair after the H1 (see "Open with Boundaries" in `authoring-tips.md`).
4. **Structure normalization.** Apply the decision table below. Update every link after a move; grep all SKILL.md files repo-wide for the old path.
5. **Signal-density cut.** Delete lines Claude would do correctly anyway; deduplicate content that appears in both SKILL.md and a reference; merge near-duplicate sections.
6. **Gotchas pass.** Rewrite vague warnings into concrete-failure format (specific command/value + consequence); delete hypothetical concerns nobody has observed.
7. **TOC additions.** Any file over 100 lines without a table of contents gets one.
8. **Workflow integrity.** Ensure a copyable progress checklist exists for multi-step workflows and the final step produces evidence (command output, score table, file listing), never "seems right".

## Structure Normalization Decision Table

| Situation | Action |
|-----------|--------|
| Supporting .md files at skill root, skill is simple/hub with a tracks table | Keep: sanctioned hub track files |
| Supporting .md files at skill root, any other pattern | Move to `references/`, update all links |
| Multiple rules folders (e.g. `rules/` + `rules-modern/`), SKILL.md dispatches to each layer explicitly | Keep: sanctioned layered design |
| Multiple rules folders, no explicit dispatch | Consolidate into one `rules/` folder |
| `agents/` folder with subagent prompts dispatched from SKILL.md | Keep: sanctioned |
| File in the folder but never linked from SKILL.md | Link it with a read-when condition, or delete it |

After any rename or move: `grep -rn "<old-path>" <repo>/skills/*/SKILL.md` must return nothing.

## Large Rule-Set Scoping

For rules-based skills with 30+ rule files, do not rewrite every rule. Drift concentrates in SKILL.md, `_sections.md`, and `_template.md`; rewrite those fully. Then run a mechanical consistency pass over rule files:

- Frontmatter present (`title`, `impact`, `tags`)
- Filename prefix matches a `_sections.md` section
- Incorrect/correct example pair present
- Counts reconcile everywhere they appear: `ls rules*/ | grep -v '^_' | wc -l` vs description, priority table, and any prose mentions

Sample-read ~10% of rules per category; deep-rewrite only the rules that fail sampling. Rewriting a correct rule can only stay equal or get worse.

## Validation

1. Run all applicable checks in `quality-checklist.md`; record the pass count.
2. Frontmatter lint: `name` matches folder, regex-clean, description ≤1024 chars, no XML tags.
3. `wc -l SKILL.md` under 500.
4. Every file in the folder is linked from SKILL.md or lives in a dispatched rules layer.
5. Rule counts reconcile (rules-based skills).
6. Repo-wide grep for any path you renamed returns clean.
7. Install smoke-test: `npx skills add <repo-slug> -g --skill <name> -y && ls ~/.claude/skills/<name>/`.
8. Re-score the ten audit dimensions and report before/after alongside files moved and anything deferred.
