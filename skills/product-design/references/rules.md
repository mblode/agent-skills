# Product Design Rules

Stable rule IDs cited across every mode. Each finding or decision in `product-design` names a rule ID so it is traceable, dedupable against a `ui-design` audit, and verifiable. Lint rules, reviews, and exemplars reference the same slug.

Cite an ID exactly as written (`rule/destructive-names-action`). If no rule below covers a decision, record a coverage gap rather than citing a slug that does not exist.

## Contents

- [How to read a rule](#how-to-read-a-rule)
- [Categories](#categories)
- [Recording a coverage gap](#recording-a-coverage-gap)
- [Copy rule IDs (defined in copywriting)](#copy-rule-ids-defined-in-copywriting)
- [Interaction and control selection](#interaction-and-control-selection)
- [Action naming and consequence](#action-naming-and-consequence)
- [State coverage](#state-coverage)
- [Accessibility as a product concern](#accessibility-as-a-product-concern)
- [Hierarchy and structure](#hierarchy-and-structure)
- [External sources](#external-sources)

## How to read a rule

| Field | Meaning |
|-------|---------|
| Scope | Surface or decision the rule governs |
| Rule | The decision as an observable constraint, not an adjective |
| Why | The user consequence when violated |
| Source | Where it is detailed or grounded: a reference section, a sibling skill, or a key in External sources |
| Enforcement | `lint` (deterministic, see `lint-patterns.md`), `judgment` (this skill), or `copy` (defined in `copywriting`) |

A rule is observable when you can point at the interface and say it passes or fails without invoking taste. "Destructive actions use Verb plus Noun" is observable; "Buttons should be clear" is not and does not belong here.

## Categories

- Interaction and control selection
- Action naming and consequence
- State coverage
- Accessibility as a product concern
- Hierarchy and structure

Visual-token integrity (design-system overrides, raw shadows, off-grid spacing, modal scroll structure) is a rendered or lint concern owned by `ui-design` and the project's visual lint. This skill decides whether a modal should exist; whether its body scrolls correctly is `ui-design` Audit mode's check.

## Recording a coverage gap

When a decision needs a rule no ID below covers, record a coverage gap inline in the pass output, where the citation would have gone:

- Proposed slug: `rule/<kebab-case>`, labeled proposed so it never reads as a real citation.
- Decision it would govern: one line, observable in the sense above.
- Category: one of the five above, or `new category` plus a name.

Example: `coverage gap (proposed) rule/autosave-signals-state`: an autosaving editor shows whether the current content is saved, saving, or failed to save. Category: State coverage.

A gap stays in the pass output. Promoting one into this file is a separate, deliberate edit.

## Copy rule IDs (defined in copywriting)

These IDs are authored and worded in the copywriting skill's `references/ui-states.md`; this skill cites them for the product decision and routes the wording there. Restated so a citation resolves without opening another skill's file. Entries below for these IDs carry `Scope`, `Why`, `Source`, and `Enforcement` but no `Rule` line: the constraint's wording has one owner.

| ID | The decision it governs |
|----|-------------------------|
| `rule/destructive-names-action` | Destructive and primary CTAs use Verb plus Noun naming the object, never `Confirm`/`OK`/`Yes`. |
| `rule/no-confirm-ok-labels` | No bare `Confirm`, `OK`, `Yes`, or `Submit` on a consequential action. `Save`, `Cancel`, and `Close` are exempt: they name their own outcome. |
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
- Rule: 2 to 3 static, mutually exclusive options use radio buttons or a segmented control with every option visible, not a select. A select is the last resort for a long list, never the default for a short one.
- Why: a select hides choices behind a click, so the user cannot compare options at a glance. GOV.UK's research found users unable to close selects, confusing focused with selected, and losing their place in long lists.
- Source: `lint-patterns.md`; `product-judgment.md` > Control selection; GOV.UK select and radios; NN/g dropdowns.
- Enforcement: lint plus judgment.

### rule/navigation-vs-action
- Scope: any clickable element.
- Rule: a link for navigation (changes location, shareable, back-button safe) and a button for an action (mutates state, submits, opens an overlay). Do not style one as the other.
- Why: the wrong semantic breaks the back button, open-in-new-tab, keyboard activation, and the screen-reader role.
- Source: `product-judgment.md` > Semantics; `ui-design` Audit mode (`nav-semantic-links`) for the rendered check.
- Enforcement: judgment.

### rule/no-nested-modals
- Scope: overlays.
- Rule: a modal does not open a second modal. Resolve the first, use one multi-step surface, or move the second step inline.
- Why: stacked modals break focus trapping, escape-key order, and layering, and hide the original context. Material's guidance: confirmation dialogs "should avoid launching additional simple dialogs".
- Source: `lint-patterns.md`; `surfaces.md` > Overlays; Material dialogs.
- Enforcement: lint plus judgment.

### rule/inline-before-modal
- Scope: revealing secondary content or controls.
- Rule: prefer inline disclosure (expand in place, a section, a popover anchored to its trigger) over a modal. Reserve a modal for a focused, interrupting decision: a critical error, information the process cannot continue without, or stopping an irreversible action.
- Why: a modal severs the user from context and forces a full-attention detour for work that often does not need it. NN/g: "if you must interrupt, make sure it's worth the cost."
- Source: `product-judgment.md` > Surface persistence; NN/g modal dialogs.
- Enforcement: judgment.

### rule/gesture-has-control-alternative
- Scope: swipe, drag, multi-finger, and press-and-hold interactions that trigger or complete an action.
- Rule: every action reachable by a gesture is also reachable by a single-pointer, non-path, non-timed control (a button, a menu item, a keyboard command) that does the same thing. Hold-to-confirm completes on release, with a way to abort before it fires.
- Why: a gesture-only action is invisible to users who cannot perform it (motor impairments, switch access, screen readers) and to everyone who never discovers it. WCAG 2.5.1 (A) requires a single-pointer alternative to path-based gestures such as swipes; 2.5.7 (AA) requires a non-dragging alternative to drag; 2.5.2 (A) requires an abort path for anything that fires on a press.
- Source: `product-judgment.md` > Gestures; WCAG 2.5.1, 2.5.2, 2.5.7; `ui-animation` builds the gesture once the alternative is settled.
- Enforcement: judgment.

### rule/smallest-intervention
- Scope: any proposed change that adds UI.
- Rule: before adding a control, setting, or surface, evaluate a better default, a behavior change, or reuse of an existing pattern. Add UI only when none solve the job.
- Why: every added control is a permanent cost to learn and maintain. Configuration is not a substitute for a correct default.
- Source: `product-judgment.md` > Smallest coherent intervention; NN/g slips (constraints, defaults, forgiving formatting).
- Enforcement: judgment.

## Action naming and consequence

### rule/destructive-names-action
- Scope: confirmation and primary buttons for destructive or irreversible actions.
- Why: a generic label hides what is about to happen, so the user confirms without reading. Apple HIG: avoid "OK" unless the alert is purely informational; a title like "Delete" or "Erase" says what the button does.
- Source: defined in the copywriting skill's `references/ui-states.md`; cited by `naming-and-copy.md`; Apple HIG alerts.
- Enforcement: copy plus judgment.

### rule/name-object-scope-consequence
- Scope: any action that mutates, deletes, shares, bills, or changes permissions.
- Rule: the interface states the object (what), the scope (how many, whose), and the consequence (reversible or not, who is affected) before the user commits.
- Why: without scope and consequence the user cannot judge the action's blast radius. NN/g: a confirmation that does not say what will happen ("Are you sure?") provides no protection.
- Source: `naming-and-copy.md` > Object, scope, consequence; NN/g confirmation dialogs.
- Enforcement: judgment.

### rule/irreversible-action-safeguard
- Scope: actions that delete or overwrite user data, commit money or legal terms, or send something to other people.
- Rule: an action the system cannot reverse has at least one of: a review step showing what will be submitted with a way to change it, input checking with a chance to correct before commit, or a confirmation that names object, scope, and consequence. Routine saves are exempt.
- Why: this is the floor beneath which data loss is designed in. WCAG 3.3.4 (AA) requires reversible, checked, or confirmed for exactly this class of submission; GOV.UK's check-answers page is the review-step form of it.
- Source: `naming-and-copy.md` > Reversibility decides the pattern; WCAG 3.3.4; GOV.UK check answers.
- Enforcement: judgment.

### rule/destructive-proportional
- Scope: destructive actions.
- Rule: friction is proportional to impact and irreversibility. A reversible action gets no confirmation dialog: act, then offer undo. A permanent single-object delete gets one named confirmation. Typed confirmation is reserved for high-impact, irreversible, wide-scope actions (a workspace, a repository, a billing account).
- Why: under-protecting a permanent delete causes data loss; over-protecting a reversible one habituates users to click through, so the confirmation that matters gets the same reflexive click. NN/g: "if you cry wolf too many times, people will stop paying attention."
- Source: `surfaces.md` > Destructive state; NN/g confirmation dialogs; NN/g heuristic 3 (user control and freedom).
- Enforcement: judgment.

### rule/undo-only-when-honest
- Scope: any undo affordance, including undo toasts and snackbars.
- Rule: an undo control appears only when activating it restores the object and its relationships completely. A timed undo toast is honest only when the object stays recoverable after the toast disappears (Trash, Archive, version history) or the delay itself is the mechanism (undo send). Otherwise treat the action as irreversible and apply `rule/irreversible-action-safeguard`.
- Why: an undo that half-restores, or that vanishes after five seconds with no other recovery path, teaches users the product lies about safety; the next "Undo" gets trusted and fails. WCAG 2.2.1 exempts a disappearing message only when an alternative exists that does not rely on the timer.
- Source: `surfaces.md` > Destructive state; Material snackbar; WCAG 2.2.1.
- Enforcement: judgment.

### rule/preserve-user-input
- Scope: forms, editors, and any input across validation, error, or navigation.
- Rule: user input survives validation failures and recoverable errors. A failed submit does not clear fields, passing or failing.
- Why: discarding entered data on error forces re-entry and loses the user's work and trust. GOV.UK: "Do not clear any form fields when showing the Error message component."
- Source: `surfaces.md` > Validation and error; `ui-design` Audit mode (`forms-lost-data-on-error`) for the React-level check; GOV.UK error message.
- Enforcement: judgment.

## State coverage

### rule/cover-reachable-states
- Scope: any surface that loads, mutates, or depends on data, time, or permissions.
- Rule: design every state the surface can actually enter: loading, empty, sparse, populated, partial or stale, validation, error, permission-denied, disabled, optimistic, destructive-in-progress, expired or timed out, offline. A happy-path-only design is incomplete.
- Why: unhandled states ship as blank screens, spinners that never resolve, or actions that silently fail.
- Source: `surfaces.md` (the full enumeration); Hurff UI stack.
- Enforcement: judgment.

### rule/empty-state-action
- Scope: empty and zero-data states.
- Why: a bare "No items" leaves the user with nothing to do and no way to begin.
- Source: defined in the copywriting skill's `references/ui-states.md`; `surfaces.md` > Empty state.
- Enforcement: copy plus judgment.

### rule/error-states-recovery
- Scope: error states and failure messages.
- Why: an error without a recovery path strands the user. NN/g heuristic 9: plain language, precise problem, constructive suggestion.
- Source: defined in the copywriting skill's `references/ui-states.md`; `surfaces.md` > Validation and error; GOV.UK error message.
- Enforcement: copy plus judgment.

### rule/loading-stable-labels
- Scope: controls in a loading or busy state.
- Rule: keep the control's label stable while busy and use the component's loading or busy affordance. Do not swap the label for "Loading..." or change its width.
- Why: a shifting label causes layout jump and hides which action is in flight.
- Source: `surfaces.md` > Loading state; `loading-state-specific` in `copywriting`.
- Enforcement: judgment.

### rule/loading-state-specific
- Scope: loading copy.
- Why: specific feedback tells the user the system is working, not stuck.
- Source: defined in the copywriting skill's `references/ui-states.md`.
- Enforcement: copy.

### rule/time-limit-adjustable
- Scope: any state that expires on a timer: session timeouts, one-time codes, reservation holds, undo windows, auto-dismissing messages.
- Rule: before a timer discards work or closes a path, the user is warned and can extend it, or the work survives the expiry (a draft, a re-sendable code, a recoverable object). Time limits that are essential to the activity (a live auction) are the exception.
- Why: a silent expiry is data loss the user cannot see coming. WCAG 2.2.1 (A) requires turn off, adjust, or extend for content-set time limits unless real-time, essential, or over 20 hours.
- Source: `surfaces.md` > Expired and offline; WCAG 2.2.1.
- Enforcement: judgment.

## Accessibility as a product concern

### rule/accessible-name-required
- Scope: icon-only buttons, icon links, and form controls.
- Rule: every interactive control has an accessible name (visible label, `aria-label`, or associated `<label>`). Icon-only controls are never nameless.
- Why: a nameless control is unusable by screen readers and ambiguous for everyone under load.
- Source: `lint-patterns.md`; `interface-quality.md` > Accessibility as task completion; `ui-design` (`a11y-icon-controls-labeled`).
- Enforcement: lint plus judgment.

### rule/keyboard-complete-flow
- Scope: any multi-step or interactive flow.
- Rule: the primary task is completable by keyboard alone, with visible focus and a sensible focus order. Focus moves to new surfaces and returns on close, and the focused control is never fully hidden behind sticky chrome.
- Why: keyboard and screen-reader users must finish the job, not just reach the first control. WCAG 2.4.11 (AA) fails when a sticky header, footer, or banner entirely covers the focused element.
- Source: `interface-quality.md` > Accessibility as task completion; WCAG 2.4.11; rendered checks to `ui-design` Audit mode (`interaction-keyboard-operable`, `focus-*`).
- Enforcement: judgment.

### rule/no-custom-focus-bypass
- Scope: focus styling.
- Rule: do not remove or replace the shared focus ring with a custom outline that bypasses the design system's focus token. Keep focus visible and consistent.
- Why: invisible or inconsistent focus makes keyboard navigation impossible to follow.
- Source: `lint-patterns.md`; `interface-quality.md`; `ui-design` (`interaction-focus-visible`).
- Enforcement: lint plus judgment.

### rule/no-redundant-entry
- Scope: multi-step flows, checkouts, sign-up, and any process that asks for information more than once.
- Rule: information the user already entered or was shown earlier in the same process is prefilled or offered for selection ("Billing address same as shipping"), not retyped. Exceptions: re-entry for security (a password), re-entry essential to the task, or information that is no longer valid.
- Why: retyping is the point where users on mobile, with motor or cognitive impairments, or simply in a hurry abandon. WCAG 3.3.7 (A).
- Source: `surfaces.md` > Validation and error; WCAG 3.3.7.
- Enforcement: judgment.

### rule/auth-allows-assistance
- Scope: sign-in, sign-up, step-up verification, and any authentication step.
- Rule: no authentication step depends on the user remembering, transcribing, or solving something unless an alternative method exists or assistance is allowed. Password fields accept paste and password managers; a code sent by SMS or email can be pasted; a puzzle CAPTCHA has a non-puzzle alternative.
- Why: blocking paste or a password manager turns a security step into a memory test that locks out users with cognitive impairments and frustrates everyone else. WCAG 3.3.8 (AA).
- Source: `interface-quality.md` > Accessibility as task completion; WCAG 3.3.8; `ui-design` (`forms-dont-block-paste-ime`) for the built check.
- Enforcement: judgment.

## Hierarchy and structure

### rule/one-primary-action
- Scope: any surface or section.
- Rule: the primary task and its primary action are unmistakable. At most one primary (emphasized) action per surface; everything else is secondary or tertiary.
- Why: competing primary actions split attention and slow every decision.
- Source: `product-judgment.md` > Hierarchy and structure.
- Enforcement: judgment.

### rule/structure-before-containers
- Scope: layout.
- Rule: use hierarchy, spacing, and alignment to group content before adding borders, cards, or boxes.
- Why: container-first layouts produce nested boxes that add weight without meaning.
- Source: `product-judgment.md` > Hierarchy and structure; visual execution to `ui-design`.
- Enforcement: judgment.

### rule/preserve-mental-model
- Scope: navigation and context changes.
- Rule: preserve the user's current context and mental model unless changing it solves a verified problem. Do not relocate the user or reset their state as a side effect.
- Why: unexpected context shifts disorient the user and lose their place.
- Source: `product-judgment.md` > Hierarchy and structure.
- Enforcement: judgment.

### rule/value-before-interruption
- Scope: onboarding and first-run flows.
- Rule: the flow reaches its core value moment before any secondary interruption (OS permission prompt, sign-up or paywall, gamification, upsell). Each interruption waits for first use in context; none is front-loaded at launch.
- Why: an ask that arrives before the user grasps the product's value gets declined or abandoned, pushing the aha moment past the drop-off point. Apple's HIG asks for permission requests in context, when the feature is used, with the benefit stated.
- Source: `product-judgment.md` > Hierarchy and structure; permission wording to `rule/permission-benefit-first`; Apple HIG privacy.
- Enforcement: judgment.

## External sources

Keys used in `Source` fields above. Consult when a decision needs the primary text.

| Key | Reference |
|-----|-----------|
| NN/g heuristics | Nielsen, 10 Usability Heuristics: nngroup.com/articles/ten-usability-heuristics/ |
| NN/g confirmation dialogs | nngroup.com/articles/confirmation-dialog/ |
| NN/g modal dialogs | nngroup.com/articles/modal-nonmodal-dialog/ |
| NN/g toggle switches | nngroup.com/articles/toggle-switch-guidelines/ |
| NN/g dropdowns | nngroup.com/articles/drop-down-menus/ |
| NN/g slips | nngroup.com/articles/slips/ |
| Apple HIG alerts | developer.apple.com/design/human-interface-guidelines/alerts |
| Apple HIG privacy | developer.apple.com/design/human-interface-guidelines/privacy |
| Material dialogs | m1.material.io/components/dialogs.html (M3 dialog and snackbar pages carry the same rules, rendered client-side) |
| Material snackbar | m3.material.io/components/snackbar/guidelines |
| GOV.UK select | design-system.service.gov.uk/components/select/ |
| GOV.UK radios | design-system.service.gov.uk/components/radios/ |
| GOV.UK error message | design-system.service.gov.uk/components/error-message/ |
| GOV.UK check answers | design-system.service.gov.uk/patterns/check-answers/ |
| GOV.UK confirmation pages | design-system.service.gov.uk/patterns/confirmation-pages/ |
| WCAG 2.x.y | w3.org/WAI/WCAG22/Understanding/ (one page per criterion: 2.2.1 Timing Adjustable, 2.4.11 Focus Not Obscured, 2.5.1 Pointer Gestures, 2.5.2 Pointer Cancellation, 2.5.7 Dragging Movements, 2.5.8 Target Size, 3.3.4 Error Prevention, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication) |
| W3C text size | w3.org/International/articles/article-text-size |
| Hurff UI stack | scotthurff.com/posts/why-your-user-interface-is-awkward-youre-ignoring-the-ui-stack/ |
