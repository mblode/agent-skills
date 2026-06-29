# Deepening an existing codebase

Find domain-informed deepening opportunities in existing code. "Deepening" means making the design express the domain more faithfully so future changes stay local; not adding layers, not a rewrite. Load during the Adoption workflow.

## Contents

1. [Map the domain language](#map-the-domain-language)
2. [Deepening opportunity patterns](#deepening-opportunity-patterns)
3. [Rank by leverage](#rank-by-leverage)
4. [Output template](#output-template)
5. [Anti-patterns](#anti-patterns)

## Map the domain language

Recover the ubiquitous language the code uses before proposing changes:

- **Entities and values:** domain nouns (Order, Subscription, Payout). Where do they live? Real types, or `any`/loose objects?
- **Actions:** verbs (settle, refund, suspend). Methods on a domain object, or free functions scattered across handlers?
- **Bounded contexts:** seams where one part stops caring about another's internals (billing vs catalog vs identity).
- **Naming divergence:** one concept named three ways, or one name meaning three things. The strongest signal the model is unclear.

Capture a short glossary so opportunities reference real names, not invented ones.

## Deepening opportunity patterns

Each is a concrete, nameable issue, not a vague "this could be cleaner".

| Pattern | What it looks like | Why it matters |
|---|---|---|
| Anemic domain concept | Data in one place, its rules scattered across handlers/services | Changing the rule means hunting every call site; the model doesn't own its invariants |
| Leaking boundary | One context reaches into another's tables, internals, or private helpers | Couples contexts; a change in one silently breaks the other |
| Naming divergence | Same concept, different names per module, or one name for several concepts | Names can't be trusted; refactors miss instances |
| Duplicated concept | Same domain idea reimplemented in parallel | Fixes and rules drift between copies |
| Primitive obsession | Core concepts as bare strings/numbers (a `string` userId everywhere) | Nowhere to centralize validation; easy to mix up arguments |
| Misplaced logic | Business rule in a transport/handler/UI layer | Untestable without the transport; not reusable |

## Rank by leverage

Score each by evidence:

- Does a current requirement become easier or safer?
- Which named future changes become local from this move?
- How much churn is required?
- Is the duplication proven by 3+ real instances, or only speculated?

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
