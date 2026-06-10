# Scaffold Source Templates

## Contents

- [src/cli.ts](#srccli-ts)
- [src/index.ts](#srcindex-ts)
- [src/types.ts](#srctypes-ts)
- [AGENTS.md](#agentsmd)
- [README.md](#readmemd)
- [skills/SKILL.md](#skillsskillmd)

---

## src/cli.ts

No shebang here: tsdown's `banner` option injects it at build time, and a source shebang would double it in `dist/cli.js`.

```typescript
import { Command } from "commander";

const program = new Command();

program
  .name("{{bin}}")
  .description("{{description}}")
  .version("0.0.1");

// Register commands here
// import { registerExampleCommand } from "./commands/example.js";
// registerExampleCommand(program);

program.parse();
```

## src/index.ts

```typescript
// Public API exports
// export { example } from "./example.js";
```

## src/types.ts

```typescript
// Shared type definitions
```

## AGENTS.md

The CLAUDE.md symlink is created later by the post-scaffold command sequence, not here.

```markdown
# {{name}}

{{description}}

## Commands

\`\`\`bash
npm install        # setup (requires Node >= 22)
npm run build      # tsdown, outputs to dist/
npm run dev        # tsdown --watch
npm run test       # vitest run --passWithNoTests
npm run typecheck  # tsc --noEmit
npm run fix        # ultracite fix: format + lint autofix
npm run check      # ultracite check: lint (CI)
\`\`\`

## Architecture

\`\`\`
src/
  cli.ts              # Commander entry point
  index.ts            # Public API exports
  types.ts            # Shared type definitions
\`\`\`

## Gotchas

- **ESM only**: This project uses `"type": "module"`. Use `.js` extensions in imports (e.g., `import { foo } from "./foo.js"`); extensionless imports fail the NodeNext typecheck.
- **Dual build**: `tsdown.config.ts` produces two entry points, `cli.js` (with shebang) and `index.js` (with .d.ts). Do not merge them, and do not add a shebang to `src/cli.ts`.
- **Linting via ultracite**: Run `npm run fix` (autofix) or `npm run check` (CI lint) instead of calling oxlint or oxfmt directly.
- **Git hooks via lefthook**: The `prepare` script runs `lefthook install` on every `npm install`; no manual hook setup.
- **No chalk/ora**: Use `import { styleText } from "node:util"` for colors (stable in Node 22.13+) and the `@clack/prompts` spinner for progress indicators.
```

## README.md

```markdown
# {{name}}

{{description}}

## Installation

\`\`\`bash
npm install -g {{name}}
\`\`\`

Or use directly with npx:

\`\`\`bash
npx {{name}} --help
\`\`\`

## Usage

\`\`\`bash
{{bin}} --help
\`\`\`

## Programmatic API

\`\`\`typescript
import {} from "{{name}}";
\`\`\`

## Usage with AI Agents

Add the skill to your AI coding assistant:

\`\`\`bash
npx skills add {{repo}}
\`\`\`

This works with Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, Goose, OpenCode, and Windsurf.

## Requirements

- Node.js >= 22

## License

[MIT](LICENSE.md)
```

## skills/SKILL.md

Create at `skills/{{bin}}/SKILL.md`. The frontmatter and body go in one file:

```markdown
---
name: {{bin}}
description: {{description}}. Use when the user wants to use {{bin}}, run {{bin}} commands, or asks about {{name}} features.
---

# {{name}}

{{description}}

## Commands

| Command | What it does |
|---------|-------------|
| `{{bin}} --help` | Show available commands and options |
| `{{bin}} --version` | Show version number |
```
