# Questioning Framework

Six dimensions for plan review. Each includes question templates and pushback patterns. Adapt templates to the specific plan content; never ask verbatim generic questions.

Every question is filtered through the core principles: **KISS > YAGNI > Clean Code**. Simpler plans are better plans. Earned abstractions only. Design before code, but design the simplest thing that works.

When a "what to look for" item is checkable against local code or docs (an unused helper, an unconfirmed library capability, a doc that contradicts the plan), verify it yourself first (`claim-verification.md`) and lead with the evidence instead of a question.

## Contents

1. [Completeness](#1-completeness): missing flows, error paths, rollback
2. [Feasibility](#2-feasibility): unproven steps, external dependencies
3. [Scope](#3-scope): YAGNI, premature abstractions, wrong abstractions
4. [Testability](#4-testability): verification, "done" criteria, boundary tests
5. [Risk](#5-risk): blast radius, failure modes, broken windows
6. [Assumptions](#6-assumptions): unstated conditions, invalidation

## 1. Completeness

What must exist for this plan to work that is not mentioned? Detect errors at a low level, handle them at a high level.

**Question templates:**
- "You describe [X flow] but don't mention what happens when [Y condition] occurs. What's the behavior?"
- "The plan has no rollback section. If this ships and immediately breaks, what is the recovery procedure?"
- "For the [API call / data flow / user action] in section [N], what happens on failure?"
- "What edge cases does [feature] need to handle that aren't listed?"
- "Where are the boundaries of this system? What gets validated at the edges?"

**Push pattern:** "You said 'handle errors appropriately'. Name the three most likely errors and what the user sees for each one."

**What to look for in the plan:**
- New API calls or data flows without error handling
- State transitions without failure paths
- "Happy path only" descriptions
- Missing cleanup or teardown steps
- No mention of what happens when external services are unavailable
- No boundary validation (user input, external APIs): program defensively at system edges

## 2. Feasibility

Which step requires something unproven, unfamiliar, or outside your control? Scope like a tracer bullet: get a minimum viable slice working across the full stack first.

**Question templates:**
- "Which step in this plan requires something you haven't built before?"
- "What is the hardest technical problem here, and how confident are you in the approach?"
- "Does any step depend on an external system you don't control? What's its reliability?"
- "You're proposing [approach]. Have you verified this works at the scale you need?"
- "Section [N] assumes [library/service] can do [X]. Have you confirmed this, or is it an assumption?"
- "What's the tracer bullet here, the thinnest slice that proves the approach works end-to-end?"

**Push pattern:** "You said this is 'straightforward'. Describe the implementation in 3 sentences. If you can't, it's not straightforward."

**What to look for in the plan:**
- Steps described in one sentence that actually require significant implementation
- References to libraries or APIs without evidence they support the use case (checkable: read the library docs or types before asking)
- Performance assumptions without benchmarks
- "Then we just..." phrasing (minimizing complexity)
- No tracer bullet: plan builds horizontal layers instead of a vertical slice first

## 3. Scope

What's not strictly necessary to achieve the stated goal? YAGNI: build it when you need it. Duplication is far cheaper than the wrong abstraction.

**Question templates:**
- "Which parts of this plan are not required to achieve the goal stated in the Context section?"
- "If you had to ship in half the time, what would you cut?"
- "Is there a simpler approach that achieves 80% of the value with 20% of the effort?"
- "[Feature X] is in the plan. What user problem does it solve that isn't solved by the rest?"
- "You're building [abstraction]. How many times will it be used? If fewer than 3, inline it."
- "Three similar lines is better than a premature abstraction. Is this abstraction earned by repetition or speculated?"
- "What's the simplest thing that could work here? Why isn't the plan doing that?"

**Push pattern:** "What user problem does X solve? If you can't name a specific scenario, it's scope creep."

**What to look for in the plan:**
- Abstractions justified by "we might need this later"
- Config systems for things with one value
- Multiple approaches listed "for flexibility" when one would suffice
- "Nice to have" items mixed with requirements
- Caching, optimization, or generalization before the basic path works
- Helper functions, utilities, or wrappers that will only be called once
- Designing for hypothetical future requirements instead of current ones

## 4. Testability

How will you verify that each step worked correctly? Write tests often and early. Test at boundaries. Know what output to expect.

**Question templates:**
- "How will you verify that [specific step] worked? What does success look like concretely?"
- "What does 'done' look like in observable terms for [feature]?"
- "Which parts are hardest to test, and what's your strategy for them?"
- "The plan mentions no test approach for [section]. How will you catch regressions?"
- "If this breaks silently, how long before someone notices?"
- "What are the boundary conditions for [input/state]? Are you testing those edges?"
- "Can you build in one step and run the tests in one step?"

**Push pattern:** "You said 'we'll add tests'. Name three specific test cases right now. If you can't, the plan doesn't understand its own behavior well enough."

**What to look for in the plan:**
- No verification section or test strategy
- "Add tests" without specifying what is tested
- Integration points with no contract validation
- Manual-only verification for automatable checks
- No mention of how to verify the migration/deployment succeeded
- No boundary/edge case testing mentioned
- No pre/post-condition assertions at critical state transitions

## 5. Risk

What is the worst realistic outcome if this plan is implemented as written? First, do no harm. Don't remove a fence until you know why it was put up.

**Question templates:**
- "What is the single worst thing that could happen if this ships as planned?"
- "If step [N] fails, what's the blast radius? What else breaks?"
- "What is the risk to existing functionality that currently works?"
- "Who else is affected if this goes wrong? Just you, or other teams/users?"
- "What's your confidence level that [dependency] won't change under you?"
- "You're removing/changing [existing code]. Do you know why it was originally there?"
- "Is this leaving the campground cleaner than you found it, or creating technical debt?"

**Push pattern:** "You said risk is 'low'. What specific evidence supports that? Have you traced the failure modes?"

**What to look for in the plan:**
- Shared state modifications without concurrency consideration
- Database migrations on large tables without downtime strategy
- Changes to authentication or authorization paths
- Removing or modifying code used by other teams (checkable: grep for call sites before asking)
- Deploying without a feature flag or gradual rollout
- Removing existing code without understanding why it exists (Chesterton's fence; `git log` the file before accepting "it's unused")
- Ignoring technical debt: broken windows accumulate

## 6. Assumptions

What does this plan take for granted that could be wrong?

**Question templates:**
- "What does this plan assume about [users / infrastructure / data / performance] that you haven't verified?"
- "What external conditions must be true for this to work?"
- "What would invalidate this entire approach?"
- "You're assuming [X based on plan text]. Where did this come from: measurement, documentation, or intuition?"
- "If [stated assumption] turns out to be false, which parts of the plan survive?"

**Push pattern:** "What happens if that assumption is false? Is there a Plan B, or does the whole thing collapse?"

**What to look for in the plan:**
- Performance claims without measurements
- "Users will..." statements without evidence
- Compatibility assumptions (API versions, browser support, OS features)
- Timing assumptions (this will be fast enough, this will complete before that)
- Implicit dependencies on team knowledge or undocumented behavior
