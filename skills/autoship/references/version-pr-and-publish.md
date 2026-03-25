# Version Packages PR and npm Publish

## Table of Contents

- [How Version Packages PR Gets Created](#how-version-packages-pr-gets-created)
- [Finding the Version Packages PR](#finding-the-version-packages-pr)
- [Verifying CI Before Merge](#verifying-ci-before-merge)
- [Merging the Version Packages PR](#merging-the-version-packages-pr)
- [Watching the npm-publish Workflow](#watching-the-npm-publish-workflow)
- [Cleanup](#cleanup)

## How Version Packages PR Gets Created

After a changeset is merged to the default branch, the changesets GitHub Action automatically:

1. Detects pending changesets in `.changeset/`
2. Runs `changeset version` to bump versions and update changelogs
3. Creates (or updates) a PR titled "Version Packages" on branch `changeset-release/main`

This may take 1-5 minutes after the merge.

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

## Watching the npm-publish Workflow

After merging, the push to the default branch triggers the `npm-publish.yml` (or similarly named) workflow.

### Detecting the Workflow Run

```bash
# Find the publish workflow
gh run list --workflow npm-publish.yml --branch main --limit 3 --json status,conclusion,databaseId,createdAt

# If the workflow name differs, list all recent runs
gh run list --branch main --limit 5 --json workflowName,status,conclusion,databaseId
```

### Polling for Completion

```
/loop 1m Check npm-publish workflow status and report progress
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
