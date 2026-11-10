import { readdirSync, readFileSync } from "node:fs";
import Database from "better-sqlite3";

const db = new Database(process.env.NOTES_DB ?? "notes.db");
db.exec("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)");

const applied = new Set(db.prepare("SELECT name FROM schema_migrations").all().map((row) => row.name));
const directory = new URL("../db/migrations/", import.meta.url);

for (const name of readdirSync(directory).sort()) {
  if (applied.has(name)) continue;
  const sql = readFileSync(new URL(name, directory), "utf8");
  db.transaction(() => {
    db.exec(sql);
    db.prepare("INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)").run(name, new Date().toISOString());
  })();
  console.log(`applied ${name}`);
}
