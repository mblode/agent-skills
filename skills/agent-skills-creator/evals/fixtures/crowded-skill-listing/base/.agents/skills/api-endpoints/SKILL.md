---
name: api-endpoints
description: Comprehensive guidance for building and changing HTTP API endpoints in the Mossback platform. Covers routes, handlers, controllers, request validation, response shapes, serializers, status codes, error responses, pagination, filtering, sorting, versioning, authentication middleware, rate limiting, idempotency keys, webhooks, and the OpenAPI document. Also covers how endpoints are registered, how request and response schemas are shared with the web client, and how a breaking change is introduced under a new version. Helps with adding a new endpoint, changing an existing response, debugging a 4xx or 5xx, and keeping the OpenAPI document in step with the code. Use when the user mentions an endpoint, a route, the API, a handler, a request, a response, a status code, a webhook, REST, JSON, or OpenAPI, or asks how the client talks to the server. Always follows the Mossback platform conventions, house style, and established best practices.
---

# API Endpoints

## Rules

- Routes live in `src/api/routes/<resource>.ts` and are registered in `src/api/index.ts`.
- Schemas come from `packages/contracts`. Do not define one inline.
- Errors go through `problem()` in `src/api/problem.ts`.
- Run `pnpm openapi:write` after any route change and commit `openapi.json`.
