---
title: System prompt missing resource injection
slug: context-starvation
category: context
defaultTier: fix-this-sprint
surfaces: agent-config
agent-native-principle: Improvement Over Time
detection: code-auditable
related: context-no-injection
---

## System prompt missing resource injection

System prompt says "You are a helpful assistant" with zero dynamic context. Agent asks "What files do you have?" instead of using them. Violates Improvement Over Time: agents should accumulate context, not start blind.

## What goes wrong

User opens a project management agent. System prompt has role instructions but nothing about 3 active projects or 12 unread notifications. First message: "What would you like to work on today?"

## Detection

**Surfaces:** agent-config

**Static signals:**
1. Find system prompt assembly: string templates, prompt builders, message arrays.
2. Check whether the prompt injects: (a) available resources, (b) capabilities, (c) recent activity.
3. Flag prompts missing any of the three.

**Concrete commands:**
```bash
rg 'role:\s*["\x27]system["\x27]' --type=ts -A 10 src/ | rg -v '\$\{|concat|join|append'
rg '(availableResources|recentActivity|capabilities|context\.md)' --type=ts src/
```

**Judgment signals:**
- Missing any of the three sections is the usual fail (too little).
- A prompt that injects every tool and every procedure on every run also fails: the run should carry what this task needs, not the whole product. A small agent with a short resident toolset is not this.

**False-positive guards:**
- Skip files with `// ax-audit-ignore:context-starvation`.
- Skip test files and fixtures.
- Skip prompts that delegate context loading to a separate init step.
- Just-in-time retrieval counts. A prompt that names what exists and hands the agent a `read_context` or `list_*` tool to fetch the rest passes the resources section; the fail is data that is neither present nor discoverable.

## Fix

```tsx
// before
const messages = [{ role: "system", content: "You are a helpful assistant." }, ...userMessages];

// after: inject Available Data, What You Can Do, Recent Context
const ctx = await loadProjectContext(session.userId);
const messages = [
  { role: "system", content: `You are an assistant.\n\n## Available Data\n${ctx.resources}\n\n## Capabilities\n${ctx.capabilities}\n\n## Recent Context\n${ctx.recent}` },
  ...userMessages,
];
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent config | fix-this-sprint |

## Examples

**Anti-pattern (fails):**
```tsx
const messages = [{ role: "system", content: "You are a helpful assistant." }];
```

**Applied (passes):**
```tsx
const ctx = await loadProjectContext(userId);
const messages = [{ role: "system", content: `You assist with code.\n\n${ctx.format()}` }];
```

## Suppression

```tsx
// ax-audit-ignore:context-starvation, bootstrapping prompt, context injected by middleware
const basePrompt = "You are a helpful assistant.";
```
