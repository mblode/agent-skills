# Monitoring Setup

CronCreate configuration, state file format, and poll lifecycle for monitor mode.

## Contents

- [Schedule Patterns](#schedule-patterns)
- [CronCreate Prompt Template](#croncreate-prompt-template)
- [State File Format](#state-file-format)
- [Auto-Detection Defaults](#auto-detection-defaults)
- [Stopping](#stopping)
- [Session Lifecycle](#session-lifecycle)

## Schedule Patterns

| User intent | Cron expression | Notes |
|-------------|-----------------|-------|
| Every 2 minutes (default) | `*/2 * * * *` | Default: responsive polling for active PRs |
| Every 5 minutes | `*/5 * * * *` | Lower API usage for stable PRs |
| Every 10 minutes | `*/10 * * * *` | Minimal polling |
| Every 15 minutes | `*/15 * * * *` | Background monitoring |
| Every hour | `7 * * * *` | Use off-minute (`:07`) to avoid jitter on `:00` |

Prefer off-minute scheduling: CronCreate adds jitter to tasks at `:00` and `:30`. Pick a minute like `3`, `7`, or `13` for hourly+ intervals.

Recurring tasks auto-expire after 3 days. If the PR is still open, re-run `/pr-babysitter` to restart.

## CronCreate Prompt Template

```
Check PR #{N} in {owner}/{repo}. Run pr-babysitter monitor phases 2-5:
1. Check for merge conflicts (gh pr view --json mergeable) and resolve if possible
2. Check CI/CD status (gh pr checks) and diagnose any failures. Use Buildkite auth fallback chain if needed.
3. Check for new review comments and triage autonomously if needed (no plan approval; fix and resolve directly)
4. Evaluate merge readiness and notify me of any state changes
State file: .claude/scratchpad/babysit-pr-{N}.md
Auto-resolve noise: yes
Auto-merge: no
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

- Auto-resolve noise: yes
- Auto-merge when ready: no
- Poll interval: every 2 minutes

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

## Auto-Detection Defaults

No setup questions. The monitor auto-detects and applies sensible defaults:

| Setting | Default | Override |
|---------|---------|----------|
| PR | Auto-detect from current branch | Pass PR number as argument |
| Poll interval | Every 2 minutes (`*/2 * * * *`) | "Poll every 5 minutes" |
| Auto-resolve noise | Yes | "Don't auto-resolve noise" |
| Auto-merge | No | "Enable auto-merge" |
| CI platforms | Auto-detected from `gh pr checks` | n/a (always auto-detected) |

Overrides can be given inline when invoking: "babysit PR #42, poll every 5 minutes, enable auto-merge."

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

- Cron jobs are session-scoped: they stop when the Claude session ends
- 3-day auto-expiry on recurring jobs
- No persistence across session restarts
- If the session is busy when a poll is due, it fires when Claude becomes idle
