---
name: agent-skills-creator
description: Creates and improves portable Agent Skills with a validator, routing scenarios, and evidence-based keep, cut, merge, or retire decisions. Use when asked to "write a skill", "update all skills", "audit my SKILL.md", "remove redundant instructions", or fix skill triggering. For AGENTS.md or CLAUDE.md use agents-md.
compatibility: Repository validation requires Bash, Ruby with YAML and JSON, Perl, and standard Unix utilities.
---

# Agent Skills Creator

Create and improve skills in the Agent Skills open format: full lifecycle from pattern selection through validation and README update.

- **IS:** creating new agent skills and auditing or rewriting existing ones: SKILL.md, references, rules folders, scripts, evaluations.
- **IS NOT:** AGENTS.md/CLAUDE.md instruction files (use `agents-md`) or general documentation quality (use `docs-writing`).

## Choose a Mode

- New skill → Creation Workflow below.
- Audit, improve, or rewrite an existing skill → `references/improving-existing-skills.md`, which scores eleven audit dimensions, runs an ordered rewrite, then reuses Steps 5-8 for validation and shipping.
- Simplify a skill or update a collection → same reference, plus `references/capability-delta.md` for retention decisions and the collection ledger.
- Skill never triggers, or triggers on the wrong prompts → the Routing Evals section of `references/evaluation-and-iteration.md`, then the description. Body edits do not fix routing.

## Reference Files

| File | Read When |
|------|-----------|
| `references/capability-delta.md` | Removing generic coaching, evaluating model upgrades, or auditing a whole collection |
| `references/authoring-tips.md` | Default when writing or cutting body content: judgement over rules, constraint calibration, degrees of freedom, content patterns, descriptions |
| `references/skill-patterns.md` | Choosing a structural pattern |
| `references/format-specification.md` | Directory layout, spec versus Claude Code-only frontmatter, body substitutions, loading semantics, which host reads the skill from where and what each can do, naming |
| `references/rules-folder-structure.md` | Building a rules-based audit/lint skill |
| `references/improving-existing-skills.md` | Auditing, scoring, simplifying, or rewriting an existing skill |
| `references/executable-code.md` | Skill includes scripts, injects live context with `!`, depends on packages, or invokes MCP tools |
| `references/evaluation-and-iteration.md` | Writing `evals/evals.json`, routing tests, ablating constraints, testing across models |
| `references/adopt-adapt-author.md` | A public skill already covers this ground, or deciding whether to vendor, adapt, or replace a third-party skill |

The validator is the single local statement of mechanical gates. From the repository root:

```bash
skills/agent-skills-creator/scripts/validate.sh skills/<name>   # one skill
skills/agent-skills-creator/scripts/validate.sh --all           # every skill in the repo
```

## Creation Workflow

Copy this checklist to track progress:

```text
Skill creation progress:
- [ ] Step 1: Choose a pattern
- [ ] Step 2: Create directory and frontmatter
- [ ] Step 3: Write SKILL.md body
- [ ] Step 4: Add reference or rule files
- [ ] Step 5: Validate
- [ ] Step 6: Update README.md (and docs/skills.mdx where the repo has one)
- [ ] Step 7: Smoke-test installation
- [ ] Step 8: Evaluate and iterate
```

### Step 1: Choose a pattern

Simple/hub, workflow, rules-based, or mixed. `references/skill-patterns.md` has the shapes, the in-repo example for each, and the problem-to-pattern affinity table.

### Step 2: Create directory and frontmatter

Create `skills/<name>/SKILL.md` with `name` and `description`, the `---` on line 1. Write the description as a model trigger, not a human summary: what it does, what it covers, then "Use when..." with the phrases users actually say, and the key use case first because the listing trims descriptions from the tail when it runs over budget. `validate.sh` enforces the limits, so write for routing and let the script police the constraints.

Decide where the skill will run before adding any other field. Use portable fields for this collection; put genuine runtime prerequisites in `compatibility`. Host-specific fields require current host documentation and a deliberately host-specific package. State authorization boundaries in the body when a workflow deploys, sends, or spends. The format reference distinguishes these contracts.

### Step 3: Write SKILL.md body

`references/authoring-tips.md` carries the judgement. Apply:

- Open with an IS/IS-NOT pair when adjacent skills exist or scope creep is likely ("Open with Boundaries")
- Add only context the agent lacks ("Don't State the Obvious"); use consistent terminology
- Phrase guidance as an outcome, reserving absolutes for safety, data loss, format contracts, and observed failures ("Judgement Over Rules")
- Check nothing here contradicts the harness, a sibling skill, or the repo AGENTS.md; route instead of restate ("Don't Fight the Harness or a Sibling")
- Keep the opinions that make the skill worth invoking; cut only what the target agent already does unprompted ("Cut Constraints, Keep Opinions"). On current frontier models over-prescription is not merely wasted tokens: instructions carried forward from older models are often too prescriptive and lower output quality, so the constraint cut is correctness work
- Match degrees of freedom to fragility: prose for open-ended work, exact commands for fragile or destructive ops ("Degrees of Freedom")
- Reach for named content patterns: template for fixed output, examples only where style is the deliverable, conditional for decision points
- State the workflow dependencies and completion evidence; add a checklist only when it helps track a long or resumable task
- Put the deliverable, routing, and task-specific constraints first; loading and compaction behavior depend on the host
- Build a Gotchas section from observed failures: the highest-signal content in any skill

