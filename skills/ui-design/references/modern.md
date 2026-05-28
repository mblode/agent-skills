# Modern Techniques (2025-2026)

Reference for current landing page optimisation techniques. Load alongside `references/cro.md` when building or auditing marketing pages.

## Table of contents

- [AI personalisation](#ai-personalisation)
- [Mobile-first conversion](#mobile-first-conversion)
- [Page speed](#page-speed)
- [Accessible copy](#accessible-copy)
- [Microcopy](#microcopy)

---

## AI personalisation

Non-personalised B2B landing pages convert at 1-3%. Personalised pages lift conversion by 25-40%. The gap is widening — personalisation is becoming table stakes, not a competitive advantage.

### What to personalise

| Element | Personalisation source | Example |
|---------|------------------------|---------|
| Headline | UTM campaign or referral source | Ad says "Cut your AWS bill" → headline echoes "Cut your AWS bill in half" |
| CTA | Awareness stage | First visit: "See how it works" / Return visit: "Start your free trial" |
| Hero image | Industry or persona | Show a dashboard for SaaS buyers, a storefront for ecommerce |
| Social proof | Visitor segment | Show testimonials from the visitor's industry |
| Pricing emphasis | Company size (firmographic) | Highlight the plan most likely to fit |

### Data sources

- **UTM parameters** — campaign, source, medium, content
- **IP-based firmographics** — company size, industry, location (tools like Clearbit, 6sense)
- **Behavioural** — returning visitor, pages viewed, time on site
- **Cookie/session data** — previous interactions, abandoned forms

### The risk spectrum

- **Under-personalisation** — wastes the infrastructure. Dynamic content that shows the same thing to everyone.
- **Over-personalisation** — feels creepy. "Hi Sarah from Acme Corp, we noticed you visited our pricing page three times" crosses the line.
- **Sweet spot** — adapt the message to the visitor's context without revealing how much you know.

28.2% of companies adopted AI personalisation for landing pages as of 2025. Adoption is accelerating.

### Common mistakes

- **Personalising before the baseline page converts.** Fix the fundamentals first. Personalisation amplifies a working page; it doesn't rescue a broken one.
- **Too many segments with too little traffic.** Each segment needs enough visitors to validate. Start with 2-3 segments, not 20.

---

## Mobile-first conversion

62% of ecommerce traffic is mobile. Design for mobile first, then enhance for desktop — not the reverse.

### Layout rules

- **Single-column layout.** No side-by-side comparisons that force horizontal scrolling.
- **44-48px tap targets.** Apple specifies 44px minimum; Google recommends 48px. Anything smaller frustrates thumb navigation.
- **Thumb-zone CTA placement.** Primary actions in the bottom-centre of the screen, reachable without stretching.
- **Sticky CTA.** Keep the primary CTA visible as the user scrolls. A fixed bottom bar or floating button ensures the action is always one tap away.

### The 70% rule

70% of mobile users don't scroll to mid-page. This changes everything about section ordering:

- CTA must appear above the fold on mobile
- Social proof must appear within the first two scroll-lengths
- Problem/pain sections that work on desktop may need to be shortened or reordered for mobile
- Test mobile and desktop layouts independently — what converts on desktop may fail on mobile

### Forms

- **Fewer fields.** Every field removed reduces friction. Test 3-field vs 5-field.
- **Larger inputs.** Font size ≥ 16px prevents iOS zoom-on-focus.
- **`inputmode` attributes.** Use `inputmode="email"`, `inputmode="tel"`, `inputmode="numeric"` to show the right keyboard.
- **Single-column forms only.** Never place fields side-by-side on mobile.

### Speed

Pages loading under 1 second convert 3x better than those loading in 5+ seconds. Mobile speed is non-negotiable — see [Page speed](#page-speed) below.

---

## Page speed

Every 100ms of load time costs approximately 1% in conversions. Speed is not a technical detail — it's a conversion lever.

### The numbers

| Metric | Impact |
|--------|--------|
| Every 100ms delay | ~1% conversion drop |
| Pages under 1 second | 3x better conversion vs 5+ seconds |
| 0.1s improvement | Up to 8% conversion lift |
| 3+ second load time | 53% of visitors abandon |

Only 42% of mobile sites pass all three Core Web Vitals. Google's March 2026 core update increased the weight of CWV in ranking — affecting both organic visibility and paid traffic quality scores.

### Core Web Vitals targets

| Metric | Target | What it measures |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Loading — how quickly the main content appears |
| INP (Interaction to Next Paint) | < 200ms | Responsiveness — how quickly the page reacts to input |
| CLS (Cumulative Layout Shift) | < 0.1 | Stability — how much the layout shifts during load |

### Three highest-leverage fixes

1. **Fonts.** Use `font-display: swap` or `optional`. Subset fonts to the characters actually used. Preload the primary font file. Self-host instead of Google Fonts CDN when possible.
2. **Images.** Serve WebP/AVIF. Use `width` and `height` attributes to prevent CLS. Lazy-load below-the-fold images. Serve responsive sizes via `srcset`.
3. **Third-party scripts.** Audit every external script (analytics, chat widgets, A/B testing tools, social embeds). Each script adds DNS lookups, connections, and parse time. Defer or remove anything non-essential for the conversion goal.

### Common mistakes

- **Optimising server response time when the bottleneck is render-blocking JS.** Measure first, optimise the actual bottleneck.
- **Adding a "speed badge" without measuring.** Claiming fast performance without Core Web Vitals data is like claiming "easy setup" without testing it.
- **A/B testing tools that slow the page.** Ironic but common — the tool you're using to improve conversion is killing it via load time. Measure the testing tool's own impact.

---

## Accessible copy

WCAG 2.2 is fully active. WCAG 3.0 is on the horizon. Accessible copy is not a compliance checkbox — it expands your addressable market and improves conversion for everyone.

### WCAG rules that affect copy

| Criterion | What it means for copy |
|-----------|------------------------|
| 2.4.4 Link purpose | Link text must describe the destination. "Click here" and "Learn more" fail. Use "View case studies" or "Download the guide". |
| 2.4.6 Headings and labels | Headings must describe the content that follows. No heading should be a mystery. |
| 1.4.3 Contrast | Text must meet minimum contrast ratios. This affects colour choices for CTA buttons and hero text over images. |
| 3.1 Readability | Write at or below grade 8 reading level for marketing copy (Flesch-Kincaid). |
| 1.3.1 Info and relationships | Heading hierarchy must be semantic (H1 → H2 → H3). Don't skip levels for visual sizing. |

### Plain language rules

- **Sentence length:** aim for 15-20 words average. Break long sentences at the strongest claim.
- **Paragraph length:** max 3-4 sentences. On mobile, even 2 sentences per paragraph is better.
- **Left-align body text.** Never centre body copy — centred text creates uneven left edges that slow reading.
- **Avoid jargon** unless your audience uses it daily. If in doubt, use the simpler word.

### Descriptive CTAs and link text

"Click here" and "Learn more" fail WCAG 2.4.4 and they fail conversion. Replace with action + outcome:

| Inaccessible | Accessible and clearer |
|--------------|----------------------|
| Click here | Download the 2026 benchmark report |
| Learn more | See how Acme reduced churn by 40% |
| Read more | Read the full case study |
| Submit | Send my request |

---

## Microcopy

The small text that isn't the headline or body copy — but still drives conversion.

### Button labels

Descriptive button text yields +25% CTR over generic labels. "Submit" → "Reserve my seat now" (specific, outcome-driven). See the `copywriting` skill's CTA Clarity framework for the full formula: action verb + what they get + qualifier.

### Form labels and help text

- Labels are identification and micro-persuasion: "Work email" signals B2B context; "Your best email" signals personal.
- Help text below fields reduces errors: "We'll send your login link here — no password needed."
- Placeholder text is not a label. Placeholders disappear on focus, breaking usability.

### Privacy reassurance

Place a privacy statement near every email field. Keep it short:

- "We won't share your email. Unsubscribe anytime."
- "No spam. Cancel anytime."
- "Your data stays private. See our privacy policy."

Privacy reassurance near forms increases completion rates — especially on mobile where trust signals are harder to spot.

### Error messages

Explain what went wrong and how to fix it:

| Bad | Good |
|-----|------|
| "Invalid input" | "Enter a valid email address (e.g. you@company.com)" |
| "Error" | "That password is too short — use at least 8 characters" |
| "Required field" | "We need your email to send the guide" |
