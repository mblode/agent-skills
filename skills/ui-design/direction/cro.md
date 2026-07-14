# Conversion Fundamentals

Landing page conversion strategy. Load when building or auditing marketing pages.

## Table of contents

- [Persuasion principles](#persuasion-principles)
- [Social proof patterns](#social-proof-patterns)
- [Conversion benchmarks](#conversion-benchmarks)
- [Voice of Customer research](#voice-of-customer-research)
- [Page length decision](#page-length-decision)

---

## Persuasion principles

Cialdini's seven principles for landing pages. Each is a tool, not a trick; misuse destroys trust faster than it builds conversion.

| Principle | Landing page application | Misuse to avoid |
|-----------|--------------------------|-----------------|
| **Reciprocity** | Offer something free first (a tool, calculator, guide) before asking for commitment | Gating basic information behind a form; the "gift" must feel genuinely useful |
| **Commitment** | Start with a micro-yes (quiz, configurator, email-only form) before the full ask | Bait-and-switch: small ask hiding a large commitment |
| **Social proof** | Reviews, badges, user counts, testimonials near the CTA (see below) | Fake reviews or fabricated numbers; readers smell it instantly |
| **Authority** | Certifications, press logos, expert endorsements, "as seen in" strips | Citing authority without specifics: "trusted by thousands" proves nothing |
| **Liking** | Brand voice, customer-as-hero framing, relatable imagery | Over-familiarity or forced warmth that doesn't match the product |
| **Scarcity** | Limited-time offers, remaining seats, closing deadlines | Fake countdown timers that reset on refresh; permanent "last chance" banners |
| **Unity** | In-group language ("fellow founders"), shared identity framing | Exclusionary language that alienates adjacent audiences |

Urgency (a subset of scarcity) lifts conversion substantially when real, and destroys credibility when fabricated. For the figure and other CTA conversion stats, see the canonical "CTA statistics" table in `testing.md`.

---

## Social proof patterns

Pages with social proof convert 34% better. Not all proof is equal.

### Credibility hierarchy

Highest to lowest trust:

1. **Third-party review badges** (G2, Capterra, Trustpilot, Product Hunt): independently verified; highest credibility for B2B SaaS.
2. **Specific-outcome testimonials:** "Cut our reporting from 4 hours to 20 minutes." Named person, real photo, company.
3. **X/Twitter testimonials:** publicly verifiable. Underused but high-trust because anyone can check.
4. **Logo walls:** recognisable companies use the product. Less persuasive alone.
5. **User counts:** "Join 50,000+ teams." Effective at scale, meaningless below ~1,000.
6. **Vague praise:** "Great product, love it!" Almost never moves the needle.

### Placement rules

- **Near the CTA:** within one scroll of every conversion point.
- **Above the fold:** 3-5 logos or one credibility stat; don't delay trust signals.
- **Adjacent to pricing:** testimonials matched to plan type reduce choice anxiety.
- **After objection sections:** proof answers "but does it actually work?"

### The specificity test

If a competitor could use the same testimonial unchanged, it's too generic. "Great tool" fails. "Reduced our deploy time from 45 minutes to 3" passes.

---

## Conversion benchmarks

Median conversion rates by industry and channel:

| Segment | Median | Top quartile |
|---------|--------|--------------|
| All industries | 6.6-8.1% | 10%+ |
| Financial services | 8.4% | 12%+ |
| Legal services | 7.4% | 11%+ |
| eCommerce | 4.3% | 8%+ |
| Healthcare | 3.0-4.2% | 8-10% |
| B2B SaaS (cold) | 1-3% | 5%+ |

| Traffic source | Average conversion |
|----------------|-------------------|
| Email campaigns | 19.3% |
| Webinar pages | 22.3% |
| Organic search | 4-6% |
| Paid search | ~1.2% |
| Paid social | 2-4% |

Directional benchmarks, not targets. 3% for a $50K ACV product is a different business than 3% for a free trial.

CRO tools report average ROI of 223%. AI-assisted A/B testing, common in mid-market, lifts median rates.

---

## Voice of Customer research

Copy-research methodology (mining reviews, tickets, and transcripts for the reader's exact words) is owned by the `copywriting` skill; it feeds the copywriting brief. Route VoC work there.

---

## Page length decision

Short-form and long-form pages serve different situations. Decide by the reader's needs, not preference.

### Decision matrix

| Price | Complexity | Awareness | Recommended length |
|-------|-----------|-----------|-------------------|
| Low | Simple | High (warm traffic) | Short: under 125 words. 15% higher conversion. |
| Low | Simple | Low (cold traffic) | Medium: establish context, then convert. |
| High | Complex | High | Medium-long: address objections, show proof. |
| High | Complex | Low | Long: full persuasion sequence. Crazy Egg saw 363% lift. |

### Short-form rules

- Under 125 words of body copy
- One screen on desktop, two on mobile
- Hero, one proof point, CTA, nothing else
- Best for: free resources, newsletter signups, known brands, warm referral traffic

### Long-form rules

- Each section answers a specific objection or builds specific confidence
- Sections that just "fill space" are friction, not persuasion
- Repeat the CTA after hero, after proof, and at bottom
- Best for: high-ticket products, complex services, cold traffic, solution-aware comparison shoppers

The Rule of One applies regardless of length: one reader, one offer, one promise, one CTA.
