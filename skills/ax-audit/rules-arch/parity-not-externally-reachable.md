---
title: Capabilities reachable only by the first-party UI
slug: parity-not-externally-reachable
category: parity
defaultTier: backlog
surfaces: agent-config
agent-native-principle: Connectability, the product is one form of a service that must be reachable from the layer above it
detection: code-auditable
related: parity-no-tool-parity, granularity-static-api-mapping
---

## Capabilities reachable only by the first-party UI

The product does everything it promises, and the only things that can operate it are its own screens and its own in-app agent. There is no server another agent can connect to, no manifest describing what the product can do, and no auth path a third party can walk on the user's behalf. When the user's actual starting point is an assistant that touches everything they own, a product it cannot reach is a product it routes around.

This is the distribution question rather than the safety question. `parity-no-tool-parity` asks whether *your* agent can do what your UI can do. This rule asks whether *anyone else's* can.

## What goes wrong

A user asks their assistant to cancel a subscription. The assistant reaches the billing provider, the email client, and the calendar, and stops at the one product with no connectable surface. The user opens the app and does it by hand, which is the outcome the whole layer exists to remove. Nothing in the product broke. It was simply not in the set of things reachable from where the user was standing.

## Detection

**Surfaces:** agent-config

Runs in full-sweep mode. In PR mode, run it only when the diff touches the tool, API, or auth surface: a finding that the repo has no connectable server is true on every PR and actionable on none, and repeating it turns the diff-wide section into noise.

**Static signals:**
1. Record the candidate file list first. Absence checks that skip this step return nothing whether the product passes or nothing was scanned.
2. Look for a server entry point exposing the product's tools to outside callers (a server package, a manifest at a well-known path, a registered transport).
3. Look for a machine-consumable capability description: an OpenAPI or JSON Schema document, a published tool manifest, or a typed public SDK.
4. Look for an auth path a third party can complete: an OAuth client registration, scoped tokens, or personal access tokens. Session cookies only means humans only.
5. Fail when all three are absent and the product has an in-app agent (which proves the capabilities are already tool-shaped internally).

**Concrete commands:**
```bash
# candidate file list, record this in evidence even when it is empty
find . -maxdepth 3 \( -name '*.json' -o -name '*.ts' -o -name '*.yaml' \) \
  | rg -i 'openapi|swagger|manifest|well-known|server'

# a connectable server or published transport
rg -n -i 'modelcontextprotocol|StreamableHTTPServerTransport|registerTool|\.well-known' .

# a third-party auth path, not just a browser session
rg -n -i 'oauth|client_credentials|personal.?access.?token|api.?key' --type=ts src/ | rg -v 'test|mock'
```

**False-positive guards:**
- A published SDK or documented REST API with token auth passes. The rule asks for a machine-operable path, not one specific protocol.
- Skip products with no in-app agent and no tool layer: there is nothing to expose yet, and this rule would only restate `parity-no-tool-parity`.
- Skip internal tools with a fixed, known set of callers where reach is not a goal. Say so in `observed` rather than returning a silent pass.
- Skip repos with `<!-- ax-audit-ignore:parity-not-externally-reachable -->` in the root README or config.

## Fix

**Concrete change:** expose the existing tool layer over a transport an outside caller can speak, rather than writing a second implementation for it.

```ts
// before: tools registered only into the in-app orchestrator
const tools = [listProjects, createTask, updateTask];
export const agent = new Orchestrator({ tools });

// after: the same array, also served to external callers with scoped auth
export const agent = new Orchestrator({ tools });

export const server = createServer({ name: "acme", version: "1.0.0" });
for (const t of tools) server.register(t, { scopes: t.scopes });
serve(server, { auth: oauthProvider, path: "/.well-known/acme" });
```

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Agent tool execution | backlog |
| Agent chat | backlog |
| Agent config | backlog |
| Agent dashboard | backlog |

The tier does not taper by surface because reach is a property of the product, not of the screen the audit happened to land on. It stays `backlog` on every surface deliberately: this is a strategic gap, not a user-harm gap, and a PR is never the thing that should be blocked on it. The stake is larger than the tier, and `references/invisible-interface.md` carries that argument rather than the tier column.

## Examples

**Anti-pattern (fails):**

```ts
// src/agent/tools.ts, the whole tool surface
export const tools = [listProjects, createTask, updateTask];
// nothing imports these outside src/agent/
```

Twelve capabilities exist as tools already, and the only caller is the product's own chat panel.

**Applied (passes):**

```ts
// src/agent/tools.ts
export const tools = [listProjects, createTask, updateTask];

// src/server/index.ts, same tools, scoped tokens, discoverable manifest
export const server = createServer({ name: "acme", version: "1.0.0" });
tools.forEach((t) => server.register(t, { scopes: t.scopes }));
```

## Suppression

```ts
// ax-audit-ignore:parity-not-externally-reachable, internal admin tool, fixed caller set
export const tools = [rotateKeys, purgeCache];
```
