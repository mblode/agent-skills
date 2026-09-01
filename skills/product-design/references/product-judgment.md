# Product Judgment

Load in `shape`, `spec`, and `harden` modes, and for any material product or flow decision. Decide what should exist before how it looks: visual execution belongs to `ui-design`, the decision belongs here.

A material decision changes the user's task, default, scope, consequence, navigation, interaction surface, or reachable states. Copy mechanics, token swaps, and established component substitutions usually are not.

## Contents

- [Write the brief first](#write-the-brief-first)
- [Separate facts from decisions](#separate-facts-from-decisions)
- [Control selection](#control-selection)
- [Gestures](#gestures)
- [Surface persistence](#surface-persistence)
- [Smallest coherent intervention](#smallest-coherent-intervention)
- [Hierarchy and structure](#hierarchy-and-structure)
- [Semantics](#semantics)
- [Evidence over taste](#evidence-over-taste)
- [The decision checklist](#the-decision-checklist)

## Write the brief first

Before proposing UI, write a compact internal brief. Length follows the decision: a one-control question fills three fields, a new flow fills all ten.

- User: who is acting, and what they know coming in.
- Job: what they want to accomplish, in their words.
- Current behavior: what happens today, and where it fails.
- Desired outcome: the behavior that solves the job.
- Success signal: how you would know it worked.
- Non-goals: what this explicitly does not do.
- Object: the product noun being acted on.
- Action, scope, consequence: what changes, how much, and whether reversible.
- Permissions: who can do this, and the unprivileged path.
- Open decisions: product questions still unresolved.

If job, desired outcome, and consequence cannot be filled in, stop and ask: the interface is unbuildable until they are clear, and guessing produces confident, wrong work.

## Separate facts from decisions

Mark assumptions and unresolved choices explicitly, so a reviewer sees at a glance what is known versus decided.

Shipped code is evidence of what exists, not proof it is correct: check it against current components, real product behavior, and explicit guidance before treating it as precedent. One shipped file is not a standard.

## Control selection

Pick the control from the choice's shape, not from habit.

| The choice is | Use | Avoid |
|---------------|-----|-------|
| 2 to 3 static, mutually exclusive options | Radio or segmented control (all visible) | A select that hides options (`rule/control-matches-cardinality`) |
| 4 to 7 static, mutually exclusive options | Stacked radios | A select; GOV.UK treats select as a last resort |
| Many options, or dynamic | Combobox with typeahead, or a select | A long radio list |
| Data the user knows by heart (birth date, postcode, country) | A text field with forgiving formatting and validation | A dropdown; typing "NY" beats scrolling to it (NN/g) |
| A binary that takes effect immediately | Switch | A checkbox that needs a save |
| A binary saved with a form | Checkbox | A switch; NN/g: separate controls with instant effect from those that wait for Submit |
| One action | Button | A menu with one item |
| Navigation to a location | Link (`rule/navigation-vs-action`) | A button that pushes history |

When two controls both fit, choose the one keeping options visible and reversible. Radios and checkboxes ship unselected unless a default is genuinely right for most users; a preselected radio cannot be cleared, so include "None of these" where it is a real answer (GOV.UK radios).

## Gestures

A gesture that replaces a control (swipe-to-delete, drag-to-reorder, hold-to-confirm) is a capability decision, settled here before `ui-animation` builds its physics.

- Every gesture-reachable action also has a visible or menu-reachable control that does the same thing (`rule/gesture-has-control-alternative`). Swipe needs a button or overflow item; drag-to-reorder needs move up/down or a "Move to" menu; a slider drag needs click-to-position or arrow keys.
- Hold-to-confirm fires on release after the hold completes, never on the press, and lifting early aborts it. It replaces a confirmation dialog only for reversible or routine actions; it is not a safeguard for the irreversible (`rule/irreversible-action-safeguard`).
- A swipe that reveals a destructive action and a swipe that performs it are different designs. Reveal is the default; perform-on-swipe needs undo that meets `rule/undo-only-when-honest`.

## Surface persistence

Match surface weight to decision importance.

- Inline disclosure first: expand in place, reveal a section, anchor a popover to its trigger; context stays (`rule/inline-before-modal`).
- Modal for a focused, interrupting decision that needs full attention: a critical error, information the process cannot continue without, stopping an irreversible action. NN/g's checks: not for content unrelated to the current flow, not inside a high-stakes process such as checkout, not for a decision that needs information the modal cannot show. No stacked modals (`rule/no-nested-modals`).
- Toast or snackbar for acknowledgement and undo only; it carries no decision and needs no dismissal.
- New page or route when the task is large, shareable, or its own destination.
- Expose advanced controls without forcing the default path to carry their complexity: the common case stays simple, power is available, not mandatory.

## Smallest coherent intervention

Before adding UI, work through cheaper options in order (`rule/smallest-intervention`):

1. A better default. Can the right thing happen without the user choosing?
2. A behavior change. Can the system do this automatically and reliably?
3. Reuse. Does an existing pattern already solve this job?
4. New UI. Only when the above do not.

Strong defaults and direct behavior beat configuration the user must learn and maintain. Adding a toggle defers the decision to the user; it does not make one. NN/g's slip-prevention list (helpful constraints, suggestions, good defaults, forgiving formatting) is the same ladder applied to input: prevent the error before designing the error state.

## Hierarchy and structure

- One primary action per surface (`rule/one-primary-action`). The primary task and action are unmistakable; everything else recedes.
- Group with hierarchy, spacing, and alignment before reaching for containers (`rule/structure-before-containers`).
- Preserve the user's context and mental model unless changing it solves a verified problem (`rule/preserve-mental-model`).
- Order a flow so its core value moment lands before any secondary interruption: OS permission prompt, sign-up or paywall, gamification, upsell (`rule/value-before-interruption`). Each ask waits for first use in context; Apple's HIG asks the same of permission prompts.

## Semantics

Navigation components for navigation, action components for actions (`rule/navigation-vs-action`). The semantic, not the styling, determines keyboard behavior, focus role, and assistive-technology output. A `div` with an onClick is not a button.

## Evidence over taste

Trace each non-mechanical decision to something in SKILL.md's Decision authority order. Two evidence sources sit below project-canonical guidance and above general heuristics: an accepted product or design decision with stable evidence, then a verified adjacent shipped pattern in the same product area.

If a decision rests only on heuristics or preference, say so and flag it open. Do not present taste as evidence.

## The decision checklist

For each non-mechanical change, answer:

- What user problem does this solve?
- Why is this component or interaction appropriate?
- What consequence must the interface communicate?
- Which evidence supports the decision?
- What is the smallest coherent change that achieves it?

If any answer is missing, the decision is not ready to build. Resolve information architecture, component semantics, interaction, and state behavior before styling or rewriting copy.
