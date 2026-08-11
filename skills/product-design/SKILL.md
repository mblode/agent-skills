---
name: product-design
description: >-
  Decides what an interface should do before UI is built or audited:
  interaction choice, action scope and consequence, reachable states,
  resilience, and accessibility as task completion. Works from a brief, spec,
  mockup, intent, or existing UI. Use when asked "is this the right
  interaction", "design the flow", "what control should this use", "what should
  this action affect", "which states should this have", "make this resilient",
  or "what breaks here". Decides which states exist; also owns a gesture that
  replaces a control, such as swipe-to-delete or hold-to-confirm, because it
  changes what a user can do. For what a state looks like once built use
  ui-design; for built-code audits use ui-design Audit mode; for the passage
  between states use ui-animation; for copy wording use copywriting.
---

# Product Design

Decide what the interface should do, then route who builds and verifies it: pick the right interaction, make scope and consequence clear, cover reality beyond the happy path. This skill owns the decision; it routes the build, verification, and copy out (ownership map in Related skills).

- **IS:** the decision layer. From a brief, spec, mockup, intent, or existing UI: choose the right interaction and control, name the object, scope, and consequence of actions, enumerate every reachable state, set resilience expectations, require accessibility as task completion. It decides, then routes build and verification out.
- **IS NOT:**
  - building or styling UI, visual direction, palettes, type: use `ui-design`.
  - auditing the built result (rendered quality, a11y markup, keyboard, layout, performance, type surface, React/Next code-level UX with a ship verdict): use `ui-design` Audit mode.
  - copy wording, persuasion, or AI-ism removal: use `copywriting`.
  - deep typography or motion: use `typography-audit` or `ui-animation`.

## product-design, ui-design, or ui-animation?

An interface is a set of states and the passages between them. That decomposition assigns the work.

| The question is about | Use |
|---|---|
| Which states exist, what an action affects, whether it is reversible | this skill |
| What a state looks like once built: markup, type, colour, layout, hierarchy | `ui-design` |
| The passage between two states: timing, easing, springs, gesture physics | `ui-animation` |

- **Subject beats artifact.** When motion is what the request is about, it is `ui-animation` whether or not code exists yet. Otherwise code, a diff, or a running UI in hand is `ui-design`, and a brief, spec, mockup, or intent with no code is this skill.
- **Capability beats presentation.** With code in hand, ask whether the change alters what a user can *do*, which objects an action affects, whether it is reversible, or whether a state exists at all. That is a capability, so this skill decides and `ui-design` implements. If it only changes how the same capability looks, reads, or behaves, `ui-design` owns it end to end.
- **A gesture that replaces a control is a capability decision.** Swipe-to-delete, hold-to-confirm, and drag-to-reorder change what the user can do and how recoverable it is, so this skill settles the interaction and `ui-animation` builds its physics.

Worked: "Delete should be undoable" is this skill. "The undo toast is ugly" is `ui-design`. "The undo toast should slide, not pop" is `ui-animation`.

One artifact often needs both in sequence: this skill decides the states that must exist, `ui-design` Audit mode verifies the built code and rendered result implement them. This skill reviews the *decision* and stops at decision altitude; it never writes line-level code fixes.

## Operating contract

- Cite a stable rule ID for every finding or non-mechanical decision. Never invent an ID; if none fits, record a coverage gap.
- The project's design system and `AGENTS.md` outrank this skill's defaults. Defer to them.
- Never restyle or rebuild. Decide, then route the build to `ui-design`.
- One mode per request, resolved from the user's verb before acting.

## Request modes

Resolve the mode from the user's verb and artifact, then load only that mode's references.

| Mode | Dispatch when the user asks for | Load |
|------|--------------------------------|------|
| **shape** (default) | "design the flow for", "what control here", "how should this work", "is this the right pattern", a brief with no settled UI | `references/product-judgment.md`, `references/surfaces.md` |
| **spec** | "spec the right interaction", "define the expected states", judgment applied before or during a build | `references/surfaces.md`, `references/naming-and-copy.md`; route the build to `ui-design` |
| **review** | "review this for product correctness", "what's wrong with this UX decision", "audit this flow" | `references/interface-quality.md`, `references/rules.md` |
| **action** | "what should this action affect", "which object or scope does this action cover", or action reversibility is unsettled | `references/naming-and-copy.md`; route final wording polish to `copywriting` |
| **harden** | "make this resilient", "what breaks here", error, permission, offline, and destructive paths | `references/surfaces.md`, `references/interface-quality.md` |

Modes chain: shape leads into spec; review leads into harden. When intent is ambiguous, use the narrowest mode the verb supports. A URL, screenshot, route, or component identifies scope; it does not authorize edits.

A material decision: see `references/product-judgment.md`.

## Decision authority

Conflict order, highest first:

1. The user's explicit goal and constraints.
2. Verified user and product evidence, and what the system actually does.
3. Project-canonical guidance: `AGENTS.md` or `CLAUDE.md`, the project's design system, routed sibling skills.
4. Sibling-skill ownership: route, do not duplicate (ownership map in Related skills).
5. This skill's product design standards (below).
6. General interface and platform conventions.

