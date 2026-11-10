---
name: add-api-route
description: Adds a Fastify route to the Saltmarsh Booking API with its schema, auth level, repository call, and registration. Use when asked to "add an endpoint", "add a route", or "expose this over the API".
---

# Add an API Route

1. Add the request and response schemas to `packages/shared/src/schemas/<resource>.ts`.
2. Create or extend `packages/api/src/routes/<resource>.ts`. Export a Fastify plugin.
3. Set `config.auth` to `"guest"`, `"owner"`, or `"public"`, and `config.rateLimit` if 60 a minute is wrong for this route.
4. Call a repository in `packages/api/src/repos`. Add the query there if it does not exist.
5. Register the plugin in `packages/api/src/app.ts`.
6. Add a typed call for it to `packages/web/src/lib/api.ts` if the web app will use it.

## Gotchas

- An owner route checks that the campsite in the path belongs to `request.owner.id`. The auth level alone does not do that.
- Return errors with `problem()`. A thrown error becomes a 500 with no detail.
