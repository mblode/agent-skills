# UI State Copy

Read when naming actions, writing destructive CTAs, or writing error, empty, and loading copy. This is product-state copy, not marketing copy: the words a user reads while doing a task, where clarity about object, scope, and consequence matters more than persuasion.

This file defines stable rule IDs that the `product-design` skill cites when it routes naming and state decisions here. Keep the IDs exactly as written.

## Contents

- Destructive CTAs and action labels
- Canonical product verbs
- Error-state copy
- Empty-state copy
- Loading-state copy
- Rule IDs

## Destructive CTAs and action labels

### rule/destructive-names-action

Destructive and primary CTAs use Verb plus Noun naming the exact object. The button says what it does.

| Bad | Good |
|-----|------|
| `Confirm` | `Delete project` |
| `OK` | `Remove member` |
| `Yes` | `Discard changes` |
| `Delete` (bare) | `Delete 3 files` |
| `Submit` (on a destructive action) | `Cancel subscription` |

A label that does not name the object forces the user to reconstruct the consequence from surrounding text, which they often skip.

### rule/no-confirm-ok-labels

Never label a destructive or consequential action `Confirm`, `OK`, `Yes`, or a bare verb. These hide what happens. The exception is a purely informational dialog with a single dismiss action and no consequence, where `Got it` or `Close` is fine.

## Canonical product verbs

### rule/canonical-verb

Use one verb per operation, consistently across the product. Do not call the same operation "Delete" on one screen and "Remove" on another. The verb carries the consequence, so the wrong verb misleads.

| Verb | Means | Reversible | Not |
|------|-------|------------|-----|
| Create | Make a new object | n/a | Add |
| Add | Attach an existing object to something | usually | Create |
| Delete | Permanently destroy the object | no | Remove |
| Remove | Detach without destroying | yes | Delete |
| Archive | Reversibly hide from the default view | yes | Delete |
| Save | Persist current edits | n/a | Apply |
| Apply | Commit a configuration that takes effect | varies | Save |
| Cancel | Abandon an in-progress action | n/a | Discard |
| Discard | Drop unsaved edits | no | Cancel |
| Duplicate | Copy the object | n/a | Clone |
| Move | Relocate without copying | yes | Transfer |

When two verbs both fit, pick the one whose consequence matches the action, then use it everywhere for that action.

## Error-state copy

### rule/error-states-recovery

An error states three things: what happened, why when known, and the recovery action. It never shows raw exception or stack text, and never a bare "Something went wrong" with no next step.

| Bad | Good |
|-----|------|
| `Something went wrong` | `Could not save your changes. Check your connection and try again.` |
| `Error 500` | `The server could not process this request. Try again in a moment.` |
| `Invalid input` | `Enter an email address, like name@example.com.` |
| `TypeError: cannot read property 'id' of undefined` | `We could not load this project. Refresh to try again.` |

Separate field-level errors (fix this input, shown inline) from surface-level errors (the action failed, shown near the action). Preserve everything the user typed; never clear the form on a failed submit.

## Empty-state copy

### rule/empty-state-action

An empty state names the object and offers the first action. No dead ends. Distinguish never-had-any (guide the first step) from filtered-to-zero (offer to clear the filter).

| Bad | Good |
|-----|------|
| `No data` | `No projects yet. Create your first project to get started.` (with a Create action) |
| `Nothing here` | `No members match "designer". Clear the filter to see all members.` |
| `Empty` | `No invoices yet. They appear here after your first payment.` |

An empty state is often a first impression. Treat it as onboarding, not as an error.

## Loading-state copy

### rule/loading-state-specific

Prefer specific loading copy over a bare "Loading..." when the target is known. Say what is loading, and for long operations, roughly how long.

| Bad | Good |
|-----|------|
| `Loading...` | `Loading your projects...` |
| `Please wait` | `Importing 1,240 rows. This takes about a minute.` |
| `...` | `Deploying. Usually under 30 seconds.` |

Keep the triggering control's label stable while it is busy; use its loading affordance rather than swapping the text, so the layout does not jump and the user can still see which action is in flight.

## Rule IDs

These IDs are shared vocabulary with `product-design`, which cites them when routing naming and state decisions here:

- `rule/destructive-names-action`
- `rule/no-confirm-ok-labels`
- `rule/canonical-verb`
- `rule/error-states-recovery`
- `rule/empty-state-action`
- `rule/loading-state-specific`

Flag violations of these in edit mode with the `[STATE-COPY]` label.