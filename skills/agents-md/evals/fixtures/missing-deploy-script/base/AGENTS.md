# Harbor Notes

Shared notes service for the dock scheduling team. Node 22, SQLite, no framework.

## Commands

- `npm run dev`: start the server with reload on `localhost:4310`.
- `npm run lint`: lint before pushing.
- `npm run check`: syntax check plus the migration order check.
- `npm run migrate`: apply pending migrations to the database named by `NOTES_DB`.
- Deploy with `scripts/deploy.sh` once `main` is green.

## Code style

- Always write descriptive variable names.
- Route handlers live in `src/routes/`, one file per resource, and are registered in `src/server.mjs`.

## Database

- Files in `db/migrations/` are append-only. Never edit a migration that has been applied; add a new numbered file.
- Migration files are named `NNNN_description.sql` and run in numeric order. `scripts/check-migrations.mjs` fails on a gap or a duplicate number.
- Notes are soft-deleted through `deleted_at`. Every query that lists notes filters on `deleted_at IS NULL`.
