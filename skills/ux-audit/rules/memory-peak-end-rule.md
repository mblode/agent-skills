---
title: Peak-End Rule
impact: MEDIUM-HIGH
kind: programmatic
prefix: memory
tags: memory, emotion, onboarding, completion, microcopy
related: memory-serial-position, interaction-flow, memory-zeigarnik
---

## Peak-End Rule

People judge an experience by two moments (its emotional peak, positive or negative, and its final moment) not by the average of every step. A flow with one delightful spike and a strong finish is remembered more fondly than a uniformly fine flow. Negative peaks weigh more than positive ones, so eliminate friction spikes first, then invest in the end. Source: Kahneman, Fredrickson & Schreiber (1993).

The "end" applies to every closed loop, not just the whole product, but each task: a successful purchase, a saved draft, a completed onboarding. A generic toast at the close of an effortful flow flattens what should be a memorable resolution.

## Check

**Surfaces:** error-state, multi-step flow completion

**Procedure:**
1. For closed-loop flows (checkout, onboarding, signup, first-publish, error recovery), locate the end-state component or final route.
2. Identify the literal final screen the user sees: search for `success`, `complete`, `thanks`, `done`, or post-mutation redirects.
3. Classify the ending: (a) silent redirect, (b) generic toast/snackbar with no detail, (c) generic success page, OR (d) deliberate completion moment with a named success state, summary of what was done, and a labeled next-step.

**Concrete commands:**
```bash
rg -n 'success|complete|thanks|done|onboardingComplete' src/
rg -n 'router\.push|redirect\(|<Toast|toast\(' src/ # find silent endings
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | Deliberate completion moment with summary AND a labeled next-step |: |
| warn | Generic success page (no summary, no next-step) | MEDIUM |
| fail | Silent redirect OR generic toast as the ONLY end-state | HIGH |

## Fix

**If fail:** Replace the redirect/toast with a dedicated completion screen. Include the user's name or what they just did (`"You're set, Sam, your workspace is ready"`) and a single primary next-action (`Start the tour`, `View your first invoice`).

**If warn:** Add a summary of the action just taken (order number, items, files saved) and a clear next-step button, even on a generic success page.

## Examples

**Anti-pattern (fails):**

```tsx
// Onboarding completes after 6 steps. The reward is a system toast.
function OnboardingComplete() {
  return <Toast>Done.</Toast>;
}
```

**Applied (passes):**

```tsx
function OnboardingComplete({ userName }: { userName: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <ConfettiBurst />
      <h2 className="text-2xl font-semibold">You're set, {userName}.</h2>
      <p className="text-muted-foreground">
        Your workspace is ready. Here's a 60-second tour of what you just unlocked.
      </p>
      <Button size="lg" autoFocus>Start the tour</Button>
    </div>
  );
}
```

Reference: https://lawsofux.com/peak-end-rule/
