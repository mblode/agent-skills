# CI Polling with Scheduled Tasks

## Setting Up a Polling Loop

After pushing, use `/loop` to create a recurring scheduled task that monitors CI:

```
/loop 1m Check CI status for the current branch and report progress
```

Or use `CronCreate` directly with a cron expression for more control.

## Checking CI Status

### With `gh` CLI

```bash
# List recent workflow runs on the current branch
gh run list --branch <branch> --limit 5 --json status,conclusion,name,databaseId

# View a specific run
gh run view <run-id> --json status,conclusion,jobs

# View failed logs
gh run view <run-id> --log-failed
```

## Adaptive Polling Intervals

- **Minutes 0-5:** Poll every 1 minute (CI is likely starting)
- **Minutes 5-15:** Poll every 2 minutes (CI is running)
- **Minutes 15+:** Poll every 5 minutes (long-running CI)

Adjust the `/loop` interval as needed, or use a single loop that tracks elapsed time.

## Failure Diagnosis

When a check fails:

1. Read the failed logs: `gh run view <id> --log-failed`
2. Classify the failure:

| Type | Indicators | Action |
|------|-----------|--------|
| Flaky test | Intermittent, passes on re-run, known flaky test names | Retry with `gh run rerun <id> --failed` |
| Real failure | Consistent, reproducible, related to the changes | Fix the code, commit, push, restart monitoring |
| Infrastructure | Network timeout, runner issue, service unavailable | Retry with `gh run rerun <id>` |

### Retry Rules

- Retry flaky/infrastructure failures up to 3 times.
- After 3 retries, escalate to the user.
- For real failures: fix, commit, push, and restart the monitoring loop.

## Do Not Stop Prematurely

- A single snapshot showing no runs does not mean CI is done. Workflows take time to queue.
- Poll at least 3 times before concluding no workflow was triggered.
- Keep polling until all required workflow runs show `completed` status.
- Only stop when: all checks pass, a failure needs user intervention, or the user cancels.

## Rate Limit Awareness

Check rate limit status if polling frequently:

```bash
gh api rate_limit --jq '.resources.core.remaining'
```

If remaining calls are low, increase the polling interval.
