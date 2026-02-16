# Post-Scaffold Commands

Run these commands in order after all files are generated.

## Command Sequence

```bash
cd {{name}}
npm install
npx ultracite init
ln -s AGENTS.md CLAUDE.md
git init
prek install
git add .
git commit -m "Initial commit"
```

## Command Notes

- `npm install` installs all dependencies from the generated package.json
- `npx ultracite init` sets up biome config — select "biome" when prompted
- The symlink ensures both AGENTS.md and CLAUDE.md point to the same file
- `prek install` wires prek into git hooks so hooks run on every commit (replaces husky)
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
- [ ] `prek run --all-files` passes all hooks
- [ ] `.github/workflows/ci.yml` exists
- [ ] `.github/workflows/npm-publish.yml` exists
- [ ] `skills/{{bin}}/SKILL.md` has valid frontmatter
```

## Troubleshooting

- If `ultracite init` fails, the `biome.jsonc` template is already correct — skip the init command
- If `prek install` fails, ensure prek is installed on the system (see https://prek.dev)
- If `ln -s` fails on Windows, copy AGENTS.md to CLAUDE.md instead
- If `npm install` fails, verify Node >= 20 with `node --version`
- If `npm run build` fails with import errors, check that all imports use `.js` extensions
