# Site discovery (Is It Agent Ready)

Read when the report is from [isitagentready.com](https://isitagentready.com/) or findings name robots, sitemap, Link headers, DNS-AID, Content Signals, API catalog, Auth.md, skills index, or commerce protocols.

These checks advertise **existing** surfaces. A well-known JSON file that describes a server you do not run is worse than omitting the file.

## Contents

- Always worth doing
- Only when the product has the surface
- Leave unless asked

## Always worth doing

Valid `/robots.txt` as `text/plain` with `User-agent` groups and a `Sitemap:` line pointing at a working `/sitemap.xml` (or the sitemap the app already emits).

Named AI-bot groups in addition to `*`, matching the owner's training vs retrieval policy. Do not copy a full allow-list from training data; `seo` owns which bots mean search vs training (`answer-engines.md` on that skill). Carry forward existing private-path disallows.

Homepage (and docs HTML) `Link` headers for what you actually publish, for example:

```http
Link: </.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc"; type="application/openapi+json", </llms.txt>; rel="describedby", </docs>; rel="alternate"; type="text/markdown"
```

Only include relations whose targets return 200 with the advertised type.

`Auth.md` (or `/docs` auth page listed from `llms.txt`) when the product has credentials. One page: how to get a key, the header name, and a failed-auth example that matches the JSON error model.

## Only when the product has the surface

| Check | Publish when | Where |
|-------|--------------|--------|
| RFC 9727 API catalog | A public HTTP API exists | `/.well-known/api-catalog` as `application/linkset+json` pointing at the OpenAPI URL |
| OAuth / OIDC discovery | You are an authorization server | `/.well-known/oauth-authorization-server` or `openid-configuration` |
| RFC 9728 protected resource | The API or MCP requires a bearer token | `/.well-known/oauth-protected-resource` |
| MCP server card | A live MCP endpoint exists | Well-known card for the transport you actually serve |
| Agent skills index | You publish installable skills | `/.well-known/agent-skills/index.json` with URL plus SHA-256 of each `SKILL.md` |
| A2A agent card | You speak A2A | `/.well-known/agent-card.json` |
| WebMCP | The page really calls `navigator.modelContext` | Do not stub the call |
| Content Signals | You have an explicit train/search policy | `Content-Signal:` in robots.txt (`ai-train`, `search`, `ai-input`) |
| Web Bot Auth | You verify HTTP message signatures | `/.well-known/http-message-signatures-directory` |
| DNS-AID | You can add DNS HTTPS/SVCB records | `_index._agents` (and `_mcp._agents` if MCP is live), DNSSEC if available |

DNS-AID and DNSSEC need registrar or DNS-provider access. Implement HTTP discovery first, then record DNS as a remaining recommendation.

## Leave unless asked

x402, UCP, ACP, MPP, and other commerce protocols. Adding them on a docs site that does not charge agents is advertising a payment flow that does not exist.

`llms-full.txt` is optional. Prefer a small `llms.txt` plus markdown twins over a dump that exceeds 50k characters.

Site-type hint for Is Agentic reports (does not change the score):

```html
<meta name="is-agentic-site-type" content="content">
```

Values: `content` (docs), `business`, `app`, `store`. One tag, one value.
