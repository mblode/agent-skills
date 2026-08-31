---
title: What the agent can reach is never shown to the user
slug: trust-undisclosed-access-scope
category: trust
defaultTier: fix-this-sprint
surfaces: agent-config, agent-tool-execution
ax-pattern: Legitimacy
detection: code-auditable
related: context-memory-not-visible, trust-no-escalation-path
---

## What the agent can reach is never shown to the user

The agent holds tokens for the user's mail, calendar, files, and billing. Nowhere in the product can the user see that list, see which scopes each grant carries, or hand back one of them without disconnecting the whole thing. The product is asking for standing access to a person's life and answering the obvious question, what can you actually get to, with silence.

Usability failures cost a task. This costs the relationship, and it is the loudest question asked of every product in this category: what can it access, what does it keep, and what does it do when nobody is watching.

## What goes wrong

A user connects their mail so the agent can draft replies. The integration requests full mailbox read and send. Months later the user notices the agent citing a thread they thought was private, goes looking for what it can see, and finds a settings page with one switch labelled "Email: connected". The only available move is to disconnect everything and lose the feature. They disconnect, and they do not come back, because the product never gave them a smaller answer than all or nothing.

## Detection

**Surfaces:** agent-config, agent-tool-execution

**Auditability:** code-auditable

**Static signals:**
1. Enumerate the grants the product requests: scope arrays, connector definitions, integration configs, service account roles. Record the list.
2. Find the settings or connections surface that a user actually sees.
3. Cross-check: every grant in step 1 should be nameable from step 2, in the user's terms rather than the provider's scope string.
4. Check for a per-connector revoke path, not just a global disconnect.
5. Check whether retention is stated anywhere the user can find: what the agent stores from that connection, and for how long.

**Concrete commands:**
```bash
# what the product asks for
rg -n -i "scopes?\s*[:=]\s*\[|scope=|'https://www\.googleapis\.com/auth" --type=ts src/
rg -n -i 'connector|integration' --type=ts src/ -l

# what the user can see: a surface that enumerates them
rg -n -i 'connections|integrations|permissions|connected accounts' --type=ts src/app src/pages src/components

# a per-connector revoke, not one global switch
rg -n -i 'revoke|disconnect' --type=ts src/ -A 3
```

**Judgment signals:**
- A list of connected services with no scopes is a partial pass: the user knows what is attached but not what it can do. Report `warn`.
- Scope strings rendered raw (`https://www.googleapis.com/auth/gmail.modify`) are a partial pass; legible only to developers.

**False-positive guards:**
- Skip products whose agent touches only first-party data the user is already looking at. There is no external reach to disclose.
- A provider-hosted consent screen counts for the initial grant but not for ongoing visibility: the question is whether the user can check later, not whether they clicked once.
- Skip files with `// ax-audit-ignore:trust-undisclosed-access-scope` near the match.
- Skip test fixtures and seed data.
- Do not merge this with `context-memory-not-visible`. What the agent can reach and what it has kept are different disclosures; if both fail, file both, each with its own evidence.

## Fix

Render the grant list the code already holds, in the user's terms, with a revoke per row.

```tsx
// before: one switch, no scopes, all or nothing
<Toggle label="Email" checked={mail.connected} onChange={disconnectAll} />

// after: what it can reach, and a way to take one thing back
{connections.map((c) => (
  <ConnectionRow key={c.id} name={c.displayName}>
    <ScopeList scopes={c.scopes.map(describeScope)} />
    <RetentionNote keeps={c.retention} />
    <Button onClick={() => revoke(c.id)}>Revoke</Button>
  </ConnectionRow>
))}
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | fix-this-sprint |
| Agent config | fix-this-sprint |
| Agent dashboard | fix-this-sprint |

Undisclosed reach on a surface that acts autonomously is the case the user cannot discover by watching, which is why the execution surface blocks and the config surface, where the user is already looking for this, does not.

## Examples

**Anti-pattern (fails):**

```ts
// src/integrations/google.ts
export const googleScopes = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/drive.readonly",
];
// no component anywhere renders googleScopes
```

**Applied (passes):**

```tsx
// src/settings/Connections.tsx
<ConnectionRow name="Google">
  <ScopeList scopes={googleScopes.map(describeScope)} />
  {/* "Read and send mail", "Read and edit calendar events", "Read files" */}
  <Button onClick={() => revoke("google")}>Revoke</Button>
</ConnectionRow>
```

## Suppression

```tsx
{/* ax-audit-ignore:trust-undisclosed-access-scope, agent reads only the open document */}
<AgentPanel document={doc} />
```
