---
title: The same few facts restated to fill the page
id: slop-fact-padding
category: slop
defaultTier: backlog
detect: static
related: slop-unverifiable-proof, slop-invented-behaviour
---

## The same few facts restated to fill the page

The brief had five facts and the page has eleven sections, so the facts go round again: "keeps both versions side by side" appears in the hero, a feature card, its own section, the pricing checklist, and the FAQ; "14-day free trial" and "no card required" sit under every button. The visitor reads the claim once, then keeps meeting it dressed as something new (a stat block, a card, a question nobody asked), and each repeat makes the page feel longer and the product thinner. By the fourth mention they skim, and they skim past the one section that said something new.

Repeating the trial terms beside the final CTA is normal. The failure is structure built out of repetition: sections, cards, and FAQ entries whose only content is a fact already stated above.

## Detection

Count restatements per file. First the stock SaaS facts, normalised so "14 days" and "14-day" count together:

```bash
rg -oiP '\b\d+[- ]days?\b|\bno (credit )?card\b|\bcancel any ?time\b|\$\d+(\.\d\d)?(?= ?(/|per|a) ?(seat|user|member|month))' -g '*.tsx' -g '*.jsx' src/ \
  | awk -F: -v OFS=: '{ $NF = tolower($NF); sub(/[- ]days?$/, "-day", $NF); sub(/no credit card/, "no card", $NF) } 1' \
  | sort | uniq -c | awk '$1 > 3'
```

Then each fact from the brief or product docs, one short phrase at a time:

```bash
FACT='both versions|keeps? both|side by side'
rg -oiP "$FACT" -g '*.tsx' -g '*.jsx' src/ | cut -d: -f1 | sort | uniq -c | awk '$1 > 3'
```

A count above three on one page opens a candidate. Confirm by reading where each mention sits: the finding is a section, card, stat, or FAQ answer that adds no new information to a fact the page already stated.

## False positives

- **Mockup copy.** A product preview that shows the feature working ("Back online: both versions, side by side") demonstrates the claim rather than restating it. Do not count it.
- **The CTA's own terms.** "14-day trial, no card" beside each primary button is reassurance at the moment of decision, and one per CTA is fine. The finding is the count of CTAs, which `SKILL.md`'s Deslop scope already deletes as repeated CTA blocks.
- **Long pages with real depth**, where each mention of a fact adds a detail (how the relay is encrypted, where both versions are saved), are explaining, not padding.

## Fix

Say each fact once, where it answers the reader's question, and let the page be as long as the facts are.

```tsx
// before: a feature card, a section, and an FAQ entry that are one sentence
<Feature title="Both versions, never one lost" body="Northwind keeps both versions side by side." />
<Section title="Worked on the same file offline? Keep both." />
<Faq q="What happens with conflicts?" a="Northwind keeps both versions side by side." />

// after: one section, with the detail the others lacked
<Section title="Offline edits to the same file are both kept">
  Each version is saved next to the original with the editor's name, so you can compare and merge.
</Section>
```

When there is not enough to say, cut sections. A three-section page that states five facts once reads as confident; an eleven-section page that states them three times reads as filler.

## Why this needs a rule

Asked for a full landing page from a short brief, a model fills every conventional section (features, how it works, stats, FAQ) and has only the brief to fill them with, so the same facts are rephrased until the template is full.

## Suppression

```tsx
{/* ui-audit-ignore:slop-fact-padding, the trial terms are required beside each CTA by legal */}
```
