# Saltmarsh Booking

Booking platform for coastal campsites. Guests search pitches, book, and pay; site owners manage availability and payouts.

This file is read by every coding agent that works in this repo. Keep it accurate.

## Commands

Run everything from the repo root unless a section says otherwise.

- `pnpm install`: install all workspace dependencies.
- `pnpm dev`: start the API on `:4000` and the web app on `:3000`.
- `pnpm check`: type-check and lint every package.
- `pnpm test`: run the Vitest suites in every package.
- `pnpm build`: build every package.
- `pnpm db:migrate`: apply pending migrations to the database in `DATABASE_URL`.
- `pnpm db:generate`: regenerate the typed query client after a schema change.

Update (March): `pnpm lint` was folded into `pnpm check`. Do not run `pnpm lint`, it no longer exists.
Update (June): `pnpm dev` now starts both apps. We used to run `pnpm dev:api` and `pnpm dev:web` in two terminals.
Update (Sept): `pnpm db:generate` replaced `pnpm codegen`.

## Repository layout

- `packages/api`: Fastify API, Postgres through Kysely.
- `packages/web`: Next.js App Router front end.
- `packages/shared`: types and validation schemas imported by both.
- `infra/`: Terraform for the two environments.
- `.claude/skills/`: project skills for longer procedures.

Note: we used to keep the shared types in `packages/api/src/types`. They moved to `packages/shared` and the old folder is gone.
Update (Sept): `packages/emails` was merged into `packages/api/src/emails`.

## General coding guidance

- Write clean, readable, maintainable code.
- Prefer small functions that do one thing.
- Use meaningful names for variables and functions.
- Handle errors properly and never ignore a rejected promise.
- Add comments where the code is not self-explanatory.
- Keep pull requests focused on one change.
- Think about edge cases before you start writing code.
- Follow the existing patterns in the file you are editing.
- Do not leave commented-out code behind.
- Remove unused imports and variables.

## TypeScript

- `strict` is on in every package. Do not add `// @ts-ignore`; use `// @ts-expect-error` with a reason if there is no other way.
- Never use `any`.
- Dates cross package boundaries as ISO strings in UTC. Convert to the campsite's timezone only when rendering.
- Money is integer pence in a `{ amount, currency }` object from `packages/shared/src/money.ts`. Never a float, never a bare number.
- Booking ranges are half-open: `checkIn` inclusive, `checkOut` exclusive. A one-night stay has `checkOut = checkIn + 1 day`.

Update (April): we used to allow `any` in test files. That exception was removed, use `unknown` and narrow.
Note: money used to be a bare number of pence. Every call site now uses the money object, and the old `formatPence` helper is deleted.

## Testing

- Tests run on Vitest. Test files sit next to the source as `*.test.ts`.
- Use `vi.fn()` and `vi.mock()` for doubles.
- API tests that touch the database use the `withTestDb` helper, which wraps each test in a transaction and rolls it back.
- Do not mock Kysely. Run the query against the test database.
- Web component tests use Testing Library. Query by role, not by test id.
- Run one file with `pnpm --filter <package> exec vitest run <path>`.

Update (Feb): we used to use Jest, now Vitest. Replace `jest.fn()` with `vi.fn()` wherever you still see it.
Update (Feb): `jest.config.js` files were deleted. If you find one, delete it.
Update (May): snapshot tests are no longer accepted in review. We used to snapshot every email template.
Update (July): `withTestDb` replaced the old `resetDb()` call in `beforeEach`. Do not call `resetDb()`, it truncates every table and is slow.
Update (Sept): coverage thresholds were removed from CI. Previously the build failed under 80%.
Note: the Playwright suite used to live in `packages/web/e2e`. It moved to its own repo and is not run from here.

## API package (`packages/api`)

