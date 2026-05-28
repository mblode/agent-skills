# Testing and Optimisation

Reference for A/B testing, heatmap analysis, and conversion optimisation loops. Load when optimising an existing landing page or planning a testing strategy.

---

## The CRO loop

Measure → Hypothesise → Test → Implement → Repeat.

Only 39.6% of companies have a documented CRO strategy. Most optimise ad-hoc, testing whatever feels wrong rather than what the data says matters. Structure the loop:

1. **Measure** — identify the weakest conversion point with analytics (bounce rate, scroll depth, click maps)
2. **Hypothesise** — state what you believe is wrong and why, with a predicted outcome
3. **Test** — run an A/B test with one variable changed
4. **Implement** — ship the winner
5. **Repeat** — move to the next weakest point

---

## What to test first

Prioritised by typical impact on conversion rate:

| Priority | Element | Why it matters |
|----------|---------|----------------|
| 1 | **Headline** | The first thing read; determines whether the rest gets read |
| 2 | **CTA text** | Personalised CTAs convert 202% better than generic |
| 3 | **Hero image/video** | Sets emotional tone; context-of-use images outperform stock |
| 4 | **Social proof placement** | Moving proof above the fold or near the CTA can shift conversion significantly |
| 5 | **Form length** | Every field removed reduces friction; test 3-field vs 5-field |
| 6 | **Page length** | Short vs long — see `references/cro.md` for the decision matrix |
| 7 | **CTA colour/size** | Lower-leverage but easy to test; button size change can yield +90% |

Test high-leverage elements first. Don't optimise button colour when the headline doesn't match the ad.

---

## A/B vs multivariate

| Method | When to use | Traffic requirement |
|--------|-------------|---------------------|
| **A/B testing** | Most landing page optimisation. One variable changed per test. Clean isolation — you know exactly why one version won. | Moderate (hundreds to low thousands of conversions) |
| **Multivariate** | Testing combinations of multiple elements simultaneously. Powerful but requires massive traffic to isolate which combination caused the lift. | Very high (thousands of conversions per variant) |

**Default to A/B.** Multivariate testing is impractical for most landing pages unless you're running tens of thousands of visitors per week.

---

## Statistical significance

- **Run until significant, not until the result looks good.** A test that shows +20% after 50 visitors is noise, not signal.
- **Minimum sample:** depends on baseline conversion rate and minimum detectable effect. Use a sample size calculator before starting.
- **Duration:** run for at least one full business cycle (typically 1-2 weeks) to account for day-of-week variation.
- **Never stop a test early** because one variant is "clearly winning." Early results are unreliable. Pre-commit to a sample size and honour it.

---

## Heatmap and scroll map insights

Heatmaps and scroll maps show where attention actually goes — not where you assume it goes.

### Key findings

- **70% of mobile users don't scroll to mid-page.** If your strongest proof or CTA is below the fold on mobile, most visitors never see it.
- **Desktop scroll depth is deeper** but still drops off sharply after the hero and first support section.
- **Dead clicks** reveal where users expect something interactive but find nothing — a missed CTA opportunity.

### What to do with scroll data

1. **Move your strongest message higher.** If heatmaps show attention clustering in the top 30% of the page, that's where your best proof and CTA belong.
2. **Create separate mobile and desktop strategies.** Mobile users scan faster and scroll less — prioritise differently.
3. **Test section order.** Move testimonials above features, or features above the problem statement, and measure the impact.
4. **Identify drop-off cliffs.** If 60% of users stop scrolling at a specific section, that section is either boring or confusing — fix or remove it.

### Real example

A local service business discovered via scroll maps that 70% of mobile users never reached their mid-page offer. Moving the offer above the fold doubled conversions within one month.

---

## CTA statistics

Data-backed insights for CTA optimisation (2025-2026):

| Change | Impact on conversion |
|--------|---------------------|
| Personalised CTA (vs generic) | +202% |
| Single CTA per page (vs multiple) | +266% |
| Adding urgency (real, limited-time) | +332% |
| Increasing button size | +90% CTR |
| Changing button colour | +21% |
| Mobile-optimised CTA | +32.5% |
| Inline CTA (vs sidebar) | +121% CTR |

These are directional, not guaranteed. Every audience is different. Test your own variants — but start with the highest-leverage changes first.
