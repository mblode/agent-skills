---
title: Agent starts blind to resources, prior sessions, or page state
slug: context-starvation
category: context
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-tool-execution, agent-config
agent-native-principle: Improvement Over Time
detection: hybrid
related: context-no-checkpoint-resume, context-memory-not-visible, comm-no-generative-momentum
---

## Agent starts blind to resources, prior sessions, or page state

The system prompt says "You are a helpful assistant" with no dynamic context, so the agent asks "What files do you have?" or "Which project?" instead of using what the app already holds. Three gaps share one fix and one finding: the prompt names no resources, capabilities, or recent activity; a session starts without the preferences and prior work from earlier sessions; or the app state on screen (current project, selection, recent actions) never reaches the prompt. Violates Improvement Over Time: agents should accumulate context, not start blind.

## What goes wrong

User opens a project page and asks "help me write a status update." The agent replies "What project are you working on?" The project name, recent commits, open tickets, and the user's preference for short updates from yesterday's session are all in app state, and the prompt carries none of them. Every needless question erodes confidence.

## Detection

**Surfaces:** agent-chat, agent-tool-execution, agent-config

**Static signals:**
1. Find system prompt assembly and session initialization: string templates, prompt builders, message arrays, agent constructors, chat init.
2. Check whether the prompt injects (a) available resources, (b) capabilities, (c) recent activity, and whether session start loads cross-session state (context files, preferences, prior work).
3. Catalog the context sources the surface already holds (user, project, selection, recent activity) and check each high-signal one reaches the prompt.
4. Flag a prompt missing any of the three sections, a session built only from static content, or a high-signal source never passed to the agent.

**Concrete commands:**
```bash
rg 'role:\s*["\x27]system["\x27]' --type=ts -A 10 src/ | rg -v '\$\{|concat|join|append'
rg '(new Agent|createAgent|initSession|startChat)' --type=ts -A 15 src/
rg '(availableResources|recentActivity|capabilities|context\.md|loadContext|getContext|sessionContext)' --type=ts src/
rg '(useUser|useProject|useTeam|useActivity|currentProject|activeWorkspace)' --type=ts -l src/
rg -A 15 '(buildPrompt|systemPrompt|assembleContext|getAgentContext)' --type=ts src/
```

**Judgment signals:**
- Would a human assistant in this position already know the answer? High-signal gaps (project name, recent activity) fail; low-signal ones do not.
- Too much also fails: a prompt that injects every tool and every procedure on every run should carry what this task needs, not the whole product. A small agent with a short resident toolset is not this.
- One static prompt can show all three gaps. File one finding and name each gap in its evidence.

**False-positive guards:**
- Skip files with `// ax-audit-ignore:context-starvation`.
- Skip test files, Storybook fixtures, and generic agent surfaces with no page-specific context.
- Skip prompts and constructors that delegate context loading to a parent orchestrator or a separate init step.
- Just-in-time retrieval counts. A prompt that names what exists and hands the agent a `read_context` or `list_*` tool to fetch the rest passes the resources section; the fail is data that is neither present nor discoverable.

## Fix

Inject the context.md sections at session start ("What I Know About This User", "What Exists", "Recent Activity"), scoped to this run, and update them as the session changes state.

```tsx
// before
const messages = [{ role: "system", content: "You are a helpful assistant." }, ...userMessages];

// after: available data, capabilities, recent context, prior-session preferences
const ctx = await loadProjectContext(session.userId);
const prefs = await getUserPreferences(session.userId);
const messages = [
  { role: "system", content: `You are an assistant.\n\n## Available Data\n${ctx.resources}\n\n## Capabilities\n${ctx.capabilities}\n\n## Recent Context\n${ctx.recent}\n\n${prefs.summary}` },
  ...userMessages,
];
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent chat | release-blocker when sessions load no cross-session or page context at all; fix-this-sprint otherwise |
| Agent tool execution | fix-this-sprint |
| Agent config | fix-this-sprint |

No tool-execution bump: a starved agent asks redundant questions but does nothing unsafe. The chat row blocks only the session that forgets everything, because the user re-enters prior work on every visit.

## Examples

**Anti-pattern (fails):**
```tsx
// User is on /projects/acme-redesign but the agent gets no project context
const { sendMessage } = useAgent({ system: "You are a helpful assistant." });
```

**Applied (passes):**
```tsx
const project = useProject();
const activity = useRecentActivity(project.id);
const { sendMessage } = useAgent({
  system: `Assistant for ${project.name}. Recent: ${activity.map((a) => a.summary).join("; ")}`,
});
```

## Suppression

```tsx
// ax-audit-ignore:context-starvation, stateless utility agent, context injected by middleware
const basePrompt = "You are a helpful assistant.";
```
