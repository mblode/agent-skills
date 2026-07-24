# Fix Plan Template

Write the fix plan to `.claude/scratchpad/pr-{N}-review-plan.md` (create the `.claude/scratchpad/` directory if missing).

The plan is an audit trail: triage proceeds without waiting for approval. If the user edits the file mid-run, re-read it before the Fix step and respect their edits.

## Contents

- [Template](#template)
- [Legal ignore reasons](#legal-ignore-reasons)
- [Template notes](#template-notes)

## Template

```markdown
# PR #{N} Review Comment Plan

**PR:** {title} (#{N})
**Branch:** {branch}
**URL:** {pr_url}
**Head:** {sha}
**Threads:** {open} open, {awaiting} awaiting my reply, {resolved} resolved ({with_reply} replied after resolve), {outdated} outdated, {collapsed} collapsed
**Reviews:** {review_count} ({changes_requested} requesting changes, {stale} stale)
**Reviewers:** @{human} (3 findings, 1 question), cursor[bot] (1 critical), unlisted: @{login}
**Merge gates:** {gate}: {verdict}
**Generated:** {date}

## Summary

| Disposition | Critical | Major | Minor | Nitpick | Total |
|-------------|----------|-------|-------|---------|-------|
| Fix         |          |       |       |         |       |
| Answer (no code change) |  |    |       |         |       |
| Ignore      |          |       |       |         |       |

---

## Questions Awaiting an Answer

Reviewer questions get a reply, not a code change. Listed first so they are not buried under bot findings.

### Q1. @{author} on `{path}:{line}`

- **Thread:** {thread_node_id}
- **Anchor:** {path}:{line} (source: {line | startLine | bot metadata | originalLine | diffHunk | path-only})
- **Question:** {verbatim quote}
- **Answer to post:** {the actual answer, not an acknowledgement}
- **Code change needed:** {no | yes, see Fix #N}
- **Resolve:** no. The reviewer resolves after reading the answer

### Q2. ...

---

## Merge Gates

### G1. {gate name} ({source comment id})

- **Verdict:** {verbatim}
- **Criteria that forced it:** {path criteria / change type / blast radius}
- **Blocking:** {yes | no}
- **What would flip it:** {a human review from ... | nothing, informational}
- **Action:** none. Not a fix item, not replied to, not resolved

---

## Issues to Fix

Severity order (critical first), grouped by file.

### 1. [{severity}] {short title}

- **Thread:** {thread_node_id}
- **Anchor:** `{path}:{line}` (source: {ladder rung})
- **Thread state:** {open | resolved-with-unanswered-reply | outdated}
- **Last comment:** @{author} at {time}
- **Author:** @{author} ({human | bot_name | unlisted reviewer})
- **Reviewed commit:** {sha} (head {sha})
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

## Legal ignore reasons

These are the only ones:

| Reason | Means |
|--------|-------|
| `ignore-duplicate` | Another thread covers it; quote the kept thread ID |
| `ignore-superseded` | A re-review opened a newer thread on the same lines |
| `ignore-pre-existing` | The flagged line is not in a `+` hunk of this PR |
| `ignore-outdated` | The anchor was recovered, the file was read, and the construct is genuinely gone |
| `ignore-contradicts-conventions` | Contradicts a rule in `CLAUDE.md` or `AGENTS.md` |
| `ignore-noise-marker` | Positive match on a documented noise marker |

**Not ignore reasons:** "author unrecognized", "thread already resolved", "no line number". An unrecognized author is triaged as a reviewer, a resolved thread with an unanswered reply is triaged, and a finding without a line number is reported with `anchor: path-only`.

## Template notes

- Replace all `{placeholders}` with actual values
- Thread IDs are GraphQL node IDs (for resolve mutations in the Fix step)
- Comment IDs are REST `id`/`databaseId` fields (for reply endpoints)
- Commit group labels batch related fixes into one commit (e.g., "golden-events", "lint-cleanup")
- Keep resolution reply comments to one sentence
- The summary table gives the user a quick overview before the details
- Every reviewer in the header appears in at least one section below; an unaccounted reviewer means the fetch lost something
- A question is never an Ignored item
- If the user moves items between Fix/Questions/Conversation/Ignore sections, respect their edits
- Purely informational conversation items (soft "up to you" suggestions) may be moved to Ignored by the user
