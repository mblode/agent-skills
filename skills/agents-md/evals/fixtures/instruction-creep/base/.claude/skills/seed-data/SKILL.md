---
name: seed-data
description: Resets and extends the local seed data for Saltmarsh Booking. Use when asked to "seed the database", "add a seed campsite", or "I need more local data".
---

# Seed Data

1. Start Postgres with `docker compose up db`.
2. Apply migrations with `pnpm db:migrate`.
3. Run `pnpm --filter @saltmarsh/api exec node scripts/seed.mjs`. It creates three campsites and forty pitches.
4. To add a campsite, extend the array in `packages/api/scripts/seed-data.json`. Coordinates are `(longitude, latitude)`.
