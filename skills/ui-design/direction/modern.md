# Modern Conversion Techniques

Personalisation, mobile-first conversion, page speed, accessible copy, microcopy. Load alongside `cro.md` when building or auditing marketing pages.

## Table of contents

- [AI personalisation](#ai-personalisation)
- [Mobile-first conversion](#mobile-first-conversion)
- [Page speed](#page-speed)
- [Accessible copy](#accessible-copy)
- [Microcopy](#microcopy)

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

### Speed

Pages under 1 second convert 3x better than 5+ seconds. Mobile speed is non-negotiable; see [Page speed](#page-speed).

---

## Page speed

Every 100ms of load time costs ~1% in conversions. Speed is a conversion lever, not a technical detail.

### The numbers

| Metric | Impact |
|--------|--------|
| Every 100ms delay | ~1% conversion drop |
| Pages under 1 second | 3x better conversion vs 5+ seconds |
| 0.1s improvement | Up to 8% conversion lift |
| 3+ second load time | 53% of visitors abandon |

Few mobile sites pass all three Core Web Vitals. CWV affects organic visibility and paid traffic quality scores, so speed work pays twice.

### Core Web Vitals targets

| Metric | Target | What it measures |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Loading: when main content appears |
| INP (Interaction to Next Paint) | < 200ms | Responsiveness: reaction speed to input |
| CLS (Cumulative Layout Shift) | < 0.1 | Stability: layout shift during load |

### Three highest-leverage fixes

1. **Fonts.** Use `font-display: swap` or `optional`. Subset to characters used. Preload the primary font. Self-host instead of the Google Fonts CDN.
2. **Images.** Serve WebP/AVIF. Set `width`/`height` to prevent CLS. Lazy-load below-the-fold. Serve responsive sizes via `srcset`.
3. **Third-party scripts.** Audit every external script (analytics, chat widgets, A/B testing tools, social embeds). Each adds DNS lookups, connections, and parse time. Defer or remove anything non-essential to the conversion goal.

### Common mistakes

- **Optimising server response time when the bottleneck is render-blocking JS.** Measure first, optimise the real bottleneck.
- **Adding a "speed badge" without measuring.** Claiming fast without Core Web Vitals data is like claiming "easy setup" untested.
- **A/B testing tools that slow the page.** Common: the tool meant to improve conversion kills it via load time. Measure the testing tool's own impact.

---

## Accessible copy

Accessible copy isn't a compliance checkbox; it expands your market and lifts conversion for everyone. Target WCAG 2.2.

### WCAG rules that affect copy

| Criterion | What it means for copy |
|-----------|------------------------|
| 2.4.4 Link purpose | Link text must describe the destination. "Click here"/"Learn more" fail; use "View case studies" or "Download the guide". |
| 2.4.6 Headings and labels | Headings must describe what follows. No mystery headings. |
| 1.4.3 Contrast | Text must meet minimum contrast ratios. Affects CTA button colours and hero text over images. |
| 3.1 Readability | Grade 8 reading level or below for marketing copy (Flesch-Kincaid). |
| 1.3.1 Info and relationships | Semantic heading hierarchy (H1 → H2 → H3). Don't skip levels for visual sizing. |

### Plain language rules

- **Sentence length:** 15-20 words average. Break long sentences at the strongest claim.
- **Paragraph length:** max 3-4 sentences, 2 on mobile.
- **Left-align body text.** Centred copy creates uneven left edges that slow reading.
- **Avoid jargon** unless your audience uses it daily. When in doubt, use the simpler word.

### Descriptive CTAs and link text

"Click here" and "Learn more" fail WCAG 2.4.4 and conversion. Replace with action + outcome:

| Inaccessible | Accessible and clearer |
|--------------|----------------------|
| Click here | Download the 2026 benchmark report |
| Learn more | See how Acme reduced churn by 40% |
| Read more | Read the full case study |
| Submit | Send my request |

---

## Microcopy

Small text that isn't headline or body copy but still drives conversion.

### Button labels

Descriptive button text yields +25% CTR over generic labels. "Submit" → "Reserve my seat now". See the `copywriting` skill's CTA Clarity framework for the formula: action verb + what they get + qualifier.

### Form labels and help text

- Labels are identification and micro-persuasion: "Work email" signals B2B; "Your best email" signals personal.
- Help text below fields reduces errors: "We'll send your login link here, no password needed."
- Placeholder text isn't a label; it disappears on focus, breaking usability.

### Privacy reassurance

Place a short privacy statement near every email field:

- "We won't share your email. Unsubscribe anytime."
- "No spam. Cancel anytime."
- "Your data stays private. See our privacy policy."

Privacy reassurance near forms lifts completion, especially on mobile where trust signals are harder to spot.

### Error messages

Explain what went wrong and how to fix it:

| Bad | Good |
|-----|------|
| "Invalid input" | "Enter a valid email address (e.g. you@company.com)" |
| "Error" | "That password is too short, use at least 8 characters" |
| "Required field" | "We need your email to send the guide" |
