---
name: product-design
description: >-
  Owns product and UX judgment and correctness: the right interaction, actions
  named by object, scope, and consequence, coverage of every reachable state
  (loading, empty, error, permission, partial, destructive, offline),
  resilience, and accessibility as a product concern. Routes by request mode:
  shape, implement, review, copy, harden. Cites stable rule IDs and defers to
  the project's own design system and AGENTS.md. Use when asked "is this the
  right interaction", "design the flow for", "what should this button do",
  "name this action", "did we cover all the states", "review this UX decision",
  "make this resilient", or "what breaks here". Not for visual direction or
  building UI (use ui-design), page-level rendered-UI or accessibility audits
  (use ui-audit), React or Next diff-level UX bug hunts (use ux-audit), or copy
  wording and AI-ism removal (use copywriting).
---

# Product Design

Make the interface correct for the user, the product, and the team. Working code is not enough: choose the right interaction, make scope and consequence clear, cover reality beyond the happy path, and verify the rendered result. This skill owns the decision of what should exist; it routes the visual build, the rendered audit, the code-level review, and the copy wording to the skills that own those.

- **IS:** product and UX judgment on an intent, spec, mockup, or diff: choosing the right interaction and control, naming the object, scope, and consequence of actions, covering every reachable state, resilience, and accessibility as a product concern. It decides, then routes implementation out.
- **IS NOT:**
  - visual direction, palettes, type, or building UI in code: use `ui-design`.
  - page-level rendered UI and accessibility-markup audits: use `ui-audit`.
  - React or Next diff-level UX bug hunting with a ship verdict: use `ux-audit`.
  - copy wording, persuasion, or AI-ism removal: use `copywriting`.
  - deep typography or motion: use `typography-audit` or `ui-animation`.

The line that prevents collapse into `ux-audit`: that skill reviews the *code* of a React diff and returns line-level fixes and a verdict. This skill reviews the *decision* (which control, what the action is named, which states are reachable) on any artifact, and hands the implementation to the owning skill.

## Operating contract

- Start with the job, not the pixels. Identify who is acting, what they want to accomplish, the object involved, and what the system will change.
- Use evidence, not taste. Trace each decision to product behavior, canonical project guidance, an accepted decision, or a verified adjacent pattern.
- Cite a stable rule ID for every finding or non-mechanical decision. Never invent an ID; if none fits, record a coverage gap.
- The project's own design system and `AGENTS.md` outrank this skill's defaults. Defer to them.
- Never restyle or rebuild. Decide, then route the build to `ui-design`.
- Design every reachable state, not just the populated success case.
- Verify the real surface. Source inspection establishes behavior; a rendered interface establishes visual and interaction quality. Never claim visual verification from code alone.
- One mode per request. Resolve it from the user's verb before acting.

## Request modes

Resolve the mode from the user's verb and artifact, then load only that mode's references.

| Mode | Dispatch when the user asks for | Load |
|------|--------------------------------|------|
| **shape** (default) | "design the flow for", "what control here", "how should this work", "is this the right pattern", a brief with no settled UI | `references/product-judgment.md`, `references/surfaces.md` |
| **implement** | "wire up the right interaction", "make sure this covers the states", judgment applied to an in-progress build | `references/surfaces.md`, `references/naming-and-copy.md`; route the build to `ui-design` |
| **review** | "review this for product correctness", "what's wrong with this UX decision", "audit this flow" | `references/interface-quality.md`, `references/rules.md` |
| **copy** | "name this action", "what should this button or dialog say" | `references/naming-and-copy.md`; route wording to `copywriting` |
| **harden** | "make this resilient", "what breaks here", error, permission, offline, and destructive paths | `references/surfaces.md`, `references/interface-quality.md` (Resilience) |

Modes chain: shape leads into implement; review leads into harden. When intent is ambiguous, use the narrowest mode the verb supports. A URL, screenshot, route, or component identifies scope; it does not by itself authorize edits.

A material decision changes the user's task, default, scope, consequence, navigation, interaction surface, or reachable states. Copy mechanics, token swaps, and established component substitutions usually are not material.

## Decision authority

Resolve conflicts in this order, highest first:

