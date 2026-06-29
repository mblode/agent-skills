# Fix Plan Template

Write the fix plan to `.claude/scratchpad/pr-{N}-review-plan.md` (create the `.claude/scratchpad/` directory if missing).

The plan is an audit trail: triage proceeds without waiting for approval. If the user edits the file mid-run, re-read it before the Fix step and respect their edits.

## Template

```markdown
# PR #{N} Review Comment Plan

**PR:** {title} (#{N})
**Branch:** {branch}
**URL:** {pr_url}
**Threads:** {total} total, {unresolved} unresolved, {outdated} outdated
**Reviews:** {review_count} ({changes_requested} requesting changes)
**Generated:** {date}

## Summary

| Disposition | Critical | Major | Minor | Nitpick | Total |
|-------------|----------|-------|-------|---------|-------|
| Fix         |          |       |       |         |       |
| Ignore      |          |       |       |         |       |

---

## Issues to Fix

Severity order (critical first), grouped by file.

### 1. [{severity}] {short title}

- **Thread:** {thread_node_id}
- **File:** `{path}:{line}`
- **Author:** @{author} ({human | bot_name})
- **Category:** {bug | security | performance | style | correctness | docs | test-coverage}
- **Finding:** {one-sentence description}
- **Fix approach:** {concrete description of what to change}
- **Commit group:** {group_label}

> Original: {relevant excerpt from comment, boilerplate stripped}

---

### 2. ...

---

## Conversation Items (no thread, reply only)

From issue-level comments or review bodies. No GraphQL resolve action; reply to acknowledge only.

### C1. [{severity}] {short title}

- **Source:** {issue comment | review body (CHANGES_REQUESTED)}
- **Comment ID:** {comment_id or review_id}
- **Author:** @{author}
- **Finding:** {one-sentence description}
- **Fix approach:** {concrete description of what to change}
- **Reply to post:** "{acknowledgment message}"
- **Commit group:** {group_label}

> Original: {relevant excerpt}

### C2. ...

---

## Ignored

### I1. [{reason}] @{author} on `{path}:{line}`

- **Thread:** {thread_node_id}
- **Reason:** {specific explanation}
- **Reply to post:** "{brief resolution comment}"

### I2. ...
```

## Template notes

- Replace all `{placeholders}` with actual values
- Thread IDs are GraphQL node IDs (for resolve mutations in the Fix step)
- Comment IDs are REST `id`/`databaseId` fields (for reply endpoints)
- Commit group labels batch related fixes into one commit (e.g., "golden-events", "lint-cleanup")
- Keep resolution reply comments to one sentence
- The summary table gives the user a quick overview before the details
- If the user moves items between Fix/Conversation/Ignore sections, respect their edits
- Purely informational conversation items (soft "up to you" suggestions) may be moved to Ignored by the user
