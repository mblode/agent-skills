# Git Resilience

How to recover when a git command hangs or fails transiently inside the poll cycle. A hung `git` call should retry, not abort the monitor.

## Contents

- [core.fsmonitor hangs](#corefsmonitor-hangs)
- [Stale index.lock contention](#stale-indexlock-contention)
- [Transient IPC hiccups](#transient-ipc-hiccups)
- [Safe-retry posture](#safe-retry-posture)

## core.fsmonitor hangs

**Symptom:** `git status`, `git fetch`, `git rebase`, or `git commit` stalls indefinitely with no output. Common in large monorepos where the filesystem-monitor daemon wedges.

**Diagnosis:**

```bash
git config --get core.fsmonitor    # true / a hook path = fsmonitor is active
```

**Recovery**: disable it for the session and retry the command:

```bash
git config core.fsmonitor false
# kill any wedged daemon, then retry
pkill -f 'fsmonitor--daemon' 2>/dev/null || true
```

For read-only status calls that only need to observe state, skip lock acquisition entirely:

```bash
GIT_OPTIONAL_LOCKS=0 git status --porcelain
```

## Stale index.lock contention

**Symptom:** `fatal: Unable to create '.../.git/index.lock': File exists`.

**Recovery:** remove the lock **only** when no git process is running; deleting it under a live process corrupts the index.

```bash
pgrep -f '[g]it ' && echo "git running: wait, do not delete lock" || rm -f .git/index.lock
```

Then retry the original command.

## Transient IPC hiccups

Brief, self-clearing failures (an intermittent `gh`/`git` IPC error, a momentary network blip on `git fetch`). Retry with backoff rather than treating the first failure as terminal:

```bash
for attempt in 1 2 3; do
  git fetch origin "$base_branch" && break
  sleep $((attempt * 2))
done
```

## Safe-retry posture

- Treat a hang or transient git error as retryable: apply the fsmonitor/lock recovery above, then retry once or twice with backoff.
- Only abort the current phase (and notify the user) if the command still fails after recovery + retries; never let a single transient git failure kill the monitor.
- Keep recovery changes session-local (`git config core.fsmonitor false` affects the local repo config only); don't push config changes as part of a PR.
