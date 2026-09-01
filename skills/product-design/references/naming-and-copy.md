# Naming and Consequence

Load in `action` and `spec` modes, and whenever an action's object, scope, consequence, or reversibility is unsettled. Owns the product decision of what the action is and what it must communicate. Wording craft (persuasion, tone, AI-ism removal, the full state-copy rules, the canonical verb table) lives in `copywriting`. Decide here; route wording there.

## The split with copywriting

- `product-design` decides: whether the action should exist, which object it affects, its scope, its consequence, whether it is reversible, and which safeguard pattern that implies.
- `copywriting` writes: the exact strings, the canonical verb per operation, and error, success, empty, loading, and permission copy. Its `references/ui-states.md` defines the shared copy rule IDs, restated in this skill's `rules.md` so citations resolve.

When the decision is settled and the user needs one label, name it inline. When the work expands into multiple strings, tone, or persuasion, route to `copywriting`.

## Object, scope, consequence

Before naming an action, identify three things (`rule/name-object-scope-consequence`):

- Object: the exact product noun. Not "this", but "the project", "3 members", "your API key".
- Scope: how many, and whose. Deleting one item, all items, or a shared team resource are different actions and read differently.
- Consequence: reversible or permanent, and who else is affected. Archive (reversible) and delete (permanent) must not look the same.

Label, surrounding copy, and friction together make all three legible before the user commits. A bulk action states its count in the label ("Delete 3 files"), because the count is the scope.

## Reversibility decides the pattern

Settle reversibility first; the interaction pattern follows from it (`rule/destructive-proportional`, `rule/irreversible-action-safeguard`).

| The system can | Pattern | Not |
|----------------|---------|-----|
| Fully reverse it, and the object stays recoverable afterwards | Act immediately, offer undo, keep the object in Trash or Archive | A confirmation dialog |
| Reverse it only during a short window (undo send) | Act with a visible countdown and undo; the window is the mechanism | A dialog plus a toast |
| Not reverse it, single object, routine | One confirmation naming object and consequence, Verb plus Noun button | "Are you sure?" with OK |
| Not reverse it, wide scope or shared (a workspace, a repo, a team's data) | Review step or typed confirmation naming the object | A one-click red button |
| Not reverse it, and it commits money or legal terms | A check-answers page with change links, then a confirmation page with a reference and what happens next | Submit from the last form step |

An undo control appears only when the first two rows are true (`rule/undo-only-when-honest`). "Undo" that half-restores is worse than no undo.

## Naming actions

- Destructive and primary CTAs use Verb plus Noun naming the object: `Delete project`, `Remove member`, `Discard changes` (`rule/destructive-names-action`).
- No `Confirm`, `OK`, `Yes`, `Submit`, or bare verb on a consequential action (`rule/no-confirm-ok-labels`). `Cancel` always means "do nothing and close".
- One canonical verb per operation across the product (`rule/canonical-verb`). The verb carries the consequence: `Delete` permanent, `Remove` detach, `Archive` recoverable, `Cancel` abandon in-progress, `Discard` drop unsaved edits. The full verb table with reversibility per verb is in the copywriting skill's `references/ui-states.md`.

## State copy at a glance

Product-level expectations; strings are `copywriting`'s:

- Error: what happened, why when known, the recovery action; no raw exceptions (`rule/error-states-recovery`).
- Success: past tense, names the object, weight proportional to the action (`rule/success-state-specific`). A consequential submission's success also carries a reference and what happens next.
- Empty: name the object, offer the first action (`rule/empty-state-action`).
- Loading: specific over "Loading..." when the target is known (`rule/loading-state-specific`).
- Permission: user benefit before the ask, in context of first use (`rule/permission-benefit-first`).
- All of the above work when heard, not just seen (`rule/reads-without-seeing`).

## When to route to copywriting

Hand off when the work is about words, not the action decision: rewriting multiple strings for tone or voice; persuasion, hero copy, or marketing CTAs; removing AI-isms or running the copy sweeps; choosing between two acceptable phrasings on style grounds.
