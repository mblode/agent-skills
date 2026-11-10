#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Command } from "commander";
import { buildDigest, renderDigest } from "./index.mjs";

//#region src/cli.ts
const program = new Command();
program.name("lumen").description("Turn a folder of changelog entries into a weekly digest").version("0.0.1").option("--output <format>", "output format: text or json", "text");
program.command("digest <folder>").requiredOption("--week <date>", "Monday of the week to digest, as YYYY-MM-DD").action((folder, flags) => {
	const digest = buildDigest(readdirSync(folder).filter((name) => name.endsWith(".json")).map((name) => JSON.parse(readFileSync(join(folder, name), "utf8"))), flags.week);
	if (program.opts().output === "json") {
		console.log(JSON.stringify(digest));
		return;
	}
	console.log(renderDigest(digest));
});
program.parseAsync().catch((error) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
});

//#endregion
export {  };
