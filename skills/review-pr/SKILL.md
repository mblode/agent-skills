---
name: review-pr
description: Reviews the current local diff or branch at the end of a coding session for high-confidence bugs and repository instruction-file compliance. Use when asked to run `/review-pr` before commit, before push, or before handing changes off for PR creation or update, and when only certain, actionable findings should be reported while style feedback is ignored.
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
   - Load relevant repository instruction files (`AGENTS.md` / `CLAUDE.md` as applicable)
   - Apply only in-scope instruction-file rules for the changed paths
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
- Code introduces a concrete security risk with direct exploit path
- Changed behavior is clearly missing a necessary regression or validation test
- Unambiguous instruction-file violation (quote rule, verify scope)

Never flag:
- Style, quality, or subjective preferences
- Pre-existing issues unrelated to the change
- Potential issues dependent on unknown inputs
- Linter-only issues likely caught automatically
- Explicitly silenced violations

## Output format

Read `references/comment-examples.md` before producing the report if you need a formatting refresher.

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

## Related skills

- `done` for session capture after the review is complete
- `babysit-pr` for triaging and resolving inbound review threads after feedback has been left

Every flagged issue should be something a senior engineer would catch.
