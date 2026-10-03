# Deepening an existing codebase

Find domain-informed deepening opportunities in existing code. "Deepening" means making the design express the domain more faithfully so future changes stay local; not adding layers, not a rewrite. Load during Deepen mode.

## Contents

1. [Vocabulary](#vocabulary)
2. [Map the domain language](#map-the-domain-language)
3. [Deepening opportunity patterns](#deepening-opportunity-patterns)
4. [Module-depth screen](#module-depth-screen)
5. [Dependency and testing checks](#dependency-and-testing-checks)
6. [Rank by leverage](#rank-by-leverage)
7. [Output template](#output-template)
8. [Anti-patterns](#anti-patterns)

## Vocabulary

Module, interface, depth, leverage, locality, seam, adapter, and the deletion test are defined in `vocabulary.md`. Use those words exactly in the output.

## Map the domain language

Read `CONTEXT.md`, `docs/adr/`, or local equivalents if present. Existing decisions are constraints, not stale obstacles; only challenge them when the current code shows real friction.

Recover the ubiquitous language the code uses before proposing changes:

- **Entities and values:** domain nouns (Order, Subscription, Payout). Where do they live? Real types, or `any`/loose objects?
- **Actions:** verbs (settle, refund, suspend). Methods on a domain object, or free functions scattered across handlers?
- **Contexts:** where one part stops caring about another's internals (billing vs catalog vs identity).
- **Naming divergence:** one concept named three ways, or one name meaning three things. The strongest signal the model is unclear.

Capture a short glossary so opportunities reference real names, not invented ones. Its format and the rules for when a decision is worth recording are in `domain-language.md`.

## Deepening opportunity patterns

Each is a concrete, nameable issue, not a vague "this could be cleaner".

| Pattern | What it looks like | Why it matters |
|---|---|---|
| Anemic domain concept | Data in one place, its rules scattered across handlers/services | Changing the rule means hunting every call site; the model doesn't own its invariants |
| Shallow module | Public interface nearly matches the implementation, or callers must know internal ordering/invariants | The module adds little leverage; tests and callers still carry the complexity |
| Leaking seam | One context reaches into another's tables, internals, or private helpers | Couples contexts; a change in one silently breaks the other |
| Naming divergence | Same concept, different names per module, or one name for several concepts | Names can't be trusted; refactors miss instances |
| Duplicated concept | Same domain idea reimplemented in parallel | Fixes and rules drift between copies |
| Primitive obsession | Core concepts as bare strings/numbers (a `string` userId everywhere) | Nowhere to centralize validation; easy to mix up arguments |
| Misplaced logic | Business rule in a transport/handler/UI layer | Untestable without the transport; not reusable |

## Module-depth screen

Use this screen to keep the review from becoming generic cleanup advice:

- A candidate must hide more behavior behind a smaller public surface, improve locality, or make tests cross one stable interface.
- Run the deletion test (`vocabulary.md`) on every candidate before scoring it.
- Friction prompts: understanding one concept requires opening many small files; callers need private sequencing knowledge; pure helpers were extracted only to make tests possible while orchestration bugs remain elsewhere; tests cannot exercise behavior through the public surface.
- Count adapters at every proposed seam: one adapter is a hypothetical seam (`vocabulary.md`).
- Do not propose a new seam only because it is aesthetically tidy. A seam needs current variation, a real test adapter, or a named future change it makes local.

## Dependency and testing checks

Classify dependencies before suggesting the new shape:

| Dependency | Good move | Test shape |
|---|---|---|
| In-process | Collapse shallow modules and expose one smaller interface | Test directly through the new interface |
| Local stand-in exists | Keep the dependency behind an internal seam | Run the stand-in in the test suite |
| Owned remote system | Define a port at the network seam | Production adapter plus in-memory test adapter |
| True external system | Inject the provider behind a port | Fake or mock adapter, with idempotency and reconciliation for effects |

A vendor (email, SMS, payments) is the clearest real seam: one port per vendor, one production adapter, one fake, chosen at wiring time by whether the key is present. The fake earns the second-adapter count because it runs in local dev, tests, and agent evals with no keys, and it doubles as the test's inbox (`sent[]`, or a dev-only "last email" route a browser test reads). Keep it one port per vendor, plain: a generic `Notifier` over email and SMS leaks by the second message type, because their fields and idempotency differ. Lint the SDK import to the adapter file, so swapping vendors rewrites one file.

Testing rule: the deepened interface is the test surface (`vocabulary.md`). Keep old shallow-module tests until replacement coverage is green, then delete the tests that only preserve the old structure. Do not expose internal seams just because tests use them.

## Design it twice

Before committing to the interface for the top candidate, draft two or three that differ in kind, not in naming: for example, one call that hides the sequencing, a small set of operations the caller orders, and a data-in, data-out shape. Where the host can run subagents, give each draft to a separate one so they do not converge. Compare them on what the caller stops having to know, which future changes each makes local, and how a test reaches the behaviour. The first interface that comes to mind is usually the shallow one, because it mirrors the current implementation.

## Rank by leverage

Score each by evidence:

- Does a current requirement become easier or safer?
- Which named future changes become local from this move?
- How much churn is required?
- Is the duplication proven by 3+ real instances, or only speculated?
- Which dependency category applies, and what test seam proves the behavior?

Prefer the opportunity that localizes the most future changes for the least churn. Defer or drop the rest.

When the claimed benefit is that agents will work faster or more correctly in the repo (a new error model, an effect system, a framework swap), measure it rather than argue it. Build the change on a branch, then run the repo's agent evals (`agents-md` covers setting them up) on both arms with the same tasks, models, and starting commit. Compare pass rate and cost: turn counts undercount work done in subagents. Repeat each task, since runs of one task in one arm can differ by tens of percent. Record a grader fault as a separate regrade, never by editing the raw results. Write up the decision with the numbers, even when they show no gain. Equal agent results still leave the adoption cost, and two models of the same concept (two error channels, two data layers) cost an agent more than either one alone.

Record every dropped or deferred opportunity in the output's "Out of scope (deferred)" section with its reason. The list is load-bearing: a future audit reads it first so rejected ideas aren't re-evaluated from scratch, and a stale reason ("no current requirement") signals the item to promote.

## Output template

```markdown
# Deepening opportunities

## Domain glossary
- <concept>: <where it lives, what names it goes by>

## Opportunities (ranked by leverage)
1. [<pattern>] <concept/module>
   - Observation: <what the code does today, with file paths>
   - Domain rationale: <how this diverges from the domain model>
   - Leverage: High | Medium | Low, <which future changes become local>
   - Depth rationale: <how the move shrinks the interface or improves locality>
   - Dependency/testing: <in-process | local stand-in | owned remote | external; how behavior will be tested>
   - Suggested move: <the smallest change that fixes it; name the slice to migrate first>

## Out of scope (deferred)
- <opportunity>: <why deferred: speculative / low leverage / no current requirement>
```

## Anti-patterns

- Big-bang rewrite. Migrate one vertical slice first, always.
- Renaming for taste, not to match the domain. Every rename must reduce divergence.
- Extracting an abstraction from two instances. Wait for three real consumers.
- Listing smells without a suggested move and leverage score. Not actionable until both exist.
- Inventing domain terms the team doesn't use. Recover language from the code; don't impose new vocabulary.
- Designing full target interfaces for every candidate before choosing one. Rank first, then deepen one selected slice.
