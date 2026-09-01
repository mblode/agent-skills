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
- Sources

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

A destructive or consequential action is never labeled `Confirm`, `OK`, `Yes`, or a bare verb; these hide what happens. Two exceptions, both from the platform guides (Apple HIG, Polaris, Material): a purely informational dialog with one dismiss action and no consequence, where `Got it` or `Close` is fine; and the common actions `Save`, `Cancel`, and `Close`, which every user already knows and which take no object. `Cancel` always means "abandon this dialog and change nothing", so a destructive dialog reads `Delete project` / `Cancel`, never `Yes` / `No`.

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

Separate field-level errors (fix this input, shown inline) from surface-level errors (action failed, shown near the action). Preserve everything the user typed; a form that clears on a failed submit turns one error into a restart.

Tone follows NN/g's error guidelines: describe the problem precisely rather than generically, offer the remedy in the same message, and drop the blaming vocabulary ("invalid", "illegal", "you failed to"). "Enter a date after today" says what to do; "Invalid date" says the user got it wrong and leaves them guessing how.

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
| `Loading...` | `Loading your projects…` |
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

Ask in context, when the feature is first used, not at launch. NN/g's permission-request research found users markedly more likely to grant a permission when given a reason, so the benefit line is not decoration. Put the benefit on a pre-permission screen you control when the system dialog cannot carry it, and give the decline option honest wording: a "No, I don't want to save money" opt-out is confirmshaming, a deceptive pattern that costs trust on every later ask.

## Copy without the screen

### rule/reads-without-seeing

Copy must work when heard, not seen.

- A field error reads sensibly after its label: screen readers announce "Email address, must include @", so `Must include @` works and `Invalid` does not.
- Link and button text names the destination or action: `View pricing`, not `Click here` or a bare `Learn more`. Screen-reader users pull up a list of the page's links out of context; twelve links reading "Learn more" are twelve identical choices.
- No directional words ("above", "below", "here"): position changes across screen sizes and means nothing read aloud. Name the place instead ("in Settings", "on the previous step").

## Length budgets

Ceilings for UI strings. Size copy for the tightest surface (usually mobile) first.

| String | Budget |
|--------|--------|
| Button or CTA label | 2 to 4 words (Apple's alert buttons: 1 or 2) |
| Title | 3 to 6 words |
| Error message | 12 to 18 words, including the recovery step |
| Any sentence the user must act on | Under 25 words (GOV.UK's split threshold); aim nearer 14, the average sentence length at which readers in the American Press Institute newspaper study still understood over 90% |

Leave 30 to 40% width headroom for translation of running text; German and French average that much longer than English. Short strings expand far more, and inversely with length: per the W3C's cited IBM figures, English strings under 10 characters grow 200 to 300% in translation and 11 to 20 characters grow 180 to 200%. A 1-word English button can become a 3-word German compound, so let buttons and tab labels wrap rather than sizing them to the English.

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

## Sources

The rules above consolidate the platform content guides, which agree on verb-plus-object labels, sentence case, and benefit-first permission asks:

- NN/g, *Error-Message Guidelines* (2023): https://www.nngroup.com/articles/error-message-guidelines/
- NN/g, *"Get Started" Stops Users*: https://www.nngroup.com/articles/get-started/
- NN/g, *Designing Empty States in Complex Applications*: https://www.nngroup.com/articles/empty-state-interface-design/
- NN/g, *3 Design Considerations for Effective Mobile-App Permission Requests*: https://www.nngroup.com/articles/permission-requests/
- Apple Human Interface Guidelines, *Alerts* and *Writing*: https://developer.apple.com/design/human-interface-guidelines/alerts
- Shopify content guidelines (Polaris moved here): https://shopify.dev/docs/apps/design/content
- Atlassian Design System, *Writing guidelines*: https://atlassian.design/content/writing-guidelines/
- GOV.UK style guide A to Z (sentence case, 25-word check, words to avoid): https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/
- Deceptive Patterns, *Confirmshaming*: https://deceptive.design/types/confirmshaming/
