---
name: review-pr
description: Reviews pull requests and code diffs for concrete bugs and CLAUDE.md compliance. Use when asked to review a PR, branch diff, or pre-merge changes. Reports only high-confidence, actionable issues.
---

# PR Review

Perform systematic review with actionable, validated feedback only.

## Scope
- Use for PR review, branch or diff review, and pre-merge checks
- Skip closed or already-reviewed PRs, draft PRs unless explicitly requested, and trivial bot-only updates

## Workflow

1. **Validate target**:
   - Confirm repo, base or head, and requested review scope
   - Skip and explain briefly when the target is out of scope
2. **Gather context**:
   - Capture PR intent, changed files, and relevant CLAUDE.md files
   - Apply only in-scope CLAUDE.md rules for the changed paths
3. **Choose review shape by size**:
   - Small change: one pass covering bugs and CLAUDE.md compliance
   - Medium change: two parallel passes (bugs, CLAUDE.md)
   - Large change: shard by subsystem and run parallel passes per shard
4. **Validate issues**:
   - Re-check exact lines before reporting
   - Keep only high-confidence issues; drop speculative or duplicate items
5. **Post**:
   - Preferred: inline comments with reasoning
   - Fallback: same issue format in chat when inline tooling is unavailable
   - If no issues remain, post the no-issues summary

## High signal only

Flag only when certain:
- Code will fail to compile (syntax, types, imports)
- Code will produce incorrect behavior (clear logic or state errors)
- Code introduces a concrete security risk with direct exploit path
- Unambiguous CLAUDE.md violation (quote rule, verify scope)

Never flag:
- Style, quality, or subjective preferences
- Pre-existing issues unrelated to the change
- Potential issues dependent on unknown inputs
- Linter-only issues likely caught automatically
- Explicitly silenced violations

## Output format

Use `github_inline_comment:create_inline_comment` when available.

For each unique issue, use this structure:
```markdown
[<severity>] <short factual title>

Why this is a bug or violation:
<one to three sentences with concrete impact>

Evidence:
- Rule or code reference
- Full-SHA link: https://github.com/owner/repo/blob/[40-char-sha]/path/to/file.ts#L10-L18

Suggested fix:
<committable patch snippet if <= 6 lines; otherwise clear implementation guidance>
```

When inline tooling is unavailable, return the same structure in chat and include `path:line` for each issue.

**Summary** (if no issues):
```
## Code review
No issues found. Checked for concrete bugs and CLAUDE.md compliance.
```

## Anti-patterns
- "This might cause issues" -> "Variable `x` is undefined at `src/foo.ts:45`, causing `ReferenceError` at runtime."
- "Consider refactoring" -> "Violates CLAUDE.md rule '<quoted rule>' in scoped file `src/foo.ts`."
- Multiple comments for the same root cause -> one comment linking all affected locations

Every flagged issue should be something a senior engineer would catch.
