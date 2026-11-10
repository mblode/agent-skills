import { readFileSync } from "node:fs";
import { Command } from "commander";
import { mergeFeeds, since } from "./index.js";
import type { Feed } from "./types.js";

const program = new Command();

program
  .name("marten")
  .description("Merge saved feeds and list what is new")
  .version("0.0.1")
  .option("--output <format>", "output format: text or json", "text")
  .option("--no-input", "never prompt, fail when a value is missing");

program
  .command("latest <files...>")
  .description("merge feed files and list items, newest first")
  .option("--since <date>", "only items published on or after this date")
  .action((files: string[], flags: { since?: string }) => {
    const feeds = files.map((file) => JSON.parse(readFileSync(file, "utf8")) as Feed);
    const merged = mergeFeeds(feeds);
    const items = flags.since ? since(merged, flags.since) : merged;
    if (program.opts().output === "json") {
      console.log(JSON.stringify(items));
      return;
    }
    for (const item of items) {
      console.log(`${item.publishedAt.slice(0, 10)}  ${item.title}`);
    }
    console.error(`${items.length} items from ${files.length} feeds`);
  });

program.parseAsync().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (program.opts().output === "json") {
    console.error(JSON.stringify({ error: { message } }));
  } else {
    console.error(`marten: ${message}`);
  }
  process.exitCode = 1;
});
