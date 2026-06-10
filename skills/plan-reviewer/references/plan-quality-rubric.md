# Plan Quality Rubric

Used during Step 2 (Triage) to score each dimension 1-5 and identify the weakest areas for deep-dive questioning.

## Scoring Scale

| Score | Label | Meaning |
|-------|-------|---------|
| 5 | Strong | Explicitly addresses this dimension with specifics. No visible gaps. |
| 4 | Adequate | Covers this dimension but lacks some specificity. Minor gaps only. |
| 3 | Partial | Mentions this dimension but significant gaps exist. Key scenarios unaddressed. |
| 2 | Weak | Barely touches this dimension. Multiple critical gaps. |
| 1 | Missing | Does not address this dimension at all. |

## Dimension-Specific Indicators

### Completeness

- **5:** Every new flow has explicit error handling. Rollback or recovery documented. Edge cases listed. Cleanup steps present.
- **4:** Main flows covered. Error handling mentioned but not specific. Minor edge cases missing.
- **3:** Happy path described. Error handling hand-waved ("handle errors appropriately"). No rollback.
- **2:** Only the core action described. No mention of failure paths or edge cases.
- **1:** Plan describes what to build but not how it handles any non-ideal scenario.

### Feasibility

A good plan delivers a tracer bullet first: a minimum viable slice across the full stack to prove the approach works.

- **5:** Technical approach validated. Dependencies confirmed. Performance characteristics known. Hardest parts explicitly identified with solutions. Tracer bullet or vertical slice identified.
- **4:** Approach is reasonable. Most dependencies verified. One or two unvalidated assumptions about capabilities.
- **3:** Approach plausible but unproven. Some steps described vaguely. External dependencies mentioned without confirmation they support the use case.
- **2:** Multiple steps rely on unverified assumptions. Key technical questions unanswered. Builds horizontal layers instead of proving a slice.
- **1:** Approach is aspirational. No evidence the proposed solution actually works at the required scale/complexity.

### Scope

KISS > YAGNI. The simplest plan that solves the problem is the best plan. Duplication is cheaper than the wrong abstraction.

- **5:** Every item directly serves the stated goal. No "nice to have" mixed with requirements. Explicitly states what is out of scope. Abstractions earned by repetition, not speculation.
- **4:** Mostly focused. One or two items could be deferred without affecting the goal.
- **3:** Several items that aren't strictly necessary. Premature abstractions or optimizations present. Designing for hypothetical futures.
- **2:** Significant feature creep. Multiple items justified by "might need later." Wrong abstractions introduced before the pattern is clear.
- **1:** Plan scope far exceeds the stated goal. Unclear what's core vs. optional. Over-engineered.

### Testability

- **5:** Verification section present. Specific test cases or commands listed. Clear "done" criteria. Integration test strategy for external dependencies.
- **4:** Verification mentioned. Some test cases listed but not comprehensive. "Done" criteria stated at high level.
- **3:** "Add tests" mentioned without specifics. Verification section is one line. No integration test strategy.
- **2:** Testing mentioned in passing only. No concrete test cases. No verification commands.
- **1:** No mention of how to verify the implementation works.

### Risk

- **5:** Failure modes identified. Blast radius stated. Mitigation strategies present. Rollout strategy (gradual, feature-flagged) appropriate to risk level.
- **4:** Major risks identified. Blast radius roughly scoped. One or two mitigations present.
- **3:** Risk acknowledged in general terms. No specific failure modes traced. No mitigation.
- **2:** Risk minimized ("this is low risk") without evidence. No failure mode analysis.
- **1:** No risk discussion. Plan assumes everything will work first time.

### Assumptions

- **5:** Assumptions explicitly listed and marked as verified or unverified. External conditions stated. Invalidation criteria present.
- **4:** Key assumptions stated. Most appear verified. One or two implicit assumptions identifiable.
- **3:** Some assumptions stated but several implicit ones not acknowledged. No invalidation criteria.
- **2:** Plan built on multiple unstated assumptions. Claims presented as facts without sources.
- **1:** No assumptions acknowledged. Plan reads as if the approach is self-evidently correct.

## Triage Decision

The goal is to drive every dimension to 5/5. After scoring all six:
1. Work each dimension scoring <5 upward in ascending order (weakest first). Re-score after each round and re-sweep anything still below 5; repeat until all six are 5/5 or stalled.
2. A dimension is **stalled** when it can't reach 5/5 after 2 pushes and the user defers or declines the proposed fix. Record what blocks 5/5 and move on.
3. If more than 3 dimensions score 1-2, the plan needs rewriting; say so directly and suggest `plan-creator` rather than grinding the loop.
4. Always check Scope regardless of score. KISS/YAGNI violations are the most common plan weakness and the easiest to miss because complexity feels like thoroughness. Driving toward 5/5 means tightening scope, not padding the plan to look thorough.
