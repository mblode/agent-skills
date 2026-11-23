# Is Agentic: essential checks, APIs, MCP, and CLIs

Read when the report is Is Agentic / Ora, or findings mention content without JavaScript, agent-friendly 404s, JSON errors, OpenAPI, versioning, rate limits, function calling, developer-portal search, or a CLI/MCP gap.

Recommended checks apply only when scan evidence already shows an API, OAuth, GraphQL, MCP, or developer portal. If the probe found no API, do not invent one. Improve docs discovery instead.

## Contents

- Essential checks
- JSON errors
- OpenAPI error model
- Versioning and deprecation
- Rate limits
- Function calling
- Discoverability
- CLI
- MCP

## Essential checks

Essentials share 80 points, recommended checks 20, and bonus signals add up to 5, so fix essentials first. The public website always gets these six:

| Check | Passes when | Fix |
|-------|-------------|-----|
| Content is available without JavaScript | The homepage's raw HTML has an H1 and 500+ characters of text | Server-render the main content. A client-only hero with no H1 scores partial even when the page looks full in a browser |
| Not blocked from AI agents | `ChatGPT-User`, `OAI-SearchBot`, `Claude-User`, and `PerplexityBot` can fetch | `site-discovery.md` bot rules; check WAF challenges, not only `robots.txt` |
| Redirects resolve cleanly | Sampled pages have no meta-refresh stub, JavaScript-redirect stub, or cross-domain hop | Same-host HTTP 3xx |
| Content is available without signing in | Sampled pages are readable logged out | Move gated public docs out from behind auth, or serve a public twin |
| Markdown content negotiation | The canonical URL serves `text/markdown` on `Accept` with `Vary: Accept` | `docs-afdocs.md` |
| Agent-friendly 404s | An unknown path returns HTTP 404 with a markdown body that guides the agent | Keep the 404 status; give the not-found body a short markdown section linking `llms.txt`, search, and the docs index |

When the scan finds the surface, these join the essentials: OpenAPI spec published, OAuth 2.0 support, scoped permissions (named scopes on the OpenAPI security scheme), JSON error responses, and MCP resources exposed (see MCP below).

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

A server that advertises the `resources` capability must return at least one resource from `resources/list`, each readable with a valid `mimeType` and non-empty content. A tool-only server omits the capability and the check becomes N/A. A card whose transport the scanner cannot connect to fails this check outright.

List the MCP URL in `llms.txt` and, when you have an RFC 9727 catalog, in `/.well-known/api-catalog`.

A docs MCP server needs both a search tool and a fetch-by-path tool. Across Mintlify-hosted servers in 2026 the calls split 53% search to 47% path retrieval, depending on whether the agent already knows the page; a server with only one strands the other half. Return markdown from both, and make the path tool accept the same slugs `llms.txt` lists.
