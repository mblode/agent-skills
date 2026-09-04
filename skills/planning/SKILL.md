---
name: planning
description: Creates and reviews executable implementation plans grounded in repository evidence, with vertical slices, explicit decisions, and verification criteria. Use when asked to "plan this feature", "stress-test this plan", "grill me", or "split this into tickets". For architecture use codebase-architecture; for code review use pr-reviewer.
---

# Planning

Produce an executable plan, or strengthen an existing one. Planning alone produces no implementation edits. When the user asks to plan and implement, finish the plan and continue within the host's active mode and authorization.

- **Create:** no plan exists; ground the approach in the repository and write the plan.
- **Review:** a plan exists; verify its consequential claims and resolve concrete gaps in the file.
- **Interview:** the user asks to be grilled or interviewed; explore decisions interactively.
- **Split:** multiple independently deliverable outcomes need tickets with native dependency links.

For architecture contracts use `codebase-architecture`; for code findings use `pr-reviewer`.

## References

| File | Read when |
|---|---|
| `references/interrogation-protocol.md` | A consequential choice is unresolved, or the user requested an interview |
| `references/doc-grounding.md` | ADRs, specifications, or library docs constrain the approach |
| `references/handoff-plans.md` | Another session or person will execute the plan |
| `references/plan-quality-rubric.md` | Reviewing completeness, feasibility, scope, testability, risk, and assumptions |
| `references/questioning-framework.md` | A review gap needs a focused user question |
| `references/claim-verification.md` | A plan claim can be checked against code or documentation |
| `references/splitting.md` | Decomposing work into executable tickets |

## Workflow

1. Identify the requested outcome and authoritative plan path. Use the host's plan file where one exists. A durable handoff goes at the project path, default `docs/plans/<slug>.md`; name which copy is authoritative.
2. Inspect the modules, tests, and decisions that constrain this change. Resolve questions the repository answers yourself. Ask only when an unresolved choice materially changes scope, behavior, or a hard-to-reverse action. Routine assumptions belong in the draft.
3. Choose the smallest vertical slice that exercises the real boundary. Name the existing code or platform capability it extends. A new dependency or abstraction needs a current requirement the existing mechanism cannot satisfy.
4. Write the plan with the contract below. Review the consequential claims once against the rubric; fix evidenced gaps directly. Interview mode can explore competing approaches, but has no minimum question count.
5. Return the plan path, unresolved decisions, and verification limits. Use the host's approval mechanism when its mode requires it. Do not add a second approval question for the plan's own review.

## Plan contract

Include only sections this change needs:

- **Outcome:** triggering problem, intended behavior, and acceptance criteria.
- **Approach:** chosen slice, affected files or interfaces, and migration order where applicable.
- **Decisions:** evidence for consequential choices; assumptions that remain unverified.
- **Boundaries:** exclusions only where an adjacent change would plausibly be mistaken for scope.
- **Verification:** a command, test scenario, or observation tied to each material acceptance criterion, including expected failure behavior.
- **Recovery:** rollback or recovery for migrations and irreversible writes.

A handoff is self-contained. Replace "as discussed" with the decision. Preserve user corrections in the file, not just the chat. Split tickets by shippable outcome, not database/backend/frontend layers.

## Review completion

Resolve gaps supported by code, the task, or operational constraints. Do not add speculative requirements to improve a self-score. Scores are optional unless requested; when used, mark unverified claims and explain residual gaps rather than iterating until every cell says 5/5.

Repeat review only after a substantive edit or new evidence. A user decision that remains unanswered is recorded at the affected step; continue independent work. If the user says to skip questions, draft from available evidence and label the assumptions.

## Gotchas

- A plan in `~/.claude/plans/` is not available to other checkouts or CI. Durable handoffs need a project artifact.
- A bare "run tests" step does not establish the changed behavior. Name the acceptance scenario and expected result.
- Publishing slices without native blocker relations leaves the execution queue unaware of dependencies.
- A plan written for a prior revision can name moved files. Verify consequential paths and interfaces against the current checkout.

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
