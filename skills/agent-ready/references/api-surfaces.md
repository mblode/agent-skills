# APIs, OpenAPI, MCP, and CLIs (Is Agentic)

Read when the report is Is Agentic / Ora, or findings mention JSON errors, OpenAPI, versioning, rate limits, function calling, developer-portal search, or a CLI/MCP gap.

Recommended checks apply only when scan evidence already shows an API, OAuth, GraphQL, MCP, or developer portal. If the probe found no API, do not invent one. Improve docs discovery instead.

## Contents

- JSON errors
- OpenAPI error model
- Versioning and deprecation
- Rate limits
- Function calling
- Discoverability
- CLI
- MCP

## JSON errors

Agents cannot parse HTML error pages. Every API error body is JSON. Default to RFC 9457 `application/problem+json`:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{
  "type": "https://example.com/errors/invalid-parameter",
  "title": "Invalid parameter",
  "status": 400,
  "detail": "limit must be between 1 and 100",
  "code": "invalid_parameter",
  "hint": "Retry with limit=100 or omit limit to use the default."
}
```

Keep `code` stable, `detail` specific, `hint` a next action. Map 400 invalid input, 401/403 auth, 404 missing, 405 method, 429 quota, 5xx unavailable. Do not change successful response shapes.

## OpenAPI error model

Give 4xx and 5xx a typed schema (the problem document or a shared `Error` object). Reference it from operations instead of untyped `string` bodies.

Every operation needs a unique `operationId`, a description, and typed request/response schemas. Partial function-calling scores are usually untyped request bodies or missing error schemas, not missing IDs.

Document rate-limit and deprecation headers in the spec (`RateLimit`, `RateLimit-Policy`, `Retry-After`, `Deprecation`, `Sunset`).

Publish the spec at a stable URL (`/openapi.json` or `/openapi.yaml`) and list that URL in `llms.txt`.

## Versioning and deprecation

Pick one advertised strategy and implement it:

- URL path: `/api/v1/...` for breaking changes. New major = new path.
- Or a documented version header, named in the spec.

Publish how sunset works: RFC 9745 `Deprecation` / `Sunset` headers plus a docs page with the timeline. A compatibility alias is allowed if it is marked deprecated and does not silently change behavior.

## Rate limits

On probed API responses, send IETF structured fields, plus `Retry-After` on 429:

```http
RateLimit-Policy: "default";q=120;w=60
RateLimit: "default";r=50;t=30
```

Document the quota next to the API (requests per window, what `q`/`r`/`t` mean). If there is no limiter yet, adding headers that claim a policy you do not enforce is a lie; implement the limiter or document "no limit" only when that is true. Prefer implementing a real window if the report failed this check on a public API.

## Function calling

| Required | Why |
|----------|-----|
| Unique `operationId` | Tool name |
| JSON Schema for params and bodies | No `additionalProperties: true` on unconstrained objects unless the API is a bag of extensions |
| Human description per operation | The model reads this as the tool doc |

Do not add unused properties to pass a linter. Type what the handler already validates.

## Discoverability

Predictable URLs: `/docs`, `/api`, `/developers`, `/openapi.json`. Link them from the homepage and from `llms.txt`. Put the product name in `<title>` and H1 of those pages so name search can hit them.

Do not add a fake developer portal. A single docs index that links auth, endpoints, and an example request is enough for the homepage-link check.

## CLI

A sentence in `llms.txt` is not a CLI. Pass means a package on npm, PyPI, or Homebrew that can run a real command.

If the product has no CLI and nobody asked to build one, remove the llms.txt mention (or move it under Optional as a planned item) and record it as a product decision. If they asked to ship one, scaffold with `scaffold-cli` and audit with `dx-audit`; this skill only requires the published entry and a link from `llms.txt`.

## MCP

Only if an MCP server already exists or the user asked to publish one.

Advertise the live transport URL in a server card (current well-known paths scanners still probe: `/.well-known/mcp/server-card.json`, compatibility copies at `/.well-known/mcp.json` / `/mcp/server-card`). Include `serverInfo` (name, version, description) and the transports you actually serve.

Auth belongs in RFC 9728 protected-resource metadata when the endpoint returns 401, not as a fictional card field. Anonymous read-only servers skip OAuth documents.

List the MCP URL in `llms.txt` and, when you have an RFC 9727 catalog, in `/.well-known/api-catalog`.
