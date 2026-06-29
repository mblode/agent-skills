---
title: Working Memory
impact: MEDIUM-HIGH
kind: rubric
prefix: cognitive
tags: recognition, recall, persistence, short-term-memory
related: cognitive-millers-law, cognitive-chunking, cognitive-cognitive-load
---

## Working Memory

Working memory is the temporary buffer holding and manipulating information for the current task. Capacity is roughly 4-7 chunks; each decays in about 20-30 seconds without rehearsal. Anything the user must hold in their head while doing something else borrows from this small budget. Rubric-based rule: score the multi-step flow against the closest anchor.

Design rule: prefer recognition over recall. Show the value, don't make the user remember it. Carry context across screens; surface visited state, recent items, partial selections. The system has unlimited memory; the user does not.

## Rubric

**Surfaces:** form, modal, search-results, dashboard

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | Every step shows a persistent summary of prior choices; earlier values visible or echoed in step labels; back-button preserves entered values. |
| 4 | Summary present but minor (step indicator shows step names; prior values on hover or in a sidebar). |
| 3 | Step indicator shows position only ("Step 3 of 5"), no content recap; back-button works but loses some state. |
| 2 | No persistent summary; back-button resets fields; user re-enters values to correct an earlier step. |
| 1 | Multi-step flow with no progress, summary, or back-button; user restarts from step 1 on any error. |

For full anchor examples and common scoring confusions, see `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 |: |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Add a persistent summary sidebar (or top strip) listing every prior choice with a "Change" link.
- Preserve form state on back-button navigation; do not reset fields when the user steps back to correct a value.
- Echo prior choices in step labels ("3. Shipping: Pro plan, annual billing") rather than a bare "Step 3 of 5".
- Echo active query and filter chips on search-result and filter pages so the input is never empty.
- Pin items being compared on screen for the comparison's duration; do not require recall.

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
