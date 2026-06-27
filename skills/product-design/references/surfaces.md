# Surfaces and Reachable States

Load in `shape`, `implement`, and `harden` modes. This is the most concrete value the skill carries: a happy-path mockup is incomplete, not done. Design every state the surface can actually enter, and only those.

Govern coverage with `rule/cover-reachable-states`. Map only reachable states: do not invent a permission-denied state for a surface everyone can reach, but do not stop at the populated success case either.

## Map the surface before the states

Inventory the surface first:

- Entry points: how the user arrives, and from where.
- Visible regions: header, body, actions, secondary panels.
- Overlays: modals, popovers, sheets, toasts.
- Transitions: what changes on action, and what animates.
- Exits and return paths: where the user goes on success, cancel, or error, and how they get back.

Then walk the state list below and mark each as reachable or not for this surface.

## The reachable-state checklist

```
State coverage:
- [ ] Loading (initial, and per-action busy)
- [ ] Empty (no data yet)
- [ ] Sparse (one or a few items; layout still holds)
- [ ] Populated (the success case)
- [ ] Partial / stale (some data, some pending or outdated)
- [ ] Validation (inline, before submit)
- [ ] Error (the action or load failed)
- [ ] Permission-denied (the user cannot do this)
- [ ] Disabled (the action is unavailable right now, and why)
- [ ] Optimistic (shown applied before the server confirms)
- [ ] Destructive-in-progress (confirm, pending, undo window)
- [ ] Responsive (compact and wide; long content; large values)
```

## Loading state

- Keep the triggering control's label stable; use its busy affordance, do not swap the text (`rule/loading-stable-labels`).
- Distinguish initial load (skeleton or placeholder for the region) from per-action busy (the specific control).
- For known targets, prefer specific loading copy over a bare "Loading..." (`rule/loading-state-specific`).
- A spinner that can hang forever needs a timeout path that lands in the error state.

## Empty state

- Name the object and offer the first action (`rule/empty-state-action`). "No projects yet" plus a "Create project" action, not a bare "No data".
- Distinguish never-had-any (onboarding tone, guide the first step) from filtered-to-zero (offer to clear the filter).
- An empty state is a first impression, not an error. No dead ends.

## Sparse and populated

- The layout must hold with one item, not just twenty. A grid of one should not look broken.
- The populated case is the baseline, not the finish line. If it is the only state you designed, the work is a `rule/cover-reachable-states` failure.

## Partial and stale

- When some data is pending or outdated, show what is known and mark what is not. Do not block the whole surface on the slowest part.
- For stale data, indicate it is stale and offer a refresh rather than silently showing old values as current.

## Validation and error

- Validate inline where possible, before submit, so the user fixes problems in context.
- On failure, preserve every field the user entered (`rule/preserve-user-input`). Never clear the form.
- Error copy states what happened, why when known, and the recovery action; never raw exception text (`rule/error-states-recovery`).
- Separate field-level errors (fix this input) from surface-level errors (the whole action failed).

## Permission and disabled

- A permission-denied path is a designed state, not a crash. Explain what the user lacks and, when relevant, how to request it.
- A disabled control says why it is disabled (tooltip, helper text, or adjacent message). A silently disabled button is a dead end.
- Do not show actions the user can never take; do show actions they could take with different permissions, clearly gated.

## Optimistic updates

- When you show a change before the server confirms, design the rollback: what the user sees if it fails, and how their input is preserved.
- Optimistic UI without a failure path is a happy-path shortcut, not a complete state.

## Destructive state

- Name the object and consequence before the user commits (`rule/name-object-scope-consequence`, `rule/destructive-names-action`).
- Make friction proportional to impact and offer undo when honestly supported (`rule/destructive-proportional`).
- Design the in-progress and post-action states: pending, success with undo window, and failure.

## Overlays

- Never nest modals (`rule/no-nested-modals`). Resolve, sequence, or inline the second step.
- Long modal content scrolls inside the body container so actions stay reachable (`rule/modal-body-scroll`).
- Focus moves into the overlay on open and returns to the trigger on close; escape closes it.

## Responsive and resilience handoff

- Check compact and wide viewports for every materially changed state.
- Test long strings, large numbers, constrained width, and localization or RTL risk.
- Overflow, localization, extreme data, and network resilience details live in `interface-quality.md` > Resilience.
