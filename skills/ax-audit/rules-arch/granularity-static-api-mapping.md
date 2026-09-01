---
title: One tool per API endpoint instead of dynamic discovery
slug: granularity-static-api-mapping
category: granularity
defaultTier: backlog
surfaces: agent-tool-execution
agent-native-principle: Granularity
detection: observational
related: granularity-workflow-shaped-tool
---

## One tool per API endpoint instead of dynamic discovery

50 tools for 50 API endpoints. Adding an endpoint requires a code change and redeploy. The agent can only access what was anticipated at build time. For evolving APIs, a discover-and-access pattern keeps capabilities in sync automatically.

## What goes wrong

CMS has 30 content types, 90 tools total. An editor adds "Press Release" in the CMS admin. The agent can't access it: no `read_press_release` tool exists yet.

## Detection

**Surfaces:** agent-tool-execution

**Static signals:**
1. Count tool definitions. High counts (>20) with the *same* parameter shape (read_X, read_Y, read_Z over one API) suggest static mapping.
2. Check whether the data source is an evolving type system (CMS, CRM custom objects) that supports dynamic type discovery.

**Concrete commands:**
```bash
rg 'name:\s*["\x27]' --type=ts src/tools/ -c | awk -F: '{sum+=$2} END {print "Total tools:", sum}'
rg 'name:\s*["\x27](read|get|list|create|update|delete)_' --type=ts -o --no-filename src/tools/ | awk -F'_' '{print $1}' | sort | uniq -c | sort -rn
```

**Judgment signals:**
- A product agent whose tools are the product nouns (`create_issue`, `update_document`, `list_requests`) passes even above 20 tools: the params differ, and the nouns are the product.
- Fail when the tools are mechanical wrappers over one shape and a new type in the source system would need a new tool and a redeploy.
- Overlap is a `warn` even under the threshold: two wrappers a human could not choose between are a coin flip for the agent too, and bloated, ambiguous tool sets are the failure Anthropic's context-engineering guidance names first.
- An MCP client that hardcodes its tool list and ignores `notifications/tools/list_changed` is static mapping over a source that already offers discovery.

**False-positive guards:**
- Skip tools with genuinely different params, small stable APIs (<10 types), and `// ax-audit-ignore:granularity-static-api-mapping`.

## Fix

Replace static tools with discover + access.

```ts
// before: read_blog_post, read_landing_page ... 30 identical tools
// after: two tools cover the entire surface
export const listContentTypes = tool({
  name: "list_content_types",
  execute: async () => api.get("/content/types"),
});
export const readContent = tool({
  name: "read_content",
  parameters: { type: { type: "string" }, id: { type: "string" } },
  execute: async ({ type, id }) => api.get(`/content/${type}/${id}`),
});
```

## Default tier and overrides

**Defaults to:** `backlog`: scaling problem, not correctness. Works fine for small, stable APIs.

| Surface | Tier |
|---|---|
| Agent tool execution | backlog |

The row exists to block the generic tool-execution bump. Static mapping is a flexibility ceiling, not an unsafe action, so it stays `backlog` on the surface where every other rule rises a tier.

## Examples

**Anti-pattern (fails):**
```ts
export const readContact = tool({ name: "read_contact", execute: ({ id }) => api.get(`/crm/contact/${id}`) });
export const readDeal = tool({ name: "read_deal", execute: ({ id }) => api.get(`/crm/deal/${id}`) });
// ... 48 more: new custom "Partner" object added in CRM, agent can't access it
```

**Applied (passes):**
```ts
// Two tools: discover + access. New "Partner" type works immediately.
export const listObjectTypes = tool({ name: "list_crm_object_types", execute: () => api.get("/crm/objects") });
export const readObject = tool({ name: "read_crm_object", execute: ({ objectType, id }) => api.get(`/crm/${objectType}/${id}`) });
```

## Suppression

```ts
// ax-audit-ignore:granularity-static-api-mapping, stable API with <10 types
export const readUser = tool({ name: "read_user", /* ... */ });
```