- Routes live in `packages/api/src/routes/<resource>.ts` and export a Fastify plugin.
- Register every new route plugin in `packages/api/src/app.ts`, or it will not be mounted.
- Request and response schemas come from `packages/shared/src/schemas`. Do not define a schema inline in a route.
- Every route sets `config.auth` to `"guest"`, `"owner"`, or `"public"`. A route without it fails the boot check.
- Use `request.log`, not `console.log`.
- Database access goes through repositories in `packages/api/src/repos`. Routes never import `db` directly.
- Repositories take a `Kysely` or `Transaction` as their first argument so they can join a caller's transaction.
- Availability is checked and the booking inserted in one transaction with `SELECT ... FOR UPDATE` on the pitch row. See `packages/api/src/repos/bookings.ts`.
- Do not send email inside a transaction. Enqueue it with `enqueueEmail()` after commit.
- Webhook handlers verify the provider signature before parsing the body.
- Payment webhooks are idempotent on the provider event id, stored in `payment_events`.
- Background jobs live in `packages/api/src/jobs` and are registered in `packages/api/src/jobs/index.ts`.
- A job must be safe to run twice. The queue delivers at least once.
- Rate limits are declared per route in `config.rateLimit`. The default is 60 requests a minute.
- Error responses use `problem()` from `packages/api/src/http/problem.ts`.

Update (Jan): we used to use Express. Everything is Fastify now, do not add Express middleware.
Update (March): the API used to use Prisma. It is Kysely now. Do not add `prisma` back, and ignore any `schema.prisma` you find in old branches.
Update (June): `config.auth` replaced the old `requireAuth` preHandler. Remove `requireAuth` when you touch a route that still has it.
Update (Aug): email used to be sent inline with `sendEmail()`. Use `enqueueEmail()`.
Update (Sept): error responses used to be `{ error: string }`. They are problem details now.
Note: rate limits used to be configured globally in `app.ts`. They are per route now.

## Web package (`packages/web`)

- Pages are Server Components by default. Add `"use client"` only for state, effects, or browser APIs.
- Data fetching happens in Server Components through `packages/web/src/lib/api.ts`. Client components receive props.
- Forms use Server Actions in `actions.ts` beside the page.
- Validate action input with the same schema the API uses, from `packages/shared/src/schemas`.
- Styling is Tailwind. Do not add a CSS module or a styled component.
- Shared UI lives in `packages/web/src/components/ui`. Check there before building a new control.
- Icons come from `lucide-react`.
- The availability calendar is `packages/web/src/components/calendar/RangeCalendar.tsx`. It expects half-open ranges.
- Every page exports `metadata` or `generateMetadata`.
- Images of campsites go through `next/image` with the `campsite` loader in `next.config.ts`.
- Dates are rendered with `formatInZone()` from `packages/web/src/lib/dates.ts`, in the campsite's timezone, never the browser's.
- Feature flags are read on the server with `flag()` from `packages/web/src/lib/flags.ts`.

Update (Feb): we used to use the Pages Router. Everything is App Router now, do not add files under `pages/`.
Update (April): data fetching used to be SWR in client components. Fetch on the server now.
Update (May): we used to use `react-hook-form`. Use Server Actions and `useActionState`.
Update (July): icons used to come from `react-icons`. That package is removed.
Update (Sept): flags used to be read in the browser with `useFlag()`. That hook is deleted.
Note: `moment` used to be imported in the calendar. It is gone, use the helpers in `dates.ts`.

## Database migrations

Schema changes go through numbered SQL migrations in `packages/api/migrations`.

1. Create the next file with `pnpm --filter @saltmarsh/api exec node scripts/new-migration.mjs <name>`.
2. Write the forward migration only. We do not write down migrations.
3. Never edit a migration that has been merged. Add a new one.
4. Adding a column to `bookings` or `pitches` must be nullable or have a default, because those tables are too big to rewrite during a deploy.
5. Add an index with `CREATE INDEX CONCURRENTLY` in its own migration file, with `-- no-transaction` on the first line.
6. Dropping a column takes two releases: stop reading and writing it in release one, drop it in release two.
7. Run `pnpm db:migrate` locally, then `pnpm db:generate` to refresh the typed client.
8. Commit the migration and the regenerated `packages/api/src/db/types.ts` together.

