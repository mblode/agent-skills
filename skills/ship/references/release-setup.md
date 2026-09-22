# Release Setup

One-time wiring for an npm package that has no release path yet, usually straight after `scaffold`: the changesets config, the Changeset Status check, the release workflow, the Actions PR setting, the bootstrap publish, and the trusted publisher. Done means `npm view <pkg> version` prints the bootstrap version and the trusted publisher entry names the release workflow; the first changeset release through Release mode is the proof that OIDC works.

## Contents

- Versions
- Package and changesets config
- Changeset Status on pull requests
- Release workflow
- Repository setting
- Bootstrap publish and trusted publisher
- Gotchas

## Versions

Resolve every action and runtime major at setup time; nothing here is pinned. `gh api repos/<owner>/<action>/releases/latest --jq .tag_name` gives an action's current release; use its major. Node is the current active LTS major.

One hard minimum: OIDC trusted publishing needs npm 11.5.1 or later (checked 1 Sep 2026). Node 22 bundles npm 10.9.x, and a publish on it fails `ENEEDAUTH` with `id-token: write` set. The workflow below upgrades npm before publishing, so the Node major cannot silently drop below it.

Resolve `@changesets/cli` and `changesets/action` together: the action's README names the CLI majors it drives and its input names. `@v1` takes `publish:`, `@v2` takes `publish-script:`, and a wrong name is ignored with a warning while the run goes green without publishing.

## Package and changesets config

`npm install -D @changesets/cli && npx changeset init` writes `.changeset/config.json` with the matching `$schema`. Then set these fields and add the two scripts:

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

```json
"scripts": {
  "changeset": "changeset",
  "release": "npm run build && changeset publish"
}
```

- `access: public`: a scoped package defaults to restricted and fails `E402` on the first release.
- `baseBranch` is the repo's default branch; `commit: false` because the action commits the version bump.
- `package.json` `repository.url` is exactly `git+https://github.com/<owner>/<repo>.git`; provenance rejects any other shape with `E422`.

## Changeset Status on pull requests

Add to the existing CI workflow, not the release one:

```yaml
      - uses: {{checkout_action}}
        with:
          fetch-depth: 0   # --since needs the base branch history
      # ...setup-node and npm ci as in the job...
      - name: Changeset Status
        if: github.event_name == 'pull_request'
        run: npx changeset status --since origin/main
```

## Release workflow

`.github/workflows/release.yml`. The trusted publisher registers this filename, so pick it once and never rename it.

```yaml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write       # version commit, tags, GitHub releases
  pull-requests: write  # the Version Packages PR
  id-token: write       # the OIDC token npm exchanges for a publish credential

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: {{checkout_action}}
        with:
          fetch-depth: 0
      - uses: {{setup_node_action}}
        with:
          node-version: {{node_major}}
          registry-url: https://registry.npmjs.org
          cache: npm
      - name: npm new enough for OIDC trusted publishing
        run: npm install -g npm@latest
      - run: npm ci
      - uses: {{changesets_action}}
        with:
          publish-script: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

No `NPM_TOKEN`, no `NODE_AUTH_TOKEN`, no `--provenance`: with `id-token: write` and a registered trusted publisher, npm mints the credential and attaches provenance itself. Before committing, `grep -n '{{[a-z_]*}}' .github/workflows/*.yml` returns nothing.

## Repository setting

New personal repos block Actions from opening PRs, so the first release run fails and no Version Packages PR appears. The setting is Settings, Actions, General, "Allow GitHub Actions to create and approve pull requests", or:

```bash
gh api -X PUT repos/<owner>/<repo>/actions/permissions/workflow \
  -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
```

A repository settings change: ask first. An org-level setting can override it.

## Bootstrap publish and trusted publisher

npm cannot register a trusted publisher for a package that does not exist, so the first version goes up by hand. It is the one manual publish SKILL.md permits: it happens before any changeset exists, at the version already in `package.json`, and only with the user's go-ahead.

1. The config and workflow above are merged on the default branch, and `npm view <pkg>` returns `E404` (name free) or shows a package the user owns.
2. From a clean checkout of the default branch: `npm whoami` (if it fails, the user runs `npm login`; it is interactive), then `npm run build && npm publish --access public`. An account with 2FA prompts for a one-time code: hand the command to the user rather than retrying.
3. `npm view <pkg> version` prints the bootstrap version. Quote it.
4. The user registers the trusted publisher on npmjs.com (package, Settings, Trusted Publisher, GitHub Actions): owner, repository, and workflow filename `release.yml` exactly, environment blank unless the job declares one. npm does not validate the entry on save; a mismatch in case or extension surfaces only at publish time as `ENEEDAUTH`.
5. If the repo carries an `NPM_TOKEN` secret, propose deleting it: classic tokens were revoked on 9 December 2025, and write-capable granular tokens expire within 90 days.

From here every release is Release mode: a changeset file, the Version Packages PR, and the OIDC publish.

## Gotchas

- A publish from a reusable workflow presents the caller's filename to npm; register the file that calls it, or publish from the registered file directly.
- The first release run before step 4 fails `E404` or `ENEEDAUTH`. That is the missing trusted publisher, not a workflow bug; do not add a token to get past it.
- Provenance is generated only for a public repository and a public package. A private repo publishes without it, as expected.
