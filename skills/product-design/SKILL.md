---
name: product-design
description: >-
  Decides what an interface should do before UI is built or audited:
  interaction choice, action scope and consequence, reachable states,
  resilience, and accessibility as task completion. Works from a brief, spec,
  mockup, intent, or existing UI. Use when asked "is this the right
  interaction", "design the flow", "what control should this use", "what should
  this action affect", "which states should this have", "make this resilient",
  or "what breaks here". For building or styling use ui-design; for built-code
  audits use ui-audit; for copy wording use copywriting.
---

# Product Design

Decide what the interface should do, then route who builds and verifies it: pick the right interaction, make scope and consequence clear, cover reality beyond the happy path. This skill owns the decision; it routes the build, verification, and copy out (ownership map in Related skills).

- **IS:** the decision layer. From a brief, spec, mockup, intent, or existing UI: choose the right interaction and control, name the object, scope, and consequence of actions, enumerate every reachable state, set resilience expectations, require accessibility as task completion. It decides, then routes build and verification out.
- **IS NOT:**
  - building or styling UI, visual direction, palettes, type: use `ui-design`.
  - auditing the built result (rendered quality, a11y markup, keyboard, layout, performance, type surface, React/Next code-level UX with a ship verdict): use `ui-audit`.
  - copy wording, persuasion, or AI-ism removal: use `copywriting`.
  - deep typography or motion: use `typography-audit` or `ui-animation`.

## product-design or ui-audit?

Dispatch on the artifact, not the topic. Both care about states and interaction; they act at different moments.

| You have... | The question is | Use |
|---|---|---|
| A brief, spec, mockup, intent, or a UI you decide *about* | What should exist: the right interaction, the action's name, which states *should* be reachable | `product-design` |
| Code, a diff, or a running UI you decide *on* | Is the built result right: states covered, accessible, renders and behaves correctly, ready to ship | `ui-audit` |

One artifact often needs both in sequence: `product-design` decides the states that must exist, `ui-audit` verifies the built code and rendered result implement them. Looking at code or a running screen is `ui-audit`'s turn. This skill reviews the *decision* and stops at decision altitude; it never writes line-level code fixes.

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
| **harden** | "make this resilient", "what breaks here", error, permission, offline, and destructive paths | `references/surfaces.md`, `references/interface-quality.md` (Resilience) |

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
```

For shape, spec, harden, or any material product or flow change, write the compact internal brief in `references/product-judgment.md` before proposing UI: user, job, current behavior, desired outcome, success signal, non-goals, object, action, consequence, reversibility, permissions, and open decisions.

## Product design standards

Five pillars. Each cites its governing rule IDs in `references/rules.md` and its reference.

- **Right interaction.** Pick the control from the choice's shape; keep options visible and reversible; prefer inline disclosure over a modal; choose the smallest coherent intervention. `rule/control-matches-cardinality`, `rule/navigation-vs-action`, `rule/inline-before-modal`, `rule/smallest-intervention`. See `references/product-judgment.md`.
- **Action naming.** Name the object, scope, and consequence; destructive CTAs use Verb plus Noun, never "Confirm" or "OK"; make friction proportional to impact and offer undo when honest. `rule/name-object-scope-consequence`, `rule/destructive-names-action`, `rule/destructive-proportional`. See `references/naming-and-copy.md`.
- **State coverage.** Design every reachable state, not just the populated one; empty states name the object and a first action; errors explain and offer recovery; preserve user input. `rule/cover-reachable-states`, `rule/empty-state-action`, `rule/error-states-recovery`, `rule/preserve-user-input`. See `references/surfaces.md`.
- **Resilience.** Survive overflow, extreme data, localization and RTL, and network failure; every fetch lands in a designed state. See `references/interface-quality.md` (Resilience).
- **Accessibility as a product concern.** Every control has an accessible name; the primary flow is completable by keyboard with visible focus; state and consequence are understandable, not just labeled. `rule/accessible-name-required`, `rule/keyboard-complete-flow`, `rule/no-custom-focus-bypass`. Route axe-style markup checks to `ui-audit`. See `references/interface-quality.md`.

## Review output

In review and harden modes, lead with findings ordered by user impact:

- **P0:** blocks the primary task, a severe accessibility failure, or unrecoverable user harm (data loss, permission bypass, an unintelligible destructive action).
- **P1:** likely task failure, a misleading consequence, a missing critical state, or a major responsive or accessibility defect.
- **P2:** meaningful friction, inconsistency, weak hierarchy, or a recoverability issue.
- **P3:** minor craft or consistency improvement.

For each finding: location (file and line, or rendered location and viewport), verification status, the rule ID, the user consequence, and the smallest concrete fix with the skill that owns implementing it. Keep findings at decision altitude; a line-level code or framework fix is `ui-audit`'s output. Full rubric in `references/interface-quality.md`.

## Linters vs agent guidance

Deterministic, structural, single-file checks (control selection by option count, nested modals, missing accessible names) belong in the consuming project's linter, wired to that project's components; judgment that needs product context (which object, what consequence) stays here. Visual-token checks (raw shadows, off-grid spacing, design-system overrides, modal scroll) belong to `ui-audit` and the project's visual lint. See `references/lint-patterns.md` for the decision tree and example rule shapes.

## Evals and the review loop

Keep this skill calibrated. Evals test whether the guidance still produces the right edits on unseen interfaces; a review loop prepares guideline updates for human review. Both are recommended practice, not runtime behavior. See `references/evals.md` for fixtures, the judge rubric, and the review loop.

## Gotchas

- Do not restyle or rebuild. That is `ui-design`. This skill decides, then routes (see "product-design or ui-audit?").
- Do not invent rule IDs. Cite only IDs in `references/rules.md` (or, for copy, the copywriting skill's `references/ui-states.md`).
- A mockup with only a happy path is a P1 minimum, not a pass (`rule/cover-reachable-states`).
- The project's design system outranks this skill's defaults; do not impose a pattern the project decided against.
- "Accessibility as a product concern" means keyboard-completable flows and understandable states, not axe-clean markup. Route the markup audit to `ui-audit`.
- A select with two options is not a style nit; it is `rule/control-matches-cardinality`, and a project linter can catch it (see `references/lint-patterns.md`).

## Related skills

- `ui-design`: visual direction and building the decided interaction in code.
- `ui-audit`: the built result, both rendered quality and accessibility-markup audit and React or Next diff-level UX bug hunt with a ship verdict.
- `copywriting`: exact wording for names, errors, and empty and loading copy; defines shared copy rule IDs in its `references/ui-states.md`.
- `typography-audit`, `ui-animation`: type and motion.
