import { readFileSync } from "node:fs";

const rates = JSON.parse(readFileSync(new URL("../src/rates.json", import.meta.url), "utf8"));

const problems = [];
for (const [currency, rate] of Object.entries(rates)) {
  if (!/^[A-Z]{3}$/.test(currency)) problems.push(`bad currency code: ${currency}`);
  if (!Number.isInteger(rate.minorUnits)) problems.push(`${currency}: minorUnits must be an integer`);
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`rates.json ok (${Object.keys(rates).length} currencies)`);
