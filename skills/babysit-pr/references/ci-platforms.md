# CI/CD Platforms

All monitoring uses `gh` CLI. Platform-specific CLIs are not required.

## Contents

- [Universal status check](#universal-status-check)
- [GitHub Actions](#github-actions)
- [Buildkite](#buildkite)
- [Vercel](#vercel)
- [Fly.io](#flyio)
- [Failure classification](#failure-classification)

## Universal status check

All CI/CD platforms register as GitHub checks. One command covers everything:

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

Buildkite registers as GitHub checks with a `buildkite/` prefix.

**Check status:**

```bash
gh pr checks --json name,state,conclusion,detailsUrl | jq '.[] | select(.name | startswith("buildkite/"))'
```

**Fetch logs:**

Buildkite does not expose logs through `gh`. Use the `detailsUrl` from the check output — it links directly to the Buildkite build page. Provide it to the user: "Check Buildkite logs at {detailsUrl}"

**Retry a build:**

No `gh` command to retry Buildkite builds. Push a new commit or empty commit to trigger a re-run:

```bash
git commit --allow-empty -m "ci: retry buildkite" && git push
```

**Extracting pipeline and build info from check name:**

Check name format is typically `buildkite/{org}/{pipeline}`. The `detailsUrl` contains the build number.

## Vercel

Vercel posts deployment status as GitHub checks and issue-level comments.

**Check deployment status:**

```bash
gh pr checks --json name,state,conclusion,detailsUrl | jq '.[] | select(.name | test("vercel|Vercel"; "i"))'
```

**Get deployment URL from PR comments:**

Vercel bot posts deployment links as issue comments:

```bash
gh pr view --json comments --jq '.comments[] | select(.author.login == "vercel[bot]") | .body' | head -1
```

**View deployment details via API:**

```bash
gh api repos/{owner}/{repo}/deployments --jq '.[0] | {environment, state, description, created_at}'
```

**List deployment statuses:**

```bash
gh api repos/{owner}/{repo}/deployments/{deployment_id}/statuses
```

**Common Vercel failures:**
- Build errors — check the `detailsUrl` from `gh pr checks` for build logs
- Environment variable missing — notify user
- Timeout — notify user (infrastructure issue)

## Fly.io

Fly.io may register as a GitHub check if configured via GitHub Actions.

**Check status:**

```bash
gh pr checks --json name,state,conclusion,detailsUrl | jq '.[] | select(.name | test("fly"; "i"))'
```

**View deployment workflow logs:**

If Fly deploys via GitHub Actions, fetch the run logs:

```bash
gh run list --branch {branch} --json databaseId,name,conclusion | jq '.[] | select(.name | test("fly|deploy"; "i"))'
gh run view {run_id} --log-failed
```

**Common Fly failures:**
- Health check failure — check workflow logs for crash/startup errors
- OOM — notify user (needs `fly.toml` config change)
- Migration error — check workflow logs, may need manual intervention

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
