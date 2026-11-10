import { readdirSync } from "node:fs";

const names = readdirSync(new URL("../db/migrations/", import.meta.url)).sort();
const numbers = names.map((name) => {
  const match = /^(\d{4})_[a-z0-9_]+\.sql$/.exec(name);
  if (!match) {
    console.error(`bad migration name: ${name}`);
    process.exit(1);
  }
  return Number(match[1]);
});

numbers.forEach((number, index) => {
  if (number !== index + 1) {
    console.error(`expected migration ${String(index + 1).padStart(4, "0")}, found ${names[index]}`);
    process.exit(1);
  }
});

console.log(`${names.length} migrations in order`);
