# Post-Scaffold Commands

Run these commands in order after all files are generated.

## Command Sequence

```bash
cd {{name}}
npx ultracite@latest init --linter oxlint --integrations lefthook --pm npm --quiet
ln -s AGENTS.md CLAUDE.md
git init
git add .
git commit -m "Initial commit"
```

## Command Notes

- `npx ultracite init` runs `npm install` itself, then writes `oxlint.config.ts`, `oxfmt.config.ts`, `lefthook.yml`, and updates `package.json` (adds `check`/`fix`/`prepare: lefthook install` scripts and `oxlint`/`oxfmt`/`lefthook`/`ultracite` devDeps). Pass `--linter oxlint` to skip the interactive prompt; `--quiet` suppresses other prompts.
- The symlink ensures both AGENTS.md and CLAUDE.md point to the same file
- The initial commit captures the clean scaffold state

## Validation Checklist

After scaffold is complete, verify every item:

```text
Validation:
- [ ] `npm run build` succeeds (produces dist/cli.js and dist/index.js)
- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] `npm run test` runs (0 tests is expected)
- [ ] `node dist/cli.js --version` prints 0.0.1
- [ ] `node dist/cli.js --help` shows description and commands
- [ ] `ls -la CLAUDE.md` shows symlink to AGENTS.md
- [ ] `.github/workflows/ci.yml` exists
- [ ] `.github/workflows/npm-publish.yml` exists
- [ ] `skills/{{bin}}/SKILL.md` has valid frontmatter
```

## Troubleshooting

- If `ultracite init` fails, write `oxlint.config.ts` and `oxfmt.config.ts` manually (templates in `scaffold-configs.md`), then run `npm install` to pick up the deps
- If `ln -s` fails on Windows, copy AGENTS.md to CLAUDE.md instead
- If `npm install` fails, verify Node >= 20 with `node --version`
- If `npm run build` fails with import errors, check that all imports use `.js` extensions
