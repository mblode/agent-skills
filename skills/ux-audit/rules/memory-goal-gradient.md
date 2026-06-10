---
title: Goal-Gradient Effect
impact: MEDIUM-HIGH
kind: programmatic
prefix: memory
tags: memory, motivation, progress, onboarding, gamification
related: memory-zeigarnik, memory-peak-end-rule, decision-parkinsons-law
---

## Goal-Gradient Effect

User effort accelerates as the perceived distance to a goal shrinks. The closer the finish line looks, the harder users push to reach it. Show progress, and show progress the user has already made; even artificially endowed progress increases completion rates. Source: Hull (1932); Kivetz, Urminsky & Zheng (2006) on endowed progress.

Pair with a single, clear goal: competing goals dilute the gradient. The classic pattern: a 10-stamp loyalty card with 2 free stamps outperforms an 8-stamp card with 0, because users feel they have already started.

## Check

**Surfaces:** empty-state, multi-step flow

**Procedure:**
1. Find multi-step flows, onboarding checklists, profile-completion UI, or wizard sequences.
2. Check for a visible progress indicator: bar, percentage, `step n of m` paired with a visual gradient, or a completed-items list.
3. Check for **endowed progress**: at least one item already marked complete on first visit (e.g. `Account created ✓` before the user does anything).

**Concrete commands:**
```bash
rg -n 'progress|step \d+ of \d+|completed|checklist' src/
rg -n '<progress|role="progressbar"' src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | Progress indicator present AND endowed progress shown at start |: |
| warn | Progress indicator present but no endowed start (begins at 0%) | MEDIUM |
| fail | No visible progress on a flow with ≥3 steps | HIGH |

## Fix

**If fail:** Add a progress bar or completed-items checklist. Render `step n of m` with a visual gradient (filled bar, not just a number).

**If warn:** Seed the checklist with 1 already-complete item (account creation, email confirmation, the visit itself) so the user starts above 0%.

## Examples

**Anti-pattern (fails):**

```html
<div class="rounded border p-4">
  <h3>Set up your account</h3>
  <ol class="list-decimal pl-5">
    <li>Verify email</li>
    <li>Add a payment method</li>
    <li>Invite your team</li>
  </ol>
  <button class="mt-3">Continue</button>
</div>
```

**Applied (passes):**

```tsx
function SetupChecklist() {
  const steps = [
    { label: "Account created", done: true },
    { label: "Verify email", done: true },
    { label: "Add a payment method", done: false },
    { label: "Invite your team", done: false },
  ];
  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);
  return (
    <section className="rounded border p-4">
      <header className="mb-3 flex items-baseline justify-between">
        <h3 className="font-semibold">You're {pct}% there</h3>
        <span className="text-sm text-muted-foreground">{completed} of {steps.length}</span>
      </header>
      <div className="mb-4 h-1.5 w-full rounded bg-muted">
        <div className="h-full rounded bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="space-y-2">
        {steps.map((s) => (
          <li key={s.label} className={s.done ? "text-muted-foreground line-through" : ""}>
            {s.done ? "✓" : "○"} {s.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Reference: https://lawsofux.com/goal-gradient-effect/
