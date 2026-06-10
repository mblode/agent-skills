# Post-Scaffold Commands

Run these commands in order after all files are generated.

## Command Sequence

```bash
cd {{name}}
git init
npx ultracite@latest init --linter oxlint --integrations lefthook --pm npm --quiet
ln -s AGENTS.md CLAUDE.md
git add .
git commit -m "Initial commit"
```

## Command Notes

- `git init` must come before `ultracite init`. The lefthook integration adds a `prepare: lefthook install` script and runs the install immediately; `lefthook install` writes into `.git/hooks` and fails without a repository.
- `npx ultracite init` runs `npm install` itself, then writes `oxlint.config.ts`, `oxfmt.config.ts`, and `lefthook.yml`, and updates `package.json` (adds `check`, `fix`, and `prepare: lefthook install` scripts and the `oxlint`/`oxfmt`/`lefthook`/`ultracite` devDeps). Pass `--linter oxlint` to skip the interactive linter prompt; `--quiet` suppresses the rest.
- Create the `ln -s AGENTS.md CLAUDE.md` symlink exactly once, here. Running it a second time fails with `File exists`.
- The initial commit captures the clean scaffold state, including the ultracite-generated files.

## Validation Checklist

Verify every item by running the command and checking its output. Do not mark an item done without the command's evidence.

```text
Validation:
- [ ] `npm run build` succeeds (produces dist/cli.js and dist/index.js, plus dist/index.d.ts)
- [ ] `head -1 dist/cli.js` prints exactly one `#!/usr/bin/env node` shebang
- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run check` passes with no errors
- [ ] `npm run test` passes (0 test files; requires --passWithNoTests in the test script)
- [ ] `node dist/cli.js --version` prints 0.0.1
- [ ] `node dist/cli.js --help` shows the description
- [ ] `ls -la CLAUDE.md` shows a symlink to AGENTS.md
- [ ] `.github/workflows/ci.yml` and `.github/workflows/npm-publish.yml` exist
- [ ] `skills/{{bin}}/SKILL.md` has frontmatter with name and description
- [ ] `grep -rn '{{[a-z]' --exclude-dir=node_modules --exclude-dir=.git .` returns nothing (no leftover template placeholders; the pattern skips the `${{ secrets... }}` syntax in workflows)
```

## Troubleshooting

- `ultracite init` fails or hangs: re-run without `--quiet` to see which prompt blocked it, answer interactively, then continue the sequence.
- `ln -s` fails on Windows: copy AGENTS.md to CLAUDE.md instead (`cp AGENTS.md CLAUDE.md`).
- `npm install` fails: verify Node >= 22 with `node --version`; the engines field rejects older versions.
- `npm run build` fails with unresolved import errors: check that every relative import uses a `.js` extension (NodeNext resolution requires them even for `.ts` sources).
- `npm run test` exits 1 with "No test files found": the test script is missing `--passWithNoTests`.
- `git commit` blocked by a hook: lefthook is already active from `ultracite init`; run `npm run fix` and retry rather than bypassing with `--no-verify`.
