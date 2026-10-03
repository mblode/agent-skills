# Wayfinding

Making the right thing cheap to find. Load when agents cannot locate things, keep re-deriving the same path, or cite documentation that is no longer true.

## Contents

- Naming and locality
- Add-a-new-X recipes
- One canonical instruction file
- The docs index and trust labels
- Docs that stay true

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

The instruction file itself (which file is canonical, how tools load it, what goes in it) belongs to `agents-md`. From here it needs two things: it indexes the recipe file and the docs index, and it changes in the same commit as the convention it states.

## The docs index and trust labels

Stale docs are worse than no docs, because an agent cites them confidently. Make the trust level explicit rather than implied.

Index every agent-facing doc with two pieces of metadata:

- **A trust label.** *Live* (maintained, believe it), *Reference* (stable background, still true but not actively tended), *Proposal* (a design or backlog for something not built; nothing in it exists in code until a plan lands it), *Historical* (point-in-time artifact, do not treat as current).
- **A one-line consult-when scope**, so the agent knows whether to open a doc before paying to read it.

```markdown
| Doc | Trust | Consult when |
|---|---|---|
| docs/knowledge/common-workflows.md | Live | Adding a new module, screen, query, flag, or locale |
| docs/knowledge/auth.md | Live | Touching session handling or a protected route |
| docs/adr/ | Reference | A decision looks arbitrary and you want the reason |
| docs/briefs/public-api.md | Proposal | Planning the public API; describes nothing that ships yet |
| docs/migrations/2024-mongo-to-postgres.md | Historical | Reading old code that still assumes Mongo shapes |
```

**Say which doc wins.** Two docs will disagree, and an agent that finds both picks whichever it read last. State the precedence in the index: code and the instruction file beat Live docs, Live beats Reference, and Proposal and Historical never override anything; where a specific pair overlaps (research notes against the architecture doc), name the winner in that row.

**A dangling index entry is worse than a missing one.** An index that points at files which do not exist sends the agent looking, and the absence reads as "I have the wrong path" rather than "this does not exist". When an entry names something unwritten, either write it or delete the entry, then grep-verify that every path in the index and the instruction file resolves.

## Docs that stay true

- **Anchor to domain concepts over file paths** where possible. Paths go stale silently. Link-check the pointers that remain in CI, including the ones inside the instruction file.
- **Validate what can be validated:** code snippets compile, frontmatter parses, any registry that mirrors docs into code stays in sync.
- **Ship a copy-paste template file** next to the prose for any pattern agents must reproduce. A working file teaches more reliably than a description of one.
- **Test doc examples against the real interface.** A drift test that extracts every command invocation from the docs, resolves each against the live command tree (command path and flags both exist), and fails the build on a mismatch turns "examples must stay runnable" into a gate. Reject past-dated examples in the same test so a stale snippet fails instead of misleading.
- **Pair each non-obvious claim with the command that re-proves it.** A note shipping its own repro lets the reader re-verify rather than trust a claim that may have rotted.
