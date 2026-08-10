---
title: Tool schema lets the model express an invalid action
slug: granularity-permissive-tool-schema
category: granularity
defaultTier: fix-this-sprint
surfaces: agent-tool-execution, agent-config
agent-native-principle: Granularity (constraints in the schema)
detection: code-auditable
related: granularity-workflow-shaped-tool, granularity-raw-primitive-escape, comm-no-approval-gate, context-unscoped-tool-surface
---

## Tool schema lets the model express an invalid action

A parameter takes a free-form string where the domain has a closed set, or the constraint that makes a call safe lives in the description rather than the type. The model can then name a target that should not be reachable, and the call is well-formed, so nothing rejects it. A schema is the one place a rule is enforced before the model gets a chance to be creative; prose next to it is a suggestion.

The sharpest version is a parameter the server ignores when it does not recognise it. A wrong value then produces no error, a plausible-looking result, and an answer built on a filter that never applied.

## What goes wrong

A calendar tool takes `calendarId: string` with a description saying new events belong on the personal calendar. It works for a year. Then a work-sounding request arrives, the model reads the subject rather than the rule, and the event lands on a calendar shared with someone else. The same tool with `z.enum([PERSONAL, LEGACY])` makes that outcome unrepresentable, and the diff is one line.

## Detection

**Surfaces:** agent-tool-execution, agent-config

**Static signals:**
1. List every tool's input schema and record each parameter's type.
2. Flag string parameters that name a target from a closed set: ids, repos, calendars, environments, channels, roles, modes, tables.
3. Read the tool description for constraints stated in prose, and check whether the schema restates them. A constraint that appears only in prose is the finding.
4. Check optional parameters that gate a destructive branch, and unbounded numbers on anything paginated or charged.
5. Fail when a constraint the code depends on is unrepresented in the schema. Record the tool, the parameter, and the prose that carries the rule today.

**Concrete commands:**
```bash
rg -n 'z\.string\(\)' --type=ts -B 3 src/tools/ | rg -i '(id|repo|calendar|env|channel|role|mode|table|target)'
rg -n '(z\.enum|z\.literal|z\.union|z\.discriminatedUnion)' --type=ts src/tools/
rg -n 'describe\(' --type=ts src/tools/ | rg -i '(never|only|must|do not|always|defaults to)'
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:granularity-permissive-tool-schema`.
- Skip genuinely open sets: free text, search queries, file contents, commit messages, user-authored prose.
- Skip identifiers minted elsewhere and passed straight back, where an enum would go stale on every new record.
- Skip a string already narrowed at the boundary by a runtime allowlist that refuses with a named reason; note it as a weaker but valid form.
- Skip test fixtures and generated clients.

## Fix

Move the constraint from the description into the type, and refuse rather than default when a value cannot be resolved.

```ts
// before: the rule is prose, so the model can decline to follow it
repo: z.string().default(VAULT_REPO).describe("owner/name; defaults to the vault repo")

// after: the rule is the type
repo: z.enum([VAULT_REPO, AGENT_REPO]).default(VAULT_REPO)
```

Where the set is known only at runtime, validate at the boundary and return a refusal naming the allowed values, so a wrong guess surfaces as an error rather than a silently ignored argument.

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent config | fix-this-sprint |

Tool execution takes the bump because that is where a permissive parameter becomes a wrong write. On a config surface the same schema is edited by a human who can see the field.

## Examples

**Anti-pattern (fails):** `repo: z.string()` on a tool that commits to GitHub, with the real constraint living in a sentence of the tool description, and no runtime check on the value.

**Applied (passes):** `calendarId: z.enum([BLODE_CO, GMAIL])` on a create-event tool, so the read-only shared calendar cannot be named at all, and the tool rejects any other id before it reaches the API.

## Suppression

```ts
// ax-audit-ignore:granularity-permissive-tool-schema, ids are minted per record, an enum would go stale hourly
issueId: z.string().describe("Linear issue id")
```
