---
name: db-migrations
description: Writes and applies Postgres schema migrations for Saltmarsh Booking. Use when asked to "add a column", "write a migration", "add an index", or "drop a column".
---

# Database Migrations

Schema changes go through numbered SQL migrations in `packages/api/migrations`.

1. Create the next file with `pnpm --filter @saltmarsh/api exec node scripts/new-migration.mjs <name>`.
2. Write the forward migration only. We do not write down migrations.
3. Never edit a migration that has been merged. Add a new one.
4. Adding a column to `bookings` or `pitches` must be nullable or have a default, because those tables are too big to rewrite during a deploy.
5. Add an index with `CREATE INDEX CONCURRENTLY` in its own migration file, with `-- no-transaction` on the first line.
6. Dropping a column takes two releases: stop reading and writing it in release one, drop it in release two.
7. Run `pnpm db:migrate` locally, then `pnpm db:generate` to refresh the typed client.
8. Commit the migration and the regenerated `packages/api/src/db/types.ts` together.

## Gotchas

- Migrations run before the new API version starts, so each one must work with the previous version of the code.
- A `NOT NULL` constraint on an existing column is added as `NOT VALID`, then validated in a second migration.
