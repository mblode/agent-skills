---
title: Tool bundles decision logic instead of being atomic
slug: granularity-workflow-shaped-tool
category: granularity
defaultTier: fix-this-sprint
surfaces: agent-tool-execution, agent-config
agent-native-principle: Granularity
detection: hybrid
related: granularity-static-api-mapping
---

## Tool bundles decision logic instead of being atomic

A tool like `analyze_and_organize(folder)` bundles judgment into code. To change what "organize" means, you refactor code instead of editing a prompt. The agent can't apply its own judgment to intermediate steps.

## What goes wrong

`analyze_and_organize_inbox` scans emails, decides importance, files them. User says "Why did you archive that?" Agent can't change the logic -- it's hardcoded. With atomic primitives, the agent decides itself.

## Detection

**Surfaces:** agent-tool-execution, agent-config

**Static signals:**
1. Grep tool definitions for compound names (`_and_`, `_then_`, `_with_`).
2. Check implementations for branching logic making domain decisions.
3. Count distinct API calls per tool -- >1 suggests bundling.

**Concrete commands:**
```bash
rg 'name:\s*["\x27]\w+_(and|then|with)_\w+' --type=ts src/tools/
rg 'name:\s*["\x27](process|handle|manage|analyze|organize|auto)_' --type=ts src/tools/
rg -l 'tool\(|defineTool' --type=ts src/tools/ | xargs rg -c 'if\s*\(|switch\s*\(' | awk -F: '$2>3'
```

**False-positive guards:**
- Skip atomic transactions (e.g., `transfer_funds`) and `// ax-audit-ignore:granularity-workflow-shaped-tool`.

## Fix

Split into atomic primitives. Let the agent decide what to move and where.

```ts
// before: analyze_and_organize_inbox: after: atomic primitives
export const listEmails = tool({ name: "list_emails", /* ... */ });
export const readEmail = tool({ name: "read_email", /* ... */ });
export const moveEmail = tool({ name: "move_email", /* ... */ });
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`: works until the user disagrees with a bundled decision.

## Examples

**Anti-pattern (fails):**
```ts
export const processNewUser = tool({
  name: "process_and_configure_new_user",
  execute: async ({ email, name }) => {
    const user = await api.post("/users", { email, name });
    await api.post(`/users/${user.id}/roles`, { role: "member" });  // can't choose role
    await api.post("/emails/send", { to: email, template: "welcome" }); // can't skip
  },
});
```

**Applied (passes):**
```ts
export const createUser = tool({ name: "create_user", /* ... */ });
export const assignRole = tool({ name: "assign_role", /* ... */ });
export const sendEmail = tool({ name: "send_email", /* ... */ });
// Agent decides: skip welcome email, assign admin role
```

## Suppression
```ts
// ax-audit-ignore:granularity-workflow-shaped-tool, atomic transaction
export const transferFunds = tool({ name: "transfer_funds", /* ... */ });
```
