# Fix Plan Template

Write the fix plan to `.claude/scratchpad/pr-{N}-review-plan.md`. Create the `.claude/scratchpad/` directory if it does not exist.

The plan is a working document — the user may edit it before approving. Re-read the file before executing Phase 4.

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

Ordered by severity (critical first), grouped by file proximity.

### 1. [{severity}] {short title}

- **Thread:** {thread_node_id}
- **File:** `{path}:{line}`
- **Author:** @{author} ({human | bot_name})
- **Category:** {bug | security | performance | style | correctness | docs | test-coverage}
- **Finding:** {one-sentence description}
- **Fix approach:** {concrete description of what to change}
- **Commit group:** {group_label}

> Original: {relevant excerpt from comment — strip boilerplate}

---

### 2. ...

---

## Conversation Items (no thread — reply only)

Items from issue-level comments or review bodies. These cannot be resolved via
GraphQL — reply to acknowledge, but there is no resolve action.

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
- Thread IDs are GraphQL node IDs (used for resolve mutations in Phase 4)
- Comment IDs are REST `id` or `databaseId` fields (used for reply endpoints)
- Commit group labels batch related fixes into single commits (e.g., "golden-events", "lint-cleanup")
- Keep resolution reply comments to one sentence
- The summary table gives the user a quick overview before reading details
- If the user moves items between Fix/Conversation/Ignore sections, respect their edits
- Conversation items that are purely informational (soft suggestions with "up to you") may be moved to Ignored by the user
