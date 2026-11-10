# Repository structure

Product: Tallyboard. Team: 3 engineers. One production deploy.

## Layout

```text
apps/
  api/                 Express API, deployed as one container
    src/
      modules/
        accounts/      signup, login, profile
        billing/       plans, invoices
        reports/       scheduled report exports
      jobs/
        worker.ts      polls the jobs table every 5 seconds
        registry.ts    maps job type to its function
      middleware/      auth, request context, error mapping
  web/                 Next.js app
packages/
  db/                  schema and migrations (Postgres)
  mailer/              wrapper around our email provider; send({ to, template, data })
  shared/              types shared by api and web
```

## Background jobs

There is one `jobs` table in Postgres: `id, type, payload, status, attempts, run_after, last_error`.

- A module enqueues by inserting a row. Inserting inside the same transaction as the business write is the normal pattern.
- `worker.ts` claims due rows, runs the function registered for the type, and on failure retries with backoff up to 5 attempts, then marks the row `failed`.
- Current job types: `report.export`, `invoice.send`.
- Queue depth and oldest job age are on the ops dashboard.

## Email today

`invoice.send` is the only email we send. It runs as a job and calls `mailer.send`. Templates live in `packages/mailer/templates/`.

## Signup today

`modules/accounts/signup.ts` validates the body, inserts the account row in a transaction, and returns 201. It sends nothing.

## Deploy

`apps/api` and `apps/web` each deploy from `main`. The worker runs in the same container as the API.
