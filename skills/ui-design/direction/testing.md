# Testing and Optimisation

Reference for A/B testing, heatmap analysis, and conversion optimisation loops. Load when optimising an existing landing page or planning a testing strategy.

## The CRO loop

Measure → Hypothesise → Test → Implement → Repeat. Most teams optimise ad-hoc; only 39.6% have a documented CRO strategy. Structure the loop instead:

1. **Measure:** find the weakest conversion point via analytics (bounce rate, scroll depth, click maps)
2. **Hypothesise:** state what's wrong and why, with a predicted outcome
3. **Test:** run an A/B test with one variable changed
4. **Implement:** ship the winner
5. **Repeat:** move to the next weakest point

## What to test first

Prioritised by typical impact on conversion rate. Test high-leverage elements first; don't optimise button colour when the headline doesn't match the ad.

| Priority | Element | Why it matters |
|----------|---------|----------------|
| 1 | **Headline** | First thing read; determines whether the rest gets read |
| 2 | **CTA text** | Personalised CTAs convert 202% better than generic |
| 3 | **Hero image/video** | Sets emotional tone; context-of-use images outperform stock |
| 4 | **Social proof placement** | Moving proof above the fold or near the CTA shifts conversion significantly |
| 5 | **Form length** | Every field removed reduces friction; test 3-field vs 5-field |
| 6 | **Page length** | Short vs long; see `cro.md` for the decision matrix |
| 7 | **CTA colour/size** | Lower-leverage but easy to test; button size change can yield +90% |

## A/B vs multivariate

| Method | When to use | Traffic requirement |
|--------|-------------|---------------------|
| **A/B testing** | Most landing page optimisation. One variable per test, clean isolation: you know exactly why one version won. | Moderate (hundreds to low thousands of conversions) |
| **Multivariate** | Combinations of multiple elements at once. Powerful but needs massive traffic to isolate which combination caused the lift. | Very high (thousands of conversions per variant) |

**Default to A/B.** Multivariate is impractical for most landing pages unless you run tens of thousands of visitors per week.

## Statistical significance

- **Run until significant, not until the result looks good.** +20% after 50 visitors is noise, not signal.
- **Minimum sample** depends on baseline conversion rate and minimum detectable effect: use a sample size calculator before starting.
- **Duration:** at least one full business cycle (typically 1-2 weeks) to account for day-of-week variation.
- **Never stop a test early** because a variant is "clearly winning." Early results are unreliable. Pre-commit to a sample size and honour it.

## Heatmap and scroll map insights

Heatmaps and scroll maps show where attention actually goes, not where you assume.

### Key findings

- **Most mobile users don't scroll to mid-page** (see the "70% rule" in `modern.md`). Strongest proof or CTA below the mobile fold is never seen by most visitors.
- **Desktop scroll depth is deeper** but drops off sharply after the hero and first support section.
- **Dead clicks** reveal where users expect interactivity but find none: a missed CTA opportunity.

### What to do with scroll data

1. **Move your strongest message higher.** If attention clusters in the top 30%, put your best proof and CTA there.
2. **Create separate mobile and desktop strategies.** Mobile users scan faster and scroll less, so prioritise differently.
3. **Test section order.** Move testimonials above features, or features above the problem statement, and measure.
4. **Identify drop-off cliffs.** A section where 60% stop scrolling is boring or confusing: fix or remove it.

### Real example

Scroll maps showed 70% of a local service business's mobile users never reached the mid-page offer; moving it above the fold doubled conversions within one month.

## CTA statistics

Directional, not guaranteed; every audience is different. Test your own variants, starting with the highest-leverage changes.

| Change | Impact on conversion |
|--------|---------------------|
| Personalised CTA (vs generic) | +202% |
| Single CTA per page (vs multiple) | +266% |
| Adding urgency (real, limited-time) | +332% |
| Increasing button size | +90% CTR |
| Changing button colour | +21% |
| Mobile-optimised CTA | +32.5% |
| Inline CTA (vs sidebar) | +121% CTR |
