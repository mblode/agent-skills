---
title: Flow
impact: MEDIUM-HIGH
kind: rubric
prefix: interaction
tags: focus, immersion, friction, feedback, interruptions
related: interaction-doherty-threshold, memory-peak-end-rule, cognitive-cognitive-load
---

## Flow

Flow (Csikszentmihalyi) is full immersion in a task: energized focus, total involvement, loss of self-consciousness. It emerges when challenge matches skill, goals are clear, and feedback is immediate. UI cannot manufacture flow but can protect or destroy it. Rubric rule: score how well the surface protects focused work from interruption.

Distinct from the Doherty Threshold: Doherty (fast feedback) is one prerequisite, but flow also needs unambiguous goals, no interruptions, and a sense of agency. Modals, toasts, banners, and onboarding nudges fired during active work break flow even when the system is fast.

## Rubric

**Surfaces:** modal, form, dashboard, loading

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | Active work is never interrupted; prompts surface only at natural breakpoints (after save, on idle, on exit); feedback is ambient. |
| 4 | One minor interruption pattern: e.g. a save toast briefly covers the cursor location. |
| 3 | Modals or toasts fire during typing or scrolling; user reflex-dismisses them. |
| 2 | Multiple unsolicited interruptions per session: feature announcements, NPS prompts, paywalls mid-action. |
| 1 | UI actively interrupts work for marketing or growth goals; users develop dismissal habits and miss real alerts. |

Full anchor examples and scoring confusions: `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 |: |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Defer prompts (NPS, feature announcements, upgrade nudges) to natural breakpoints (after save, on idle ≥60s, or on exit); never during typing or scrolling.
- Replace blocking modals with ambient feedback: a status pill, a non-focus-stealing toast, or an inline indicator.
- Reserve space for save indicators so they do not shift content during typing.
- Move save toasts away from the cursor so they do not occlude the work area.
- Drop required confirmations for low-stakes actions; allow one-click undo instead.

## Examples

**Anti-pattern (fails):**

```tsx
function Editor() {
  // Fires 30s after page load: mid-typing for any focused user.
  useEffect(() => {
    const id = setTimeout(() => setShowNps(true), 30_000);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <DocumentCanvas />
      {showNps && <NPSPromptModal />}
      <FeatureAnnouncementBanner />
    </>
  );
}
```

**Applied (passes):**

```tsx
function Editor() {
  // Surface prompts only at natural breakpoints: after save, on idle, on exit.
  useIdleCallback(() => maybeShowFeatureHint(), { idleMs: 60_000 });
  useOnSaveSuccess(() => maybeShowNps());

  return (
    <>
      <DocumentCanvas />
      <SaveStatus className="text-xs text-zinc-500" />  {/* ambient feedback */}
      <CommandPalette />                                 {/* user-initiated */}
    </>
  );
}
```

Reference: https://lawsofux.com/flow/
