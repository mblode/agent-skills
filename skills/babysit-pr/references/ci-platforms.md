# CI/CD Platforms

Platform-specific commands for checking status, fetching logs, and re-running builds.

## Contents

- [Detecting platforms from check names](#detecting-platforms-from-check-names)
- [GitHub Actions](#github-actions)
- [Buildkite](#buildkite)
- [Vercel](#vercel)
- [Fly.io](#flyio)
- [Failure classification](#failure-classification)

## Detecting platforms from check names

Run `gh pr checks --json name,state,conclusion,detailsUrl` and match check names:

| Pattern | Platform |
|---------|----------|
| `buildkite/` prefix | Buildkite |
| `Vercel`, `vercel` in name, or `vercel.com` in detailsUrl | Vercel |
| `fly-deploy`, `fly-` prefix, or `fly.io` in detailsUrl | Fly.io |
| Everything else | GitHub Actions (default) |

## GitHub Actions

**List recent runs for the branch:**

```bash
gh run list --branch {branch} --limit 5 --json databaseId,name,status,conclusion
```

**View a specific run:**

```bash
gh run view {run_id}
```

**Fetch failed job logs (most useful for diagnosis):**

```bash
gh run view {run_id} --log-failed
```

**Fetch full logs:**

```bash
gh run view {run_id} --log
```

**Re-run failed jobs only:**

```bash
gh run rerun {run_id} --failed
```

**Re-run entire workflow:**

```bash
gh run rerun {run_id}
```

**Watch a run until completion:**

```bash
gh run watch {run_id}
```

**Cancel a run:**

```bash
gh run cancel {run_id}
```

## Buildkite

Buildkite registers as GitHub checks with a `buildkite/` prefix. Primary monitoring is through `gh pr checks`.

**Check status:**

Status appears in `gh pr checks` output. The `detailsUrl` links to the Buildkite build page.

**Fetch logs:**

Buildkite does not expose logs via a simple CLI command. Options:

1. If `bk` CLI is installed: `bk build view --pipeline {pipeline} --branch {branch}`
2. Otherwise: provide the `detailsUrl` to the user — "Check Buildkite logs at {url}"

**Retry a build:**

1. If `bk` CLI is installed: `bk build retry --pipeline {pipeline} --number {build_number}`
2. Otherwise: use the Buildkite REST API or direct the user to the web UI

**Extracting pipeline and build info from check name:**

Check name format is typically `buildkite/{org}/{pipeline}`. The `detailsUrl` contains the build number.

## Vercel

Vercel posts deployment status as GitHub checks and issue-level comments.

**Check deployment status:**

Status appears in `gh pr checks`. The `detailsUrl` links to the Vercel deployment.

**Inspect a deployment (if Vercel CLI installed):**

```bash
vercel inspect {deployment_url}
```

**View build logs:**

```bash
vercel logs {deployment_url}
```

**Stream live logs:**

```bash
vercel logs {deployment_url} --follow
```

**List recent deployments:**

```bash
vercel ls --limit 5
```

**Force redeploy:**

```bash
vercel --force
```

**Common Vercel failures:**
- Build errors — read logs for compilation/bundling errors
- Environment variable missing — check `vercel env ls`
- Timeout — notify user (infrastructure issue)

## Fly.io

**Check app status:**

```bash
flyctl status --app {app_name}
```

**View logs:**

```bash
flyctl logs --app {app_name} --no-tail
```

**Stream live logs:**

```bash
flyctl logs --app {app_name}
```

**View recent releases:**

```bash
flyctl releases --app {app_name}
```

**Trigger deployment:**

```bash
flyctl deploy --app {app_name}
```

**Check health:**

```bash
flyctl checks list --app {app_name}
```

**Common Fly failures:**
- Health check failure — check logs for crash/startup errors
- OOM — notify user (increase memory in `fly.toml`)
- Migration error — read logs, may need manual intervention

**Discovering the app name:**

1. Check `fly.toml` in the repo root for `app = "name"`
2. If not found, ask the user

## Failure classification

Decision tree for diagnosing CI/CD failures:

1. **Error contains "flaky", "timeout", or matches known flaky test pattern** → re-run the check
2. **Compilation/type/lint error in logs** → code fix needed. Read the error, fix the file, commit, push
3. **"rate limit", "quota", "infrastructure", "service unavailable"** → notify user (not fixable from code)
4. **"npm ERR!", "dependency", "resolution", "peer dep"** → delete lockfile, re-install, commit, push
5. **"OOM", "memory", "killed"** → notify user (infrastructure — needs config change)
6. **Test assertion failure (not flaky)** → read failing test and source, fix, commit, push
7. **Unknown** → fetch full logs, attempt diagnosis, notify user if unsure

When re-running checks, wait for the re-run to complete before diagnosing again. Do not re-diagnose while checks are pending.
