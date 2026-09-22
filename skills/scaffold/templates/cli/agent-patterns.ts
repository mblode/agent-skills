// Copy only the pattern a command needs, adjusting command and field names.
// The base cli.ts already ships --output, --no-input, the stdout/stderr split,
// and the JSON error envelope.
import { resolve, sep } from "node:path";
import { confirm, isCancel } from "@clack/prompts";
import type { Command } from "commander";

// --- Input validation: any command taking an identifier, path, or URL segment.
function hasControlChar(value: string): boolean {
  return [...value].some((ch) => ch.charCodeAt(0) < 0x20); // bytes 0x00 to 0x1f
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

// --- Dry run: any command that mutates state.
export function registerDelete(program: Command): void {
  program
    .command("delete <id>")
    .option("--dry-run", "validate and report without executing")
    .option("--yes", "confirm without prompting")
    .action(async (id: string, flags: { dryRun?: boolean; yes?: boolean }) => {
      assertSafeId(id);
      if (flags.dryRun) {
        console.error(`would delete ${id}`); // report to stderr, no side effect
        return;
      }
      if (!(await confirmDestructive(`delete ${id}`, { ...flags, input: program.opts().input }))) return;
      // ... perform the mutation
    });
}

// --- Confirmation: destructive commands. Never hang on a prompt under a pipe.
export async function confirmDestructive(
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

// --- Schema: CLIs with more than a couple of commands.
export function registerSchema(program: Command): void {
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
}
