# UI State Copy

Read when naming actions or writing destructive CTAs, errors, empty, or loading copy. Product-state copy, not marketing: words a user reads while doing a task, where clarity about object, scope, and consequence beats persuasion.

Defines stable rule IDs that `product-design` cites when routing naming and state decisions here. Keep IDs exactly as written.

## Contents

- Destructive CTAs and action labels
- Canonical product verbs
- Error-state copy
- Empty-state copy
- Loading-state copy
- Rule IDs

## Destructive CTAs and action labels

### rule/destructive-names-action

Destructive and primary CTAs use Verb plus Noun naming the exact object, so the button says what it does.

| Bad | Good |
|-----|------|
| `Confirm` | `Delete project` |
| `OK` | `Remove member` |
| `Yes` | `Discard changes` |
| `Delete` (bare) | `Delete 3 files` |
| `Submit` (on a destructive action) | `Cancel subscription` |

A label that omits the object forces users to reconstruct the consequence from surrounding text they often skip.

### rule/no-confirm-ok-labels

Never label a destructive or consequential action `Confirm`, `OK`, `Yes`, or a bare verb; these hide what happens. Exception: a purely informational dialog with one dismiss action and no consequence, where `Got it` or `Close` is fine.

## Canonical product verbs

### rule/canonical-verb

One verb per operation, used consistently. Don't call the same operation "Delete" on one screen and "Remove" on another. The verb carries the consequence, so the wrong verb misleads.

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

When two verbs fit, pick the one whose consequence matches, then use it everywhere for that action.

## Error-state copy

### rule/error-states-recovery

An error states three things: what happened, why (when known), and the recovery action. Never show raw exception or stack text, never a bare "Something went wrong" with no next step.

| Bad | Good |
|-----|------|
| `Something went wrong` | `Could not save your changes. Check your connection and try again.` |
| `Error 500` | `The server could not process this request. Try again in a moment.` |
| `Invalid input` | `Enter an email address, like name@example.com.` |
| `TypeError: cannot read property 'id' of undefined` | `We could not load this project. Refresh to try again.` |

Separate field-level errors (fix this input, shown inline) from surface-level errors (action failed, shown near the action). Preserve everything the user typed; never clear the form on a failed submit.

## Empty-state copy

### rule/empty-state-action

Name the object and offer the first action. No dead ends. Distinguish never-had-any (guide the first step) from filtered-to-zero (clear the filter).

| Bad | Good |
|-----|------|
| `No data` | `No projects yet. Create your first project to get started.` (with a Create action) |
| `Nothing here` | `No members match "designer". Clear the filter to see all members.` |
| `Empty` | `No invoices yet. They appear here after your first payment.` |

Often a first impression. Treat it as onboarding, not an error.

## Loading-state copy

### rule/loading-state-specific

Prefer specific copy over bare "Loading..." when the target is known. Say what loads, and for long operations, roughly how long.

| Bad | Good |
|-----|------|
| `Loading...` | `Loading your projects...` |
| `Please wait` | `Importing 1,240 rows. This takes about a minute.` |
| `...` | `Deploying. Usually under 30 seconds.` |

Keep the triggering control's label stable while busy; use its loading affordance instead of swapping text, so the layout doesn't jump and the user still sees which action is in flight.

## Rule IDs

Shared vocabulary with `product-design`, which cites them when routing naming and state decisions here:

- `rule/destructive-names-action`
- `rule/no-confirm-ok-labels`
- `rule/canonical-verb`
- `rule/error-states-recovery`
- `rule/empty-state-action`
- `rule/loading-state-specific`

Flag violations of these in edit mode with the `[STATE-COPY]` label.
