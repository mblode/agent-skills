#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";
import { upload } from "./upload.js";

const USAGE = `Usage: harbor deploy [--branch <name>] [--dir <path>]

Commands:
  deploy    Build the site and publish a preview URL for the branch

Options:
  --branch  Deploy a specific branch instead of the current one
  --dir     Folder to upload (default: dist)
  --help    Show this message`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    branch: { type: "string" },
    dir: { type: "string", default: "dist" },
    help: { type: "boolean", default: false },
  },
});

if (values.help || positionals[0] !== "deploy") {
  console.log(USAGE);
  process.exit(values.help ? 0 : 1);
}

if (!process.env.HARBOR_TOKEN) {
  console.error("HARBOR_TOKEN is not set. Create one with your team admin and export it.");
  process.exit(1);
}

const branch =
  values.branch ?? execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf8" }).trim();

const url = await upload({ dir: values.dir, branch, token: process.env.HARBOR_TOKEN });
console.log(url);
