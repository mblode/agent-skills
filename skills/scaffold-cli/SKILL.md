---
name: scaffold-cli
description: >-
  Scaffolds a production-ready TypeScript CLI and npm package: ESM on Node 24,
  a dual tsdown build (CLI binary plus typed library), vitest, oxlint and
  oxfmt via ultracite with a lefthook pre-commit hook, changesets v3, GitHub
  Actions CI, OIDC trusted publishing to npm including the first-publish
  bootstrap, publint and arethetypeswrong checks, AGENTS.md, and a bundled
  agent skill. Use when creating a new CLI tool, bootstrapping a TypeScript
  package, scaffolding a node CLI, starting a new npm package, or asking
  "scaffold a CLI project", "set up a new TypeScript CLI", or "new npm package
  with CI and publishing". For a Next.js web app use scaffold-nextjs; for
  structuring an existing codebase use codebase-architecture; for auditing an
  existing CLI's developer experience use dx-audit; for releasing an already-
  scaffolded package use autoship.
---

# Scaffold CLI

- **IS:** bootstrapping a brand-new TypeScript CLI or npm package (Node 24, TypeScript 7) from the pinned templates in `references/`, through to a green first CI run and a package npm can publish over OIDC.
- **IS NOT:** a Next.js web app (use `scaffold-nextjs`), folder structure or module contracts for an existing codebase (use `codebase-architecture`), auditing an existing CLI's ergonomics (use `dx-audit`), or shipping a release of an existing package (use `autoship`).

Low-freedom scaffold. Generate files exactly as templated, substituting only `{{placeholder}}` variables. The toolchain is the opinion: tsdown not tsup, vitest not jest, oxlint and oxfmt via ultracite not eslint or prettier, `node:util` `styleText` not chalk, `@clack/prompts` not ora. Swapping any of them or restructuring the layout produces a repo the templates' notes no longer describe.

## Reference Files

| File | Read When |
|------|-----------|
| `references/scaffold-configs.md` | Step 3: package.json, tsconfig, tsdown, gitignore, license, changeset config, GitHub Actions |
| `references/scaffold-source.md` | Steps 4-5: src/cli.ts, src/index.ts, src/types.ts, AGENTS.md, README.md, skills/SKILL.md |
| `references/agent-friendly-cli.md` | Step 4, only when a command takes an identifier, path, or URL, or mutates state: input validation, dry-run, confirmation, schema |
| `references/post-scaffold.md` | Steps 6-8: post-scaffold commands, the lefthook.yml replacement, validation checklist, GitHub and npm bootstrap, troubleshooting |

## Scaffold Workflow

Copy this checklist to track progress:

```text
Scaffold progress:
- [ ] Step 1: Gather project info
- [ ] Step 2: Create directory structure
- [ ] Step 3: Generate config files
- [ ] Step 4: Generate source files
- [ ] Step 5: Generate docs and skill
- [ ] Step 6: Run post-scaffold commands
- [ ] Step 7: Validate scaffold
- [ ] Step 8: Bootstrap GitHub and npm (with the user's go-ahead)
```

### Step 1: Gather project info

Ask only for what the user didn't provide:

| Variable | Example | Default | Used in |
|----------|---------|---------|---------|
| `{{name}}` | `md-tools` | required | package.json name, README title, npm package |
| `{{description}}` | `CLI tool to convert content to markdown` | required | package.json, README, SKILL.md |
| `{{bin}}` | `md` | same as `{{name}}` | package.json bin field, CLI examples, skills folder |
| `{{repo}}` | `acme/md-tools` | required | package.json repository, GitHub repo, npm trusted publisher |
| `{{author}}` | `Your Name` | required | package.json, LICENSE |
| `{{year}}` | `2026` | current year | LICENSE |

`{{repo}}` must be the exact GitHub `owner/name`: npm provenance rejects a publish whose `repository.url` differs from the repo it came from.

### Step 2: Create directory structure

```
{{name}}/
  .changeset/
  .github/
    workflows/
  src/
  skills/{{bin}}/
```

### Step 3: Generate config files

Load `references/scaffold-configs.md`. Generate every file there, replacing each `{{placeholder}}`:

`package.json`, `tsconfig.json`, `tsdown.config.ts`, `.gitignore`, `LICENSE.md`, `.changeset/config.json`, `.changeset/README.md`, `.github/workflows/ci.yml`, `.github/workflows/npm-publish.yml`

### Step 4: Generate source files

Load `references/scaffold-source.md`. Generate:

- `src/cli.ts`: Commander entry point with agent-friendly defaults (`--output text|json`, `--no-input`, stdout data / stderr log split, JSON error envelope)
- `src/index.ts`: Public API exports
- `src/types.ts`: Shared type definitions

When a command takes an identifier, path, or URL, or mutates state, also load `references/agent-friendly-cli.md` and copy the matching pinned pattern. Skip it for a CLI with no such command.

### Step 5: Generate docs and skill

From the same `references/scaffold-source.md`, generate:

