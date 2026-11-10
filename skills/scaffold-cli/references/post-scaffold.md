# Post-Scaffold Commands

Run in order after all files are generated.

## Contents

- Command Sequence
- Command Notes
- Validation Checklist
- Troubleshooting

## Command Sequence

```bash
cd {{name}}
git init
pnpm dlx ultracite@latest init --linter oxlint --integrations lefthook --pm pnpm --quiet
# Use AGENTS.md directly; no compatibility symlink.
git add .
git commit -m "Initial commit"
```

## Command Notes

- `pnpm-workspace.yaml` from Step 3 must exist before `ultracite init`: its `allowBuilds` entry for `lefthook` is what lets the `pnpm add -D lefthook` inside init succeed.
- `git init` must precede `ultracite init`: the lefthook integration adds a `prepare: lefthook install` script and runs it immediately; `lefthook install` writes into `.git/hooks` and fails without a repo.
- `ultracite init` runs `pnpm install` itself (from `--pm pnpm`), then writes `oxlint.config.ts`, `oxfmt.config.ts`, `lefthook.yml`, and updates `package.json` (adds `check`, `fix`, `prepare: lefthook install` scripts and the `oxlint`/`oxfmt`/`lefthook`/`ultracite` devDeps). `--linter oxlint` is required: under `--quiet` the linter defaults to Biome instead of prompting, so the repo silently lands on the wrong toolchain.
- Keep AGENTS.md as the only shared instruction file.
- The initial commit captures the clean scaffold state, including ultracite-generated files.

## Validation Checklist

Verify every item by running the command and checking its output; do not mark done without the command's evidence.

```text
Validation:
- [ ] `pnpm run build` succeeds (produces dist/cli.js and dist/index.js, plus dist/index.d.ts)
- [ ] `head -1 dist/cli.js` prints exactly one `#!/usr/bin/env node` shebang
- [ ] `pnpm run typecheck` passes with no errors
- [ ] `pnpm run check` passes with no errors
- [ ] `pnpm run test` passes (0 test files; requires --passWithNoTests in the test script)
- [ ] `node dist/cli.js --version` prints 0.0.1
- [ ] `node dist/cli.js --help` shows the description and lists the `--output` and `--no-input` global options
- [ ] `node dist/cli.js --version | cat` prints 0.0.1 with no ANSI escape codes (color is suppressed when stdout is not a TTY)
- [ ] AGENTS.md exists without a CLAUDE.md wrapper or symlink
- [ ] `grep 'run:' lefthook.yml | grep -vc '{staged_files}'` returns 0: every hook command in the generated `lefthook.yml` is scoped to the staged files, so a commit never rewrites files it did not stage
- [ ] a JSON-only commit passes the hook: `pnpm exec lefthook run pre-commit --file package.json` exits 0 (this is the changesets-bot release path; `touch` plus `git add` stages nothing on an unchanged file, so the hook would skip and prove nothing)
- [ ] `pnpm-lock.yaml` exists and `package-lock.json` does not (a stray npm lockfile makes `changeset publish` and the CI cache pick the wrong tool)
- [ ] `.github/workflows/ci.yml` and `.github/workflows/npm-publish.yml` exist
- [ ] `skills/{{bin}}/SKILL.md` has frontmatter with name and description
- [ ] `grep -rn '{{[a-z]' --exclude-dir=node_modules --exclude-dir=.git .` returns nothing (no leftover template placeholders; the pattern skips the `${{ secrets... }}` syntax in workflows)
```

## Troubleshooting

- `ultracite init` fails or hangs: re-run without `--quiet` to see the blocking prompt, answer interactively, then continue.
- Claude Code requires its built-in agents-md mod enabled with an AGENTS.md-loading mode; use the agents-md skill if instructions do not load.
- `pnpm install` fails with `ERR_PNPM_UNSUPPORTED_ENGINE`: verify Node >= 24.11 with `node --version`; the engines field rejects older versions.
- `ultracite init` dies at `pnpm add -D lefthook` with `ERR_PNPM_IGNORED_BUILDS`, or `pnpm install` fails the same way, and `lefthook.yml` is missing: `pnpm-workspace.yaml` is absent or lacks the `lefthook: false` entry under `allowBuilds`. Write it from `references/scaffold-configs.md` and re-run the `ultracite init` command. For any other package the error names, add its own `allowBuilds` entry (`true` only when it needs its build script); do not allow all builds.
- `pnpm install` prints a peer warning for `typescript` against `tsdown`: expected and harmless. `tsdown@0.22.x` still lists its optional `typescript` peer as `^5 || ^6`, but its `.d.ts` engine (`rolldown-plugin-dts`) supports `^7`, so `dist/index.d.ts` still generates. Do not downgrade TypeScript.
- `pnpm run build` fails with unresolved imports: every relative import needs a `.js` extension (NodeNext requires them even for `.ts` sources).
- `pnpm run test` exits 1 with "No test files found": the test script is missing `--passWithNoTests`.
- `git commit` blocked by a hook, with real lint errors in the output: lefthook is active from `ultracite init`; run `pnpm run fix` and retry rather than bypassing with `--no-verify`.
