# Hooks and the pre-PR gate

Hooks catch what an agent skipped before it leaves the machine; CI catches what the hooks missed or were bypassed for. Both call the same scripts, so a check has one definition.

## One entry point

Give the repository one command an agent runs before opening a PR, and name it in AGENTS.md:

```json
{
  "scripts": {
    "prepare": "lefthook install",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings=0",
    "test": "vitest run --reporter=dot",
    "verify": "npm run typecheck && npm run lint && npm run test"
  }
}
```

`prepare` runs on every `npm install`, so a fresh clone or an agent sandbox gets the hooks without anyone remembering. In a monorepo, `verify` calls the task runner (`turbo run typecheck lint test`); validate per workspace that each one has the script, because a missing script is skipped silently.

AGENTS.md line: ``Before opening a PR: `npm run verify` must pass on a fresh install. Quote its last line in the PR's Proof section.``

## lefthook.yml

```yaml
# Fast checks on commit, the affected suite on push. CI repeats all of it.
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx,js,jsx}"
      run: npx eslint --max-warnings=0 {staged_files}
    format:
      glob: "*.{ts,tsx,js,jsx,json,md,yml}"
      run: npx prettier --check {staged_files}

pre-push:
  parallel: true
  commands:
    typecheck:
      run: npm run typecheck
    test-affected:
      glob: "*.{ts,tsx,js,jsx}"
      run: npx vitest related --run --reporter=dot {push_files}
```

- Typecheck runs whole-project on push: a partial typecheck misses the caller that broke.
- `vitest related` runs tests that import the pushed files. In a Turborepo, `turbo run test --affected` is the equivalent across workspaces.
- Keep pre-commit under a few seconds or agents and people learn `--no-verify`. Anything slow moves to pre-push.

## Watch each hook fail

For every command: stage a deliberate violation (a type error, a lint error, a failing assertion in an affected test), run `npx lefthook run pre-commit` or `npx lefthook run pre-push`, see the exit code, revert. A hook whose glob matches nothing passes forever.

## CI repeats the hooks

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run verify
  container:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: false
          tags: app:pr-${{ github.sha }}
```

Make `verify` and `container` required checks on the default branch (a settings change the user applies). Read what is required now with `gh api repos/{owner}/{repo}/branches/main/protection --jq '.required_status_checks.contexts'` or `gh api repos/{owner}/{repo}/rulesets`. A required check whose name no longer matches a job sits at "Expected" forever and blocks every merge; compare the names after any rename. The reverse is worse: a job added but never made required is advice.

## Portability

The hooks live in git, so they fire whichever agent commits: Claude Code, Codex, Cursor, a cloud agent, or a person. Tool-native hooks (`.claude/settings.json`, `.cursor/hooks.json`) are a last rung for checks that must run mid-session, before a commit exists; they cover one tool each and never replace the git hook or the CI check.
