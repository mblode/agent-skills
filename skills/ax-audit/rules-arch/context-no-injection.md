---
title: Agent session starts without knowing what data exists
slug: context-no-injection
category: context
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-tool-execution
agent-native-principle: Improvement Over Time
detection: code-auditable
related: context-starvation, context-no-checkpoint-resume
---

## Agent session starts without knowing what data exists

Session initializes with a static system prompt and no dynamic context. Every session starts ignorant of projects, preferences, or prior work, even when this data exists. Violates Improvement Over Time: each session should build on the last.

## What goes wrong

User opens a design review agent for the third time today. Agent has no memory of earlier sessions, the 5 files reviewed, or the user's preference for accessibility-first feedback. It asks "What would you like me to review?" again.

## Detection

**Surfaces:** agent-chat, agent-tool-execution

**Static signals:**
1. Find session initialization: agent constructors, chat init, session start handlers.
2. Check whether initialization loads dynamic context (context files, preferences, recent activity).
3. Flag sessions that use only static/hardcoded prompt content.

**Concrete commands:**
```bash
rg '(new Agent|createAgent|initSession|startChat)' --type=ts -A 15 src/
rg 'messages\s*[:=]\s*\[' --type=ts -A 5 src/ | rg 'role.*system' | rg -v 'await|fetch|load|get'
rg '(context\.md|loadContext|getContext|sessionContext)' --type=ts src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:context-no-injection`.
- Skip test files and fixtures.
- Skip constructors where context is injected by a parent orchestrator.

## Fix

```tsx
// before: static initialization
function createSession(userId: string) {
  return { messages: [{ role: "system", content: STATIC_PROMPT }] };
}

// after: read context.md at session start
async function createSession(userId: string) {
  const ctx = await readContextFile(userId);
  const prefs = await getUserPreferences(userId);
  return {
    messages: [{ role: "system", content: `${STATIC_PROMPT}\n\n${ctx}\n\n${prefs.summary}` }],
  };
}
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent chat | release-blocker |
| Agent tool execution | fix-this-sprint |
| Agent config | backlog |
| Agent dashboard | backlog |

## Examples

**Anti-pattern (fails):** `private messages = [{ role: "system", content: "You review code." }]`

**Applied (passes):** `static async create(uid) { const ctx = await loadProjectContext(uid); ... }`

## Suppression

```tsx
// ax-audit-ignore:context-no-injection, stateless utility agent, no user context needed
const agent = new StatelessAgent(STATIC_PROMPT);
```
