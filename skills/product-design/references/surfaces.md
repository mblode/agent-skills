# Surfaces and Reachable States

Load in `shape`, `spec`, and `harden` modes. A happy-path mockup is incomplete, not done: design every state the surface can actually enter, and only those.

`rule/cover-reachable-states` governs coverage. Map only reachable states: invent no permission-denied state for a surface everyone reaches, and do not stop at the populated success case. The checklist below extends Scott Hurff's five-state UI stack (ideal, empty, error, partial, loading) with the states that data-mutating, permissioned, and time-bound surfaces add.

## Contents

- [Map the surface before the states](#map-the-surface-before-the-states)
- [The reachable-state checklist](#the-reachable-state-checklist)
- [Loading](#loading)
- [Empty, sparse, populated](#empty-sparse-populated)
- [Partial and stale](#partial-and-stale)
- [Validation and error](#validation-and-error)
- [Permission and disabled](#permission-and-disabled)
- [Optimistic updates](#optimistic-updates)
- [Destructive state](#destructive-state)
- [Expired and offline](#expired-and-offline)
- [Overlays](#overlays)
- [Resilience: extreme data, localization, viewport](#resilience-extreme-data-localization-viewport)

## Map the surface before the states

Inventory the surface first:

- Entry points: how and from where the user arrives, including deep links and back navigation.
- Visible regions: header, body, actions, secondary panels.
- Overlays: modals, popovers, sheets, toasts.
- Transitions: what changes on action, what animates (`ui-animation` owns the motion).
- Exits and return paths: where the user lands on success, cancel, or error, and how back behaves.

Then walk the state list and mark each reachable or not for this surface.

## The reachable-state checklist

```text
State coverage:
- [ ] Loading (initial, and per-action busy)
- [ ] Empty (never had any / filtered to zero / user cleared)
- [ ] Sparse (one or a few items; layout still holds)
- [ ] Populated (the success case)
- [ ] Partial / stale (some data, some pending or outdated)
- [ ] Validation (inline, before submit)
- [ ] Error (the action or load failed)
- [ ] Permission-denied (the user cannot do this)
- [ ] Disabled (the action is unavailable right now, and why)
- [ ] Optimistic (shown applied before the server confirms)
- [ ] Destructive-in-progress (confirm, pending, undo window)
- [ ] Expired / timed out (session, code, hold, undo window)
- [ ] Offline / degraded (no network, slow network, partial outage)
- [ ] Responsive (compact and wide; long content; large values)
```

## Loading

- Keep the trigger's label stable while busy (`rule/loading-stable-labels`).
- Distinguish initial load from per-action busy; a page skeleton and a button spinner are different states.
- For known targets, prefer specific loading copy over a bare "Loading..." (`rule/loading-state-specific`).
- A load that can hang resolves into the error state; nothing spins forever.

## Empty, sparse, populated

- Name the object and offer the first action (`rule/empty-state-action`): "No projects yet" plus "Create project", not "No data".
- Three empties, three designs: never-had-any (onboarding, guide the first step), filtered-to-zero (offer to clear the filter; a "Create" CTA here produces duplicates), user-cleared (confirm completion, say when new content appears; the one empty state that needs no CTA).
- Layout holds with one item, not twenty: a grid of one should not look broken.
- The populated case is the baseline, not the finish line.

## Partial and stale

- When data is pending or outdated, show what is known and mark what is not; do not block the surface on the slowest part.
- Mark stale data stale and offer a refresh rather than silently presenting old values as current.

## Validation and error

- Validate inline before submit, so the user fixes problems in context; on submit, summarize every error once and link each to its field (the GOV.UK error-summary shape).
- On failure, preserve every field the user entered, passing and failing (`rule/preserve-user-input`).
- Error copy states what happened, why when known, and the recovery action; never raw exception text and never "invalid" (`rule/error-states-recovery`).
- Separate field-level errors (fix this input) from surface-level errors (the whole action failed).
- In a multi-step flow, anything already entered is prefilled or selectable later, never retyped (`rule/no-redundant-entry`).

## Permission and disabled

- A permission-denied path is a designed state, not a crash: explain what the user lacks and how to request it.
- A disabled control says why (tooltip, helper text, or adjacent message). A silently disabled button is a dead end.
- Hide actions the user can never take; show ones they could take with different permissions, clearly gated.

## Optimistic updates

- When showing a change before the server confirms, the failure state exists and preserves the user's input.
- Optimistic UI without a rollback path is a happy-path shortcut, not a complete state (`ui-design` checks the built rollback under `async-optimistic-without-rollback`).

## Destructive state

- Name the object, scope, and consequence before the user commits (`rule/name-object-scope-consequence`, `rule/destructive-names-action`).
- Decide reversibility first, then the pattern (`rule/destructive-proportional`): reversible means act then offer undo, with no confirmation dialog; irreversible means one of review, check, or named confirmation (`rule/irreversible-action-safeguard`).
- An undo toast is a courtesy, not the recovery path. Pair it with a place the object stays recoverable (Trash, Archive, history) or treat the action as irreversible (`rule/undo-only-when-honest`).
- Design the in-progress and post-action states: pending, success with undo window, and failure.
- A success screen for a consequential submission says what happened, gives a reference the user can keep, and says what happens next and when (GOV.UK confirmation pages).

## Expired and offline

- A timer that can discard work warns before it fires and offers an extension, or the work survives it: a saved draft, a re-sendable code, a recoverable object (`rule/time-limit-adjustable`). A live auction or a security-mandated timeout is the exception, and says so.
- Offline is a state, not an error: show what is cached, queue or block writes explicitly, and say which. A write that silently fails offline is data loss.
- A degraded dependency (search down, payments slow) degrades one region, not the whole surface.

## Overlays

- A modal does not open a second modal (`rule/no-nested-modals`). Resolve, sequence, or inline the second step.
- Long content never pushes the confirm and cancel actions out of reach. Keeping the actions reachable is this skill's decision; whether the modal body scrolls correctly is `ui-design` Audit mode's rendered check.
- Focus moves into the overlay on open, returns to the trigger on close, and Escape closes it.
- A toast carries acknowledgement and undo, never a decision: anything that needs the user to choose is a dialog or inline.

## Resilience: extreme data, localization, viewport

These states are decided here; whether the built UI renders them correctly is `ui-design` Audit mode's check (`layout-long-content-safety`, `dark-i18n-rtl-untested`).

- Long strings, large numbers, zero, negative, and missing values, for every text region and every stat.
- Localization headroom scales inversely with string length: per the W3C's cited IBM figures, English strings under 10 characters grow 200 to 300% in translation, 11 to 20 characters grow 180 to 200%, and only strings over 70 characters settle near 130%. A segmented control with three fixed-width English labels is the first thing to break; design it to wrap or stack.
- RTL mirroring of direction-bearing layout (progress, back and forward, sliders) and vertical headroom for Thai, Arabic, and CJK scripts.
- Compact and wide viewports for every materially changed state, not just populated.
