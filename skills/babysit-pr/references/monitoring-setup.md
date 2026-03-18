# Monitoring Setup

CronCreate configuration, state file format, and poll lifecycle for monitor mode.

## Contents

- [Schedule Patterns](#schedule-patterns)
- [CronCreate Prompt Template](#croncreate-prompt-template)
- [State File Format](#state-file-format)
- [Setup Questions](#setup-questions)
- [Stopping](#stopping)
- [Session Lifecycle](#session-lifecycle)

## Schedule Patterns

| User intent | Cron expression | Notes |
|-------------|-----------------|-------|
| Every 5 minutes (default) | `*/5 * * * *` | Good balance of responsiveness and API usage |
| Every 10 minutes | `*/10 * * * *` | Lower API usage for stable PRs |
| Every 15 minutes | `*/15 * * * *` | Minimal polling |
| Every hour | `7 * * * *` | Use off-minute (`:07`) to avoid jitter on `:00` |

Prefer off-minute scheduling — CronCreate adds jitter to tasks at `:00` and `:30`. Pick a minute like `3`, `7`, or `13` for hourly+ intervals.

Recurring tasks auto-expire after 3 days. If the PR is still open, re-run `/babysit-pr` to restart.

## CronCreate Prompt Template

```
Check PR #{N} in {owner}/{repo}. Run babysit-pr monitor phases 2-5:
1. Check for merge conflicts (gh pr view --json mergeable) and resolve if possible
2. Check CI/CD status (gh pr checks) and diagnose any failures
3. Check for new review comments and triage if needed
4. Evaluate merge readiness and notify me of any state changes
State file: .claude/scratchpad/babysit-pr-{N}.md
Auto-resolve noise: {yes|no}
Auto-merge: {yes|no}
```

## State File Format

Write to `.claude/scratchpad/babysit-pr-{N}.md`. Create directory if needed.

```markdown
# Babysit PR #{N}

**PR:** {title} (#{N})
**URL:** {pr_url}
**Branch:** {head_branch} → {base_branch}
**Cron Job ID:** {job_id}
**Started:** {timestamp}
**Last Poll:** {timestamp}

## Preferences

- Auto-resolve noise: {yes|no}
- Auto-merge when ready: {yes|no}
- Poll interval: {interval}

## Current State

- **HEAD:** {sha}
- **Mergeable:** {MERGEABLE|CONFLICTING|UNKNOWN}
- **Review Decision:** {APPROVED|CHANGES_REQUESTED|REVIEW_REQUIRED}
- **Unresolved Threads:** {count}
- **Checks:**
  - {check_name}: {SUCCESS|FAILURE|PENDING} ({platform})
  - ...

## History

| Time | Event |
|------|-------|
| {timestamp} | {state change description} |
| ... | ... |
```

Keep the history log to the last 20 entries. Older entries can be dropped.

## Setup Questions

Ask the user during Phase 1:

1. **Confirm PR** — "Monitoring PR #{N}: {title}. Correct?"
2. **Poll interval** — "How often should I check? (default: every 5 minutes)"
3. **Auto-resolve noise** — "Auto-resolve noise bot comments (vercel, linear, changeset)? (default: no)"
4. **Auto-merge** — "Auto-merge when all checks pass and reviews are approved? (default: no)"

CI platforms are auto-detected from `gh pr checks` — no need to ask.

## Stopping

To stop monitoring:

1. Read the cron job ID from the state file
2. Call CronDelete with that job ID
3. Report final summary:
   - Total polls run
   - Conflicts resolved
   - CI failures fixed
   - Comments triaged
   - Current PR state

## Session Lifecycle

- Cron jobs are session-scoped — they stop when the Claude session ends
- 3-day auto-expiry on recurring jobs
- No persistence across session restarts
- If the session is busy when a poll is due, it fires when Claude becomes idle
