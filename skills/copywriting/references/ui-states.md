# UI State Copy

Read when naming actions or writing destructive CTAs, error, success, empty, loading, or permission copy. Product-state copy, not marketing: words a user reads while doing a task, where clarity about object, scope, and consequence beats persuasion.

Defines stable rule IDs that `product-design` cites when routing naming and state decisions here. Keep IDs exactly as written.

## Contents

- Destructive CTAs and action labels
- Canonical product verbs
- Error-state copy
- Success-state copy
- Empty-state copy
- Loading-state copy
- Permission-request copy
- Copy without the screen
- Length budgets
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

## Success-state copy

### rule/success-state-specific

Confirm in past tense what happened to which object, proportional to the action. Add follow-on information only when it changes what the user does next.

| Bad | Good |
|-----|------|
| `Success!` | `Changes saved` |
| `Awesome! 🎉` | `Invite sent to jane@acme.com` |
| `Operation completed successfully` | `Project archived. Find it under Archived.` |

Match weight to stakes: a routine save earns two words; a milestone can carry one sentence about what happens next.

## Empty-state copy

### rule/empty-state-action

Name the object and offer the first action. No dead ends. Three types: never-had-any (guide the first step), filtered-to-zero (clear the filter), and user-cleared (confirm completion and say when new content appears; the one empty state that needs no CTA).

| Bad | Good |
|-----|------|
| `No data` | `No projects yet. Create your first project to get started.` (with a Create action) |
| `Nothing here` | `No members match "designer". Clear the filter to see all members.` |
| `Empty` | `No invoices yet. They appear here after your first payment.` |
| `No tasks` | `You're all caught up. New tasks appear here when they're assigned to you.` |

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

## Permission-request copy

### rule/permission-benefit-first

State the user benefit before the permission ask; never lead with the system need. Pattern: benefit, then permission.

| Bad | Good |
|-----|------|
| `Allow notifications?` | `Get notified when orders ship. Enable notifications.` |
| `This app requires location access` | `Find stores near you. Allow location access.` |
| `Grant storage permission` | `Back up your photos. Grant storage access.` |

Ask in context, when the feature is first used, not at launch.

## Copy without the screen

### rule/reads-without-seeing

Copy must work when heard, not seen.

- A field error reads sensibly after its label: screen readers announce "Email address, must include @", so `Must include @` works and `Invalid` does not.
- Link and button text names the destination or action: `View pricing`, never `Click here` or a bare `Learn more`.
- No directional words ("above", "below", "here"): position changes across screen sizes and means nothing read aloud. Name the place instead ("in Settings", "on the previous step").

## Length budgets

Ceilings for UI strings. Size copy for the tightest surface (usually mobile) first.

| String | Budget |
|--------|--------|
| Button or CTA label | 2 to 4 words |
| Title | 3 to 6 words |
| Error message | 12 to 18 words, including the recovery step |
| Any sentence the user must act on | 14 words (90% comprehension); 8 words reads at full comprehension |

Leave 30 to 40% width headroom for translation; German and French run that much longer than English.

## Rule IDs

Shared vocabulary with `product-design`, which cites them when routing naming and state decisions here:

- `rule/destructive-names-action`
- `rule/no-confirm-ok-labels`
- `rule/canonical-verb`
- `rule/error-states-recovery`
- `rule/success-state-specific`
- `rule/empty-state-action`
- `rule/loading-state-specific`
- `rule/permission-benefit-first`
- `rule/reads-without-seeing`

Flag violations of these in edit mode with the `[STATE-COPY]` label.
