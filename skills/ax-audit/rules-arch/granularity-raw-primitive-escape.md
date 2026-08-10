---
title: Raw substrate access sits alongside the domain tools
slug: granularity-raw-primitive-escape
category: granularity
defaultTier: release-blocker
surfaces: agent-tool-execution, agent-config
agent-native-principle: Granularity (bounded action space)
detection: code-auditable
related: granularity-workflow-shaped-tool, granularity-permissive-tool-schema, comm-no-approval-gate, trust-no-refusal-path
---

## Raw substrate access sits alongside the domain tools

The agent can reach the layer underneath its own tools: arbitrary JavaScript in a page, a shell against real data, a raw SQL or GraphQL passthrough, an untyped SDK call. Every tool boundary above it becomes advisory, since anything a domain tool refuses can be done a level down. The failure is not the first request that uses it; it is the long-tail request with no obvious path to completion, where the model reaches for the substrate and improvises.

Scope: atomic primitives are the right shape for a domain tool, and `granularity-workflow-shaped-tool` fires when they are bundled away. That is a different axis from this one. `read_note` and `update_note` are atomic domain primitives with a bounded blast radius; `evaluate(js)` and `query(sql)` are substrate access whose blast radius is the whole system. Atomic-first argues for the former and says nothing in favour of the latter. Sandboxed primitives over scratch data, which is what a coding agent's `bash` operates on, are not in scope: the test is whether the reachable data is production.

## What goes wrong

A group chat agent mounts a browser extension for research. Twenty of its tools navigate and read. The twenty-first evaluates arbitrary JavaScript on any domain, because the package ships it and nothing narrowed the mount. No user story asked for it, no eval covers it, and any member of the chat can steer it. The agent behaves for months, which is the problem: the capability is only exercised the day someone asks for something the other twenty tools cannot do.

## Detection

**Surfaces:** agent-tool-execution, agent-config

**Static signals:**
1. List the registered tools and mark any whose input is code, a query, a command line, or a URL plus a script.
2. For each, trace what it reaches. Production database, live account, real filesystem, or an authenticated browser session is in scope; a disposable sandbox over scratch data is not.
3. Check for a narrowing layer: a domain allowlist, a statement-kind restriction, a network policy that is not allow-all, a read-only credential.
4. Fail when a substrate tool reaches production data with no narrowing layer. Record the tool name, the file, and what it reaches.

**Concrete commands:**
```bash
rg -n '(eval|new Function|vm\.runIn|child_process|execSync|spawnSync)' --type=ts src/tools/
rg -n '(rawQuery|\.query\(|executeSql|graphql\(|gql`)' --type=ts src/tools/
rg -n '(allowedDomains|allowlist|readOnly|permissions|networkPolicy)' --type=ts src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:granularity-raw-primitive-escape`.
- Skip sandboxed execution over scratch or fixture data with no production credential in reach.
- Skip parameterised queries against a read-only replica with a restricted role, which is a narrowing layer.
- Skip developer-only tools behind an operator flag the agent's own principal cannot set.
- Skip test files, seed scripts, and migrations.

## Fix

Remove the substrate tool, or narrow it until its worst case is describable in one sentence. When neither is possible, name the gap the tool was covering and add a domain tool for it.

```ts
// before: anything the domain tools refuse is reachable one level down
tools: [...domainTools, evaluateJs, rawSqlQuery]

// after: the gap is a named capability with its own bounded tool
tools: [...domainTools, extractTableFromPage]
```

Losing the escape hatch means some long-tail requests can no longer be served. That is the trade: `trust-no-refusal-path` covers saying so plainly instead of improvising.

## Default tier and overrides

**Defaults to:** `release-blocker`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent config | release-blocker |

The rows do not taper. A substrate tool is reachable from wherever it is registered, so exposing it through a config surface is the same defect with the same blast radius.

## Examples

**Anti-pattern (fails):** a tool registry exporting `browser__evaluate` with no `allowedDomains` set anywhere in the mount, or a `runQuery(sql: string)` tool authenticated as the application's own database role.

**Applied (passes):** the browser mount overrides the slot to drop the evaluate tool and pins a domain allowlist; database reads go through named query tools whose parameters are typed and whose role is read-only.

## Suppression

```ts
// ax-audit-ignore:granularity-raw-primitive-escape, sandbox holds fixture data only, no credential reaches it
const shell = defineTool({ name: "bash", execute: runInSandbox });
```
