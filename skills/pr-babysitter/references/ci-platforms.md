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

Buildkite registers as GitHub checks with a `buildkite/` prefix. Status is always available via `gh pr checks`. Logs and retries require authenticated access: use the fallback chain below.

### Status (always works)

```bash
gh pr checks --json name,state,conclusion,detailsUrl | jq '.[] | select(.name | startswith("buildkite/"))'
```

Check name format is typically `buildkite/{org}/{pipeline}`. The `detailsUrl` links directly to the Buildkite build page.

### Auth Fallback Chain

Try these in order. Stop at the first one that works.

**1. `bk` CLI (if authenticated)**

Test auth first:

```bash
bk auth status 2>&1
```

If this returns a 401, expired token, or any error, skip to option 2. Do not retry or prompt the user to re-authenticate during a monitor cycle.

If auth is valid:

```bash
bk build view --pipeline {pipeline} --branch {branch}
bk job log --pipeline {pipeline} --build {build_number} --job {job_id}
bk build retry --pipeline {pipeline} --number {build_number}
```

**2. Buildkite REST API (if `BUILDKITE_API_TOKEN` is set)**

```bash
# List builds for the branch
curl -sH "Authorization: Bearer $BUILDKITE_API_TOKEN" \
  "https://api.buildkite.com/v2/organizations/{org}/pipelines/{pipeline}/builds?branch={branch}&per_page=1"

# Get build details
curl -sH "Authorization: Bearer $BUILDKITE_API_TOKEN" \
  "https://api.buildkite.com/v2/organizations/{org}/pipelines/{pipeline}/builds/{build_number}"

# Get job log
curl -sH "Authorization: Bearer $BUILDKITE_API_TOKEN" \
  "https://api.buildkite.com/v2/organizations/{org}/pipelines/{pipeline}/builds/{build_number}/jobs/{job_id}/log"

# Retry a build
curl -sH "Authorization: Bearer $BUILDKITE_API_TOKEN" \
  -X PUT "https://api.buildkite.com/v2/organizations/{org}/pipelines/{pipeline}/builds/{build_number}/rebuild"
```

Extract org and pipeline from the check name: `buildkite/{org}/{pipeline}` maps to the API path `organizations/{org}/pipelines/{pipeline}`.

**3. Fallback: `gh pr checks` + detailsUrl (always works)**

If neither `bk` CLI nor `BUILDKITE_API_TOKEN` is available:

- Use `gh pr checks` for pass/fail status (always available)
- Provide the `detailsUrl` link for the user to check logs manually
- Cannot retry builds without auth. Notify the user: "Buildkite build failed. Unable to fetch logs (no Buildkite auth). See: {detailsUrl}"

### BK CLI Auth Recovery

If `bk auth status` fails and the user wants to fix it:

1. The `bk` CLI stores tokens in the macOS Keychain as `bkua_*` entries; these expire or get revoked periodically
2. Tell the user: "Run `! bk auth login` to re-authenticate. I'll use the fallback until then."
3. Do not block the monitor cycle on auth recovery; continue with fallback options
4. On the next cycle, re-test `bk auth status` to pick up restored auth

### Parsing detailsUrl

The `detailsUrl` from `gh pr checks` contains all the information needed:

```
https://buildkite.com/{org}/{pipeline}/builds/{build_number}
```

Parse with:

```bash
org=$(echo "$url" | sed -E 's|https://buildkite.com/([^/]+)/.*|\1|')
pipeline=$(echo "$url" | sed -E 's|https://buildkite.com/[^/]+/([^/]+)/.*|\1|')
build_number=$(echo "$url" | sed -E 's|.*/builds/([0-9]+).*|\1|')
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
- Build errors: read logs for compilation/bundling errors
- Environment variable missing: check `vercel env ls`
- Timeout: notify user (infrastructure issue)

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
- Health check failure: check logs for crash/startup errors
- OOM: notify user (increase memory in `fly.toml`)
- Migration error: read logs, may need manual intervention

**Discovering the app name:**

1. Check `fly.toml` in the repo root for `app = "name"`
2. If not found, notify the user that the app name could not be determined

## Failure classification

Decision tree for diagnosing CI/CD failures:

1. **Error contains "flaky", "timeout", or matches known flaky test pattern** → re-run the check
2. **Type error referencing a sibling/workspace package's types, or "Cannot find module"/missing generated types** → likely **stale dependency**, not a code bug. Reinstall and rebuild deps, regenerate types, then re-run type-check (see below). Only treat as a code error if it persists
3. **Compilation/type/lint error in logs (not stale-dependency)** → code fix needed. Read the error, fix the file, commit, push
4. **`knip` failure (unused files, exports, or dependencies)** → remove the dead export/file/dep. If the report is intentional (e.g. a public API entry point), add it to the `knip` config's `ignore`/`entry` instead. Commit, push
5. **"rate limit", "quota", "infrastructure", "service unavailable"** → notify user (not fixable from code)
6. **"npm ERR!", "dependency", "resolution", "peer dep"** → reinstall (delete lockfile + `node_modules` if needed), and in a monorepo rebuild dependency packages so workspace types resolve, commit, push
7. **"OOM", "memory", "killed"** → notify user (infrastructure; needs a config change)
8. **Test assertion failure (not flaky)** → read failing test and source, fix, commit, push
9. **Unknown** → fetch full logs, attempt diagnosis, notify user if unsure

When re-running checks, wait for the re-run to complete before diagnosing again. Do not re-diagnose while checks are pending.

### Stale-dependency type-check failures

In a monorepo, a type-check often fails not because the changed code is wrong but because a dependency package's build output or generated types are out of date relative to the working tree. Symptoms: errors pointing into `node_modules`/`dist` of a sibling package, types that exist in source but not in the resolved declaration, or a green local editor but a red CI type-check.

Before editing source, refresh the dependency graph and re-run:

```bash
# reinstall (use the repo's package manager)
npm ci            # or: yarn install --immutable / pnpm install --frozen-lockfile
# rebuild dependency packages so workspace types resolve (use the repo's task runner)
turbo run build --filter=...[changed]   # or: nx affected -t build / make build-deps
# regenerate any codegen'd types (GraphQL, OpenAPI, etc.) the repo defines
# then re-run the type-check
```

If the type-check passes after the refresh, it was a stale-dependency issue and no source change is needed. If it still fails, treat it as a real code error (item 3).