### Step 4: Add reference or rule files

- **Workflow/mixed**: a `references/` folder, each file linked from SKILL.md with a "Read when" condition
- **Rules-based**: a `rules/` folder; `references/rules-folder-structure.md` covers `_sections.md`, `_template.md`, and file naming
- **Simple/hub**: track files alongside SKILL.md, linked from a tracks table

Prefer a reference that is code. An existing implementation or a test suite pins a contract better than prose describing it ("Reference-as-Spec"). Split by loading condition, not line count: two topics read at different moments are two files.

Advanced, all covered in `references/executable-code.md` and `references/format-specification.md`: `scripts/` for executables the agent composes, resolved relative to the installed SKILL.md; Claude Code can substitute `${CLAUDE_SKILL_DIR}`; `` !`command` `` injection for data the skill always needs at invocation (a diff, PR comments); `hooks` frontmatter for a PreToolUse gate that should exist only while the skill is active; `config.json` for setup context that would otherwise be re-asked every session.

### Step 5: Validate

```bash
skills/agent-skills-creator/scripts/validate.sh skills/<name>
```

Output separates **format** requirements from **house** conventions, including recommendations adopted as local gates. Fix every FAIL. Run `skills-ref validate <dir>` for an independent metadata and naming check. Neither check establishes behavioral quality or compatibility with every host.

### Step 6: Update README.md

Add a bullet under the matching category heading, and bump the skill count near the top of the README:

```markdown
- **[<skill-name>](./skills/<skill-name>/SKILL.md)**: <one-line description>
```

Categories: Architecture, Design, Writing, Quality, Shipping, Authoring. `validate.sh` verifies the bullet and the count. A repo that also ships `docs/skills.mdx` needs the same bullet there; the check is conditional on that file existing, so it stays silent in a repo without one.

### Step 7: Smoke-test

When installation behavior changed, install the edited local source into a disposable target using the installer's documented local-source options. Verify the loaded SKILL.md and a bundled reference or script against the working copy. Do not overwrite a global installation to smoke-test an edit, and do not install the remote default branch as evidence for unpushed changes.

### Step 8: Evaluate and iterate

`references/evaluation-and-iteration.md`. Write 2-3 scenarios in `evals/evals.json`, add assertions after the first run, and measure with-skill against without-skill in fresh sessions. Test routing separately with should-trigger and near-miss prompts. Test on each target model, and ablate any rule you suspect is dead weight: delete it, rerun the scenarios, keep it only if one regresses.

## Gotchas

- The installed copy under `~/.agents/skills/<name>/` is a copy, not a link to your repo. Editing the repo changes nothing in a running session, and the stale copy loads silently, so a skill can be several commits behind while appearing correct. Verify that an evaluation loads the edited local source.
- A reference-chain failure calls for moving the load condition into SKILL.md, not disguising the same dependency with different wording.
- `toc-over-100-lines` wants `## Contents` inside the first 20 lines of any reference over 100 lines. A TOC further down does not count, and the file fails while looking fine.
- `readme-skill-count` compares the README's stated count against `find skills -maxdepth 2 -name SKILL.md`. Adding a reference file to an existing skill does not change it; only adding or removing a skill does.
- `--agent` on `skills add` is variadic and space-separated (`--agent codex cursor`); it consumes arguments until the next one starting with `-`. A comma-separated list is validated element-wise and rejected whole as one invalid name. Do not conclude from an empty `~/.codex/skills` that the install failed: any agent whose `skillsDir` is `.agents/skills` is treated as universal and installed to `~/.agents/skills/`, which those agents read directly.
- A description that omits "Use when" fails `description-triggers` outright, but a description that has the phrase and the wrong trigger words fails nothing and simply never routes. The validator cannot see this; only a routing eval can.

## Anti-patterns

- Usage examples standing in for an expressive interface; name the parameters and enums instead
- A rule stated in SKILL.md and again in a script's `--help`, a tool description, or a rule file
- Dumping the full specification into the SKILL.md body instead of a reference file
- Time-sensitive content ("before August 2025, use..."), including model names as the reason a rule exists
- A `context: fork` skill whose body is guidelines rather than a task; the subagent gets conventions and no prompt, and returns nothing
- Vague names (`helper`, `utils`, `tools`, `documents`, `data`) that give the model nothing to route on
- Magic numbers in scripts with no justifying comment
- Shipping without testing across the capability tiers and effort levels the skill will actually run under; what reads well to a frontier model may underspecify a small fast one, and a step the model only volunteers at high effort is a step the workflow does not really have

## Related Skills

- `agents-md` for auditing AGENTS.md/CLAUDE.md instruction files
- `docs-writing` for documentation quality rules

Maintenance only: `evals/evals.json` holds the behavioural scenarios and routing prompts for anyone changing this skill. It never loads during a user task, which is the baseline Phase A of `references/improving-existing-skills.md` asks for.
