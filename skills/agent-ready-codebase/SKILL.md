---
name: agent-ready-codebase
description: Hardens an existing repo so coding agents work in it cheaply and safely, covering guardrail tooling wired into hooks and CI, an enforcement rung for rules the codebase already violates, structural lint that walks the filesystem, regenerate-and-diff staleness gates, verification tiers, legacy and generated-file markers, add-a-new-X recipes, and a trust-labeled docs index. Use when asked to "make this codebase agent-friendly", "set up guardrails for coding agents", "add a dead-code check", "wire knip, madge, or jscpd", "stop deep imports across modules", "set up check and verify scripts", "add CI gates for AI-written code", "why does the agent keep copying the old pattern", or "my agent can't find anything in this repo". For the content of AGENTS.md or CLAUDE.md itself use agents-md, for deciding what the structure should be use codebase-architecture, for a diff-scoped cleanup pass use tidy, and for the developer surface a library or CLI ships to its consumers use dx-audit.
---

# Agent-Ready Codebase

Make a repo cheap and safe for coding agents to work in. Two halves: **guardrails** stop the wrong thing from landing, **wayfinding** makes the right thing cheap to find.

- **IS:** wiring guardrail tooling into hooks and CI; choosing an enforcement rung for a rule the codebase already violates; structural lint; staleness gates; verification tiers; legacy and generated-file markers; add-a-new-X recipes; a trust-labeled docs index; session hooks and permission allowlists.
- **IS NOT:** the content quality of AGENTS.md or CLAUDE.md itself (`agents-md`), deciding what the structure should be (`codebase-architecture`), a diff-scoped cleanup pass (`tidy`), or the developer surface a library, CLI, or SDK ships to its consumers (`dx-audit`).

## Contents

- Workflow and references
- Step 1: Survey what exists
- Step 2: Choose checks by the failure they prevent
- Step 3: Install each check
- Step 4: Wayfinding
- Step 5: Contagion markers
- Step 6: Runtime ergonomics
- Step 7: Verify
- Excuses
- Related skills
- Gotchas

Agents arrive by grep, not by reading docs. Every technique here follows from that: the warning has to live where the agent lands, and the rule has to be an exit code rather than a sentence someone might recall.

## Workflow and references

Track this checklist:

```text
Agent-ready progress:
- [ ] Step 1: Survey what exists and what is dormant
- [ ] Step 2: Choose checks by the failure they prevent
- [ ] Step 3: Install each check (rung, ship green, prove it bites)
- [ ] Step 4: Wayfinding (naming, recipes, docs index)
- [ ] Step 5: Contagion markers (legacy, generated, dual paths)
- [ ] Step 6: Runtime ergonomics (hooks, allowlist, verify tiers)
- [ ] Step 7: Verify and record the evidence
```

Load references only when the condition applies:

| Reference | Read when |
|-----------|-----------|
| [references/enforcement-ladder.md](references/enforcement-ladder.md) | Adding any check to a repo that already violates it |
| [references/guardrail-tooling.md](references/guardrail-tooling.md) | Choosing and wiring the actual checks |
| [references/wayfinding.md](references/wayfinding.md) | Agents cannot find things, or keep re-deriving the same path |
| [references/contagion-markers.md](references/contagion-markers.md) | The repo has legacy, generated, or dual-path code |
| [references/verification-tiers.md](references/verification-tiers.md) | Defining which commands an agent should run, and when |
| [references/agent-runtime.md](references/agent-runtime.md) | Configuring session hooks, permissions, or review gating |

## Step 1: Survey what exists

Read before adding: package scripts, CI workflow steps, hook config (lefthook, husky, `.claude/settings.json`), lint config, the instruction file, and any docs index.

Two things to find:

- **Gaps between local and CI.** A check that runs locally but is not wired into the merge gate protects nothing; the invariant decays silently and nobody learns until it is expensive.
- **Dormant config.** A devDep, config file, or script nobody invokes, especially one pointing at a path that does not exist. Delete it. An agent reads it as live convention and extends it, and a config aimed at a missing file produces a confident wrong answer rather than an error.

## Step 2: Choose checks by the failure they prevent

Name the failure first, then pick the tool. A check nobody can name a failure for is overhead that trains people to add `--no-verify`.

The categories and their tools are in [references/guardrail-tooling.md](references/guardrail-tooling.md). Do not install all of them in one pass; pick the two or three whose failure mode this repo actually exhibits.

## Step 3: Install each check

For each one, in order:

1. **Pick an enforcement rung** for the violations that already exist. The ladder and the reasoning are in [references/enforcement-ladder.md](references/enforcement-ladder.md). Never hand-roll a baseline file.
2. **Ship it green.** Fix the existing violations in the same change, or scope them out via the rung you picked. A rule that lands red teaches agents and humans alike that the check is noise.
3. **Prove it bites.** Run the check (passes), introduce a violation (fails, with a message naming the fix), revert (passes). This is the completion criterion, not an optional extra.
4. **Wire it into both** a pre-commit hook and CI. Hooks are not guaranteed installed; CI alone gives feedback too late for the agent's edit loop.

## Step 4: Wayfinding

Covered in [references/wayfinding.md](references/wayfinding.md): naming and locality, the add-a-new-X recipe file, the trust-labeled docs index, and consolidating to one canonical instruction file.

The recipe file is the highest-value item here and the one most often skipped. Trace every recipe against real code before writing it down.

## Step 5: Contagion markers

Covered in [references/contagion-markers.md](references/contagion-markers.md). Anything an agent must not copy or must not edit needs a greppable marker at the code site, naming what to use instead: legacy code, generated files, and unmarked old/new dual paths.

## Step 6: Runtime ergonomics

Verification tiers in [references/verification-tiers.md](references/verification-tiers.md); session hooks, permission allowlists, and review gating in [references/agent-runtime.md](references/agent-runtime.md).

## Step 7: Verify

Each item needs evidence. "Looks wired" is not a pass.

1. **Every check bites.** Evidence: the pass/fail/pass observation from Step 3, per check.
2. **CI and local agree.** Evidence: the CI step invokes the same umbrella command a developer runs, or the diff of the two lists is deliberate and stated.
3. **No dangling pointers.** Evidence: a grep proving every path named in the docs index and the instruction file exists.
4. **A recipe works cold.** Evidence: a fresh-context agent follows one add-a-new-X recipe end to end with no further guidance.

## Excuses

| Excuse | Rebuttal |
|--------|----------|
| "The check is obviously configured right." | You have not watched it fail. A misconfigured gate passes on everything and reads as coverage. |
| "There are too many existing violations to fix." | That is what the enforcement ladder is for. Pick a rung and land it green today rather than a perfect rule next quarter. |
| "I'll write the baseline file, it's only 30 lines." | It was built and deleted. Every tool in this category already ships the mechanism; the custom layer is maintenance for no added coverage. |
| "AGENTS.md already says not to do that." | A prompt rule decays under context pressure. If a static tool can check it, it belongs in tooling. |
| "The recipe is obvious, I don't need to trace it." | A recipe naming a file that moved sends the agent to the wrong place with full confidence. Trace it. |

## Related skills

- `codebase-architecture`: decides what the structure and module contracts should be; this skill makes them hold.
- `agents-md`: audits and refactors the instruction file's content. This skill decides what moves out of it into tooling, and owns the docs tree around it.
- `tidy`: diff-scoped cleanup. The guardrails here are what keep those passes small.
- `pr-reviewer`: read-only review of a local diff, including whether new code respects these checks.
- `dx-audit`: the developer surface a package ships outward, rather than the repo an agent works inside.

## Gotchas

- Don't hand-roll a shrink-only baseline (`*-ratchet.mjs` plus `*.baseline.json`): it was built once and deleted, because knip, eslint, madge, and jscpd all ship native ignore, allowlist, and warn mechanisms that do the same job with no code to maintain.
- Don't land a rule red: agents and humans both learn the check is noise, and the next person adds `--no-verify` instead of a fix.
- Don't ship a check you have not watched fail: a wrong glob or a filter matching zero files passes on everything and reads as coverage.
- Don't leave dormant config or an unused devDep in place: an agent reads it as live convention and extends it, and one pointing at a missing file yields a confident wrong answer instead of an error.
- Don't index a doc that does not exist: agents cite confidently, so a dangling pointer is worse than a missing one.
- Don't write add-a-new-X recipes from memory: a recipe naming a moved file sends the agent somewhere wrong, and it will not doubt the doc.
- Don't rely on pre-commit hooks alone: they are not guaranteed installed on a fresh clone or in a worktree, which is exactly where agents run.
- Don't put a marker only in `docs/legacy.md`: an agent that arrived by grep never opens it. The marker goes in the frozen file.
- Don't generate the instruction file wholesale: one 2026 study found LLM-generated context files reduced task success and raised inference cost. Hand-curate it and update it in the PR that changes the convention.
