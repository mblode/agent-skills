---
name: product-design
description: >-
  Decides what an interface should do before it is built or audited: which
  control fits the choice, whether an action needs a confirmation or an undo,
  what it affects and whether it is reversible, which states must exist, what
  breaks offline or on error, and accessibility as task completion. Works from
  a brief, spec, mockup, intent, or existing UI. Use when asked "is this the
  right interaction", "design the flow", "what control should this use",
  "should this be a modal or inline", "should delete be undoable", "do we need
  a confirm dialog", "what should this action affect", "which states should
  this have", "make this resilient", "what breaks here", "spec the right
  interaction", or "review this flow for product correctness". Owns a gesture
  that replaces a control (swipe-to-delete, hold-to-confirm). For what a state
  looks like once built use ui-design; for built-code audits use ui-design
  Audit mode; for the passage between states use ui-animation; for copy
  wording use copywriting; for agentic trust use ax-audit.
---

# Product Design

Decide what the interface should do, then route who builds and verifies it: pick the right interaction, make scope and consequence clear, cover reality beyond the happy path.

- **IS:** the decision layer. From a brief, spec, mockup, intent, or existing UI: choose the interaction and control, name the object, scope, and consequence of each action, settle reversibility and the safeguard it implies, enumerate every reachable state, set resilience expectations, and require accessibility as task completion. It decides, then routes build, verification, and wording out.
- **IS NOT:**
  - building or styling UI, visual direction, palettes, type: `ui-design`.
  - auditing the built result (rendered quality, a11y markup, keyboard, layout, performance, React or Next code-level UX with a ship verdict): `ui-design` Audit mode.
  - copy wording, persuasion, or AI-ism removal: `copywriting`.
  - motion, gesture physics, or deep typography: `ui-animation`, `typography-audit`.
  - whether an agentic feature earns trust: `ax-audit`.

## product-design, ui-design, or ui-animation?

An interface is a set of states and the passages between them. That decomposition assigns the work.

| The question is about | Use |
|---|---|
| Which states exist, what an action affects, whether it is reversible | this skill |
| What a state looks like once built: markup, type, colour, layout, hierarchy | `ui-design` |
| The passage between two states: timing, easing, springs, gesture physics | `ui-animation` |

- **Subject beats artifact.** When motion is the subject, it is `ui-animation` whether or not code exists.
- **Artifact is the opening presumption, not the verdict.** A brief, spec, mockup, or intent with no code is this skill. Code, a diff, or a running UI presumes `ui-design`, and the next test can overturn that: this skill reads existing UI whenever the question is what it should do.
- **Capability beats presentation.** With code in hand, ask whether the change alters what a user can *do*, which objects an action affects, whether it is reversible, or whether a state exists at all. That is a capability: this skill decides and `ui-design` implements. If it only changes how the same capability looks, reads, or behaves, `ui-design` owns it end to end.
- **A gesture that replaces a control is a capability decision.** Swipe-to-delete, hold-to-confirm, and drag-to-reorder change what the user can do and how recoverable it is, so this skill settles the interaction (including its non-gesture alternative) and `ui-animation` builds its physics.
- **Choosing between surfaces with different reachability is a capability.** Modal against inline, drawer against full page, dialog against toast each change what stays visible, how the task is dismissed, and where focus lands (`rule/inline-before-modal`). Styling whichever is chosen is `ui-design`'s.
- **A missing state nobody would debate is `ui-design`'s to detect and build.** An empty list, a failed fetch, and a pending submit obviously need a state; its `states-` rules find and fix them. This skill decides which states must exist only where that is genuinely open: whether a partial, expired, or offline state should exist at all.

Worked: "Delete should be undoable" is this skill. "The undo toast is ugly" is `ui-design`. "The undo toast should slide, not pop" is `ui-animation`. One artifact often needs both in sequence: this skill decides the states that must exist, then `ui-design` Audit mode verifies the built code implements them.

## Request modes

Resolve one mode from the user's verb and artifact before acting, then load that mode's references. `references/rules.md` loads in **every** mode: every finding cites a rule ID from it, and you cannot conclude that no rule governs a decision without the registry in front of you.

