# CI/CD Platforms

`gh` for GitHub (PRs, Actions, checks); platform-native CLIs for Buildkite, Vercel, Fly.io.

## Contents

- [Universal status check](#universal-status-check)
- [GitHub Actions](#github-actions)
- [Buildkite](#buildkite)
- [Vercel](#vercel)
- [Fly.io](#flyio)
- [Failure classification](#failure-classification)

## Universal status check

Every platform registers as a GitHub check. Status:

```bash
gh pr checks --json name,state,bucket,link,workflow
```

Fields: `name`, `state` (raw GitHub status or conclusion), `bucket` (`pass`, `fail`, `pending`, `skipping`, `cancel`), `link` (details URL), `workflow`, `description`, `startedAt`, `completedAt`, `event`. There is no `conclusion` or `detailsUrl` field here; those live in `gh pr view --json statusCheckRollup`.

Exit codes: 0 all passed, 1 a check failed, 8 checks still pending, 16 no checks found. The JSON prints in every case, so in a script read stdout and ignore the exit status; in the fix loop use the exit status:

```bash
gh pr checks --watch --fail-fast              # returns on the first failure
gh pr checks --watch --required               # required checks only
```

`--interval` defaults to 10 seconds. Fine-grained personal access tokens cannot run this command (no `checks:read` scope); classic tokens and `gh auth login` OAuth can.

Identify the platform from the check `name` or `link`:

| Pattern | Platform |
|---------|----------|
| `buildkite/` prefix | Buildkite |
| `vercel` in name, or `vercel.com` in link | Vercel |
| `fly-` prefix, or `fly.io` in link | Fly.io |
| Everything else | GitHub Actions |

## GitHub Actions

Find the failing run for the branch:

```bash
gh run list --branch {branch} --limit 5 --json databaseId,name,status,conclusion,headSha
```

Failed-step logs only (the diagnosis command; the full `--log` is thousands of lines re-sent every turn):

```bash
gh run view {run_id} --log-failed
gh run view {run_id} --job {job_database_id} --log-failed   # one job
```

`--job` takes the job's `databaseId` (from `gh run view {run_id} --json jobs`), not the number in the browser URL, which 404s.

Re-run failed jobs only, once, for a flaky failure:

```bash
gh run rerun {run_id} --failed
```

`gh run watch {run_id} --exit-status --compact` waits on a single run; `gh pr checks --watch` waits on the PR.

## Buildkite

Registers as `buildkite/{org}/{pipeline}` checks, so pass/fail always comes from `gh pr checks`. Logs and retries need Buildkite auth: try the chain in order and stop at the first that works.

**1. `bk` CLI**

```bash
bk auth status
```

`bk` keeps its token in the OS credential store (macOS Keychain); tokens expire or get revoked, and a dead one stalls the cycle. On any error skip to option 2; do not prompt for re-auth mid-cycle. Tell the user once: "Run `bk auth login` (or `bk configure`) to restore Buildkite access; using the fallback until then." Re-test on the next cycle.

When auth is valid:

```bash
bk build view {build_number} --pipeline {pipeline} --job-states failed --output json
bk job log {job_id} --agent            # --agent strips ANSI and trims for an LLM
bk job retry {job_id}                  # each job id retries once; the response carries the new id
bk build rebuild {build_number} --pipeline {pipeline}
```

**2. REST API** (`BUILDKITE_API_TOKEN` set; scopes `read_builds`, `read_build_logs`, `write_builds`)

```bash
BK="https://api.buildkite.com/v2/organizations/{org}/pipelines/{pipeline}"
curl -sH "Authorization: Bearer $BUILDKITE_API_TOKEN" "$BK/builds/{build_number}"
curl -sH "Authorization: Bearer $BUILDKITE_API_TOKEN" -H "Accept: text/plain" \
  "$BK/builds/{build_number}/jobs/{job_id}/log"
curl -sH "Authorization: Bearer $BUILDKITE_API_TOKEN" -X PUT "$BK/builds/{build_number}/jobs/{job_id}/retry"
curl -sH "Authorization: Bearer $BUILDKITE_API_TOKEN" -X PUT "$BK/builds/{build_number}/rebuild"
```

`Accept: text/plain` returns the raw log; without it the log arrives as JSON with `content`, `size`, and `header_times`.

**3. Status only**

No auth at all: report pass/fail from `gh pr checks` and hand over the `link`: "Buildkite build failed. No Buildkite auth to fetch logs. See: {link}". Retry is impossible without auth.

**Parsing the link:** `https://buildkite.com/{org}/{pipeline}/builds/{build_number}` maps to the API path `organizations/{org}/pipelines/{pipeline}/builds/{build_number}`.

## Vercel

Deployment status arrives as GitHub checks and as a `vercel[bot]` comment (noise, per bot-patterns). Logs need the `vercel` CLI, and the two log commands are not interchangeable:

```bash
vercel inspect --logs {deployment_url}     # build logs: why the deployment failed
vercel inspect --logs --wait {deployment_url}   # still building: wait for completion
vercel logs {deployment_url}               # runtime request logs of a live deployment
vercel ls --limit 5                        # recent deployments
```

Missing environment variable: `vercel env ls`, then notify; the fix is in the dashboard, not the repo. Build timeout: infrastructure, notify.

## Fly.io

```bash
flyctl status --app {app}
flyctl logs --app {app} --no-tail           # buffered logs, no stream
flyctl releases --app {app}
flyctl checks list --app {app}
```

App name comes from `app = "..."` in `fly.toml` at the repo root; if absent, say so rather than guessing. OOM (`Out of memory`, `killed`) means raise memory in `fly.toml`: notify, it is a config decision. Health-check or migration failures need the log read and usually a human.

## Failure classification

Decide in this order; the first match wins:

1. **"flaky", "timeout", a known flaky pattern** → re-run once (`gh run rerun --failed`, `bk job retry`). A second identical failure is a real failure
2. **Type error pointing into a sibling workspace package, "Cannot find module", missing generated types** → stale dependency, not a code bug. Refresh below; code error only if it persists
3. **Compilation, type, or lint error (not stale)** → read the error, fix the file, gate, commit, push
4. **`knip` failure (unused files, exports, dependencies)** → delete the dead code. When it is intentional (a public entry point), add it to the `knip` config `entry` or `ignore`. `knip` exits 1 on any issue; `--production` narrows to production files if the repo runs it that way
5. **"rate limit", "quota", "service unavailable", 5xx from a registry** → infrastructure, notify
6. **"npm ERR!", "peer dep", "resolution"** → reinstall with the repo's package manager; in a monorepo rebuild dependency packages so workspace types resolve
7. **"OOM", "memory", "killed"** → infrastructure or runner config, notify
8. **Test assertion failure (not flaky)** → read the failing test and the source it exercises, fix, gate, commit, push
9. **Unknown** → fetch the full log, diagnose, notify if still unsure

Wait for any re-run to finish before diagnosing again.

### Stale-dependency type-check failures

In a monorepo, type-check fails when a dependency package's build output or generated types are stale, not because the changed code is wrong. Symptoms: errors pointing into `node_modules` or `dist` of a sibling package, types present in source but missing from the resolved declaration, a green editor and a red CI type-check.

Refresh before editing source:

```bash
npm ci                                  # or: yarn install --immutable / pnpm install --frozen-lockfile
turbo run build --filter=...[origin/{base}]   # or: nx affected -t build / make build-deps
# regenerate codegen types the repo defines (GraphQL, OpenAPI), then re-run the type-check
```

Passes after the refresh: stale-dependency issue, no source change. Still fails: a real code error (item 3).
