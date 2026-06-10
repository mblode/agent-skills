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

50 tools for 50 API endpoints. Adding a new endpoint requires a code change and redeployment. Agent can only access what was anticipated at build time. For evolving APIs, a discover-and-access pattern keeps agent capabilities in sync automatically.

## What goes wrong

CMS has 30 content types, 90 tools total. Content editor adds "Press Release" in the CMS admin. Agent can't access it -- no `read_press_release` tool exists yet.

## Detection

**Surfaces:** agent-tool-execution

**Static signals:**
1. Count tool definitions. High counts (>20) with repetitive patterns suggest static mapping.
2. Check whether the data source supports dynamic type discovery.

**Concrete commands:**
```bash
rg 'name:\s*["\x27]' --type=ts src/tools/ -c | awk -F: '{sum+=$2} END {print "Total tools:", sum}'
rg 'name:\s*["\x27](read|get|list|create|update|delete)_' --type=ts -o --no-filename src/tools/ | awk -F'_' '{print $1}' | sort | uniq -c | sort -rn
```

**False-positive guards:**
- Skip small stable APIs (<10 types), tools with genuinely different params, and `// ax-audit-ignore:granularity-static-api-mapping`.

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
