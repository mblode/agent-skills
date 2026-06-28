---
title: Working Memory
impact: MEDIUM-HIGH
kind: rubric
prefix: cognitive
tags: recognition, recall, persistence, short-term-memory
related: cognitive-millers-law, cognitive-chunking, cognitive-cognitive-load
---

## Working Memory

Working memory is the temporary buffer that holds and manipulates information for the current task. Capacity is roughly 4-7 chunks, and each chunk decays in about 20-30 seconds without rehearsal. Anything the user must hold in their head while doing something else is borrowing from this budget, and the budget is small. This is a rubric-based rule: score the multi-step flow against the closest anchor.

The design rule that follows: prefer recognition over recall. Show the value, don't make the user remember it. Carry context across screens. Surface visited state, recent items, and partial selections. The system has unlimited memory; the user does not.

## Rubric

**Surfaces:** form, modal, search-results, dashboard

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | Every step shows a persistent summary of prior choices; values entered earlier are visible or at minimum echoed in step labels; back-button preserves entered values. |
| 4 | Summary present but minor: e.g. step indicator shows step names, prior values visible on hover or in a sidebar. |
| 3 | Step indicator shows position only ("Step 3 of 5") with no content recap; back-button works but loses some state. |
| 2 | No persistent summary; back-button resets fields; user must re-enter values to correct an earlier step. |
| 1 | Multi-step flow with no progress, no summary, no back-button; user must restart from step 1 on any error. |

For full anchor examples and common scoring confusions, see `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 |: |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Add a persistent summary sidebar (or top strip) that lists every prior choice with a "Change" link.
- Preserve form state on back-button navigation; do not reset fields when the user steps back to correct a value.
- Echo prior choices in step labels ("3. Shipping: Pro plan, annual billing") rather than showing a bare "Step 3 of 5".
- Echo active query and filter chips on search-result and filter pages so the input is never empty.
- Pin items being compared on screen for the duration of the comparison; do not require recall.

## Examples

**Anti-pattern (fails):**

```tsx
// Step 1: user picks a plan and clicks Continue
<PlanPicker selected="Pro" />
<Button onClick={() => navigate('/checkout')}>Continue</Button>

// Step 2, checkout, no reminder of what they chose
<h1>Checkout</h1>
<form>
  <Field label="Card number" />
  <Field label="Expiry" />
  <Button>Pay</Button>
</form>
```

**Applied (passes):**

```tsx
<h1>Checkout</h1>
<aside className="summary">
  <h2>Pro plan</h2>
  <p>$24/month, billed annually. <Link href="/plans">Change</Link></p>
</aside>
<form>
  <Field label="Card number" />
  <Field label="Expiry" />
  <Button>Pay $288</Button>
</form>
```

Reference: https://lawsofux.com/working-memory/
