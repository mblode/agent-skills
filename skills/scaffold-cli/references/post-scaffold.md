# Post-Scaffold Commands

Run in order after all files are generated.

## Contents

- Command Sequence
- Replace the generated lefthook.yml
- Command Notes
- Validation Checklist
- Troubleshooting

## Command Sequence

```bash
cd {{name}}
git init
pnpm dlx ultracite@latest init --linter oxlint --integrations lefthook --pm pnpm --quiet
```

Then **overwrite the generated `lefthook.yml`** with the version below before committing:
see "Replace the generated lefthook.yml" for why.

```bash
# Use AGENTS.md directly; no compatibility symlink.
git add .
git commit -m "Initial commit"
```

## Replace the generated lefthook.yml

`ultracite init` emits a single job that runs `ultracite fix` with **no file arguments**,
so every commit formats the whole repo, silently rewriting files the commit never touched,
including in-progress work elsewhere in the tree. Overwrite it with:

```yaml
# Two jobs, not one, for two independent reasons.
#
# 1. Scope. `ultracite fix` with no file arguments formats the WHOLE repo,
#    so committing one file silently rewrites unrelated files in the working
#    tree. Passing {staged_files} keeps the fixer to what is being committed.
#
# 2. Empty sets. `ultracite fix` runs oxfmt then oxlint, and oxlint exits
#    non-zero when handed no lintable files. Globbing json/css into the same
#    job as ts/tsx would therefore fail any JSON-only commit, which is exactly
#    what the changesets bot produces for "Version Packages", breaking the
#    release workflow. So lint only what oxlint can lint, and format the rest
#    with oxfmt directly.
#
# md/mdx are absent from both globs on the same reasoning: neither tool handles
# markdown, so a docs-only commit would hit the identical empty-set failure.
pre-commit:
  parallel: true
  jobs:
    - name: ultracite
      glob: "*.{js,jsx,ts,tsx}"
      run: pnpm exec ultracite fix {staged_files}
      stage_fixed: true
    - name: oxfmt
      # oxfmt exits non-zero when every file it is given is ignored, and it
      # ignores lockfiles. pnpm-lock.yaml is YAML, so this glob never hands it
      # the lockfile; keep yaml out of the glob for that reason.
      glob: "*.{json,jsonc,css}"
      run: pnpm exec oxfmt --write {staged_files}
      stage_fixed: true
```

Do **not** fix this by only adding `{staged_files}` to the generated single job. That
narrows the scope but introduces reason 2's bug: the job's glob still matches JSON, so a
JSON-only staged set reaches oxlint empty and fails the commit. The split is what makes
both correct at once.

## Command Notes

- `git init` must precede `ultracite init`: the lefthook integration adds a `prepare: lefthook install` script and runs it immediately; `lefthook install` writes into `.git/hooks` and fails without a repo.
- `ultracite init` runs `pnpm install` itself (from `--pm pnpm`), then writes `oxlint.config.ts`, `oxfmt.config.ts`, `lefthook.yml`, and updates `package.json` (adds `check`, `fix`, `prepare: lefthook install` scripts and the `oxlint`/`oxfmt`/`lefthook`/`ultracite` devDeps). `--linter oxlint` skips the linter prompt; `--quiet` suppresses the rest.
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
- [ ] `grep -c staged_files lefthook.yml` returns 2 (the generated single-job version was replaced)
- [ ] a JSON-only commit passes the hook: `touch package.json && git add package.json && pnpm exec lefthook run pre-commit` exits 0 (this is the changesets-bot release path)
- [ ] `pnpm-lock.yaml` exists and `package-lock.json` does not (a stray npm lockfile makes `changeset publish` and the CI cache pick the wrong tool)
- [ ] `.github/workflows/ci.yml` and `.github/workflows/npm-publish.yml` exist
- [ ] `skills/{{bin}}/SKILL.md` has frontmatter with name and description
- [ ] `grep -rn '{{[a-z]' --exclude-dir=node_modules --exclude-dir=.git .` returns nothing (no leftover template placeholders; the pattern skips the `${{ secrets... }}` syntax in workflows)
```

## Troubleshooting

- `ultracite init` fails or hangs: re-run without `--quiet` to see the blocking prompt, answer interactively, then continue.
- Claude Code requires its built-in agents-md mod enabled with an AGENTS.md-loading mode; use the agents-md skill if instructions do not load.
- `pnpm install` fails with `ERR_PNPM_UNSUPPORTED_ENGINE`: verify Node >= 24.11 with `node --version`; the engines field rejects older versions.
- `pnpm install` lists ignored build scripts (for example `lefthook`): expected. pnpm skips dependency lifecycle scripts unless approved, and the project's own `prepare: lefthook install` installs the hooks, so there is nothing to approve.
- `pnpm install` prints a peer warning for `typescript` against `tsdown`: expected and harmless. `tsdown@0.22.x` still lists its optional `typescript` peer as `^5 || ^6`, but its `.d.ts` engine (`rolldown-plugin-dts`) supports `^7`, so `dist/index.d.ts` still generates. Do not downgrade TypeScript.
- `pnpm run build` fails with unresolved imports: every relative import needs a `.js` extension (NodeNext requires them even for `.ts` sources).
- `pnpm run test` exits 1 with "No test files found": the test script is missing `--passWithNoTests`.
- `git commit` blocked by a hook, with real lint errors in the output: lefthook is active from `ultracite init`; run `pnpm run fix` and retry rather than bypassing with `--no-verify`.
- `git commit` blocked by a hook reporting "No files found to lint" / "Expected at least one target file": this is the empty-set failure, not a lint error, and `pnpm run fix` cannot clear it. It means `lefthook.yml` still routes non-lintable files (JSON, CSS, or anything oxlint ignores, such as dot-directory configs) into the `ultracite fix` job. Apply the two-job `lefthook.yml` above.
