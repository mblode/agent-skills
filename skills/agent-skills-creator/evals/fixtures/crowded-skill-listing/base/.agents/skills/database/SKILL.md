---
name: database
description: Comprehensive guidance for all database work in the Mossback platform. Covers models, schemas, tables, columns, indexes, constraints, relations, entities, data models, model definitions, model fields, migrations, seeds, queries, joins, transactions, connection pooling, query performance, the ORM, repositories, and data access patterns in general. Also covers Postgres configuration, extensions, backups, restores, replication, and local database setup. Helps with designing a new model, changing an existing model, understanding how models relate to one another, and debugging anything that touches persisted data. Use when the user mentions a model, a schema, a table, the database, data, SQL, Postgres, the ORM, a query, a record, an entity, storage, or persistence, or asks anything about how data is structured, stored, loaded, saved, or changed anywhere in the platform. Always follows the Mossback platform conventions, house style, and established best practices.
---

# Database

## Rules

- Migrations live in `db/migrations` as numbered SQL files. Create one with `pnpm db:new <name>`.
- Never edit a merged migration. Add a new one.
- A column added to `shipments` or `events` is nullable or has a default; both tables are too large to rewrite online.
- Build an index with `CREATE INDEX CONCURRENTLY` in its own file.
- After a migration, run `pnpm db:types` and commit `src/db/types.ts` with it.
