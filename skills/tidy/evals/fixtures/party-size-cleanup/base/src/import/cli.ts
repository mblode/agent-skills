import { readFileSync } from "node:fs";
import { importWaitlist } from "./waitlist-csv.ts";

const path = process.argv[2];
if (!path) {
  console.error("usage: node src/import/cli.ts <waitlist.csv>");
  process.exit(1);
}

const result = importWaitlist(readFileSync(path, "utf8"));
console.log(`created ${result.created} reservations, rejected ${result.rejected.length} rows`);
for (const row of result.rejected) {
  console.log(`  line ${row.line}: ${row.reason}`);
}
