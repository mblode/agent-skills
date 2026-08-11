# Ship Readiness: Three-Tier Verdict

Every finding gets exactly one tier, deciding whether the PR ships, waits, or merges with follow-up.

## Table of contents

- [The three tiers](#the-three-tiers)
- [Tier assignment rules](#tier-assignment-rules)
- [Verdict logic](#verdict-logic)
- [Anti-patterns](#anti-patterns)
- [Examples](#examples)

## The three tiers

### ⛔ release-blocker: fix before merge

Fix before merge. These cause user-visible harm or data loss in production.

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

Degrade UX but don't block shipping. Create a tracking issue before merge, resolve within the sprint.

Tier triggers:
- Sub-44 px tap target on touch surface (Fitts's violation, not data-loss)
- Missing skeleton on async state (causes CLS)
- Vague error message ("Invalid", "Error occurred")
- Missing empty-state CTA (stalls the user)
- Generic loading copy ("Loading...") instead of context-specific
- Sub-7 plan/option count violations on pricing pages without recommended flag
- Single primary CTA per surface violated (Von Restorff cancellation)
- Toast disappears too quickly to read (< 5 s for ≥ 1 sentence)
- 422 response shown as a generic error toast instead of inline field errors

Examples:
- Form submit shows "Error" toast instead of "Email already in use: sign in or reset password"
- Empty inbox shows "No messages" with no compose CTA
- Loading the dashboard shows a centered spinner; no skeleton matching the dashboard layout

### 📋 backlog: track, ship

Real but low-stakes. Ship, log a backlog issue, prioritize by frequency or impact later.

Tier triggers:
- Dark mode untested (works but may have contrast issues)
- RTL not verified
- Microcopy nits ("Submit" instead of "Save changes": both work)
- Touch-vs-pointer affordances slightly misaligned (hover hint visible on touch device but doesn't break function)
- Container queries not used where they would help
- 1px / spacing-token nits
- Score-3 findings on the Layer 4 rubric rules (`cognitive-working-memory`, `perception-pragnanz`)

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

Aggregate per-finding tiers into a top-level verdict:

| Verdict | Condition |
|---|---|
| ✅ READY | 0 release-blockers AND ≤3 fix-this-sprint |
| ⚠️ READY WITH FOLLOW-UP | 0 release-blockers AND ≥4 fix-this-sprint |
| ❌ NOT READY | ≥1 release-blocker |
| 🚫 INCOMPLETE | Audit-self-check failed; re-run |

Verdict shows in the summary block atop every audit report.

## Anti-patterns

- ❌ **Tier inflation**: marking every finding `release-blocker`. Kills signal; reserve it for genuine ship-blockers.
- ❌ **Tier deflation**: dumping everything to `backlog` for a greener verdict. Catches up at the next prod incident.
- ❌ **Tier per rule, not per finding**: a default tier is a starting point; surface context bumps it up or down.
- ❌ **Skipping the override step**: justify every tier in the output ("release-blocker because checkout flow"). Never render bare tiers.

## Examples

```json
{
  "rule": "forms-lost-data-on-error",
  "surface": "CheckoutForm",
  "defaultTier": "fix-this-sprint",
  "assignedTier": "release-blocker",
  "tierReason": "Surface is checkout; data loss on payment-fields validation is a money-flow blocker."
}
```

```json
{
  "rule": "interaction-fittss-law",
  "surface": "MarketingHero",
  "defaultTier": "fix-this-sprint",
  "assignedTier": "backlog",
  "tierReason": "Surface is marketing landing; sub-44 px CTA hurts mobile conversion but not data integrity."
}
```
