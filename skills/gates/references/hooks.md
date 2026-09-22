# Hooks and the pre-PR gate

Hooks catch what an agent skipped before it leaves the machine; CI catches what the hooks missed or were bypassed for. Both call the same scripts, so a check has one definition.

## Contents

- One entry point
- Tiers
- The boot check
- lefthook.yml
- Watch each hook fail
- CI repeats the hooks
- Portability

## One entry point

Give the repository one command an agent runs before opening a PR, and name it in AGENTS.md:

```json
{
  "scripts": {
    "prepare": "lefthook install",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings=0",
    "test": "vitest run --reporter=dot",
    "verify": "npm run typecheck && npm run lint && npm run test",
    "verify:full": "npm run verify && npm run test:integration && npm run boot"
  }
}
```

`prepare` runs on every `npm install`, so a fresh clone or an agent sandbox gets the hooks without anyone remembering. In a monorepo, `verify` calls the task runner (`turbo run typecheck lint test`); validate per workspace that each one has the script, because a missing script is skipped silently.

AGENTS.md line: ``Before opening a PR: `npm run verify` must pass on a fresh install. Quote its last line in the PR's Proof section.``

## Tiers

Name three tiers and say in AGENTS.md which one gates what. Two fold the edit loop into the test suite; four leave the agent guessing.

| Tier | Contents | Runs |
|------|----------|------|
| `check` | lint, typecheck, format check, plus file-scoped variants (`lint:file`, one project's typecheck, one test path) | Between edits; the agent knows which files it touched |
| `verify` | `check` plus unit tests | Before a commit or PR |
| `verify:full` | `verify` plus integration tests, the boot check, staleness gates | Pre-push and CI |

Put the latency budget in test filenames so "the narrowest tier" is a glob, not a judgement: `*.test.ts` under 3 s, `*.integration.test.ts` under 10 s, `*.e2e.test.ts` unbounded and outside `verify`.

## The boot check

`npm run boot` builds the app's wiring the way the entrypoint does (config, dependency container, module graph, route and job registration, telemetry start) against `.env.example`, asserts it came up, and exits without serving. It is the runtime-startup evidence level, and it catches what typecheck and unit tests both pass: everything compiles and the app cannot start, which is the break an agent makes when it adds a dependency or registers a module. Observed: dev startup failed on ESM resolution (TypeScript source run with type stripping, importing `.js` paths); a telemetry initializer was exported and never invoked; queues were registered before they existed on a fresh database. So assert the effects (initializer ran, queues exist), not only exit 0, and run it in CI against a fresh database. Watch it fail by deleting one registration.

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
      - run: npm run verify:full
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

The hooks live in git, so they fire whichever agent commits: Claude Code, Codex, Cursor, a cloud agent, or a person. Tool-native hooks (`.claude/settings.json`, `.cursor/hooks.json`) are a last rung for checks that must run mid-session, before a commit exists; they cover one tool each and never replace the git hook or the CI check. Three earn their place:

- **Session start:** install dependencies when missing, or the agent spends turns diagnosing a missing module as a code error. In parallel worktrees the same step copies env files, reuses dependency and codegen output when lockfiles match, and offsets dev-server ports; without the offset the second agent's server fails in a way that reads as a code bug.
- **After an edit:** format and autofix the file just written, so a formatting gate never fails on agent code. Pre-commit keeps what needs the staged set or the whole repo.
- **Before a command:** block what must never run unattended in this repo.