Update (March): we used to write down migrations. Stop, they were never run and several were wrong.
Update (June): we used to generate migrations with Prisma Migrate. They are hand-written SQL now.
Update (Sept): the `-- no-transaction` marker used to be `-- disable-ddl-transaction`. The runner only reads the new one.

## Shared package (`packages/shared`)

- Schemas are Zod. Export the schema and its inferred type from the same file.
- A schema change is a contract change for both apps. Make the API accept the old and new shape for one release.
- No runtime dependency other than `zod` goes into this package. It is bundled into the browser.
- Enumerations are string literal unions, not TypeScript `enum`.
- Pitch types are `tent`, `caravan`, `motorhome`, and `glamping`. The list lives in `packages/shared/src/pitch.ts` only.

Update (March): we used to use Yup for schemas. Everything is Zod now.
Note: `packages/shared` used to re-export `date-fns`. Import it directly in the package that needs it.

## Search and availability

- Search results come from the `pitch_availability` materialized view, refreshed by the `refresh-availability` job every five minutes.
- A booking write also updates the affected rows of the view inside the same transaction, so a just-booked pitch disappears at once.
- Never compute availability from `bookings` in a route. Use `availabilityRepo.forRange()`.
- Search is by bounding box. Distances are metres, coordinates are WGS84 in `(longitude, latitude)` order to match PostGIS.
- Results are capped at 200 pitches per request. Paginate with the `after` cursor, not an offset.
- A pitch closed by its owner stays in the view with `closed = true` so owners can see it in their dashboard. Guest search filters it out.

Update (May): search used to hit Elasticsearch. The cluster is shut down and the client package is removed.
Update (Aug): coordinates used to be `(latitude, longitude)`. They were swapped to match PostGIS, check any old helper before reusing it.

## Payments and payouts

- Card payments go through the provider client in `packages/api/src/payments/client.ts`. Do not call the provider SDK anywhere else.
- A booking is `pending` until the `payment.succeeded` webhook arrives. Never mark it `confirmed` from the browser redirect.
- The platform fee is 8% of the booking total, rounded half up to a whole penny, computed in `packages/api/src/domain/fees.ts`.
- Payouts to owners run on the `payouts` job at 02:00 UTC for stays that checked out at least three days earlier.
- A payout row is written before the transfer is requested and marked `sent` after. A crash between the two is recovered by the job on its next run.
- Amounts sent to the provider are integer minor units. The client rejects a non-integer.
- Never log a full card fingerprint, a payment method id, or a bank account number. Log the internal `payment_id`.

Update (Feb): the fee used to be 10%. It is 8% for bookings created after the pricing change, and old bookings keep the fee stored on the row.
Update (June): payouts used to run weekly on Mondays. They are daily now.

## Emails

- Templates are React Email components in `packages/api/src/emails/templates`.
- Every template has a plain-text version exported beside it.
- Guest-facing dates in an email use the campsite's timezone and name it, for example "Friday 14 June, 3pm (Europe/Paris)".
- Emails are sent through `enqueueEmail()` only. The job retries three times, then writes to `email_failures`.
- Marketing email is not sent from this repo. If a change needs a guest's marketing consent, stop and ask.

Update (Aug): templates used to be MJML files compiled at build time. They are React Email now.

## Accessibility and copy

- Every interactive control has an accessible name. Icon-only buttons take `aria-label`.
- The booking flow must be usable with a keyboard alone. The calendar supports arrow keys, Page Up, and Page Down.
- Colour contrast meets WCAG AA. Use the tokens in `packages/web/tailwind.config.ts`, not ad hoc hex values.
- UI copy is British English: "cancelled", "colour", "pitch" (not "site" or "spot").
- Error messages say what happened and what to do next. They never show a raw error code to a guest.
- Prices are shown with the currency symbol and two decimal places, including for whole pounds.

## Logging and metrics

