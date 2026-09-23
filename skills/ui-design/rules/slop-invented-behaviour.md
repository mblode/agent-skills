---
title: Product behaviour the brief never stated
id: slop-invented-behaviour
category: slop
defaultTier: fix-this-sprint
detect: static
related: slop-unverifiable-proof, slop-fact-padding, slop-faux-product-chrome
---

## Product behaviour the brief never stated

The brief said the product keeps both versions when offline edits conflict, and the settings screen offers "Keep both versions" or "Ask me". The brief said LAN first with an encrypted relay fallback, and the screen offers "Relay only". Neither mode exists, and one contradicts the fact it sits beside. A user who reads a setting believes the product can do it; a stakeholder who reviews the screen assumes someone decided it. The same goes for an app sidebar with Overview and Files pages nobody specified, a "contact your administrator" line for a product with no admin role, and "most sync tools pick a winner" about competitors nobody researched. Each is a claim about the product or the market, invented to fill a layout, and it ships as a commitment.

`slop-unverifiable-proof` owns invented numbers, logos, and testimonials. This rule owns invented capability: settings, modes, roles, integrations, navigation, and comparisons.

## Precondition: this rule requires the brief

The finding is "not in the source of truth", so it needs one: the prompt, the PRD, product docs, or the existing app. Without any of them, report **result unknown** and list the candidate claims for a human to confirm. Never report a capability as invented because it seems unlikely.

## Detection

Three candidate sources, each read against the brief.

```bash
# 1. Choice sets: every option a user can pick, and the union types behind them
rg -nUP '<input\b[^>]*\btype="(radio|checkbox)"|role="(switch|radio|checkbox)"|<select\b' -g '*.tsx' -g '*.jsx' src/
rg -nP '\btype \w*(Mode|Role|Policy|Strategy|Level|Plan|Tier)\w* = ' -g '*.tsx' -g '*.ts' src/

# 2. Claims about roles, integrations, and competitors
rg -niP "\b(most|other|traditional|legacy) (sync )?(tools|apps|services|products)\b|\bunlike\b|\bcompetitors?\b|\badmin(istrator)?s?\b|\b(SSO|SAML|SCIM|audit log|webhook)s?\b|\b(Slack|Zapier|Dropbox|Google Drive|OneDrive|iCloud)\b" -g '*.tsx' -g '*.jsx' src/

# 3. App shell around a single requested screen
rg -nP '<(aside|nav)\b' -g '*settings*.tsx' -g '*Settings*.tsx' src/
```

For signal 1, list each option label and check it against the brief: an option the brief did not state is a candidate, and an option that contradicts a stated fact is confirmed. For signal 3, read the nav items; a sidebar of destinations that were not requested is confirmed when none of them route anywhere real.

## False positives

- **The existing app.** When the screen is added to a real product, its sidebar, roles, and settings already exist; read them from the codebase before reporting. The rule fires on new surfaces that invent structure, not on ones that inherit it.
- **Standard controls implied by the feature.** Choosing the synced folder, pausing sync, and signing out follow from "desktop folder sync" without being listed. The test is whether a reasonable reader of the brief would expect the control, not whether the word appears in it.
- **Competitor claims with a source.** A comparison page that names the tool and links its docs is research, not invention.

## Fix

Render only what the brief states, and ask about the rest.

```tsx
// before: two modes, one contradicting the brief
<Radio value="keep-both">Keep both versions</Radio>
<Radio value="ask">Ask me</Radio>

// after: the fixed behaviour, stated as fact
<p>When two people edit the same file offline, Northwind keeps both versions side by side.</p>
```

Where a real choice probably exists but was not specified, leave it out and list it as an open question in the hand-off. A missing setting is easy to add; a shipped one is a promise.

## Why this needs a rule

A settings page with no settings looks unfinished, so a model supplies plausible ones, and plausible is exactly what makes them hard to spot: every invented option reads like a product decision that someone else made.

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Settings, onboarding, or any control the user can change | fix-this-sprint |
| Marketing page capability or competitor claim | fix-this-sprint |
| Prototype or design exploration explicitly scoped as speculative | backlog |

Never a release blocker on its own, but an option that contradicts a stated fact should not survive review.

## Suppression

```tsx
{/* ui-audit-ignore:slop-invented-behaviour, relay-only mode is in PRD-142 */}
```
