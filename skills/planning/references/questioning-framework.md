# Questioning Framework

Six dimensions for plan review, each with question templates and pushback patterns. Adapt templates to the plan; never ask verbatim generic questions. When a "look for" item is checkable against local code or docs (unused helper, unconfirmed library capability, doc that contradicts the plan), verify it yourself first (`claim-verification.md`) and lead with the evidence instead of a question.

## Contents

1. [Completeness](#1-completeness): missing flows, error paths, rollback
2. [Feasibility](#2-feasibility): unproven steps, external dependencies
3. [Scope](#3-scope): unnecessary scope, premature abstractions, wrong abstractions
4. [Testability](#4-testability): verification, "done" criteria, boundary tests
5. [Risk](#5-risk): blast radius, failure modes, broken windows
6. [Assumptions](#6-assumptions): unstated conditions, invalidation

## 1. Completeness

What must exist for this plan to work that is not mentioned?

**Question templates:**
- "You describe [X flow] but not what happens when [Y condition] occurs. What's the behavior?"
- "No rollback section. If this ships and breaks immediately, what's the recovery procedure?"
- "For the [API call / data flow / user action] in section [N], what happens on failure?"
- "What edge cases does [feature] need to handle that aren't listed?"
- "Where are the boundaries of this system? What gets validated at the edges?"

**Push pattern:** "You said 'handle errors appropriately'. Name the three likeliest errors and what the user sees for each."

**Look for:**
- New API calls or data flows without error handling
- State transitions without failure paths
- Missing cleanup or teardown steps
- No handling when external services are unavailable
- No boundary validation (user input, external APIs)

## 2. Feasibility

Which step requires something unproven, unfamiliar, or outside your control?

**Question templates:**
- "Which step requires something you haven't built before?"
- "What's the hardest technical problem here, and how confident are you in the approach?"
- "Does any step depend on an external system you don't control? What's its reliability?"
- "You're proposing [approach]. Verified it works at the scale you need?"
- "Section [N] assumes [library/service] can do [X]. Confirmed, or assumed?"
- "What's the tracer bullet here, the thinnest slice that proves the approach end-to-end?"

**Push pattern:** "You said this is 'straightforward'. Describe the implementation in 3 sentences. If you can't, it's not straightforward."

**Look for:**
- One-sentence steps that actually require significant implementation
- Libraries or APIs cited without evidence they support the use case (checkable: read the docs or types first)
- Performance assumptions without benchmarks
- "Then we just..." phrasing (minimizing complexity)
- No tracer bullet: plan builds horizontal layers instead of a vertical slice first

## 3. Scope

What's not strictly necessary to achieve the stated goal? Keep repetition when the proposed abstraction lacks a shared invariant, owner, lifecycle, or failure mode.

**Question templates:**
- "Which parts aren't required to achieve the goal stated in the Context section?"
- "If you had to ship in half the time, what would you cut?"
- "Is there a simpler approach that gets 80% of the value for 20% of the effort?"
- "[Feature X] is in the plan. What user problem does it solve that the rest doesn't?"
- "You're building [abstraction]. What invariant, owner, lifecycle, or failure mode does it protect today?"
- "These call sites look similar. Do they encode the same business rule, or only the same shape?"
- "What's the simplest thing that could work here? Why isn't the plan doing that?"

**Push pattern:** "What user problem does X solve? If you can't name a specific scenario, it's scope creep."

**Look for:**
- Abstractions justified by "we might need this later"
- Multiple approaches listed "for flexibility" when one would suffice
- Caching, optimization, or generalization before the basic path works
- Helpers, utilities, or wrappers called only once

## 4. Testability

How will you verify that each step worked correctly?

**Question templates:**
- "How will you verify [specific step] worked? What does success look like concretely?"
- "What does 'done' look like in observable terms for [feature]?"
- "Which parts are hardest to test, and what's your strategy for them?"
- "No test approach for [section]. How will you catch regressions?"
- "If this breaks silently, how long before someone notices?"
- "What are the boundary conditions for [input/state]? Are you testing those edges?"
- "Can you build in one step and run the tests in one step?"

**Push pattern:** "You said 'we'll add tests'. Name three specific test cases now. If you can't, the plan doesn't understand its own behavior."

**Look for:**
- No verification section or test strategy
- Integration points with no contract validation
- Manual-only verification for automatable checks
- No way to verify the migration/deployment succeeded
- No boundary/edge case testing mentioned
- No pre/post-condition assertions at critical state transitions

## 5. Risk

What is the worst realistic outcome if this plan is implemented as written? Don't remove a fence until you know why it was put up.

**Question templates:**
- "What's the single worst thing that could happen if this ships as planned?"
- "If step [N] fails, what's the blast radius? What else breaks?"
- "What's the risk to existing functionality that works today?"
- "Who else is affected if this goes wrong? Just you, or other teams/users?"
- "How confident are you that [dependency] won't change under you?"
- "You're removing/changing [existing code]. Know why it was there?"
- "Is this leaving the campground cleaner than you found it, or creating technical debt?"

**Push pattern:** "You said risk is 'low'. What evidence supports that? Have you traced the failure modes?"

**Look for:**
- Shared state modifications without concurrency consideration
- Database migrations on large tables without downtime strategy
- Changes to authentication or authorization paths
- Removing or modifying code used by other teams (checkable: grep for call sites before asking)
- Deploying without a feature flag or gradual rollout
- Removing existing code without understanding why it exists (Chesterton's fence; `git log` the file before accepting "it's unused")

## 6. Assumptions

What does this plan take for granted that could be wrong?

**Question templates:**
- "What does this plan assume about [users / infrastructure / data / performance] that you haven't verified?"
- "What external conditions must be true for this to work?"
- "What would invalidate this entire approach?"
- "You're assuming [X based on plan text]. Source: measurement, documentation, or intuition?"
- "If [stated assumption] is false, which parts of the plan survive?"

**Push pattern:** "What happens if that assumption is false? Is there a Plan B, or does the whole thing collapse?"

**Look for:**
- Performance claims without measurements
- "Users will..." statements without evidence
- Compatibility assumptions (API versions, browser support, OS features)
- Timing assumptions (this will be fast enough, this will complete before that)
- Implicit dependencies on team knowledge or undocumented behavior
