# Version Packages PR and npm Publish

## Table of Contents

- [The `changesets/action` Workflow](#the-changesetsaction-workflow)
- [Finding the Version Packages PR](#finding-the-version-packages-pr)
- [Verifying CI Before Merge](#verifying-ci-before-merge)
- [Merging the Version Packages PR](#merging-the-version-packages-pr)
- [Watching the Publish Run](#watching-the-publish-run)
- [Cleanup](#cleanup)

## The `changesets/action` Workflow

A single workflow (commonly `release.yml` or `npm-publish.yml`) handles both versioning and publishing. It runs on pushes to the default branch and uses `changesets/action@v1` with a `publish:` input pointing at an npm script that calls `changeset publish` (typically `npm run release`).

The action has two modes, chosen automatically by state on `main`:

1. **Pending changesets present** → it runs `changeset version` internally, then opens or updates a PR titled "Version Packages" on branch `changeset-release/main` containing the version bump and `CHANGELOG.md` updates. No publish yet.
2. **No pending changesets (Version Packages PR just merged)** → it runs the `publish:` script, which calls `changeset publish` to push tags and publish to npm.

So the SAME workflow run that opens the Version Packages PR does not publish; a second run of the SAME workflow, triggered by merging that PR, publishes. When monitoring, you are watching two successive runs of one workflow — not two different workflows.

Reference best-practice `release.yml` shape (OIDC trusted publishing):

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

The `release` script is typically `changeset publish` (optionally preceded by a build). The `changeset:version` npm script, if present, is invoked by the action, **never locally**.

`.changeset/config.json` should have `"commit": false` so the action controls commits via the PR.

## Finding the Version Packages PR

### With `gh` CLI

```bash
# Search by title
gh pr list --search "Version Packages" --state open --json number,title,headBranch,statusCheckRollup

# Search by branch pattern
gh pr list --head changeset-release/main --state open --json number,title,statusCheckRollup
```

### If the PR Does Not Exist Yet

The changesets bot may take a few minutes. Set up a polling loop:

```
/loop 1m Search for open "Version Packages" PR and report if found
```

Poll for up to 10 minutes. If still not found, check:

- Are there pending changesets on the default branch?
- Is the changesets GitHub Action configured in `.github/workflows/`?
- Did the action run? Check with `gh run list --workflow <changeset-workflow-name>`

## Verifying CI Before Merge

Before merging the Version Packages PR, verify all CI checks pass:

```bash
gh pr checks <pr-number> --json name,state,conclusion
```

All checks must show `state: completed` and `conclusion: success`.

If checks are still running, use `/loop` to poll until they complete.

## Merging the Version Packages PR

This is a RED-tier operation -- confirm with the user before merging.

```bash
gh pr merge <pr-number> --squash --delete-branch
```

Prefer `--squash` for clean history. Use `--merge` if the project convention requires merge commits.

## Watching the Publish Run

After merging the Version Packages PR, the push to the default branch triggers the SAME release workflow again. This second run detects there are no pending changesets and executes the `publish:` script (`changeset publish`).

### Detecting the Workflow Run

Find the workflow file by inspecting `.github/workflows/` — common names are `release.yml`, `npm-publish.yml`, `publish.yml`. Then:

```bash
# Replace release.yml with the actual file name
gh run list --workflow release.yml --branch main --limit 3 --json status,conclusion,databaseId,createdAt

# Or list all recent runs and identify by name
gh run list --branch main --limit 5 --json workflowName,status,conclusion,databaseId
```

### Polling for Completion

```
/loop 1m Check release workflow status and report progress
```

Terminal conditions:

- **Success:** Workflow completes with `conclusion: success` -- report and stop
- **Failure:** Workflow completes with `conclusion: failure` -- report with logs and stop
- Do NOT auto-retry publish failures. These typically indicate real issues (auth, registry, permissions)

### Verifying the Published Version

After the publish workflow succeeds:

```bash
npm view <package-name> version
```

Compare with the version in `package.json` to confirm the publish was successful.

## Cleanup

- The `--delete-branch` flag on merge handles branch cleanup
- Cancel any remaining scheduled polling tasks
- Report the final published version to the user