- `AGENTS.md`: commands, architecture, gotchas, agent invariants
- `README.md`: install, usage, API, agent skill install, license
- `skills/{{bin}}/SKILL.md`: agent skill definition

Do not create the CLAUDE.md symlink here; Step 6 creates it exactly once.

### Step 6: Run post-scaffold commands

Load `references/post-scaffold.md`. Run the command sequence in the order given, including the `lefthook.yml` overwrite between `ultracite init` and the first commit.

### Step 7: Validate scaffold

Run the validation checklist in `references/post-scaffold.md`. Every item is a command whose output is the evidence; the checklist includes `publint`, `arethetypeswrong`, the hook exercised against real files, and the placeholder sweep.

### Step 8: Bootstrap GitHub and npm

Creating the GitHub repo and the first `npm publish` are public and irreversible (the npm name is claimed on publish), so confirm with the user before either, and stop after Step 7 if they only want local files. Otherwise follow "Bootstrap GitHub and npm" in `references/post-scaffold.md`: create and push the repo, enable Actions-created PRs, publish 0.0.1 once by hand so the package exists, then register the workflow as a trusted publisher. Terminal evidence is a green CI run on the pushed commit and `npm view {{name}} version` printing `0.0.1`. From here every release belongs to `autoship`.

## Dependencies

**Runtime:** `@clack/prompts`, `commander`

**Development (in the package.json template):** `@changesets/cli`, `@types/node`, `tsdown`, `typescript`, `vitest`

**Added by `ultracite init`, never listed by hand:** `ultracite` (pinned exact by init), `oxlint`, `oxfmt`, `lefthook`, plus the `check`, `fix`, and `prepare` scripts. By-hand entries produce duplicate scripts and version skew against what init installs.

## Gotchas

- **tsdown emits `.mjs` by default.** With `platform: node` (the default) `fixedExtension` is on, so a config without `outputOptions.entryFileNames: "[name].js"` builds `dist/cli.mjs`, `dist/index.mjs`, and `dist/index.d.mts`, and `bin` and `exports` point at files that do not exist. The `outputOptions` block in the template is what keeps them `.js`; do not trim it as noise.
- **No shebang in `src/cli.ts`.** tsdown's `banner` injects `#!/usr/bin/env node`; a source shebang doubles it in `dist/cli.js`. The two build entries stay separate: the CLI entry has the banner and `dts: false`, the library entry has `dts: true` and no banner.
- **`ultracite init --quiet` without `--linter oxlint` installs Biome.** Quiet mode defaults the linter to Biome instead of prompting, so the repo silently ends up on the wrong toolchain. Pass every flag in the post-scaffold command.
- **`git init` before `ultracite init`.** Init adds `prepare: lefthook install` and runs it at once; `lefthook install` writes into `.git/hooks` and fails without a repo.
- **Replace the generated `lefthook.yml` before the first commit.** It runs `npx ultracite fix` with no file arguments, so a one-line change reformats the whole tree (31 files in the reference repo), and its `**/*.ts` globs never match root files, so `package.json` and `tsdown.config.ts` edits bypass the hook entirely. Adding `{staged_files}` alone makes it worse: a JSON-only commit (the shape of the changesets bot's Version Packages commit) then hits oxlint with no lintable file and exits 1. Use the version in `references/post-scaffold.md`, with `*.{...}` globs, never `**/`.
- **`touch <file> && git add <file>` stages nothing.** An unchanged file has no staged diff, so the hook skips and the check proves nothing. Exercise the hook with `npx lefthook run pre-commit --file <path>`.
- **`"test": "vitest run"` without `--passWithNoTests`** exits 1 on a repo with zero test files, so the first CI run goes red.
- **`@changesets/cli@3` pairs with `changesets/action@v2` and the `publish-script:` input.** `@v1` cannot drive changesets v3, and `@v2` given the v1 `publish:` input versions the package and then completes green without publishing. The templates carry the matching pair; do not downgrade one side.
- **npm cannot register a trusted publisher for a package that does not exist yet.** The first release run fails `E404` or `ENEEDAUTH` until Step 8's one-time manual `npm publish` has created the package and the workflow is registered. That publish happens before any changeset exists, so it is the one manual publish `autoship`'s rules do not forbid.
- **Node 22 ships npm 10.9.x; OIDC publishing needs npm 11.5.1 or later.** Node 24 ships npm 11.19, which is why both workflows pin `node-version: 24`. Lowering it to 22 breaks publishing with `ENEEDAUTH`.
- **Agent-facing output is a format contract.** Data on stdout, logs and progress on stderr; a stray `console.log` breaks a consumer parsing `--output json`. Never prompt when stdin is not a TTY: honor `--no-input` and take every value as a flag, or the process hangs under a pipe.

## Related Skills

- `autoship`: every release after the bootstrap publish: changeset, CI watch, Version Packages PR, publish verification, and diagnosis of a release that did not publish.
- `dx-audit`: audit the CLI's flags, errors, and types once real commands exist.
- `agents-md`: grow the generated AGENTS.md as the codebase gains structure.
- `readme-creator`: rewrite the README once there is a real usage story to tell.
