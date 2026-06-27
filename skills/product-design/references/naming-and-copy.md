# Naming and Copy

Load in `copy` mode and whenever an action needs a name. This file owns the product decision of what an action is and what it must communicate. It does not own the wording craft: persuasion, tone, AI-ism removal, and the full state-copy rules live in `copywriting`. Decide here; route the wording there.

## The split with copywriting

- `product-design` decides: which action exists, its object, its scope, and its consequence. Whether a destructive action needs naming at all, and what it affects.
- `copywriting` writes: the exact words, the canonical verb, the error and empty and loading strings. The shared rule IDs (`rule/destructive-names-action`, `rule/canonical-verb`, `rule/error-states-recovery`, `rule/empty-state-action`, `rule/loading-state-specific`) are defined in `copywriting/references/ui-states.md` and cited from here.

When a request is "name this action" with a settled product decision, you can name it inline using the rules below. When it expands into rewriting many strings, tone, or persuasion, route to `copywriting`.

## Object, scope, consequence

Before naming an action, identify three things (`rule/name-object-scope-consequence`):

- Object: the exact product noun. Not "this", but "the project", "3 members", "your API key".
- Scope: how many, and whose. Deleting one item versus all items versus a shared team resource are different actions and read differently.
- Consequence: reversible or permanent, and who is affected. A reversible archive and a permanent delete must not look the same.

The label, the surrounding copy, and the friction together must make all three legible before the user commits.

## Naming actions

- Destructive and primary CTAs use Verb plus Noun naming the object: `Delete project`, `Remove member`, `Discard changes` (`rule/destructive-names-action`).
- Never `Confirm`, `OK`, `Yes`, `Submit`, or a bare verb on a destructive action. These hide what happens (`rule/no-confirm-ok-labels`, defined in `copywriting`).
- Use the canonical verb for the operation and keep it consistent across the product (`rule/canonical-verb`). Do not call the same operation "Delete" in one place and "Remove" in another.
- The verb pairs with the consequence: `Delete` implies permanent, `Remove` implies detach, `Archive` implies recoverable, `Cancel` abandons an in-progress action, `Discard` drops unsaved edits.

## Disambiguation pairs

Common verbs that get confused. Keep them distinct (full vocabulary in `copywriting/references/ui-states.md`):

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

For full state-copy rules, route to `copywriting/references/ui-states.md`. The product-level expectations:

- Error: what happened, why when known, the recovery action. No raw exceptions (`rule/error-states-recovery`).
- Empty: name the object, offer the first action, no dead ends (`rule/empty-state-action`).
- Loading: specific over "Loading..." when the target is known (`rule/loading-state-specific`).

## When to route to copywriting

Hand off when the work is about words rather than the action decision:

- Rewriting multiple strings for tone or voice.
- Persuasion, hero copy, CTAs on marketing surfaces.
- Removing AI-isms or running the copy sweeps.
- Choosing between two acceptable phrasings on style grounds.

Keep here only the decision of what the action is and what it must say to be honest about object, scope, and consequence.
