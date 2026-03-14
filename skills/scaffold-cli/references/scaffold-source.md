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

After writing AGENTS.md, create a symlink: `ln -s AGENTS.md CLAUDE.md`

```markdown
# {{name}}

{{description}}

## Commands

\`\`\`bash
npm install              # setup (requires Node >= 22)
npm run build            # tsdown → dist/
npm run dev              # tsdown --watch
npm run test             # vitest run
npm run typecheck        # tsc --noEmit
npm exec -- ultracite fix   # format + lint autofix
npm exec -- ultracite check # lint check (CI)
\`\`\`

## Architecture

\`\`\`
src/
  cli.ts              # Commander entry point
  index.ts            # Public API exports
  types.ts            # Shared type definitions
\`\`\`

## Gotchas

- **ESM only**: This project uses `"type": "module"`. Use `.js` extensions in imports (e.g., `import { foo } from "./foo.js"`).
- **Dual build**: `tsdown.config.ts` produces two entry points — `cli.js` (with shebang) and `index.js` (with .d.ts). Do not merge them.
- **Linting via ultracite**: Run `npm exec -- ultracite fix` instead of calling oxlint or oxfmt directly.
- **Git hooks via ultracite**: Ultracite sets up lefthook for pre-commit hooks. Run `npx ultracite init` after cloning to wire them into git.
- **No chalk/ora**: Use `import { styleText } from "node:util"` for colors (stable in Node 22.13+) and `@clack/prompts` spinner for progress indicators.
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

Create at `skills/{{bin}}/SKILL.md`:

```yaml
---
name: {{bin}}
description: {{description}}. Use when the user wants to use {{bin}}, run {{bin}} commands, or asks about {{name}} features.
---
```

```markdown
# {{name}}

{{description}}

## Commands

| Command | What it does |
|---------|-------------|
| `{{bin}} --help` | Show available commands and options |
| `{{bin}} --version` | Show version number |
```
