#!/usr/bin/env node
import { Command } from "commander";
import { addBusinessDays, isBusinessDay } from "./index.js";

const program = new Command();

program
  .name("plover")
  .description("Work out business days and public holidays from the command line")
  .version("0.0.1")
  .option("--output <format>", "output format: text or json", "text")
  .option("--no-input", "never prompt, fail when a value is missing");

function emit(data: Record<string, unknown>, text: string): void {
  if (program.opts().output === "json") {
    console.log(JSON.stringify(data));
    return;
  }
  console.log(text);
}

program
  .command("check <date>")
  .description("say whether a date is a business day")
  .action((date: string) => {
    const businessDay = isBusinessDay(date);
    emit({ date, businessDay }, businessDay ? `${date} is a business day` : `${date} is not a business day`);
  });

program
  .command("add <date> <days>")
  .description("add business days to a date")
  .action((date: string, days: string) => {
    const result = addBusinessDays(date, Number(days));
    emit({ date, days: Number(days), result }, result);
  });

program.parseAsync().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (program.opts().output === "json") {
    console.error(JSON.stringify({ error: { message } }));
  } else {
    console.error(`plover: ${message}`);
  }
  process.exitCode = 1;
});
