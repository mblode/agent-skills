---
name: plan-feature
version: 0.1.0
description: Create implementation-ready plans and specs for complex changes without writing code. Use when the user asks for a plan/spec/roadmap, requests a detailed plan, or when a change spans multiple files/systems and needs discovery, sequencing, or architecture decisions.
---

# Feature Planning

Create concrete, implementation-ready plans for features and complex changes.

DO NOT WRITE CODE during planning. Only explore, analyse, and document.

## Planning threshold

Before deep planning, quickly confirm the scope:
- Plan in detail when changes affect 3+ files or multiple systems
- Plan in detail when requirements are unclear or architectural tradeoffs exist
- Skip heavyweight planning for single-file changes with clear requirements
- For small/obvious changes, give a short execution outline instead of a full spec

## Planning workflow

### 1. Discovery
Ask targeted questions to uncover intent. For each question:
- Present 2-3 concrete options with tradeoffs
- Give your recommended option with clear reasoning
- One question at a time; wait for user response
- Skip questions already answered by the user

Critical questions:
- What problem are you solving? (user pain point, business goal)
- What should happen? (expected behaviour, success criteria)
- What should NOT happen? (constraints, edge cases to avoid)
- Who is this for? (user type, environment, scale)
- How will you verify it works? (testing approach, validation)

### Speed-to-learning reference
- Use `ship-fast-loop.md` for a lightweight shipping loop and feedback cadence.

### 2. Analysis
Explore the codebase systematically:
- Locate relevant files (prefer `rg --files` and `rg`; document paths with line numbers)
- Map existing patterns (architecture, naming, data flow)
- Identify dependencies (what will be affected by changes)
- Find similar implementations (to maintain consistency)
- Note relevant standards (from `implement-frontend`, `define-architecture`, etc)

Document findings:
- File: `path/to/file.ts:123` - what it does, how it's relevant
- Pattern: existing approach for similar features
- Constraint: technical limitation or requirement

### 3. Planning
Create a concrete, ordered plan with:

**For each change, specify:**
- File path and approximate line number
- Exact function/component/class to modify
- What to add/remove/change (be specific)
- Why this change (how it fits the goal)
- Dependencies (what must happen first)

**Plan structure:**
```
## Goal
[One sentence: what we're building and why]

## Changes

### 1. [Description]
- File: `path/to/file.ts:45`
- Action: Add `functionName()` that does X
- Reasoning: Needed because Y
- Dependencies: None

### 2. [Description]
- File: `path/to/other.ts:89`
- Action: Modify `existingFunction()` to handle Z
- Reasoning: Integrates with change #1
- Dependencies: #1 must complete first

## Validation
- [ ] Tests pass
- [ ] Feature works for case A
- [ ] Edge case B is handled
- [ ] Follows `implement-frontend` (if frontend)
- [ ] No console logs or debug code
```

### 4. Standards reference
Explicitly note which standards apply:
- Frontend changes: reference `implement-frontend`, `audit-ui`
- UI changes: reference `design-ui`
- Motion: reference `ui-animation`
- Backend: reference `define-architecture`
- Typography: reference `audit-ui`

Format: "This plan must follow `implement-frontend` for forms and type safety."

### 5. Validation checklist
Before finalizing, verify the plan includes:
- [ ] Clear goal statement
- [ ] Specific file paths with line numbers
- [ ] Ordered steps (dependencies clear)
- [ ] Acceptance criteria
- [ ] Edge cases considered
- [ ] Relevant skill standards referenced
- [ ] No ambiguous language ("update", "improve", "enhance" without specifics)

## Anti-patterns

Avoid vague plans:
- Bad: "Update the authentication system"
- Good: "Modify `auth/middleware.ts:34` to add `validateSession()` that checks token expiry"

Avoid missing context:
- Bad: "Add error handling"
- Good: "Wrap API call in `auth/api.ts:67` with try/catch, show toast on error per `audit-ui`"

Avoid assuming knowledge:
- Bad: "Use the standard pattern"
- Good: "Follow the existing DAO pattern from `user/dao.ts:12` (class-based with explicit types)"

Avoid incomplete acceptance criteria:
- Bad: "Make sure it works"
- Good: "Verify: (1) form submits on Enter, (2) shows inline errors, (3) disables submit during request"

Avoid ignoring standards:
- Bad: Plan uses `any` types and manual form state
- Good: Plan enforces `implement-frontend`: no `any`, uses React Hook Form

## Quick checks

Before handing off the plan:
- Can someone implement this without asking questions?
- Are all file paths valid and line numbers approximate?
- Are dependencies between steps clear?
- Are acceptance criteria testable?
- Are relevant skill standards explicitly referenced?
- Is every decision justified (the "why")?

## Output format

Deliver the plan as a formatted markdown document that serves as a complete implementation specification. The implementer should not need to make architectural decisions.
