# Naming and Copy

Load in `action` mode and whenever an action's object, scope, consequence, or reversibility is unsettled. Owns the product decision of what the action is and what it must communicate, not wording craft: persuasion, tone, AI-ism removal, and the full state-copy rules live in `copywriting`. Decide here; route wording there.

## The split with copywriting

- `product-design` decides: whether the action should exist, which object it affects, its scope, its consequence, and whether it is reversible.
- `copywriting` writes: the exact strings, canonical verb, and error, success, empty, loading, and permission copy. The shared copy rule IDs are defined in that skill's `references/ui-states.md` and restated in this skill's `references/rules.md`; cite them from here.

When the decision is settled and the user needs one label, name it inline using the rules below. When the work expands into multiple strings, tone, or persuasion, route to `copywriting`.

## Object, scope, consequence

Before naming an action, identify three things (`rule/name-object-scope-consequence`):

- Object: the exact product noun. Not "this", but "the project", "3 members", "your API key".
- Scope: how many, and whose. Deleting one item, all items, or a shared team resource read as different actions.
- Consequence: reversible or permanent, and who is affected. Archive (reversible) and delete (permanent) must not look the same.

The label, surrounding copy, and friction together must make all three legible before the user commits.

## Naming actions

- Destructive and primary CTAs use Verb plus Noun naming the object: `Delete project`, `Remove member`, `Discard changes` (`rule/destructive-names-action`).
- Never `Confirm`, `OK`, `Yes`, `Submit`, or a bare verb on a destructive action; these hide what happens (`rule/no-confirm-ok-labels`, defined in `copywriting`).
- Use the canonical verb and keep it consistent across the product (`rule/canonical-verb`); don't call the same operation "Delete" here and "Remove" there.
- The verb pairs with the consequence: `Delete` implies permanent, `Remove` detach, `Archive` recoverable, `Cancel` abandons an in-progress action, `Discard` drops unsaved edits.

## Disambiguation pairs

Common verbs that get confused; keep them distinct (full vocabulary in the copywriting skill's `references/ui-states.md`):

| If the action | Use | Not |
|---------------|-----|-----|
| Permanently destroys the object | Delete | Remove |
| Detaches without destroying | Remove | Delete |
| Reversibly hides | Archive | Delete |
| Abandons an in-progress flow | Cancel | Discard |
| Drops unsaved edits | Discard | Cancel |
| Adds an existing thing | Add | Create |
| Makes a new thing | Create | Add |

## State copy at a glance

For full state-copy rules, route to the copywriting skill's `references/ui-states.md`. The product-level expectations:

- Error: what happened, why when known, the recovery action. No raw exceptions (`rule/error-states-recovery`).
- Success: past tense, names the object, weight proportional to the action (`rule/success-state-specific`).
- Empty: name the object, offer the first action, no dead ends (`rule/empty-state-action`).
- Loading: specific over "Loading..." when the target is known (`rule/loading-state-specific`).
- Permission: user benefit before the ask, in context of first use (`rule/permission-benefit-first`).

## When to route to copywriting

Hand off when the work is about words, not the action decision:

- Rewriting multiple strings for tone or voice.
- Persuasion, hero copy, CTAs on marketing surfaces.
- Removing AI-isms or running the copy sweeps.
- Choosing between two acceptable phrasings on style grounds.

Keep here only the decision of what the action is and what it must say to be honest about object, scope, and consequence.
