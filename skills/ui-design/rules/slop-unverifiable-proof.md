---
title: Unverifiable proof standing in for real evidence
id: slop-unverifiable-proof
category: slop
defaultTier: backlog
detect: static
related: slop-faux-product-chrome
---

## Unverifiable proof standing in for real evidence

"99.9% uptime", "10,000+ teams", "3x faster", a testimonial from Jane Doe, CEO at Acme, and a strip of logos nobody has heard of. Every one of these is a claim about the world, and a visitor who cannot check any of them learns that this page's numbers are decoration. The damage is not aesthetic: it is that the true claims on the same page now read as invented too, and the one number you could have proven gets discounted with the rest. Shipping a placeholder testimonial to production is also a straightforward credibility risk, and in some jurisdictions an advertising one.

`direction/aesthetic-direction.md` treats invented proof as absolute rather than count-based, for exactly this reason: it misinforms rather than merely underwhelming.

## Precondition: this rule requires diff scope

**Read this before running anything.** A real company has real logos, real customer counts, and a real uptime number. `99.9%` on a mature marketing page is very likely true and audited. This rule cannot tell a true stat from an invented one by looking at the string.

So it fires only when the string is a **literal in JSX** and either:

1. it matches a **placeholder marker** (see below), which is decisive on its own, or
2. it was **introduced in the diff under audit**, meaning a claim about the world appeared without anyone having gathered evidence for it.

On a full-codebase sweep with no diff, report **result unknown** for the shape-based signals and report only placeholder-marker hits. Do not list a page's existing stats as findings.

## Detection

```bash
# Placeholder markers: decisive with or without a diff
rg -ni 'logoipsum|placehold\.|placeholder\.com|via\.placeholder|dummyimage|lorem ipsum' -g '*.tsx' -g '*.jsx' src/
rg -nP '/logo-[1-9]\.(png|svg|webp)|/(client|partner|customer)-[1-9]\.' -g '*.tsx' src/
rg -ni 'jane doe|john doe|john smith|acme (inc|corp|co\b)|example\.com|@example\.|CEO, Acme|Company Name' -g '*.tsx' src/

# Shape-based signals: diff scope only
git diff --unified=0 origin/main...HEAD -- '*.tsx' '*.jsx' \
  | rg '^\+' \
  | rg -v 'className|class=' \
  | rg -nP '\b\d{1,3}(\.\d+)?%|\b\d{1,3},\d{3}\+|\b\d+(\.\d+)?x (faster|cheaper|more)|\b\d+M\+|\b\d+k\+ '
```

The `className` filter matters: `size-[max(100%,3rem)]` and `w-1/2` are full of numbers and percentages that are not claims about the world. Any hit that survives still needs reading in context, since a percentage inside a `style` object or a chart config is data, not copy.

Every finding must carry `file:line` and the exact literal, so a human can answer one question: is this true, and who can confirm it?

## False positives

- **Anything that is not a string literal in JSX.** `{stats.customerCount}`, `{`${uptime}%`}`, `{t('hero.stat')}`, and values read from a CMS or a config file are data, and the data may well be correct. Never report a rendered expression. This exclusion is doing most of the work.
- **True stats are the normal case.** A funded company genuinely has 10,000 customers and genuinely publishes 99.9%. The round shape of a number is suspicious only when the number is brand new and nobody sourced it.
- **`Acme` and `example.com` are correct in docs, tests, and fixtures.** Documentation examples, Storybook stories, seed data, and API samples are supposed to use reserved placeholder names. Skip `*.stories.tsx`, `*.test.tsx`, `docs/`, `fixtures/`, `mocks/`, and seed scripts.
- **Real people are sometimes named Jane.** Confirm the surrounding testimonial has a real role, company, and ideally a link or photo before reporting a name.
- **Pricing, percentages, and benchmarks with a citation.** A stat next to a footnote, a source link, or a "measured on ..." qualifier has already done the work this rule asks for.

## Fix

Cut the claim, or make it checkable.

```tsx
// before
<p className="text-5xl font-semibold">10,000+</p>
<p className="text-gray-600">teams ship faster with us</p>
<img src="https://logoipsum.com/logo-1.svg" alt="Customer logo" />

// after: a smaller true number beats a big invented one
<p className="text-5xl font-semibold">{customerCount.toLocaleString()}</p>
<p className="text-gray-600">teams on a paid plan as of {asOfDate}</p>
<img src="/logos/northwind.svg" alt="Northwind" />
```

When there is no evidence yet, delete the section. A landing page with one honest sentence outperforms one with five unprovable ones, and the empty slot is a useful reminder to go and get a real quote.

## Why this needs a rule

A model asked for a stats band has no access to the company's real numbers and no way to leave the slot empty, so it fills the shape with a plausible figure, which is exactly the failure mode a reviewer must catch before it ships.

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Marketing landing, pricing, or home page | fix-this-sprint |
| Public case study or testimonial page | fix-this-sprint |
| Application UI, internal admin, docs | backlog |
| Storybook, tests, fixtures | ignore |

Never a release blocker on its own, but a placeholder-marker hit on a public marketing page should not survive a review cycle.

## Suppression

```tsx
{/* ui-audit-ignore:slop-unverifiable-proof, 99.95% is the contractual SLA, see legal/sla.md */}
```
