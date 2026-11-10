import { chmodSync, cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
cpSync("src", "dist", { recursive: true });

const entry = "dist/cli.js";
writeFileSync(entry, `#!/usr/bin/env node\n${readFileSync(entry, "utf8")}`);
chmodSync(entry, 0o755);
console.log("built dist/");
