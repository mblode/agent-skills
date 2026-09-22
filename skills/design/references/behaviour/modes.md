# Behaviour Mode

The decision layer: what the interface should do before anyone styles it. Choose the interaction and control, name the object, scope, and consequence of each action, settle reversibility and the safeguard it implies, enumerate every reachable state, set resilience expectations, and require accessibility as task completion. Decide, then hand the build to Build mode, the motion to Motion mode, and the wording to `ghostwriter`.

Whether a feature deserves investment or fits the product is out of scope: state it as an open product question.

## Contents

- Sub-modes
- Pass outline
- Decision authority
- Standards and their rule IDs
- Review output
- Decision contract
- Gotchas

## Sub-modes

Resolve one from the user's verb and artifact. `product-rules.md` loads in every sub-mode: every finding cites a rule ID from it, and you cannot conclude that no rule governs a decision without the registry in front of you.

| Sub-mode | Dispatch when the user asks for | Load (plus `product-rules.md`) |
|------|--------------------------------|------|
| **shape** (default) | "design the flow for", "what control here", "how should this work", a brief with no settled UI | `judgment.md`, `reachable-states.md` |
| **spec** | "spec the right interaction", "define the expected states", judgment applied before or during a build | `judgment.md`, `reachable-states.md`, `naming-and-consequence.md`; the build goes to Build mode |
| **review** | "review this flow for product correctness", "is this the right interaction" | `interface-quality.md` |
| **action** | "what should this action affect", "should this be undoable", "do we need a confirm dialog" | `naming-and-consequence.md`; final wording to `ghostwriter` |
| **harden** | "make this resilient", "what breaks here", error, permission, offline, expiry, and destructive paths | `reachable-states.md`, `interface-quality.md`, `judgment.md` |

Review here is about a flow, not an artifact. "Audit this component" and "design QA this page" point at built markup and belong to Audit mode. Shape leads into spec; review leads into harden. When intent is ambiguous, use the narrowest sub-mode the verb supports. A URL, screenshot, route, or component identifies scope; it does not authorize edits.

`lint-patterns.md` has no sub-mode: read it when deciding whether a standard belongs in the consuming project's linter or here.

## Pass outline

1. Locate authority (user constraints, project design system, AGENTS.md).
2. Write the internal brief for shape, spec, and harden (`judgment.md` > Write the brief first). If job, desired outcome, or consequence cannot be filled, stop and ask.
3. Name object, scope, consequence, and reversibility for each action in scope (spec, action, review).
4. Enumerate reachable states and check coverage (shape, spec, harden).
5. Emit output with a rule ID or a labelled coverage gap per finding or decision, routing follow-on work.

Output length follows the work. A single settled decision is a short answer; drop the sections a pass did not need.

## Decision authority

Conflict order, highest first:

1. The user's explicit goal and constraints.
2. Verified user and product evidence, and what the system actually does.
3. Project-canonical guidance: `AGENTS.md` or `CLAUDE.md`, the project's design system.
4. This skill's standards (below).
5. General interface and platform conventions (WCAG 2.2, NN/g, Apple HIG, Material, GOV.UK), which `product-rules.md` cites per rule.

## Standards and their rule IDs

- **Right interaction.** Pick the control from the choice's shape; keep options visible and reversible; prefer inline disclosure over a modal; every gesture has a control alternative; choose the smallest coherent intervention. `rule/control-matches-cardinality`, `rule/navigation-vs-action`, `rule/inline-before-modal`, `rule/no-nested-modals`, `rule/gesture-has-control-alternative`, `rule/smallest-intervention`. Detail: `judgment.md`.
- **Action naming and consequence.** Name the object, scope, and consequence; settle reversibility first, then the pattern; an irreversible action gets review, check, or named confirmation; undo appears only when honest. `rule/name-object-scope-consequence`, `rule/destructive-names-action`, `rule/destructive-proportional`, `rule/irreversible-action-safeguard`, `rule/undo-only-when-honest`, `rule/preserve-user-input`. Detail: `naming-and-consequence.md`.
- **State coverage.** Design every reachable state: empty states name the object and a first action; errors explain and offer recovery; timers warn before they discard. `rule/cover-reachable-states`, `rule/empty-state-action`, `rule/error-states-recovery`, `rule/loading-stable-labels`, `rule/time-limit-adjustable`. Detail: `reachable-states.md`.
- **Resilience.** Overflow, extreme data, localization and RTL, offline, and network failure are designed states; every fetch lands in one. Shares `rule/cover-reachable-states`. Whether the built UI renders them is Audit mode's check.
- **Accessibility as task completion.** Every control has a name; the primary flow completes by keyboard with visible focus; nothing already entered is retyped; authentication allows assistance. `rule/accessible-name-required`, `rule/keyboard-complete-flow`, `rule/no-custom-focus-bypass`, `rule/no-redundant-entry`, `rule/auth-allows-assistance`. Detail: `interface-quality.md`. Markup and target-size checks belong to Audit mode.

## Review output

In review and harden, lead with findings ordered by user impact (P0 to P3), each with location, verification status, rule ID, user consequence, and the smallest concrete fix with the mode or skill that owns it. Keep findings at decision altitude; a line-level code fix is Audit mode's output. Rubric and finding format: `interface-quality.md` > Severity rubric.

## Decision contract

Report unresolved decisions; omit a separate ceremony when the output already carries them.

- Every finding and non-mechanical decision carries a rule ID that appears verbatim in `product-rules.md`, or an inline coverage gap labelled proposed.
- The internal brief has job, desired outcome, and consequence filled, for shape, spec, and harden.
- Every destructive or consequential action in scope has its reversibility stated and a matching pattern.
- Follow-on work is routed by name (Build mode, Motion mode, `ghostwriter`), not done inside the behaviour pass.

## Gotchas

- A confirmation dialog on a reversible action (archive, remove from list, unsubscribe) trains users to click through, so the one confirmation that matters, permanent delete, gets the same reflexive click. Act and offer undo instead (`rule/destructive-proportional`).
- An undo toast as the only recovery path: it vanishes in about five seconds, and the object is gone. Either the object stays recoverable (Trash, Archive) or the action is irreversible and needs a safeguard (`rule/undo-only-when-honest`, WCAG 2.2.1).
- Swipe-to-delete or drag-to-reorder with no button or menu equivalent fails WCAG 2.5.1 and 2.5.7 outright. Spec the alternative before Motion mode builds the physics (`rule/gesture-has-control-alternative`).
- A segmented control with three fixed-width English labels: strings under 10 characters grow 200 to 300% in translation (W3C). Decide the wrap or stack behaviour in the spec.
- Reusing the "No projects yet, Create project" empty state for a filtered-to-zero list: the user creates a duplicate of an item hidden behind the filter. Three empties, three designs (`reachable-states.md`).
- A checkout or sign-up that asks again for something entered two steps earlier fails WCAG 3.3.7 and is where mobile users leave (`rule/no-redundant-entry`).
- Emitting a line-level fix (a prop, a hook, a `className`) instead of the decision. It arrives without the rendered check that would validate it, and the decision goes unstated.
- Citing a plausible rule ID that does not exist (`rule/clear-labels`). It cannot be deduped against an audit finding or traced. Record a coverage gap instead.
