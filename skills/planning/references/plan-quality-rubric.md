# Plan Quality Rubric

Used in Step 2 (Triage) to score each dimension 1-5 and find the weakest areas for deep-dive questioning.

## Scoring Scale

| Score | Label | Meaning |
|-------|-------|---------|
| 5 | Strong | Addresses this dimension with specifics. No visible gaps. |
| 4 | Adequate | Covers it but lacks some specificity. Minor gaps only. |
| 3 | Partial | Mentions it but significant gaps exist. Key scenarios unaddressed. |
| 2 | Weak | Barely touches it. Multiple critical gaps. |
| 1 | Missing | Does not address it at all. |

## Dimension-Specific Indicators

### Completeness

- **5:** Every new flow has explicit error handling. Rollback or recovery documented. Edge cases listed. Cleanup steps present.
- **4:** Main flows covered. Error handling mentioned but not specific. Minor edge cases missing.
- **3:** Happy path described. Error handling hand-waved ("handle errors appropriately"). No rollback.
- **2:** Only the core action described. No failure paths or edge cases.
- **1:** Describes what to build but not how it handles any non-ideal scenario.

### Feasibility

A good plan delivers a tracer bullet first: a minimum viable slice across the full stack to prove the approach.

- **5:** Approach validated. Dependencies confirmed. Performance characteristics known. Hardest parts identified with solutions. Tracer bullet or vertical slice identified.
- **4:** Approach reasonable. Most dependencies verified. One or two unvalidated capability assumptions.
- **3:** Approach plausible but unproven. Some steps vague. External dependencies mentioned without confirming they support the use case.
- **2:** Multiple steps rely on unverified assumptions. Key technical questions unanswered. Builds horizontal layers instead of proving a slice.
- **1:** Approach is aspirational. No evidence it works at the required scale/complexity.

### Scope

- **5:** Every item serves the stated goal. No "nice to have" mixed with requirements. States what is out of scope. Abstractions earned by repetition, not speculation. New code and dependencies justified against the ladder of least code.
- **4:** Mostly focused. One or two items could be deferred without affecting the goal.
- **3:** Several non-essential items. Premature abstractions or optimizations. Designing for hypothetical futures.
- **2:** Significant feature creep. Multiple items justified by "might need later." Wrong abstractions before the pattern is clear.
- **1:** Scope far exceeds the goal. Unclear what's core vs optional. Over-engineered.

### Testability

- **5:** Verification section present. Specific test cases or commands listed. Clear "done" criteria. Integration test strategy for external dependencies.
- **4:** Verification mentioned. Some test cases but not comprehensive. "Done" criteria at high level.
- **3:** "Add tests" without specifics. Verification section is one line. No integration test strategy.
- **2:** Testing mentioned in passing. No concrete test cases. No verification commands.
- **1:** No mention of how to verify the implementation works.

### Risk

- **5:** Failure modes identified. Blast radius stated. Mitigations present. Rollout strategy (gradual, feature-flagged) appropriate to risk level.
- **4:** Major risks identified. Blast radius roughly scoped. One or two mitigations.
- **3:** Risk acknowledged in general terms. No specific failure modes traced. No mitigation.
- **2:** Risk minimized ("this is low risk") without evidence. No failure mode analysis.
- **1:** No risk discussion. Assumes everything works first time.

### Assumptions

- **5:** Assumptions explicitly listed and marked verified or unverified. External conditions stated. Invalidation criteria present.
- **4:** Key assumptions stated. Most appear verified. One or two implicit assumptions identifiable.
- **3:** Some assumptions stated but several implicit ones unacknowledged. No invalidation criteria.
- **2:** Built on multiple unstated assumptions. Claims presented as facts without sources.
- **1:** No assumptions acknowledged. Reads as if the approach is self-evidently correct.

## Triage Decision

Drive every dimension to 5/5. After scoring all six:

1. Work each dimension <5 upward, weakest first. Re-score after each round, re-sweep anything still below 5; repeat until all six hit 5/5 or stall.
2. A dimension is **stalled** when it can't reach 5/5 after 2 pushes and the user defers or declines the fix. Record the blocker and move on.
3. If more than 3 dimensions score 1-2, the plan needs rewriting: say so directly and switch to Create mode rather than grinding the loop.
4. Always check Scope regardless of score. Scope creep is easy to miss because complexity feels like thoroughness. Driving to 5/5 means tightening scope, not padding the plan to look thorough.
