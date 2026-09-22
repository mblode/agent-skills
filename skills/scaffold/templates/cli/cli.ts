// src/cli.ts. No shebang: tsdown's banner injects it, and a source shebang
// doubles it in dist/cli.js.
import { styleText } from "node:util";
import { Command } from "commander";

// stdout carries data only; stderr carries logs, progress, and human hints.
const isInteractive =
  Boolean(process.stdout.isTTY) && !process.env.NO_COLOR && !process.env.CI;

const program = new Command();

program
  .name("{{bin}}")
  .description("{{description}}")
  .version("0.0.1")
  .option("--output <format>", "output format: text or json", "text")
  .option("--no-input", "never prompt; fail if a required value is missing");

// Register commands here:
// import { registerExampleCommand } from "./commands/example.js";
// registerExampleCommand(program);

program.parseAsync().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (program.opts().output === "json") {
    process.stdout.write(
      JSON.stringify({ error: true, code: "UNEXPECTED", message, details: {} }),
    );
  } else {
    const label = isInteractive ? styleText("red", "Error:") : "Error:";
    process.stderr.write(`${label} ${message}\n`);
  }
  process.exitCode = 1;
});
