import { execFileSync } from "node:child_process";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

const lastTag = git("describe", "--tags", "--abbrev=0");
const subjects = git("log", `${lastTag}..HEAD`, "--merges", "--pretty=%b").split("\n").filter(Boolean);

for (const subject of subjects) {
  console.log(`- ${subject}`);
}
