# Surfaces and Reachable States

Load in `shape`, `spec`, and `harden` modes. A happy-path mockup is incomplete, not done: design every state the surface can actually enter, and only those.

`rule/cover-reachable-states` governs coverage. Map only reachable states: invent no permission-denied state for a surface everyone reaches, nor stop at the populated success case.

## Map the surface before the states

Inventory the surface first:

- Entry points: how and from where the user arrives.
- Visible regions: header, body, actions, secondary panels.
- Overlays: modals, popovers, sheets, toasts.
- Transitions: what changes on action, what animates.
- Exits and return paths: where the user lands on success, cancel, or error, and how back.

Then walk the state list below and mark each reachable or not for this surface.

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

- Keep the trigger's label stable while busy (`rule/loading-stable-labels`).
- Distinguish initial load from per-action busy.
- For known targets, prefer specific loading copy over a bare "Loading..." (`rule/loading-state-specific`).
- A load that can hang must resolve into the error state, not hang forever.

## Empty state

- Name the object and offer the first action (`rule/empty-state-action`): "No projects yet" plus a "Create project" action, not a bare "No data".
- Distinguish never-had-any (onboarding, guide the first step) from filtered-to-zero (offer to clear the filter).
- An empty state is a first impression, not an error. No dead ends.

## Sparse and populated

- Layout must hold with one item, not twenty: a grid of one should not look broken.
- The populated case is the baseline, not the finish line: designing only it fails `rule/cover-reachable-states`.

## Partial and stale

- When data is pending or outdated, show what is known and mark what is not; do not block the surface on the slowest part.
- For stale data, mark it stale and offer a refresh rather than silently showing old values as current.

## Validation and error

- Validate inline before submit, so the user fixes problems in context.
- On failure, preserve every field the user entered (`rule/preserve-user-input`). Never clear the form.
- Error copy states what happened, why when known, and the recovery action; never raw exception text (`rule/error-states-recovery`).
- Separate field-level errors (fix this input) from surface-level errors (the whole action failed).

## Permission and disabled

- A permission-denied path is a designed state, not a crash: explain what the user lacks and how to request it.
- A disabled control says why (tooltip, helper text, or adjacent message). A silently disabled button is a dead end.
- Hide actions the user can never take; show ones they could take with different permissions, clearly gated.

## Optimistic updates

- When showing a change before the server confirms, the failure state must exist and preserve the user's input.
- Optimistic UI without a failure path is a happy-path shortcut, not a complete state.

## Destructive state

- Name the object and consequence before the user commits (`rule/name-object-scope-consequence`, `rule/destructive-names-action`).
- Make friction proportional to impact and offer undo when honestly supported (`rule/destructive-proportional`).
- Design the in-progress and post-action states: pending, success with undo window, and failure.

## Overlays

- Never nest modals (`rule/no-nested-modals`). Resolve, sequence, or inline the second step.
- Long content must never push the confirm and cancel actions out of reach. Keeping the actions reachable is this skill's decision; whether the modal body scrolls correctly is a rendered check for `ui-audit` and the project's lint.
- Focus moves into the overlay on open, returns to the trigger on close; escape closes it.

## Responsive and resilience handoff

- Check compact and wide viewports for every materially changed state.
- Test long strings, large numbers, constrained width, and localization or RTL risk.
- These resilience states (overflow, localization, extreme data, network failure) must be designed here; whether the built UI renders them correctly is `ui-audit`'s check.