1. The user's explicit goal and constraints.
2. Verified user and product evidence, and what the system actually does.
3. Project-canonical guidance: `AGENTS.md` or `CLAUDE.md`, the project's design system, and routed sibling skills.
4. Sibling-skill ownership. Route, do not duplicate:
   - visual direction and build: `ui-design`
   - rendered quality and a11y-markup audit: `ui-audit`
   - React or Next behavior review and verdict: `ux-audit`
   - copy wording and AI-ism removal: `copywriting`
5. This skill's product design standards (below).
6. General interface and platform conventions.

When a request spans authorities, name the owning skill and hand off rather than acting outside this skill's slice.

## Workflow

```
Product design pass:
- [ ] Step 1: Classify the request into exactly one mode
- [ ] Step 2: Locate authority (user constraints, project design system, AGENTS.md)
- [ ] Step 3: Load only that mode's reference files
- [ ] Step 4: Identify the object, scope, and consequence of each action in scope
- [ ] Step 5: Enumerate reachable states and check coverage (surfaces.md)
- [ ] Step 6: Apply the standards; cite a stable rule ID per finding or decision
- [ ] Step 7: Emit output (review and harden use P0-P3) and route follow-on work to siblings
```

For shape, implement, harden, or any material product or flow change, write the compact internal brief in `references/product-judgment.md` before proposing UI: user, job, current behavior, desired outcome, success signal, non-goals, object, action, consequence, reversibility, permissions, and open decisions.

## Product design standards

Five pillars. Each cites its governing rule IDs in `references/rules.md` and points to its reference.

- **Right interaction.** Pick the control from the shape of the choice; keep options visible and reversible; prefer inline disclosure before a modal; choose the smallest coherent intervention. `rule/control-matches-cardinality`, `rule/navigation-vs-action`, `rule/inline-before-modal`, `rule/smallest-intervention`. See `references/product-judgment.md`.
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

For each finding: location (file and line, or rendered location and viewport), verification status, the rule ID, the user consequence, and the smallest concrete fix with the skill that owns implementing it. Keep findings at the decision altitude; a line-level framework fix is `ux-audit`'s output, not this skill's. Full rubric in `references/interface-quality.md`.

## Linters vs agent guidance

Deterministic, structural, single-file checks belong in a linter; judgment that needs product context stays in this skill. This skill ships a real, installable ESLint plugin for the deterministic slice (control selection, nested modals, accessible names, design-system overrides, modal scroll, raw shadows, off-grid spacing). It is a working package with tests, not a snippet.

See `references/lint/README.md` for the rules, the install and config, and the full "lint rule vs agent guidance" decision tree. Counting 2-3 static options is mechanical, so it is a lint rule; naming the right object and consequence needs product context, so it stays here.

## Evals and the review loop

Keep this skill calibrated. Evals test whether the guidance still produces the right edits on unseen interfaces; a weekly review loop gathers evidence and prepares guideline updates for human review. Both are recommended practice, not runtime behavior. See `references/evals/README.md` for the fixture shape, the judge rubric, and the collector, judge, and human-review loop.

## Gotchas

- Do not restyle or rebuild. That is `ui-design`. This skill decides, then routes.
- Do not re-run `ux-audit`'s diff rules here. "Review this PR for UX bugs" goes to `ux-audit`; this skill reviews the decision, not the code, and returns no framework fix patches.
- Do not invent rule IDs. Cite only IDs in `references/rules.md` (or, for copy, in `copywriting/references/ui-states.md`).
- A mockup with only a happy path is a P1 minimum, not a pass (`rule/cover-reachable-states`).
- The project's design system outranks this skill's defaults. Do not impose a pattern the project already decided against.
- "Accessibility as a product concern" means keyboard-completable flows and understandable states, not axe-clean markup. Route the markup audit to `ui-audit`.
- A select with two options is not a style nit; it is `rule/control-matches-cardinality`, and the lint rule catches it.

## Related skills

- `ui-design`: visual direction and building the decided interaction in code.
- `ui-audit`: page-level rendered quality and accessibility-markup audit of the built result.
- `ux-audit`: React or Next diff-level UX bug hunt with a ship verdict.
- `copywriting`: the wording of names, errors, and empty and loading copy; defines the shared copy rule IDs in its `references/ui-states.md`.
- `typography-audit`, `ui-animation`: type and motion.
