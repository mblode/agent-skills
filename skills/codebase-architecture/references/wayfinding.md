# Wayfinding

Making the right thing cheap to find. Load when agents cannot locate things, keep re-deriving the same path, or cite documentation that is no longer true.

## Contents

- Why this pays
- Naming and locality
- Add-a-new-X recipes
- One canonical instruction file
- The docs index and trust labels
- Docs that stay true

## Why this pays

Code cleanliness does not change an agent's pass rate; it changes the cost of every task. Across 660 Claude Code trials over repo pairs matched on architecture, dependencies, and behavior but differing on rule violations and cognitive complexity, the clean side used 7 to 8% fewer tokens and revisited already-edited files about a third less often, with pass rate unchanged within noise (Sonar, [arXiv:2605.20049](https://arxiv.org/abs/2605.20049)). Two mechanisms drive it:

- **Traversal cost.** Agents rebuild context per task by grepping and reading. Predictable names and small files mean the first guess lands; bloated files mean chunked reads and repeated visits.
- **Convention contagion.** Agents mimic whatever code they read first. A legacy pattern sitting unmarked next to the current one gets copied even when the instruction file says otherwise.

## Naming and locality

- Name files for what someone would grep first: `invoice-refunds.ts`, not `utils2.ts` or `helpers.ts`.
- Keep files small enough to read in one pass. The ~400-line lint cap doubles as a traversal budget.
- Co-locate code that changes together. A feature spread across six directories is six reads before the first edit.
- One canonical name per concept. Naming divergence, one concept with three names, is the strongest confusion signal for agents and humans alike. Deepen mode recovers the vocabulary; the glossary format is in `domain-language.md`.

## Add-a-new-X recipes

The single highest-value wayfinding artifact, and the one most repos lack. One file (`docs/knowledge/common-workflows.md` or local equivalent) holding numbered recipes for the additions this codebase makes over and over: a new module, a new screen and route, a new query and its generated hook, a new store, a new feature flag, a new translated string, a new locale.

Format rules that make it work:

- **Ten steps or fewer per recipe.** Longer means the thing itself needs simplifying, and the recipe is documenting the problem.
- **Name exact files and exact commands.** "Register it in the module manifest" is not a step; `src/modules/index.ts`, plus the line to add, is.
- **Link out for depth, never duplicate.** The recipe is the path; the deeper doc holds the reasoning. Duplicated prose drifts within a quarter.
- **Trace every recipe against real code before writing it.** A recipe written from memory names files that moved, and an agent follows a stale pointer with full confidence rather than an error.
- **Index it from the instruction file**, or it will not be found by the agents that need it most.

Acceptance is behavioral, not editorial: a fresh-context agent follows one recipe end to end with no further guidance. If it stalls or asks a question, the recipe is missing a step.

## One canonical instruction file

Two overlapping instruction files (AGENTS.md and CLAUDE.md, or per-tool variants) read inconsistently and drift apart, and the agent has to reconcile them before it can act.

- Merge into one canonical file and symlink the other to it. One file to update, every tool reads the same content.
- Never create a second one when the first exists.
- Update it in the same change that changes the convention, not in a later docs pass.
- Keep it hand-curated. Hand-written context files measurably beat LLM-generated ones (p=0.038), while generating one raises cost 20 to 23% for no significant accuracy change either way. Generated files mostly parrot documentation the repo already has: they only beat having no file at all once the README and docs are deleted ([arXiv:2602.11988](https://arxiv.org/abs/2602.11988)).
- Write the requirements the agent cannot discover, not an overview of what it can. Directory enumerations and codebase tours appeared in every generated file in that study and did not reduce the steps taken to reach the relevant code. A specific instruction does land: agents told to use a particular tool reached for it around 160 times more often than when it went unmentioned, so instruction-following is literal enough that a wrong line is as load-bearing as a right one.

## The docs index and trust labels

Stale docs are worse than no docs, because an agent cites them confidently. Make the trust level explicit rather than implied.

Index every agent-facing doc with two pieces of metadata:

- **A trust label.** *Live* (maintained, believe it), *Reference* (stable background, still true but not actively tended), *Historical* (point-in-time artifact, do not treat as current).
- **A one-line consult-when scope**, so the agent knows whether to open a doc before paying to read it.

```markdown
| Doc | Trust | Consult when |
|---|---|---|
| docs/knowledge/common-workflows.md | Live | Adding a new module, screen, query, flag, or locale |
| docs/knowledge/auth.md | Live | Touching session handling or a protected route |
| docs/adr/ | Reference | A decision looks arbitrary and you want the reason |
| docs/migrations/2024-mongo-to-postgres.md | Historical | Reading old code that still assumes Mongo shapes |
```

**A dangling index entry is worse than a missing one.** An index that points at files which do not exist sends the agent looking, and the absence reads as "I have the wrong path" rather than "this does not exist". When an entry names something unwritten, either write it or delete the entry, then grep-verify that every path in the index and the instruction file resolves.

## Docs that stay true

- **Anchor to domain concepts over file paths** where possible. Paths go stale silently. Link-check the pointers that remain in CI, including the ones inside the instruction file.
- **Validate what can be validated:** code snippets compile, frontmatter parses, any registry that mirrors docs into code stays in sync.
- **Ship a copy-paste template file** next to the prose for any pattern agents must reproduce. A working file teaches more reliably than a description of one.
- **Test doc examples against the real interface.** A drift test that extracts every command invocation from the docs, resolves each against the live command tree (command path and flags both exist), and fails the build on a mismatch turns "examples must stay runnable" into a gate. Reject past-dated examples in the same test so a stale snippet fails instead of misleading.
- **Pair each non-obvious claim with the command that re-proves it.** A note shipping its own repro lets the reader re-verify rather than trust a claim that may have rotted.
