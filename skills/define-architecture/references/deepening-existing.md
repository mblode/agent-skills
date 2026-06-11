# Deepening an existing codebase

Find domain-informed deepening opportunities in code that already exists. "Deepening" means making the design express the domain more faithfully so future changes stay local. It is not adding layers, and not a rewrite. Load during the Adoption workflow.

## Contents

1. [Map the domain language](#map-the-domain-language)
2. [Deepening opportunity patterns](#deepening-opportunity-patterns)
3. [Rank by leverage](#rank-by-leverage)
4. [Output template](#output-template)
5. [Anti-patterns](#anti-patterns)

## Map the domain language

Before proposing any change, recover the ubiquitous language the code actually uses:

- **Entities and values:** the nouns the domain cares about (Order, Subscription, Payout). Where do they live? Are they real types or just shapes of `any`/loose objects?
- **Actions:** the verbs (settle, refund, suspend). Are they methods on a domain object, or free functions scattered across handlers?
- **Bounded contexts:** the natural seams where one part of the system stops caring about another's internals (billing vs catalog vs identity).
- **Naming divergence:** the same concept named three ways, or one name meaning three things, across modules. This is the strongest signal of where the model is unclear.

Capture this as a short glossary so the opportunities below reference real names, not invented ones.

## Deepening opportunity patterns

Each is a concrete, nameable issue, not a vague "this could be cleaner".

| Pattern | What it looks like | Why it matters |
|---|---|---|
| Anemic domain concept | Data lives in one place, the rules about it are scattered across handlers/services | A change to the rule means hunting every call site; the model doesn't own its own invariants |
| Leaking boundary | One context reaches into another's tables, internals, or private helpers | Couples two contexts; a change in one silently breaks the other |
| Naming divergence | Same concept with different names per module, or one name for several concepts | Readers can't trust names; refactors miss instances |
| Duplicated concept | The same domain idea reimplemented in parallel | Fixes and rules drift apart between copies |
| Primitive obsession | Core concepts passed as bare strings/numbers (a `string` userId everywhere) | No place to centralize validation or invariants; easy to mix up arguments |
| Misplaced logic | Business rule sitting in a transport/handler/UI layer | Untestable without the transport; can't be reused |

## Rank by leverage

Not every opportunity is worth acting on. Score each against the Principles in the SKILL.md:

- **KISS:** does the change make the code simpler to understand, or just differently shaped?
- **YAGNI:** is a *current* requirement made easier by this, or is it speculative tidiness?
- **Easier to change:** how many future changes become local because of this move? Higher = more leverage.
- **Duplication over wrong abstraction:** only unify concepts proven duplicated (3+ real instances), never speculated.

Prefer the opportunity that makes the most future changes local for the least churn. Defer or drop the rest.

Record every dropped or deferred opportunity in the output's "Out of scope (deferred)" section with its reason. The list is load-bearing: a future audit starts by reading it so rejected ideas are not re-evaluated from scratch, and a reason that no longer holds ("no current requirement") is the signal to promote the item.

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

- Proposing a big-bang rewrite. Migrate one vertical slice first, always.
- Renaming for taste rather than to match the domain. Every rename must reduce divergence.
- Extracting an abstraction from two instances. Wait for three real consumers.
- Listing smells without a suggested move and a leverage score. An opportunity isn't actionable until both exist.
- Inventing domain terms the team doesn't use. Recover the language from the code; don't impose new vocabulary.
