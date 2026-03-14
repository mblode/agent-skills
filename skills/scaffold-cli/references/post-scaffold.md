# Post-Scaffold Commands

Run these commands in order after all files are generated.

## Command Sequence

```bash
cd {{name}}
npm install
npx ultracite init
ln -s AGENTS.md CLAUDE.md
git init
git add .
git commit -m "Initial commit"
```

## Command Notes

- `npm install` installs all dependencies from the generated package.json
- `npx ultracite init` sets up oxlint/oxfmt config and lefthook git hooks — select "Oxlint + Oxfmt" when prompted
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

- If `ultracite init` fails, the `.oxlintrc.json` template is already correct — skip the init command
- If `ln -s` fails on Windows, copy AGENTS.md to CLAUDE.md instead
- If `npm install` fails, verify Node >= 20 with `node --version`
- If `npm run build` fails with import errors, check that all imports use `.js` extensions
