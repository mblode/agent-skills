import { execFileSync } from "node:child_process";

const target = process.env.DEPLOY_TARGET ?? "staging";
const allowed = new Set(["staging", "production"]);

if (!allowed.has(target)) {
  console.error(`unknown DEPLOY_TARGET: ${target}`);
  process.exit(1);
}

const revision = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
const archive = `harbor-notes-${revision}.tgz`;

execFileSync("tar", ["-czf", archive, "src", "db", "package.json"], { stdio: "inherit" });
execFileSync("scp", [archive, `deploy@notes-${target}.internal:/srv/harbor-notes/releases/`], { stdio: "inherit" });
execFileSync("ssh", [`deploy@notes-${target}.internal`, "/srv/harbor-notes/bin/activate", archive], { stdio: "inherit" });

console.log(`published ${revision} to ${target}`);
