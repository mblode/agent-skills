# Product Judgment

Load in `shape` mode and for any material product or flow decision. Decide what should exist before how it looks: visual execution belongs to `ui-design`, the decision belongs here.

A material decision changes the user's task, default, scope, consequence, navigation, interaction surface, or reachable states. Copy mechanics, token swaps, and established component substitutions usually are not.

## Write the brief first

Before proposing UI, write a compact internal brief; do not skip to components.

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

If you cannot fill in job, desired outcome, and consequence, stop and ask: the interface is unbuildable until clear, and guessing produces confident, wrong work.

## Separate facts from decisions

Mark assumptions and unresolved choices explicitly. Do not bury a product decision in an implementation detail; a reviewer should see at a glance what is known versus decided.

Shipped code is evidence of what exists, not proof it is correct: check it against current components, real product behavior, and explicit guidance before treating it as precedent. One shipped file is not a standard.

## Control selection

Pick the control from the choice's shape, not from habit.

| The choice is | Use | Avoid |
|---------------|-----|-------|
| 2 to 3 static, mutually exclusive options | Radio or segmented control (all visible) | A select that hides options (`rule/control-matches-cardinality`) |
| Many options, or dynamic | Select or combobox | A long radio list |
| A binary on/off applied immediately | Switch | A checkbox that needs a save |
| A binary agreement saved with a form | Checkbox | A switch |
| One action | Button | A menu with one item |
| Navigation to a location | Link (`rule/navigation-vs-action`) | A button that pushes history |

When two controls both fit, choose the one keeping options visible and reversible.

## Surface persistence

Match surface weight to decision importance.

- Inline disclosure first: expand in place, reveal a section, anchor a popover to its trigger; keeps context (`rule/inline-before-modal`).
- Modal only for a focused, interrupting decision needing full attention. Never stack modals (`rule/no-nested-modals`).
- New page or route when the task is large, shareable, or its own destination.
- Expose advanced controls without forcing the default path to carry their complexity: common case stays simple, power is available, not mandatory.

## Smallest coherent intervention

Before adding UI, work through cheaper options in order (`rule/smallest-intervention`):

1. A better default. Can the right thing happen without the user choosing?
2. A behavior change. Can the system do this automatically and reliably?
3. Reuse. Does an existing pattern already solve this job?
4. New UI. Only when the above do not.

Strong defaults and direct behavior beat configuration the user must learn and maintain. Do not solve one job by creating unrelated settings or abstractions. Adding a toggle defers the decision to the user, it does not make one.

## Hierarchy and structure

- One primary action per surface (`rule/one-primary-action`). Make the primary task and action unmistakable; everything else recedes.
- Group with hierarchy, spacing, and alignment before reaching for containers (`rule/structure-before-containers`); nested boxes add weight, not meaning.
- Preserve the user's context and mental model unless changing it solves a verified problem (`rule/preserve-mental-model`).

## Semantics

Use navigation components for navigation, action components for actions (`rule/navigation-vs-action`). The semantic, not the styling, determines keyboard behavior, focus role, and assistive-technology output. A `div` with an onClick is not a button.

## Evidence over taste

Trace each non-mechanical decision to one of:

1. The user's explicit goal and constraints.
2. Verified product behavior and system truth (what the mutation does).
3. Repository-canonical guidance: the project's `AGENTS.md`, its design system, and routed sibling skills.
4. An accepted product or design decision with stable evidence.
5. A verified adjacent shipped pattern in the same product area.
6. General interface heuristics, only when nothing above applies.

If a decision rests only on heuristics or preference, say so and flag it open. Do not present taste as evidence.

## The decision checklist

For each non-mechanical change, answer:

- What user problem does this solve?
- Why is this component or interaction appropriate?
- What consequence must the interface communicate?
- Which evidence supports the decision?
- What is the smallest coherent change that achieves it?

If any answer is missing, the decision is not ready to build. Resolve information architecture, component semantics, interaction, and state behavior before styling or rewriting copy.
