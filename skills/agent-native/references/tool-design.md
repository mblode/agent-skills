# Tool Design

<!-- TOC -->
- [Atomic Primitives](#atomic-primitives)
- [Domain Tools](#domain-tools)
- [CRUD Completeness](#crud-completeness)
- [Dynamic Capability Discovery](#dynamic-capability-discovery)
  - [MCP: The Standard Protocol](#mcp-the-standard-protocol)
- [Graduating to Code](#graduating-to-code)
<!-- /TOC -->

---

## Atomic Primitives

Start with pure primitives: bash, file operations, basic storage. Prove the architecture works before adding domain-specific tools.

```python
# Wrong — bundles judgment
Tool: analyze_and_publish(input)
# Decision logic is in code; changing behavior requires refactoring

# Right — one conceptual action
Tool: publish(content)
# Agent decided what to publish; changing behavior edits the prompt
```

**The rule:** One conceptual action per tool. Judgment about what to do or whether to do it belongs in the prompt.

Keep primitives available. Domain tools are shortcuts, not gates. Unless there's a specific reason to restrict access (security, data integrity), the agent should still be able to use underlying primitives for edge cases.

---

## Domain Tools

Add domain tools deliberately as patterns emerge from primitive usage. Use them for:

| Reason | Example | Why |
|--------|---------|-----|
| **Vocabulary anchoring** | `create_note` | Teaches the agent what "note" means in your system |
| **Guardrails** | `publish_post` | Validates before publishing (shouldn't be left to judgment) |
| **Efficiency** | `sync_library` | Common multi-step operation bundled for speed |

**Anti-pattern:** `analyze_and_organize` bundles judgment. Break into `read_file`, `move_file`, `write_file` and let the agent compose.

**Default is open.** Gating should be a conscious, documented decision.

---

## CRUD Completeness

For every entity in your system, verify the agent has full create, read, update, delete capability:

| Entity | Create | Read | Update | Delete |
|--------|--------|------|--------|--------|
| Note | `create_note` | `read_notes` | `update_note` | `delete_note` |
| Project | `create_project` | `list_projects` | `update_project` | `delete_project` |
| Task | `create_task` | `read_task` | `update_task` | `delete_task` |

**The audit:** List every entity in your system and verify all four operations are available.

**Common failure:** `create_note` and `read_notes` exist but `update_note` and `delete_note` are missing. User asks the agent to fix a typo — agent can't help.

---

## Dynamic Capability Discovery

Instead of building one tool per API endpoint, let the agent discover capabilities at runtime.

```python
# Wrong — static mapping
def read_steps(): ...
def read_heart_rate(): ...
def read_sleep(): ...
# New API metric → code change required
# Agent can only access what you anticipated

# Right — dynamic discovery
def list_available_types() -> list[str]:
    return ["steps", "heart_rate", "sleep", ...]

def read_data(type: str) -> dict:
    # reads any discovered type
    ...
# New API metric → agent discovers it automatically
```

**When to use:**
- External APIs where you want the agent to have full user-level access (HealthKit, HomeKit, GraphQL)
- Systems that add new capabilities over time
- When you want the agent to do anything the API supports

**When static mapping is fine:**
- Intentionally constrained agents with limited scope
- Simple APIs with stable, well-known endpoints
- When you need tight control over access

Pattern: one tool to discover what's available, one tool to interact with any discovered capability. Let the API validate inputs.

### MCP: The Standard Protocol

Model Context Protocol (MCP) is the open standard for tool integration in agent systems. It formalizes the discover + access pattern above into a client-server protocol.

- **MCP servers** expose tools (resources, actions) with typed schemas
- **MCP clients** (your host app) discover available tools at runtime and invoke them
- **No static registration** — new tools added to an MCP server are available to the agent immediately
- **Standardized across vendors** — the same tool server works with any MCP-compatible host

When integrating external services, prefer an MCP server over hand-coded tool wrappers. When building internal tools, expose them via MCP to make your app composable with other agents and hosts.

---

## Graduating to Code

Some operations move from agent-orchestrated to optimized code for performance or reliability.

| Stage | Approach | Trade-off |
|-------|----------|-----------|
| 1 | Agent uses primitives in a loop | Flexible, proves the concept |
| 2 | Domain tools for common operations | Faster, still agent-orchestrated |
| 3 | Optimized code for hot paths | Fast, deterministic |

**The caveat:** Even after graduation, the agent should be able to trigger the optimized operation itself and fall back to primitives for edge cases. Graduation is about efficiency — parity still holds.
