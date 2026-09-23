# Domain Language and Decision Records

The two artifacts that keep a codebase's vocabulary and its non-obvious choices from rotting: a glossary and a set of short decision records. Load when writing or fixing a glossary, resolving naming divergence, or recording an architecture decision.

## Glossary format

One file, conventionally `CONTEXT.md` at the repo root. Each entry:

```markdown
**Payout**: Money leaving the platform to a seller, after fees and holds are applied. One payout covers many orders.
_Avoid_: transfer, disbursement, settlement
```

- **Define what the term IS, not what it does.** One or two sentences. A definition that describes behavior becomes wrong the first time the behavior changes.
- **Be opinionated.** When several words name one concept, pick one and list the rest under `_Avoid_`. The Avoid list is the working half of the entry: it is what makes a reviewer or an agent catch the wrong word.
- **Only terms this project argues about.** General programming concepts (timeout, retry, cache, event) do not belong even when the codebase uses them constantly.
- **Record unresolved ambiguity too**, in a short list at the bottom. "We use 'account' for both Customer and User and have not decided" is more useful than silence, and it names the next decision to make.

## The glossary is a glossary and nothing else

No implementation details, no spec content, no scratch notes, no architecture decisions. A general "project context" file accumulates whatever nobody had a home for and stops being read; a single-purpose one stays short enough to stay true.

Architecture decisions go in decision records. Implementation detail goes in the code.

## Working practices

- **Write it inline, not batched.** When a term resolves mid-conversation, record it there and then. Batched glossary updates never happen.
- **Challenge against the glossary as you go.** "The glossary defines cancellation as voiding the whole order, but you seem to mean removing one line item. Which is it?" Naming divergence surfaces in conversation long before it surfaces in code.
- **Cross-reference with the code.** "The code cancels whole Orders, but you just said partial cancellation is possible." One of the two is wrong and finding out which is the point.
- **Proceed silently when it does not exist.** If the repo has no glossary and no decision records, do not flag their absence or propose scaffolding them upfront. Create the file when there is something to write in it.
- **A missing term is a signal.** If the concept you need is not in the glossary, either you are inventing language the project does not use, or there is a real gap. Both are worth a sentence; neither is worth inventing vocabulary over.

## Multi-context repos

Where the repo spans several contexts (billing, catalog, identity), each gets its own glossary and the root gets a map: the list of contexts, and their relationships named by the events that cross between them.

```markdown
## Relationships

- Ordering to Fulfillment: emits `OrderPlaced`
- Billing to Ordering: emits `PaymentCaptured`, `PaymentFailed`
```

The relationship list is the thing worth maintaining. Two contexts with no named event between them are either independent or coupled through something nobody has admitted to.

## When a decision is worth recording

Offer a decision record only when all three hold:

1. **Hard to reverse.** If it is cheap to undo, skip it; you will just undo it.
2. **Surprising without context.** If the choice is obvious, nobody will wonder why.
3. **The result of a real trade-off.** If there was no viable alternative, there is nothing to record beyond "we did the obvious thing".

The categories that pass most often: deliberate deviations from the obvious path (these stop the next engineer from "fixing" something intentional), constraints not visible in the code (a vendor limit, a contractual obligation, a migration deadline), and choices made under information that has since disappeared.

## Decision record format

```markdown
# Enum values are UPPER_SNAKE, response fields stay camelCase

Our first two API consumers both hand-wrote switch statements over enum values
and both got bitten by casing drift. UPPER_SNAKE makes enum values visually
distinct from fields at the call site. The inconsistency is deliberate.
```

A title and one to three sentences of context, decision, and why. That is the whole template.

Status, Considered Options, and Consequences are optional and most records will not need them. Add Considered Options only when a rejected alternative is likely to be proposed again; the value of the record is that a decision was made and why, not the completeness of the form.

Number them (`docs/adr/0007-enum-casing.md`) so they can be cited, and never edit one to reflect a new decision. Write a new record that supersedes it; the old reasoning is the record's whole point.

## Anti-patterns

- A glossary entry with no `_Avoid_` list, when synonyms are in active use. The entry documents the winner without retiring the losers, so both keep appearing.
- Inventing domain terms the team does not use. Recover the language from the code and the conversation; a glossary that reads as an outsider's vocabulary gets ignored.
- A decision record written as a template with every section filled in. The length signals importance the decision does not have, and nobody reads the third one.
- Editing an existing record when the decision changes. Supersede it instead; a record rewritten to match the present cannot explain the past.