- Log through the request logger with structured fields. The first argument is an object, the second the message.
- Do not log guest email addresses or phone numbers. Log `guest_id`.
- Every job logs `job`, `run_id`, and `duration_ms` when it finishes.
- A new background job gets a row in the jobs dashboard config at `infra/dashboards/jobs.json`.
- Counters and timers go through `metrics` from `packages/api/src/observability/metrics.ts`. Names are snake case with the unit as a suffix.

Update (April): logging used to be Winston. It is the Fastify logger (Pino) now.
Update (July): metrics used to be sent to StatsD. They are OpenTelemetry now, and the `statsd` helper is deleted.

## Deploys

- `main` deploys to staging automatically.
- Production deploys are started by a person from the deploy dashboard. Agents do not deploy to production.
- Do not change anything under `infra/` without being asked. A wrong Terraform apply takes the booking API down.
- Migrations run before the new API version starts, so a migration must work with the previous version of the code.
- Environment variables are declared in `packages/api/src/env.ts` and `packages/web/src/env.ts`. Add a new one there and in `infra/variables.tf`.

Update (April): staging used to deploy from the `develop` branch. That branch is deleted, do not target it.
Update (Aug): we used to deploy from a laptop with `pnpm deploy:prod`. That script is removed.
Note: the old container pipeline is gone. Ignore any `Procfile` you find.

## Git and pull requests

- Branch from `main`. Name branches `<ticket>-<short-description>`, for example `SMB-812-refund-window`.
- Commit messages are imperative and sentence case.
- One logical change per pull request.
- A pull request that changes a schema in `packages/shared` names the API and web changes that go with it.
- Do not force-push a branch someone else has reviewed.

Update (May): we used to squash locally before pushing. Do not, the merge queue squashes.
Update (Sept): pull request titles used to need a `[api]` or `[web]` prefix. The labeler does that now.

## Refunds and cancellations

- A guest can cancel for a full refund up to 48 hours before `checkIn`, measured in the campsite's timezone.
- Inside 48 hours the refund is the booking total minus the first night.
- Owner-initiated cancellations always refund in full and are never charged the platform fee.
- Refund amounts are computed in `packages/api/src/domain/refunds.ts` only. Do not recompute one in a route or in the web app.

Update (July): the refund window used to be 72 hours. It is 48 now. Some old comments in the code still say 72.

## Things that have gone wrong before

- A booking was double-sold because availability was checked outside the insert transaction. Keep the check and the insert together.
- A webhook was processed twice and refunded a guest twice. Keep the `payment_events` idempotency check first in the handler.
- Dates rendered in the browser's timezone showed UK guests the wrong check-in day for a French campsite. Always render in the campsite's timezone.
- An index was created inside a transaction and locked `bookings` for four minutes. Use `CONCURRENTLY` with the no-transaction marker.

## Local environment

- Node 22 and pnpm 10. The versions are pinned in `package.json` and `.nvmrc`.
- Postgres 16 with PostGIS runs from `docker compose up db`. The API will not boot without it.
- Copy `.env.example` to `.env` in `packages/api` and `packages/web`. Never commit a `.env` file.
- Seed data comes from `pnpm --filter @saltmarsh/api exec node scripts/seed.mjs`. It creates three campsites and forty pitches.
- The payment provider runs in its test mode locally. Webhooks reach your machine through the provider CLI, not a tunnel.
- If the typed client is out of date you will see errors in `packages/api/src/db/types.ts`. Run `pnpm db:generate`.
- Port 4000 or 3000 already in use means an old dev server is still running. Stop it, do not change the port.
- The web app reads the API URL from `API_URL`. Locally that is `http://localhost:4000`.
- Run `pnpm install` again after switching branches, because the lockfile changes often.

## Before you finish

- Run `pnpm check` and the tests for the package you changed.
- If you changed a schema in `packages/shared`, run both packages' tests.
- If you added a migration, confirm `packages/api/src/db/types.ts` is regenerated and committed.
- Update this file if you changed a command or a convention.
