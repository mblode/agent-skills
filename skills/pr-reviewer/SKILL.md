---
name: pr-reviewer
description: Produces a read-only review report of the current local diff or branch — it lists findings and does NOT edit files. Use when asked to run `/pr-reviewer` before commit, before push, or before handing changes off for PR creation or update; also use for "review my changes", "code review", "code quality review", or when you want findings listed by severity so you can decide what to fix yourself. Also use for "thermo-nuclear review", "deep code quality audit", "structural review", "harsh maintainability review", or "code judo" — these load the structural quality rubric for an unusually strict maintainability pass. Also use for "deslop this", "clean up AI code", "remove slop", or "review for AI patterns" — these load the AI slop detection catalog. For automatic fix-in-place (no manual review step needed), use the private `simplify` skill instead.
---

# Local Review

Perform systematic review with actionable, validated feedback only.
Use this skill as an explicit local self-review step before handoff, not as a generic replacement for native PR review tools.
Run it before `/done` when a coding session produced changes worth checking.

## Reference Files

| File | Read When |
|------|-----------|
| `references/severity-rubric.md` | Default: choosing severity labels and filtering weak findings |
| `references/comment-examples.md` | Before producing a local review report |
| `references/review-surfaces.md` | When deciding whether the work stays in local self-review or should hand off to PR-specific workflows |
| `references/security-checklist.md` | When the diff touches auth, input handling, external APIs, file uploads, or environment configuration |
| `references/performance-checklist.md` | When the diff touches data fetching, rendering, images, dependencies, or bundle-affecting imports |
| `references/structural-quality-rubric.md` | When the user asks for a structural quality review, thermo-nuclear review, deep code quality audit, or when reviewing large diffs that touch module boundaries |
| `references/ai-slop-patterns.md` | When the user asks to deslop, clean up AI code, remove slop, or when reviewing AI-assisted code changes |

## Scope
- Default target: staged or uncommitted local changes
- Secondary target: current branch diff against base when the working tree is clean or the user asks for branch review
- Explicit PR requests are secondary: keep the same review criteria, but treat them as a handoff path rather than the main workflow
- Keep the skill focused on concrete bugs, missing validation/tests that clearly matter, and repository instruction-file compliance
- Do not use this skill for inbound PR comments or thread resolution; use `pr-comments` for that

## Workflow

Copy this checklist to track progress:

```text
Review progress:
- [ ] Discover local review target
- [ ] Gather context and scoped instruction files
- [ ] Choose the local review path
- [ ] Validate findings
- [ ] Produce the review report
```

1. **Discover the review target**:
   - If staged or unstaged changes exist, review those first
   - Otherwise review the current branch diff against its base
   - Only switch to a PR handoff summary when the user explicitly points at an existing PR
   - Record the current branch and changed files so the report is grounded in the local session
2. **Gather context**:
   - Capture the change intent from the session, recent commits, or the user's request
   - Load relevant repository instruction files (`AGENTS.md` / `CLAUDE.md` as applicable, including any in nested package/MFE directories whose code is in the diff)
   - Apply only in-scope instruction-file rules for the changed paths
   - Run the project's lint, type check, and test commands (from `package.json` scripts) to capture current status — note pre-existing failures so they are distinguishable from regressions caused by the change. Include the lint/type-check/test status in the report so the reader knows the baseline at review time
3. **Choose the local review path**:
   - Local self-review is the default: current diff/branch with a local report in chat
   - Existing PR requests are secondary: apply the same validation bar, then produce a concise handoff summary instead of changing the main workflow
   - For large changes, shard by subsystem and keep the final report consolidated
4. **Validate issues**:
   - Re-check exact lines before reporting
   - Keep only high-confidence issues; drop speculative or duplicate items
   - Confirm each issue still applies to the latest diff and maps to a changed line
   - Collapse multiple comments that share the same root cause into one finding
5. **Produce the report**:
   - Default output: a local review report in chat
   - Organize findings into `Must fix before push`, `Should fix soon`, and `Ready for handoff`
   - Do not post inline comments, resolve threads, or handle inbound review feedback from this skill
   - Hand off inbound PR feedback to `pr-comments`

## High signal only

