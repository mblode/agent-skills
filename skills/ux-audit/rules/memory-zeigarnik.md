---
title: Zeigarnik Effect
impact: MEDIUM-HIGH
kind: programmatic
prefix: memory
tags: memory, motivation, completion, progress, onboarding
related: memory-goal-gradient, memory-peak-end-rule, decision-parkinsons-law
---

## Zeigarnik Effect

People remember unfinished or interrupted tasks more vividly than completed ones. An incomplete task creates a low-grade cognitive tension that nudges the user to come back and close the loop. Visible "almost done" state is a motivator; silent abandonment is forgotten. Source: Zeigarnik (1927).

Surface unfinished work, persist it across sessions, and pair the open loop with a clear next action so the tension resolves into completion, not anxiety. Do not weaponize it: fabricated "incomplete" states erode trust.

## Check

**Surfaces:** modal, empty-state, loading

**Procedure:**
1. Find multi-step flows or saved-state UI: drafts, wizards, profile-completion checklists, partially configured features.
2. Check for: visible incomplete-task indicator (e.g. `1 draft saved`, `Resume`, `Continue setup`), persistence across sessions, and "you're 2 steps away from X" callouts.
3. For modals/dialogs: confirm that closing them does not destroy unsaved work without an explicit confirmation.

**Concrete commands:**
```bash
rg -n 'draft|resume|continue|incomplete|in progress' src/
rg -n 'onClose|onDismiss|setOpen\(false\)' src/ # check for unsaved-work guards
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | Incomplete tasks are visible AND persist across sessions/refresh |: |
| warn | Incomplete tasks are visible but lost on refresh or navigation | MEDIUM |
| fail | Incomplete tasks are not visible at all OR destroyed silently on close | HIGH |

## Fix

**If fail:** Add a persistent indicator (badge, banner, or list item) with a labeled action like `Resume draft`. For modals with form state, intercept close with a `confirm("Discard unsaved changes?")` or auto-save to local storage.

**If warn:** Persist the open-loop state in `localStorage`, server-backed drafts, or session storage so it survives reloads.

## Examples

**Anti-pattern (fails):**

```tsx
// Profile is 40% complete, but the dashboard says nothing.
function Dashboard() {
  return (
    <main>
      <h1>Welcome back</h1>
      <RecentActivity />
    </main>
  );
}
```

**Applied (passes):**

```tsx
function ProfileNudge({ filledFields, totalFields }: { filledFields: number; totalFields: number }) {
  const remaining = totalFields - filledFields;
  if (remaining === 0) return null;
  const pct = Math.round((filledFields / totalFields) * 100);
  return (
    <aside className="rounded-lg border p-4">
      <p className="text-sm font-medium">
        Your profile is {pct}% complete, {remaining} field{remaining === 1 ? "" : "s"} left.
      </p>
      <div className="mt-2 h-1.5 w-full rounded bg-muted">
        <div className="h-full rounded bg-black" style={{ width: `${pct}%` }} />
      </div>
      <a href="/profile" className="mt-3 inline-block text-sm underline">
        Finish setup
      </a>
    </aside>
  );
}
```

Reference: https://lawsofux.com/zeigarnik-effect/
