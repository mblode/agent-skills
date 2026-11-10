import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Command } from "commander";
import { buildDigest, renderDigest } from "./index.js";
import type { Entry } from "./types.js";

const program = new Command();

program
  .name("lumen")
  .description("Turn a folder of changelog entries into a weekly digest")
  .version("0.0.1")
  .option("--output <format>", "output format: text or json", "text");

program
  .command("digest <folder>")
  .requiredOption("--week <date>", "Monday of the week to digest, as YYYY-MM-DD")
  .action((folder: string, flags: { week: string }) => {
    const entries: Entry[] = readdirSync(folder)
      .filter((name) => name.endsWith(".json"))
      .map((name) => JSON.parse(readFileSync(join(folder, name), "utf8")) as Entry);
    const digest = buildDigest(entries, flags.week);
    if (program.opts().output === "json") {
      console.log(JSON.stringify(digest));
      return;
    }
    console.log(renderDigest(digest));
  });

program.parseAsync().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
