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

Use these words exactly. Substituting a synonym is not a style slip: it splits one concept across two names in the output, which is the exact failure this analysis exists to find.

- **Module**: anything with an interface and an implementation. Scale-agnostic on purpose: a function, a class, a package, or a slice spanning tiers. _Avoid_: component, service, unit.
- **Interface**: everything a caller must know to use the module correctly. Not just the type signature: also invariants, ordering constraints, error modes, required configuration. _Avoid_: API, signature (both name only the type-level surface).
- **Seam**: the place a module's interface lives, where behavior can be altered without editing in that place. _Avoid_: boundary (reserved here for import and layer rules, and for trust boundaries where input is validated).
- **Depth**: leverage at the interface, meaning how much behavior a caller or a test exercises per unit of interface it has to learn.
- **Locality**: what maintainers get from depth. Change, bugs, and verification concentrate in one place instead of spreading across callers.

**Rejected framing:** depth as the ratio of implementation lines to interface lines. It is the common definition and the one to drift back toward, and it rewards padding the implementation. A module that grew 200 lines of duplicated branching did not get deeper. Depth is leverage at the interface; measure it by what a caller stops having to know.

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
- Deletion test: if deleting the module only moves identical complexity elsewhere, it is a pass-through; if deleting it spreads behavior across callers, the module is earning its place and may be worth deepening.
- Friction prompts: understanding one concept requires opening many small files; callers need private sequencing knowledge; pure helpers were extracted only to make tests possible while orchestration bugs remain elsewhere; tests cannot exercise behavior through the public surface.
- One adapter means a hypothetical seam; two means a real one. A port with a single implementation is indirection you pay for and nothing varies across it. (Distinct from the rule of three for duplicated code below: that one counts copies, this one counts things that differ.)
- Do not propose a new seam only because it is aesthetically tidy. A seam needs current variation, a real test adapter, or a named future change it makes local.

## Dependency and testing checks

Classify dependencies before suggesting the new shape:

| Dependency | Good move | Test shape |
|---|---|---|
| In-process | Collapse shallow modules and expose one smaller interface | Test directly through the new interface |
| Local stand-in exists | Keep the dependency behind an internal seam | Run the stand-in in the test suite |
| Owned remote system | Define a port at the network seam | Production adapter plus in-memory test adapter |
| True external system | Inject the provider behind a port | Fake or mock adapter, with idempotency and reconciliation for effects |

Testing rule: the deepened interface is the test surface. Keep old shallow-module tests until replacement coverage is green, then delete the tests that only preserve the old structure. Do not expose internal seams just because tests use them.

## Rank by leverage

Score each by evidence:

- Does a current requirement become easier or safer?
- Which named future changes become local from this move?
- How much churn is required?
- Is the duplication proven by 3+ real instances, or only speculated?
- Which dependency category applies, and what test seam proves the behavior?

Prefer the opportunity that localizes the most future changes for the least churn. Defer or drop the rest.

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
