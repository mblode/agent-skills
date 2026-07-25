# Modern Conversion Techniques

Personalisation and mobile-first conversion. Load alongside `cro.md` when building or auditing marketing pages. Page speed, accessible copy, and microcopy are covered here only as pointers to their owning skills (`optimise-seo`, `copywriting`, `ui-audit`/`typography-audit`).

## Table of contents

- [AI personalisation](#ai-personalisation)
- [Mobile-first conversion](#mobile-first-conversion)
- [Owned elsewhere](#owned-elsewhere)

---

## AI personalisation

Non-personalised B2B landing pages convert at 1-3%. Personalised pages lift conversion by 25-40%, and the gap is widening: personalisation is becoming table stakes, not a competitive advantage.

### What to personalise

| Element | Personalisation source | Example |
|---------|------------------------|---------|
| Headline | UTM campaign or referral source | Ad: "Cut your AWS bill" → headline: "Cut your AWS bill in half" |
| CTA | Awareness stage | First visit: "See how it works" / Return visit: "Start your free trial" |
| Hero image | Industry or persona | Dashboard for SaaS buyers, storefront for ecommerce |
| Social proof | Visitor segment | Testimonials from the visitor's industry |
| Pricing emphasis | Company size (firmographic) | Highlight the best-fit plan |

### Data sources

- **UTM parameters:** campaign, source, medium, content
- **IP-based firmographics:** company size, industry, location (Clearbit, 6sense)
- **Behavioural:** returning visitor, pages viewed, time on site
- **Cookie/session data:** previous interactions, abandoned forms

### The risk spectrum

- **Under-personalisation:** wastes the infrastructure. Dynamic content that shows everyone the same thing.
- **Over-personalisation:** creepy. "Hi Sarah from Acme Corp, we noticed you visited our pricing page three times" crosses the line.
- **Sweet spot:** adapt to the visitor's context without revealing how much you know.

### Common mistakes

- **Personalising before the baseline page converts.** Fix fundamentals first. Personalisation amplifies a working page, not a broken one.
- **Too many segments, too little traffic.** Each needs enough visitors to validate. Start with 2-3, not 20.

---

## Mobile-first conversion

62% of ecommerce traffic is mobile. Design mobile-first, then enhance for desktop.

### Layout rules

- **Single-column layout.** No side-by-side comparisons forcing horizontal scroll.
- **44-48px tap targets.** Apple minimum 44px, Google recommends 48px. Smaller frustrates thumb navigation.
- **Thumb-zone CTA placement.** Primary actions in the bottom-centre, reachable without stretching.
- **Sticky CTA.** Keep the primary CTA visible as the user scrolls. A fixed bottom bar or floating button keeps the action one tap away.

### The 70% rule

70% of mobile users don't scroll to mid-page. This changes section ordering:

- CTA must appear above the fold on mobile.
- Social proof must appear within the first two scroll-lengths.
- Problem/pain sections that work on desktop may need shortening or reordering for mobile.
- Test mobile and desktop layouts independently; what converts on desktop may fail on mobile.

### Forms

- **Fewer fields.** Every field removed cuts friction. Test 3-field vs 5-field.
- **Larger inputs.** Font size ≥ 16px prevents iOS zoom-on-focus.
- **`inputmode` attributes.** Use `inputmode="email"`, `inputmode="tel"`, `inputmode="numeric"` to show the right keyboard.
- **Single-column forms only.** Never place fields side-by-side on mobile.

---

## Owned elsewhere

Three conversion levers belong to sibling skills; name the lever, then route the work.

- **Page speed.** Pages under 1 second convert roughly 3x better than 5+ seconds, so mobile speed is a conversion decision. Core Web Vitals (LCP/INP/CLS), `font-display`, WebP/AVIF, and third-party script budgets: route to `optimise-seo`.
- **Accessible copy.** Descriptive link and CTA text and plain-language reading level: route to `copywriting`. The a11y checks (WCAG link purpose, heading hierarchy, contrast): route to `ui-audit` or `typography-audit`.
- **Microcopy.** Button labels, form help text, privacy reassurance, error messages: route to `copywriting`.
