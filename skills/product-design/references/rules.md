# Product Design Rules

Stable rule IDs cited across every mode. Each finding or decision in `product-design` names a rule ID so it is traceable, dedupable, and verifiable. These IDs are a shared vocabulary: lint rules, reviews, and exemplars reference the same slug.

Cite an ID exactly as written (`rule/destructive-names-action`). Never invent one. If a needed rule is missing, record it as a coverage gap instead of citing a made-up ID.

## Contents

- [How to read a rule](#how-to-read-a-rule)
- [Categories](#categories)
- [Copy rule IDs (defined in copywriting)](#copy-rule-ids-defined-in-copywriting)
- [Interaction and control selection](#interaction-and-control-selection)
- [Action naming and consequence](#action-naming-and-consequence)
- [State coverage](#state-coverage)
- [Accessibility as a product concern](#accessibility-as-a-product-concern)
- [Hierarchy and structure](#hierarchy-and-structure)

## How to read a rule

| Field | Meaning |
|-------|---------|
| Scope | Surface or decision the rule governs |
| Rule | The decision as an observable constraint, not an adjective |
| Why | The user consequence when violated |
| Source | Where it's enforced or detailed: lint rule, reference section, or sibling skill |
| Enforcement | `lint` (deterministic, see `lint-patterns.md`), `judgment` (this skill), or `copy` (defined in `copywriting`) |

A rule is observable when you can point at the interface and say it passes or fails without invoking taste. "Destructive actions use Verb plus Noun" is observable; "Buttons should be clear" is not and does not belong here.

## Categories

- Interaction and control selection
- Action naming and consequence
- State coverage
- Accessibility as a product concern
- Hierarchy and structure

Visual-token integrity (design-system overrides, raw shadows, off-grid spacing, modal scroll structure) is not this skill's: it is a rendered or lint concern owned by `ui-audit` and the project's visual lint. This skill decides whether a modal should exist or be nested; whether its body scrolls correctly is `ui-audit`'s check.

## Copy rule IDs (defined in copywriting)

These IDs are authored and worded in the copywriting skill's `references/ui-states.md`; this skill cites them for the product decision and routes the wording there. Restated here so a citation resolves without loading another skill's file. For the exact strings and verb vocabulary, open that file.

| ID | The decision it governs |
|----|-------------------------|
| `rule/destructive-names-action` | Destructive and primary CTAs use Verb plus Noun naming the object, never `Confirm`/`OK`/`Yes`. |
| `rule/no-confirm-ok-labels` | No bare `Confirm`, `OK`, `Yes`, or `Submit` on a consequential action. |
| `rule/canonical-verb` | One canonical verb per operation, consistent across the product. |
| `rule/error-states-recovery` | An error states what happened, why when known, and the recovery action; never raw exception text. |
| `rule/success-state-specific` | A success message confirms in past tense what happened to which object, proportional to the action. |
| `rule/empty-state-action` | An empty state names the object and offers the first action; no dead ends. |
| `rule/loading-state-specific` | Prefer specific loading copy over a bare "Loading..." when the target is known. |
| `rule/permission-benefit-first` | A permission request states the user benefit before the ask, in context of first use. |
| `rule/reads-without-seeing` | Copy works when heard: errors read sensibly after the field label, links name the destination, no directional words. |

## Interaction and control selection

### rule/control-matches-cardinality
- Scope: choosing a control for a small set of mutually exclusive options.
- Rule: 2 to 3 static, mutually exclusive options use radio buttons or a segmented control, not a select. Keep every option visible.
- Why: a select hides choices behind a click, so the user cannot compare options at a glance.
- Source: `lint-patterns.md`; `product-judgment.md` > Control selection.
- Enforcement: lint plus judgment.

### rule/navigation-vs-action
- Scope: any clickable element.
- Rule: use a link for navigation (changes location, shareable, back-button safe) and a button for an action (mutates state, submits, opens an overlay). Do not style one as the other.
- Why: the wrong semantic breaks the back button, open-in-new-tab, keyboard activation, and screen-reader role.
- Source: `product-judgment.md` > Semantics; `ui-audit` for the rendered check.
- Enforcement: judgment.

### rule/no-nested-modals
- Scope: overlays.
- Rule: do not open a modal from within a modal. Resolve the first, use a single multi-step surface, or move the second step inline.
- Why: stacked modals break focus trapping, escape-key order, and layering, and hide the original context.
- Source: `lint-patterns.md`; `surfaces.md` > Overlays.
- Enforcement: lint plus judgment.

### rule/inline-before-modal
- Scope: revealing secondary content or controls.
- Rule: prefer inline disclosure (expand in place, a section, a popover anchored to its trigger) over a modal. Reserve modals for focused, interrupting decisions.
- Why: a modal severs the user from context and forces a full-attention detour for work that often does not need it.
- Source: `product-judgment.md` > Surface persistence.
- Enforcement: judgment.

### rule/smallest-intervention
- Scope: any proposed change that adds UI.
- Rule: before adding a control, setting, or surface, evaluate a better default, a behavior change, or reuse of an existing pattern. Add UI only when none solve the job.
- Why: every added control is a permanent cost to learn and maintain. Configuration is not a substitute for a correct default.
- Source: `product-judgment.md` > Smallest coherent intervention.
- Enforcement: judgment.

## Action naming and consequence

### rule/destructive-names-action
- Scope: confirmation and primary buttons for destructive or irreversible actions.
- Rule: destructive CTAs use Verb plus Noun naming the exact object (`Delete project`, `Remove member`, `Discard changes`). Never `Confirm`, `OK`, `Yes`, or a bare verb.
- Why: a generic label hides what is about to happen, so the user confirms without reading.
- Source: defined in the copywriting skill's `references/ui-states.md`; cited by `naming-and-copy.md`.
- Enforcement: copy plus judgment.

### rule/name-object-scope-consequence
- Scope: any action that mutates, deletes, shares, bills, or changes permissions.
- Rule: the interface states the object (what), the scope (how many, whose), and the consequence (reversible or not, who is affected) before the user commits.
- Why: without scope and consequence the user cannot judge the action's blast radius.
- Source: `naming-and-copy.md` > Object, scope, consequence; `product-judgment.md`.
- Enforcement: judgment.

### rule/destructive-proportional
- Scope: destructive actions.
- Rule: make friction proportional to impact. Offer undo when the system can honestly support it. Require typed confirmation only for high-impact, irreversible actions, not routine ones.
- Why: under-protecting a permanent delete causes data loss; over-protecting a reversible one trains users to click through warnings.
- Source: `surfaces.md` > Destructive state.
- Enforcement: judgment.

### rule/preserve-user-input
- Scope: forms, editors, and any input across validation, error, or navigation.
- Rule: preserve user input through validation failures and recoverable errors. Do not clear fields on a failed submit.
- Why: discarding entered data on error forces re-entry and loses the user's work and trust.
- Source: `surfaces.md` > Error state; `ui-audit` for the React-level check.
- Enforcement: judgment.

## State coverage

### rule/cover-reachable-states
- Scope: any surface that loads, mutates, or depends on data or permissions.
- Rule: design every state the surface can actually enter: loading, empty, sparse, populated, error, permission-denied, partial or stale, optimistic, and destructive-in-progress. A happy-path-only design is incomplete.
- Why: unhandled states ship as blank screens, spinners that never resolve, or actions that silently fail.
- Source: `surfaces.md` (the full enumeration).
- Enforcement: judgment.

### rule/empty-state-action
- Scope: empty and zero-data states.
- Rule: an empty state names the object and offers the first action. No dead ends.
- Why: a bare "No items" leaves the user with nothing to do and no way to begin.
- Source: defined in the copywriting skill's `references/ui-states.md`; `surfaces.md` > Empty state.
- Enforcement: copy plus judgment.

### rule/error-states-recovery
- Scope: error states and failure messages.
- Rule: an error states what happened, why when known, and the recovery action. Never surface raw exception or stack text. Never a bare "Something went wrong" with no next step.
- Why: an error without a recovery path strands the user.
- Source: defined in the copywriting skill's `references/ui-states.md`; `surfaces.md` > Error state.
- Enforcement: copy plus judgment.

### rule/loading-stable-labels
- Scope: controls in a loading or busy state.
- Rule: keep the control's label stable while busy and use the component's loading or busy affordance. Do not swap the label for "Loading..." or change its width.
- Why: a shifting label causes layout jump and hides which action is in flight.
- Source: `surfaces.md` > Loading state; `loading-state-specific` in `copywriting`.
- Enforcement: judgment.

### rule/loading-state-specific
- Scope: loading copy.
- Rule: prefer specific loading text over a bare "Loading..." when the target is known (what is loading, and roughly how long for long operations).
- Why: specific feedback tells the user the system is working, not stuck.
- Source: defined in the copywriting skill's `references/ui-states.md`.
- Enforcement: copy.

## Accessibility as a product concern

### rule/accessible-name-required
- Scope: icon-only buttons, icon links, and form controls.
- Rule: every interactive control has an accessible name (visible label, `aria-label`, or associated `<label>`). Icon-only controls are never nameless.
- Why: a nameless control is unusable by screen readers and ambiguous for everyone under load.
- Source: `lint-patterns.md`; `interface-quality.md` > Accessibility.
- Enforcement: lint plus judgment.

### rule/keyboard-complete-flow
- Scope: any multi-step or interactive flow.
- Rule: the primary task is completable by keyboard alone, with visible focus and a sensible focus order. Focus moves to new surfaces and returns on close.
- Why: keyboard and screen-reader users must finish the job, not just reach the first control.
- Source: `interface-quality.md` > Accessibility; route rendered checks to `ui-audit`.
- Enforcement: judgment.

### rule/no-custom-focus-bypass
- Scope: focus styling.
- Rule: do not remove or replace the shared focus ring with a custom outline that bypasses the design system's focus token. Keep focus visible and consistent.
- Why: invisible or inconsistent focus makes keyboard navigation impossible to follow.
- Source: `lint-patterns.md`; `interface-quality.md`.
- Enforcement: lint plus judgment.

## Hierarchy and structure

### rule/one-primary-action
- Scope: any surface or section.
- Rule: the primary task and its primary action are unmistakable. At most one primary (emphasized) action per surface; everything else is secondary or tertiary.
- Why: competing primary actions split attention and slow every decision.
- Source: `product-judgment.md` > Hierarchy.
- Enforcement: judgment.

### rule/structure-before-containers
- Scope: layout.
- Rule: use hierarchy, spacing, and alignment to group content before adding borders, cards, or boxes.
- Why: container-first layouts produce nested boxes that add weight without meaning.
- Source: `product-judgment.md` > Hierarchy; route visual execution to `ui-design`.
- Enforcement: judgment.

### rule/preserve-mental-model
- Scope: navigation and context changes.
- Rule: preserve the user's current context and mental model unless changing it solves a verified problem. Do not relocate the user or reset their state as a side effect.
- Why: unexpected context shifts disorient the user and lose their place.
- Source: `product-judgment.md` > Context.
- Enforcement: judgment.