| Mode | Dispatch when the user asks for | Load (plus `references/rules.md`) |
|------|--------------------------------|------|
| **shape** (default) | "design the flow for", "what control here", "how should this work", "is this the right pattern", a brief with no settled UI | `references/product-judgment.md`, `references/surfaces.md` |
| **spec** | "spec the right interaction", "define the expected states", judgment applied before or during a build | `references/product-judgment.md`, `references/surfaces.md`, `references/naming-and-copy.md`; route the build to `ui-design` |
| **review** | "review this flow for product correctness", "what's wrong with this UX decision", "is this the right interaction" | `references/interface-quality.md` |
| **action** | "what should this action affect", "should this be undoable", "do we need a confirm dialog", or reversibility is unsettled | `references/naming-and-copy.md`; route final wording to `copywriting` |
| **harden** | "make this resilient", "what breaks here", error, permission, offline, expiry, and destructive paths | `references/surfaces.md`, `references/interface-quality.md`, `references/product-judgment.md` |

**Review mode is about a flow, not an artifact.** "Audit this component", "check my UI", and "design QA this page" point at built markup and belong to `ui-design` Audit mode. This skill's review asks whether the decisions behind a flow are right, and stops at decision altitude.

Modes chain: shape leads into spec; review leads into harden. When intent is ambiguous, use the narrowest mode the verb supports. A URL, screenshot, route, or component identifies scope; it does not authorize edits.

`references/lint-patterns.md` has no mode: read it when deciding whether a standard belongs in the consuming project's linter or in this skill. `evals/evals.json` never loads during a user task; it is the regression set for anyone changing this skill.

## Workflow

```text
Product design pass:
- [ ] Step 1: Classify the request into one mode
- [ ] Step 2: Locate authority (user constraints, project design system, AGENTS.md)
- [ ] Step 3: Load rules.md plus that mode's reference files
- [ ] Step 4: Write the internal brief (shape, spec, harden); stop and ask if job, outcome, or consequence is unfillable
- [ ] Step 5: Name object, scope, consequence, and reversibility for each action in scope (spec, action, review)
- [ ] Step 6: Enumerate reachable states and check coverage (shape, spec, harden)
- [ ] Step 7: Emit output with a rule ID or labeled coverage gap per finding or decision; route follow-on work to siblings
- [ ] Step 8: Run the pass self-check and label the pass INCOMPLETE if any item fails
```

Steps 5 and 6 are mode-scoped because their references are: a pure `action` pass has no state matrix to enumerate, and a `shape` pass has no built actions to name yet.

Output length follows the work, not the template. A single settled decision is a short answer; drop the sections a pass did not need rather than filling them.

## Decision authority

Conflict order, highest first:

1. The user's explicit goal and constraints.
2. Verified user and product evidence, and what the system actually does.
3. Project-canonical guidance: `AGENTS.md` or `CLAUDE.md`, the project's design system, routed sibling skills.
4. Sibling-skill ownership: route, do not duplicate.
5. This skill's standards (below).
6. General interface and platform conventions (WCAG 2.2, NN/g, Apple HIG, Material, GOV.UK), which `references/rules.md` cites per rule.

When a request spans authorities, name the owning skill and hand off.

## Product design standards

Five pillars, each naming its rule IDs in `references/rules.md` and the reference that details it.

- **Right interaction.** Pick the control from the choice's shape; keep options visible and reversible; prefer inline disclosure over a modal; every gesture has a control alternative; choose the smallest coherent intervention. `rule/control-matches-cardinality`, `rule/navigation-vs-action`, `rule/inline-before-modal`, `rule/no-nested-modals`, `rule/gesture-has-control-alternative`, `rule/smallest-intervention`. Detail: `references/product-judgment.md`.
- **Action naming and consequence.** Name the object, scope, and consequence; settle reversibility first, then the pattern; an irreversible action gets review, check, or named confirmation; undo appears only when honest. `rule/name-object-scope-consequence`, `rule/destructive-names-action`, `rule/destructive-proportional`, `rule/irreversible-action-safeguard`, `rule/undo-only-when-honest`, `rule/preserve-user-input`. Detail: `references/naming-and-copy.md`.
- **State coverage.** Design every reachable state, not just the populated one: empty states name the object and a first action; errors explain and offer recovery; timers warn before they discard. `rule/cover-reachable-states`, `rule/empty-state-action`, `rule/error-states-recovery`, `rule/loading-stable-labels`, `rule/time-limit-adjustable`. Detail: `references/surfaces.md`.
- **Resilience.** Overflow, extreme data, localization and RTL, offline, and network failure are designed states; every fetch lands in one. Shares `rule/cover-reachable-states`: it is the same requirement pointed at adverse inputs. Detail: `references/surfaces.md` > Resilience. Whether the built UI renders them is `ui-design` Audit mode's check.
- **Accessibility as task completion.** Every control has a name; the primary flow completes by keyboard with visible focus; nothing already entered is retyped; authentication allows assistance; state and consequence are understandable, not just labeled. `rule/accessible-name-required`, `rule/keyboard-complete-flow`, `rule/no-custom-focus-bypass`, `rule/no-redundant-entry`, `rule/auth-allows-assistance`. Detail: `references/interface-quality.md`. Markup and target-size checks route to `ui-design` Audit mode.