Flag only when certain:
- Code will fail to compile (syntax, types, imports)
- Code will produce incorrect behavior (clear logic or state errors)
- Code introduces a concrete security risk with direct exploit path — load `references/security-checklist.md` for the three-tier classification when the diff touches auth, input handling, external APIs, or environment configuration
- Code introduces a measurable performance regression — load `references/performance-checklist.md` for common bottleneck patterns when the diff touches data fetching, rendering, images, or dependencies
- Changed behavior is clearly missing a necessary regression or validation test, including: a new component or hook shipped with no co-located test file, or an existing test where every assertion is a render-only presence check (`expect(getByText(...)).toBeInTheDocument()`) with no user interaction or branch coverage
- Bug fix without a failing test that reproduces it first (Prove-It Pattern: if the fix is correct, a test for the bug should fail before and pass after)
- Test code over-abstracts shared setup to the point where individual tests are unreadable without tracing helpers (prefer DAMP — Descriptive And Meaningful Phrases — over DRY in test code)
- Lint, type check, or tests fail as a result of the change (distinguish from pre-existing failures captured in step 2)
- Unambiguous instruction-file violation (quote rule, verify scope)
- YAGNI violation: code adds abstractions, config systems, or extension points not justified by a current requirement (three similar lines is better than a premature abstraction)
- KISS violation: implementation is more complex than the problem demands — a simpler approach exists that achieves the same result
- Code exhibits AI-generated patterns (over-commenting, unnecessary wrapping, type bypasses, premature abstraction) — load `references/ai-slop-patterns.md` for the detection catalog
- File pushed past ~1000 lines by the diff when the new code could be extracted into a focused module
- Ad-hoc conditionals or feature-specific branches inserted into unrelated shared code paths
- Bespoke helper duplicating an existing canonical utility in the codebase
- Logic placed in the wrong layer when there is a clear canonical home elsewhere

Never flag:
- Style, quality, or subjective preferences
- Pre-existing issues unrelated to the change
- Potential issues dependent on unknown inputs
- Linter-only issues likely caught automatically
- Explicitly silenced violations

## Output format

Read `references/comment-examples.md` before producing the report if you need a formatting refresher.

When the structural quality rubric is loaded, structural findings use the same tiers — presumptive blockers from the rubric map to `Must fix before push`, and other structural issues map to `Should fix soon`.

Default local output:
```markdown
## Local review

### Must fix before push
- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <one to two sentences with concrete impact>
  Fix: <committable fix or clear implementation guidance>

### Should fix soon
- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <one to two sentences with concrete impact>
  Fix: <committable fix or clear implementation guidance>

### Ready for handoff
- <brief readiness summary>
```

If the user explicitly points at an existing PR, adapt the same validated findings into a concise handoff summary:
```markdown
## PR handoff summary

- [<severity>] `path/to/file.ts:line` <short factual title>
  Why: <one to two sentences with concrete impact>
  Fix: <committable fix or clear implementation guidance>
```

**Summary** (if no issues):
```
## Local review

### Must fix before push
- None.

### Should fix soon
- None.

### Ready for handoff
- No blocking issues found. Checked for high-confidence bugs, missing validation/tests, and instruction-file compliance on the current local changes.
```

## Anti-patterns
- Starting by asking for a PR number when local changes are available -> review the local diff first
- Teaching inline review comments as the default output -> keep the main path local-first
- "This might cause issues" -> "Variable `x` is undefined at `src/foo.ts:45`, causing `ReferenceError` at runtime."
- "Consider refactoring" -> "Violates instruction-file rule '<quoted rule>' in scoped file `src/foo.ts`."
- Multiple comments for the same root cause -> one comment linking all affected locations

## Boundary with `simplify` (private)

This skill produces a **report only** — findings organized by severity (`Must fix before push`, `Should fix soon`, `Ready for handoff`) with no automatic file edits. The working tree is unchanged when the skill finishes.

Use the private `simplify` skill instead when you want fixes applied automatically: it fans out four concurrent agents over the diff and edits files in-place, then re-runs lint/type-check/tests to verify. Both skills cover reuse, quality, and efficiency issues; the difference is report-only vs fix-in-place.

## Related skills

- `done` for session capture after the review is complete
- `pr-babysitter` for triaging and resolving inbound review threads after feedback has been left
- `simplify` (private) for automatic fix-in-place rather than a review report

Every flagged issue should be something a senior engineer would catch.
