# Post-Scaffold Commands

Run in order after all files are generated.

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

- `git init` must precede `ultracite init`: the lefthook integration adds a `prepare: lefthook install` script and runs it immediately; `lefthook install` writes into `.git/hooks` and fails without a repo.
- `npx ultracite init` runs `npm install` itself, then writes `oxlint.config.ts`, `oxfmt.config.ts`, `lefthook.yml`, and updates `package.json` (adds `check`, `fix`, `prepare: lefthook install` scripts and the `oxlint`/`oxfmt`/`lefthook`/`ultracite` devDeps). `--linter oxlint` skips the linter prompt; `--quiet` suppresses the rest.
- Create the `ln -s AGENTS.md CLAUDE.md` symlink exactly once, here; a second run fails with `File exists`.
- The initial commit captures the clean scaffold state, including ultracite-generated files.

## Validation Checklist

Verify every item by running the command and checking its output; do not mark done without the command's evidence.

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

- `ultracite init` fails or hangs: re-run without `--quiet` to see the blocking prompt, answer interactively, then continue.
- `ln -s` fails on Windows: copy instead (`cp AGENTS.md CLAUDE.md`).
- `npm install` fails: verify Node >= 24.11 with `node --version`; the engines field rejects older versions.
- `npm install` prints a peer warning for `typescript` against `tsdown`: expected and harmless. `tsdown@0.22.x` still lists its optional `typescript` peer as `^5 || ^6`, but its `.d.ts` engine (`rolldown-plugin-dts`) supports `^7`, so `dist/index.d.ts` still generates. Do not downgrade TypeScript.
- `npm run build` fails with unresolved imports: every relative import needs a `.js` extension (NodeNext requires them even for `.ts` sources).
- `npm run test` exits 1 with "No test files found": the test script is missing `--passWithNoTests`.
- `git commit` blocked by a hook: lefthook is active from `ultracite init`; run `npm run fix` and retry rather than bypassing with `--no-verify`.
