# Version Packages PR and npm Publish

> The Monitor watch scripts for this file live in `references/ci-polling.md` ("Waiting for the Version Packages PR to Appear" and "Watching the Publish Workflow"); SKILL.md Steps 4 and 5 load both files together, so they are in context.

## Table of Contents

- [The `changesets/action` Workflow](#the-changesetsaction-workflow)
- [Finding the Version Packages PR](#finding-the-version-packages-pr)
- [Verifying CI Before Merge](#verifying-ci-before-merge)
- [Merging the Version Packages PR](#merging-the-version-packages-pr)
- [Watching the Publish Run](#watching-the-publish-run)

## The `changesets/action` Workflow

One workflow (commonly `release.yml` or `npm-publish.yml`) handles both versioning and publishing across two successive runs on the default branch (see SKILL.md's Release Loop). Reference best-practice shape (OIDC trusted publishing):

```yaml
permissions:
  contents: write
  pull-requests: write
  id-token: write
steps:
  - uses: actions/checkout@v4
    with: { fetch-depth: 0 }
  - uses: actions/setup-node@v4
    with: { node-version: 22, registry-url: https://registry.npmjs.org, cache: npm }
  - run: npm ci
  - uses: changesets/action@v1
    with:
      publish: npm run release
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_CONFIG_PROVENANCE: "true"
```

The `release` script is typically `changeset publish` (optionally preceded by a build). The `changeset:version` npm script, if present, is invoked by the action, **never locally**. Set `"commit": false` in `.changeset/config.json` so the action controls commits via the PR.

## Finding the Version Packages PR

### With `gh` CLI

```bash
# Search by title (the JSON field is headRefName; headBranch is not a valid field)
gh pr list --search "Version Packages" --state open --json number,title,headRefName,statusCheckRollup

# Search by branch pattern
gh pr list --head changeset-release/main --state open --json number,title,statusCheckRollup
```

### If the PR Does Not Exist Yet

The changesets bot may take a few minutes. Watch with the "Waiting for the Version Packages PR to Appear" script in `ci-polling.md`, capped at 10 minutes. On timeout, check:

- Are there pending changesets on the default branch?
- Is the changesets GitHub Action configured in `.github/workflows/`?
- Did the action run? Check with `gh run list --workflow <changeset-workflow-name>`

## Verifying CI Before Merge

Before merging, verify every check passes:

```bash
gh pr checks <pr-number> --json name,state,bucket
```

Every check must report `bucket: pass`. A `bucket` of `pending`, `fail`, `skipping`, or `cancel` blocks the merge. If checks are still running, use the watch script in `ci-polling.md` to wait.

## Merging the Version Packages PR

YELLOW-tier within autoship: invoking the skill is standing consent for the merge. Do not prompt for re-confirmation. Gate the merge on the objective preconditions in SKILL.md Step 4 (PR identity, every check `bucket: pass`, `mergeable: MERGEABLE`).

Announce in one short line, then execute:

```text
Merging Version Packages PR #<n>: <package>@<version>
```

```bash
gh pr merge <pr-number> --squash --delete-branch
```

Prefer `--squash` for clean history; use `--merge` if the project convention requires merge commits. `--delete-branch` handles cleanup. If any precondition fails, stop and report; do not fix mergeability or override failing checks.

## Watching the Publish Run

The merge triggers the second run of the SAME workflow, which publishes (see SKILL.md's Release Loop).

### Detecting the Workflow Run

Find the workflow file in `.github/workflows/`; common names are `release.yml`, `npm-publish.yml`, `publish.yml`. Then:

```bash
# Replace release.yml with the actual file name
gh run list --workflow release.yml --branch main --limit 3 --json status,conclusion,databaseId,createdAt

# Or list all recent runs and identify by name
gh run list --branch main --limit 5 --json workflowName,status,conclusion,databaseId
```

### Watching for Completion

Run the "Watching the Publish Workflow" script from `ci-polling.md` on the release workflow's latest run on `main`. It exits on the first `TERMINAL:` line.

Terminal conditions:

- **Success:** `conclusion: success`. Report and stop.
- **Failure:** any other conclusion. Report with logs and stop.
- Do NOT auto-retry publish failures; causes are real (npm auth, registry, OIDC/provenance, tag conflict).

### Verifying the Published Version

After the publish workflow succeeds:

```bash
npm view <package-name> version
```

Compare with the version in `package.json` to confirm the publish. Stop any Monitor watches still running, then report the final published version.
