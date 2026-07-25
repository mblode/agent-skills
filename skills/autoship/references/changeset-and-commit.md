# Changeset Creation and Commit

Mechanics for Steps 1-3. The decisions (bump type, gate order, what to stage) are in SKILL.md; this file is how to execute them non-interactively.

## Writing the changeset file

`npm run changeset` needs a TTY, so write the file directly:

```bash
cat > .changeset/<short-id>.md << 'EOF'
---
"<package-name>": patch
---

<description of changes>
EOF
```

Generate the short id: `node -e "console.log(Math.random().toString(36).slice(2,10))"`.

The description is 1-2 sentences of user-facing change, not a commit-log dump. It ships verbatim in `CHANGELOG.md` and is the only thing consumers read about this version.

## Per-gate commands

Discover what exists before running anything; do not assume script names:

```bash
cat package.json | jq '.scripts | keys[]' -r
```

| Gate | Run | Auto-fixer |
|------|-----|------------|
| Lint | `npm run lint` | `npm run lint -- --fix`, or `npx eslint --fix <changed-paths>` |
| Type-check | `npm run typecheck`, or `npx tsc --noEmit` | none; fix by hand |
| Test | `npm test` | none; fix the code, never skip or delete a test to get green |
| Format | `npm run format`, or `npx prettier --write <changed-paths>` | is the fixer |

## Re-running after a fix

Re-run every gate from the start after any code change, not just the one that failed: a type fix routinely breaks lint, and a lint autofix can break a test. Report the remaining error count each pass so the user sees the trend rather than a silent grind.