When a request spans authorities, name the owning skill and hand off.

## Workflow

```
Product design pass:
- [ ] Step 1: Classify the request into one mode
- [ ] Step 2: Locate authority (user constraints, project design system, AGENTS.md)
- [ ] Step 3: Load only that mode's reference files
- [ ] Step 4: Identify object, scope, and consequence of each action in scope
- [ ] Step 5: Enumerate reachable states; check coverage (surfaces.md)
- [ ] Step 6: Apply standards; cite a stable rule ID per finding or decision
- [ ] Step 7: Emit output (review and harden use P0-P3); route follow-on work to siblings
- [ ] Step 8: Run the pass self-check and report its counts
```

For shape, spec, harden, or any material product or flow change, write the compact internal brief specified in `references/product-judgment.md` before proposing UI. If its job, desired outcome, and consequence fields cannot be filled in, stop and ask rather than guessing.

## Pass self-check

Close every pass with these counts, and label the pass `INCOMPLETE` if any line fails:

- Rules cited versus rules applicable to the surfaces in scope (name the applicable ones you did not reach).
- Findings or non-mechanical decisions carrying no rule ID from `references/rules.md`: must be zero.
- Coverage gaps recorded for every decision no existing rule governs.
- Internal brief present with job, desired outcome, and consequence filled, for shape, spec, and harden.

## Product design standards

Five pillars. Each cites its governing rule IDs in `references/rules.md` and its reference.

- **Right interaction.** Pick the control from the choice's shape; keep options visible and reversible; prefer inline disclosure over a modal; choose the smallest coherent intervention. `rule/control-matches-cardinality`, `rule/navigation-vs-action`, `rule/inline-before-modal`, `rule/smallest-intervention`. See `references/product-judgment.md`.
- **Action naming.** Name the object, scope, and consequence; destructive CTAs use Verb plus Noun, never "Confirm" or "OK"; make friction proportional to impact and offer undo when honest. `rule/name-object-scope-consequence`, `rule/destructive-names-action`, `rule/destructive-proportional`. See `references/naming-and-copy.md`.
- **State coverage.** Design every reachable state, not just the populated one; empty states name the object and a first action; errors explain and offer recovery; preserve user input. `rule/cover-reachable-states`, `rule/empty-state-action`, `rule/error-states-recovery`, `rule/preserve-user-input`. See `references/surfaces.md`.
- **Resilience.** Require that overflow, extreme data, localization and RTL, and network-failure states be designed; every fetch lands in a designed state. `rule/cover-reachable-states`. See `references/surfaces.md`. Whether the built UI renders them correctly is `ui-design` Audit mode's check.
- **Accessibility as a product concern.** Every control has an accessible name; the primary flow is completable by keyboard with visible focus; state and consequence are understandable, not just labeled. `rule/accessible-name-required`, `rule/keyboard-complete-flow`, `rule/no-custom-focus-bypass`. Route axe-style markup checks to `ui-design` Audit mode. See `references/interface-quality.md`.

## Review output

In review and harden modes, lead with findings ordered by user impact (P0-P3), each with location, verification status, rule ID, user consequence, and the smallest concrete fix with the skill that owns it. Keep findings at decision altitude; a line-level code or framework fix is `ui-design` Audit mode's output. Full severity rubric and finding format in `references/interface-quality.md` > Severity rubric.

## Linters vs agent guidance

Deterministic, structural, single-file checks (control selection by option count, nested modals, missing accessible names) belong in the consuming project's linter, wired to that project's components; judgment that needs product context (which object, what consequence) stays here. See `references/lint-patterns.md` for the decision tree and the rules worth encoding.

## Gotchas

- Emitting a line-level fix (a prop, a hook, a `className`) instead of the decision. It arrives without the rendered check that would validate it, and the product decision it was supposed to carry goes unstated. Route it to `ui-design` Audit mode.
- Proposing UI when the internal brief's job, desired outcome, or consequence field cannot be filled. Every finding after that rests on a guessed job, so stop and ask (`references/product-judgment.md`).
- Citing a plausible-sounding rule ID that does not exist (`rule/clear-labels`). The citation resolves to nothing, so the finding cannot be deduped against a sibling audit or traced to a rule. Record a coverage gap instead.

## Related skills

- `ui-design`: visual direction and building the decided interaction in code; its Audit mode covers the built result, both rendered quality and accessibility-markup audit and React or Next diff-level UX bug hunt with a ship verdict.
- `copywriting`: exact wording for names, errors, and empty and loading copy; defines shared copy rule IDs in its `references/ui-states.md`.
- `ui-animation`: the passage between two states (timing, easing, springs, gesture physics). This skill settles whether a gesture replaces a control and whether the action it triggers is reversible; that skill builds its physics.
- `typography-audit`: deep type.
- Taste Training (blode.co/taste-training): trains the eye these rules encode, across type, copy, craft, interaction, and motion.