## Review output

In review and harden modes, lead with findings ordered by user impact (P0 to P3), each with location, verification status, rule ID, user consequence, and the smallest concrete fix with the skill that owns it. Keep findings at decision altitude; a line-level code or framework fix is `ui-design` Audit mode's output. Rubric and finding format: `references/interface-quality.md` > Severity rubric.

## Pass self-check

Close every pass with these, and label it `INCOMPLETE` if any fails:

- Every finding and non-mechanical decision carries a rule ID that appears verbatim in `references/rules.md`, or an inline coverage gap labeled proposed.
- The internal brief is present with job, desired outcome, and consequence filled, for shape, spec, and harden.
- Every destructive or consequential action in scope has its reversibility stated and a matching pattern.
- Follow-on work is routed by name (`ui-design`, `ui-animation`, `copywriting`), never done here.

## Gotchas

- A confirmation dialog on a reversible action (archive, remove from list, unsubscribe) trains users to click through, so the one confirmation that matters, permanent delete, gets the same reflexive click. NN/g's "cry wolf" finding. Act and offer undo instead (`rule/destructive-proportional`).
- An undo toast as the only recovery path: it vanishes in about five seconds, and the object is gone. Either the object stays recoverable (Trash, Archive) or the action is irreversible and needs a safeguard. Do not call it undo otherwise (`rule/undo-only-when-honest`, WCAG 2.2.1).
- Swipe-to-delete or drag-to-reorder with no button or menu equivalent fails WCAG 2.5.1 and 2.5.7 outright and is undiscoverable to everyone else. Spec the alternative before routing the physics to `ui-animation` (`rule/gesture-has-control-alternative`).
- A segmented control with three fixed-width English labels: strings under 10 characters grow 200 to 300% in translation (W3C), so "Day / Week / Month" becomes a wrapped or clipped mess in German. Decide the wrap or stack behavior in the spec.
- Reusing the "No projects yet, Create project" empty state for a filtered-to-zero list. The user creates a duplicate because the item they searched for exists behind the filter. Three empties, three designs (`references/surfaces.md`).
- A checkout or sign-up that asks again for something entered two steps earlier (billing address after shipping, email after account) fails WCAG 3.3.7 and is the step where mobile users leave (`rule/no-redundant-entry`).
- Emitting a line-level fix (a prop, a hook, a `className`) instead of the decision. It arrives without the rendered check that would validate it, and the product decision it was supposed to carry goes unstated. Route it to `ui-design` Audit mode.
- Citing a plausible-sounding rule ID that does not exist (`rule/clear-labels`). The citation resolves to nothing, so the finding cannot be deduped against a `ui-design` audit or traced to a rule. Record a coverage gap instead.

## Related skills

- `ui-design`: visual direction and building the decided interaction in code; its Audit mode covers the built result, rendered quality and accessibility markup, with a ship verdict.
- `copywriting`: exact wording for names, errors, and empty and loading copy; defines the shared copy rule IDs in its `references/ui-states.md`.
- `ui-animation`: the passage between two states (timing, easing, springs, gesture physics). This skill settles whether a gesture replaces a control and what its alternative is; that skill builds the motion.
- `ax-audit`: whether a built agentic feature earns trust; this skill decides what it should do first.
- `typography-audit`: deep type.
