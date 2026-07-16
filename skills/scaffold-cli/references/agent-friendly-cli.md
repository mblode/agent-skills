# Agent-Friendly CLI Patterns

Pinned patterns to copy into the scaffolded CLI when a command needs them. Copy the block verbatim, adjust only the command and field names. The base `src/cli.ts` already ships the globals these build on: `--output text|json`, `--no-input`, the stdout data / stderr log split, and the top-level JSON error envelope. Copy a pattern only when its condition holds; do not add all of them by default.

## Contents

- [Input validation helper](#input-validation-helper)
- [Dry-run pattern](#dry-run-pattern)
- [Confirmation and no-input](#confirmation-and-no-input)
- [Schema command](#schema-command)

---

## Input validation helper

Copy into `src/` when a command takes an identifier, path, or URL segment. An agent will pass plausible but wrong values, and this is the last checkpoint before they reach the filesystem or a URL.

```typescript
import { resolve, sep } from "node:path";

function hasControlChar(value: string): boolean {
  return [...value].some((ch) => ch.charCodeAt(0) < 0x20); // rejects bytes 0x00 to 0x1f
}

export function assertSafeId(value: string): string {
  if (hasControlChar(value) || /[?#%]/.test(value) || !/^[\w.-]+$/.test(value)) {
    throw new TypeError(`invalid id ${JSON.stringify(value)}: expected [A-Za-z0-9_.-]`);
  }
  return value;
}

export function containedPath(baseDir: string, userPath: string): string {
  const full = resolve(baseDir, userPath);
  if (full !== resolve(baseDir) && !full.startsWith(resolve(baseDir) + sep)) {
    throw new Error(`path ${JSON.stringify(userPath)} escapes ${baseDir}`);
  }
  return full;
}

export function urlSegment(value: string): string {
  return encodeURIComponent(value); // never splice raw input into a URL path
}
```

## Dry-run pattern

Copy into any command that mutates state. `--dry-run` validates and reports the plan without executing.

```typescript
program
  .command("delete <id>")
  .option("--dry-run", "validate and report without executing")
  .action((id: string, flags: { dryRun?: boolean }) => {
    assertSafeId(id);
    if (flags.dryRun) {
      console.error(`would delete ${id}`); // report to stderr, no side effect
      return;
    }
    // ... perform the mutation
  });
```

## Confirmation and no-input

Copy into destructive commands. Confirm in a TTY; when stdin is not a TTY, require an explicit `--yes` and fail naming the flag rather than hang on a prompt.

```typescript
import { confirm, isCancel } from "@clack/prompts";

async function confirmDestructive(
  action: string,
  flags: { yes?: boolean; input?: boolean },
): Promise<boolean> {
  if (!process.stdin.isTTY || flags.input === false) {
    if (!flags.yes) {
      console.error(`refusing to ${action} without --yes`);
      process.exitCode = 1;
      return false;
    }
    return true;
  }
  const ok = await confirm({ message: `${action}?` });
  return !isCancel(ok) && ok === true;
}
```

## Schema command

Copy when the CLI has more than a couple of commands. It prints the command tree, options, defaults, and required-ness as JSON so an agent discovers the surface without scraping `--help`.

```typescript
program
  .command("schema")
  .description("print the command surface as JSON")
  .action(() => {
    const schema = program.commands.map((cmd) => ({
      command: cmd.name(),
      description: cmd.description(),
      options: cmd.options.map((opt) => ({
        flag: opt.long,
        description: opt.description,
        default: opt.defaultValue,
        required: opt.required,
      })),
    }));
    process.stdout.write(JSON.stringify(schema));
  });
```
