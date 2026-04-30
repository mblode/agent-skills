---
title: Cognitive Bias
impact: MEDIUM-HIGH
tier: rubric
prefix: cognitive
tags: heuristics, decision-making, framing, defaults
related: cognitive-cognitive-load, memory-mental-model, memory-jakobs-law
---

## Cognitive Bias

Cognitive biases are systematic shortcuts the brain takes to skip full analysis. Users do not evaluate a UI rationally — they pattern-match against past experience, recent context, and emotional state. Anchoring shifts perceived price by whatever number is shown first. Default bias keeps most users on the pre-selected option. Loss aversion makes "lose your data" hit harder than "save your data." This is a rubric-based rule: score the surface against the closest anchor instead of measuring a number.

Treat bias as a diagnostic lens, not a manipulation toolkit. The audit penalizes only bias-exploitation — defaults, framings, and copy that push users toward outcomes they would reject if they thought clearly. Persuasive copy that makes the truth more legible is not a bias issue.

## Rubric

**Surfaces:** modal, form, pricing, marketing-hero

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | Defaults match what a friend would recommend; cancel/destructive flows use neutral language ("Cancel subscription") and equal visual weight on confirm/dismiss; comparison anchors are honest. |
| 4 | Defaults mostly neutral; one minor framing issue (e.g. opt-out checkbox pre-checked but obvious). |
| 3 | Mixed: some defaults helpful, others nudge toward business-preferred outcome; "Are you sure?" copy uses mild loss-aversion. |
| 2 | Multiple dark patterns: pre-checked upsells, asymmetric button styling on cancel flows, "you'll lose your streak forever" language. |
| 1 | Confirmshaming, hidden cancel paths, anchoring to fake-high prices, urgency timers without basis. |

For full anchor examples and common scoring confusions, see `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 | — |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Replace asymmetric button styling on cancel/destructive flows with equal visual weight on confirm and dismiss.
- Remove pre-checked upsell, marketing-email, and data-sharing opt-ins; require the user to opt in.
- Replace "lose your streak forever" / "are you sure?" copy with neutral, factual statements: "Your access continues until <date>. You can resubscribe any time."
- Strip "Recommended" / "Most popular" / "Best value" badges that have no objective criteria; only keep them when truthful.
- Remove urgency or scarcity copy ("9 people viewing", countdown timers) that has no factual basis.

## Examples

**Anti-pattern (fails):**

```html
<div class="modal">
  <h2>Are you sure you want to leave?</h2>
  <p>You'll lose your 12-day streak and forfeit member discounts forever.</p>
  <button class="primary">Stay subscribed</button>
  <button class="link">No thanks, cancel my account</button>
</div>
```

**Applied (passes):**

```html
<div class="modal">
  <h2>Cancel subscription</h2>
  <p>Your access continues until April 30, 2026. You can resubscribe any time and keep your data for 90 days.</p>
  <button class="primary">Cancel subscription</button>
  <button class="ghost">Keep subscription</button>
</div>
```

Reference: https://lawsofux.com/cognitive-bias/
