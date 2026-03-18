# CI/CD Platforms

Use `gh` CLI for GitHub (PRs, Actions, checks). Use platform-native CLIs for Buildkite, Vercel, and Fly.io.

## Contents

- [Universal status check](#universal-status-check)
- [GitHub Actions](#github-actions)
- [Buildkite](#buildkite)
- [Vercel](#vercel)
- [Fly.io](#flyio)
- [Failure classification](#failure-classification)

## Universal status check

All CI/CD platforms register as GitHub checks. One command covers status:

```bash
gh pr checks --json name,state,conclusion,detailsUrl
```

Watch all checks until they complete:

```bash
gh pr checks --watch
```

Wait for only required checks:

```bash
gh pr checks --watch --required
```

Identify the platform from the check name:

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

Buildkite registers as GitHub checks with a `buildkite/` prefix. Use `gh pr checks` for status, `bk` CLI for logs and retries.

**Check status:**

```bash
gh pr checks --json name,state,conclusion,detailsUrl | jq '.[] | select(.name | startswith("buildkite/"))'
```

Check name format is typically `buildkite/{org}/{pipeline}`. The `detailsUrl` contains the build number.

**View build details:**

```bash
bk build view --pipeline {pipeline} --branch {branch}
```

**Fetch logs:**

```bash
bk job log --pipeline {pipeline} --build {build_number} --job {job_id}
```

If `bk` CLI is not available, provide the `detailsUrl` to the user — it links directly to the Buildkite build page.

**Retry a build:**

```bash
bk build retry --pipeline {pipeline} --number {build_number}
```

## Vercel

Vercel posts deployment status as GitHub checks. Use `gh pr checks` for status, `vercel` CLI for logs and inspection.

**Check deployment status:**

```bash
gh pr checks --json name,state,conclusion,detailsUrl | jq '.[] | select(.name | test("vercel|Vercel"; "i"))'
```

**Inspect a deployment:**

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

**Check status via GitHub checks (if configured):**

```bash
gh pr checks --json name,state,conclusion,detailsUrl | jq '.[] | select(.name | test("fly"; "i"))'
```

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
