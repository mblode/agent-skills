# Ship Readiness: Three-Tier Verdict

Every finding gets exactly one tier, deciding whether the PR ships, waits, or merges with follow-up.

The audit fixes what it can in the same pass, so tier and verdict answer different questions. Tier is a property of the finding and never changes when a fix lands: a payment-data-loss bug is a release-blocker whether or not the audit repaired it. The verdict is a property of the working tree at the end of the run, so it counts only what remains.

## Table of contents

- [The three tiers](#the-three-tiers)
- [Tier assignment rules](#tier-assignment-rules)
- [Verdict logic](#verdict-logic)
- [Anti-patterns](#anti-patterns)
- [Examples](#examples)

## The three tiers

### ⛔ release-blocker: fix before merge

These cause user-visible harm or data loss in production. Fix them in the pass if the fix lands inside the audited files. If it doesn't, the finding stays remaining, and the PR does not ship until a human resolves it.

Tier triggers:
- **Data loss**: user input destroyed by code (form clears on validation error, optimistic update without rollback on server reject)
- **Broken critical path**: sign-in, checkout, payment, or auth flows failing silently or blocking the user
- **Missing critical-path error state**: async fetch on the primary goal with no error UI
- **Broken focus management**: focus trap that doesn't restore (keyboard users locked out)
- **Dark patterns**: confirmshaming, hidden cancel, pre-checked upsells, fake urgency
- **Hydration mismatch on the primary route**: SSR/CSR diff causing layout flash
- **Race condition to inconsistent state**: out-of-order responses, double-submit creating duplicates

Examples per playbook:
- Sign-in: password manager autofill broken; form re-renders during auth
- Checkout: card field loses CVC on shipping-address validation; "Place order" enables before payment confirmation
- Modal: Esc-to-close doesn't restore focus to trigger
- Form: 422 response ignored, user sees no field-level errors
- Loading: blocking spinner without escape hatch (no cancel after 10 s)

### ⚠️ fix-this-sprint: merge but log issue

Degrade UX but don't block shipping. Fix in the pass where the change is mechanical and in scope. Whatever remains gets a tracking issue before merge, resolved within the sprint.

Tier triggers:
- Sub-44 px tap target on touch surface
- Loading placeholder that does not reserve height (causes CLS)
- Vague error message ("Invalid", "Error occurred")
- Missing empty-state CTA (stalls the user)
- 422 response shown as a generic error toast instead of inline field errors

Examples:
- Form submit shows "Error" toast instead of "Email already in use: sign in or reset password"
- Empty inbox shows "No messages" with no compose CTA
- Loading the dashboard shows a centered spinner with no reserved height, so widgets jump in

### 📋 backlog: track, ship

Real but low-stakes. Ship, log a backlog issue, prioritize by frequency or impact later. Apply a backlog fix only when it is a one-line change in a file already being edited; otherwise leave it and log it. Backlog nits are not worth widening the diff.

Tier triggers:
- Dark mode untested (works but may have contrast issues)
- RTL not verified
- Touch-vs-pointer affordances slightly misaligned (hover hint visible on touch device but doesn't break function)
- Container queries not used where they would help
- 1px / spacing-token nits

## Tier assignment rules

When a rule's default tier conflicts with surface context, use the higher tier:

| Surface context | Default tier upgrades to |
|---|---|
| Sign-in / sign-up | Bump 1 tier (sprint → blocker; backlog → sprint) |
| Checkout / payment | Bump 1 tier: money flows are unforgiving |
| Account deletion / data export | Bump 1 tier: destructive |
| Authenticated app shell | Same |
| Marketing landing page | Down 1 tier (blocker → sprint; sprint → backlog): usually no data on the line |
| Internal admin tool | Down 1 tier: different audience tolerance |

## Verdict logic

Aggregate the tiers of the findings still present at the end of the run. Findings the audit fixed in the pass do not count toward the verdict; findings it could not fix, including ones whose fix falls outside the audited files, do.

| Verdict | Condition |
|---|---|
| ✅ READY | 0 remaining release-blockers AND ≤3 remaining fix-this-sprint |
| ⚠️ READY WITH FOLLOW-UP | 0 remaining release-blockers AND ≥4 remaining fix-this-sprint |
| ❌ NOT READY | ≥1 remaining release-blocker |
| 🚫 INCOMPLETE | Audit-self-check failed; re-run |

Verdict shows in the summary block atop every audit report, under the found / applied / remaining counts, so a reader can see both what the code arrived as and what it ships as.

## Anti-patterns

- ❌ **Tier inflation**: marking every finding `release-blocker`. Kills signal; reserve it for genuine ship-blockers.
- ❌ **Tier deflation**: dumping everything to `backlog` for a greener verdict. Catches up at the next prod incident.
- ❌ **Tier per rule, not per finding**: a default tier is a starting point; surface context bumps it up or down.
- ❌ **Skipping the override step**: justify every tier in the output ("release-blocker because checkout flow"). Never render bare tiers.
- ❌ **Fixing quietly to reach green**: an applied fix that isn't reported is indistinguishable from a missed finding. Every fix names the file, the lines, and the edit, so the verdict can be walked against the diff.
- ❌ **Downgrading a tier because the fix was hard**: an out-of-scope release-blocker is still a release-blocker, and the verdict stays ❌ NOT READY until a human decides on the shared component.

## Examples

Two tier assignments worth stating, both about the bump rules above rather than about JSON shape:

- A `forms-lost-data-on-error` finding on a checkout surface bumps to release-blocker, and being fixed in the same pass does not lower it. It counts as a found release-blocker and an applied one, and the verdict reads `remaining`, so it does not hold the ship.
- A `dark-i18n-untested` finding on an internal admin surface bumps down to backlog. Four of those do not make a `READY_WITH_FOLLOW_UP`, because that threshold counts remaining fix-this-sprint findings, not backlog ones.

The emitted object's shape, including every field these two would show, is owned by `references/output-adapters.md`. It is not repeated here: two files describing one JSON shape is how the two drift apart.
