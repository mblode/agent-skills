# Version Packages PR and npm Publish

## Contents

- [The Release Workflow](#the-release-workflow)
- [Finding the Version Packages PR](#finding-the-version-packages-pr)
- [Waiting for the PR to Appear](#waiting-for-the-pr-to-appear)
- [Merge Preconditions and Merge](#merge-preconditions-and-merge)
- [Watching the Publish Run](#watching-the-publish-run)
- [Verifying on npm](#verifying-on-npm)
- [Publish Failure Table](#publish-failure-table)

## The Release Workflow

One workflow (commonly `release.yml` or `npm-publish.yml`) handles versioning and publishing across two runs on the default branch (SKILL.md, The Release Loop). Current shape with OIDC trusted publishing and `changesets/action@v2`:

```yaml
on:
  push:
    branches: [main]
permissions:
  contents: write
  pull-requests: write
  id-token: write
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@v6
        with: { node-version: 24, registry-url: https://registry.npmjs.org, cache: npm }
      - run: npm ci
      - uses: changesets/action@v2
        with:
          publish-script: npm run release
```

- `release` is typically `npm run build && changeset publish`. `changeset publish` calls `npm publish` per package; with `id-token: write`, npm 11.5.1+, and a trusted publisher configured on npmjs.com for this repo and this workflow filename, no token is involved and provenance is attached automatically (`NPM_CONFIG_PROVENANCE` and `--provenance` are redundant).
- The same workflow on `@v1` uses `publish: npm run release` and `env: GITHUB_TOKEN`. Both majors default the PR title to "Version Packages" and the head branch to `changeset-release/<base>`; v2 also defaults `create-github-releases` and `push-git-tags` to true.
- v2 no longer writes `.npmrc` from `NPM_TOKEN`; token auth on v2 means the workflow sets `NODE_AUTH_TOKEN` itself, and only a granular token works (classic tokens are revoked).
- Repository setting required for the PR to open: Settings, Actions, General, "Allow GitHub Actions to create and approve pull requests".
- Any `changeset:version` npm script is invoked by the action, never locally.

## Finding the Version Packages PR

```bash
BASE=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name)
gh pr list --state open --head "changeset-release/$BASE" \
  --json number,title,headRefName,mergeable,statusCheckRollup
```

The head branch is the identity; the title is "Version Packages" by default but `pr-title` can rename it and pre mode appends "(next)". `headBranch` is not a valid `--json` field; `headRefName` is.

## Waiting for the PR to Appear

`changesets/action` opens the PR during the release run triggered by the changeset push, usually within a minute of that run finishing. When the Step 4a watch is `TERMINAL: success` and the PR is absent, run this watch (Monitor or background Bash, per `references/ci-polling.md` mechanics) with a 10-minute cap:

```bash
BASE=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name)
DEADLINE=$(( $(date +%s) + 600 ))
while [ "$(date +%s)" -lt "$DEADLINE" ]; do
  PR=$(gh pr list --state open --head "changeset-release/$BASE" --json number --jq '.[0].number // empty' 2>/dev/null)
  [ -n "$PR" ] && { echo "FOUND: $PR"; exit 0; }
  sleep 30
done
echo "TIMEOUT"; exit 1
```

On `TIMEOUT`, check in order: `gh run view <release-run-id> --log-failed` for "not permitted to create or approve pull requests"; `ls .changeset/*.md` on the default branch still shows the pending file; `.github/workflows/` contains a `changesets/action` step that triggers on push to the default branch.

## Merge Preconditions and Merge

```bash
gh pr checks <n> --json name,bucket          # every bucket must be pass
gh pr view <n> --json mergeable,headRefName  # MERGEABLE, changeset-release/<base>
```

`bucket` is one of `pass`, `fail`, `pending`, `skipping`, `cancel`; anything but `pass` blocks. `mergeable` is `MERGEABLE`, `CONFLICTING`, or `UNKNOWN` (still computing: wait 30 seconds and re-query).

Merging is Yellow tier: announce one line, then execute. Do not prompt for re-confirmation; invoking autoship is the consent.

```text
Merging Version Packages PR #<n>: <package>@<version>
```

```bash
gh pr merge <n> --squash --delete-branch
```

If squash is disabled the command errors; pick the method the repo allows from `gh repo view --json squashMergeAllowed,mergeCommitAllowed,rebaseMergeAllowed`. A failed precondition means stop and report: never `--admin`, never resolve conflicts inside the bot PR (fix on the default branch and let the action regenerate it).

## Watching the Publish Run

The merge triggers the second run of the same workflow. Scope the watch to the merge commit rather than "latest run on main", which can pick up an unrelated push:

```bash
SHA=$(gh pr view <n> --json mergeCommit --jq .mergeCommit.oid)
```

Run the commit watch script with that `SHA`. On `TERMINAL: failure`, `gh run view <id> --log-failed` on the release run and match it against the failure table below. Publish failures are configuration, auth, or registry state; a blind rerun reproduces the same error and, on a partial monorepo publish, can double-publish the packages that succeeded.

## Verifying on npm

```bash
VERSION=$(jq -r .version package.json)     # on the merged default branch
npm view <package>@"$VERSION" version       # prints the version; E404 means not published
npm view <package> dist-tags               # latest must point at $VERSION unless pre mode
```

With `create-github-releases` on, `gh release view "v$VERSION"` (or `<package>@$VERSION` in a monorepo) is a third confirmation. Quote the `npm view` outputs in the final report; they are the completion evidence.

## Publish Failure Table

| Log says | Cause | Fix |
|----------|-------|-----|
| `Unexpected input(s) 'publish'` warning, run green, no publish | `changesets/action@v2` with v1 input names | Rename to `publish-script` (and `version-script`, `pr-title`, `commit-message`, `pr-base-branch`) |
| `ENEEDAUTH` with `id-token: write` set | npm older than 11.5.1 (Node 22 ships 10.9.x), or the trusted publisher's workflow filename, owner, or repo does not match this workflow exactly (case and `.yml` included), or the publish runs from a reusable workflow so npm sees the caller's filename | Node 24 or `npm install -g npm@latest`; fix the trusted publisher entry on npmjs.com; publish from the registered workflow file |
| `ENEEDAUTH` or `E401` with an `NPM_TOKEN` secret | Classic token (all revoked), or an expired granular token | Configure a trusted publisher and drop the secret |
| `E402 Payment Required` on a scoped package | `access` defaults to `restricted` | `"access": "public"` in `.changeset/config.json` (or `publishConfig.access` in `package.json`) |
| `E422` `Failed to validate repository information` | `package.json` `repository.url` does not match the GitHub repo exactly; provenance rejects it | Fix `repository.url` to `git+https://github.com/<owner>/<repo>.git`, merge, and let the loop run again |
| `E403` `You cannot publish over the previously published versions` | The version already exists (manual `npm publish`, or a re-run after a partial publish) | Nothing to publish for that version; confirm with `npm view`; add a new changeset for further changes |
| Provenance missing on npmjs.com, publish succeeded | Private repository or private package | Expected; provenance is only generated for public repo and public package |

Every row needs a config, settings, or code change before the loop can succeed. Report the row and the fix; do not re-run the workflow.
