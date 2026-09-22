# CLI Profile: TypeScript CLI and npm Package

A TypeScript CLI or library on current Node LTS, built with tsdown into a CLI entry and a typed library entry, tested with Vitest, linted by Ultracite over Oxlint and Oxfmt, hooked by Lefthook, with agent-friendly output contracts. Templates are in `templates/cli/`. Release wiring (changesets, the publish workflow, OIDC trusted publishing, the first publish) is `ship`.

## Contents

- Inputs
- Sequence
- Agent-friendly patterns
- Validation
- Gotchas

## Inputs

`{{name}}` (npm name, may be scoped), `{{description}}`, `{{bin}}` (defaults to the unscoped name), `{{repo}}` (exact GitHub `owner/name`: npm provenance rejects a publish whose `repository.url` differs), `{{author}}`, `{{year}}`. `{{node_major}}` is the current Node LTS major, resolved from `node --version` against the Node release schedule, and the same number goes in `engines` and CI.

The toolchain is the opinion: tsdown not tsup, Vitest not Jest, Ultracite (Oxlint, Oxfmt) not ESLint or Prettier, `styleText` from `node:util` not chalk, `@clack/prompts` not ora. Swapping one produces a repo the templates no longer describe.

## Sequence

1. **Layout.** `{{name}}/` with `src/`, `.github/workflows/`, and `skills/{{bin}}/`.
2. **Config.** From the templates: `package.json`, `tsconfig.json`, `tsdown.config.ts`, `.gitignore` (from `gitignore`), `.github/workflows/ci.yml`. An MIT `LICENSE.md` with `{{year}}` and `{{author}}`.
3. **Dependencies, resolved live.** `npm install commander @clack/prompts`, then `npm install -D typescript tsdown vitest @types/node`. The templates carry no versions; the lockfile is the record.
4. **Source.** `src/cli.ts` from `cli.ts`, an `src/index.ts` exporting the public API, `src/types.ts` for shared types. Copy from `agent-patterns.ts` only the pattern a command needs (below).
5. **Docs and skill.** `AGENTS.md` from `agents.md.tmpl`, `skills/{{bin}}/SKILL.md` from `skill.md.tmpl`, and a README covering install, usage, the programmatic API, and `npx skills add {{repo}}` for agents. No CLAUDE.md wrapper.
6. **Lint and hooks.** `git init` first, then `npx ultracite@latest init --linter oxlint --integrations lefthook --pm npm --quiet`. Overwrite the generated `lefthook.yml` with the template before the first commit.
7. **Validate** (below), then commit locally.
8. **Remote**, only with the user's go-ahead or an explicit request: create and push the GitHub repo, and confirm the first CI run is green. Publishing, including the one-time bootstrap publish, is `ship`.

## Agent-friendly patterns

`cli.ts` already ships a global `--output text|json`, `--no-input`, the stdout-data and stderr-log split, and a JSON error envelope. `agent-patterns.ts` holds four more, each copied only when its condition holds:

| Pattern | Copy when |
|---|---|
| Input validation (`assertSafeId`, `containedPath`, `urlSegment`) | A command takes an identifier, path, or URL segment |
| Dry run | A command mutates state |
| Confirmation with `--yes` | A command is destructive |
| `schema` command | The CLI has more than a couple of commands |

## Validation

Each item is a command whose output is the evidence:

- `npm run build` emits `dist/cli.js`, `dist/index.js`, and `dist/index.d.ts`; `npx --yes publint` reports no missing `bin`, `main`, `types`, or `exports` targets.
- `head -1 dist/cli.js` prints exactly one `#!/usr/bin/env node`.
- `npm run typecheck`, `npm run check`, and `npm test` pass (zero test files is a pass only because of `--passWithNoTests`).
- `node dist/cli.js --version` prints `0.0.1`; `--help` lists `--output` and `--no-input`; `node dist/cli.js --version | cat` has no ANSI codes.
- `npx lefthook run pre-commit --file package.json` exits 0: the JSON-only path a release bot's version commit takes.
- `scripts/cold-clone.sh` passes on the committed state.
- The placeholder sweep returns nothing.

## Gotchas

- tsdown's node-platform default emits `.mjs` and `.d.mts`, so `bin` and `exports` point at files that do not exist. `fixedExtension: false` in the template keeps `.js`; publint catches the mismatch if it comes back.
- The CLI entry sets `dts: false` explicitly: tsdown enables declarations automatically when `package.json` has `types`, which emits a stray `cli.d.ts`.
- No shebang in `src/cli.ts`: the `banner` injects it, and a source shebang doubles it.
- `ultracite init --quiet` without `--linter oxlint` installs Biome. `git init` must come first: init runs `lefthook install`, which writes into `.git/hooks`.
- `ultracite init` adds `ultracite`, `oxlint`, `oxfmt`, `lefthook`, and the `check`, `fix`, and `prepare` scripts. Listing them by hand produces duplicate scripts and version skew.
- The generated `lefthook.yml` runs `ultracite fix` with no file arguments, reformatting the whole tree on a one-line commit, and its `**/` globs never match root files. Adding `{staged_files}` alone is worse: a JSON-only commit then reaches oxlint empty and fails. Use the two-job template.
- `touch <file> && git add <file>` stages nothing, so the hook skips and proves nothing. Exercise it with `npx lefthook run pre-commit --file <path>`.
- Relative imports need `.js` extensions under NodeNext even from `.ts` sources, or the typecheck fails.
- Agent-facing output is a format contract: a stray `console.log` on stdout breaks a consumer parsing `--output json`, and a prompt when stdin is not a TTY hangs the pipe.
