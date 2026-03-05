# Core Principles

<!-- TOC -->
- [Parity](#parity)
- [Granularity](#granularity)
- [Composability](#composability)
- [Emergent Capability](#emergent-capability)
- [Orchestration](#orchestration)
- [Improvement Over Time](#improvement-over-time)
<!-- /TOC -->

---

## Parity

Whatever the user can do through the UI, the agent must be able to achieve through tools.

Build a capability map for every entity:

| User Action | Agent Method |
|-------------|--------------|
| Create item | `write_file` or `create_item` tool |
| Update item | `update_file` or `update_item` tool |
| Delete item | `delete_file` or `delete_item` tool |
| Search | `search_files` or `search` tool |
| Publish | `publish` tool (one action) |

**The discipline:** When adding any UI capability, ask: Can the agent achieve this outcome? If not, add the necessary tools.

**Test:** Pick any action a user can take in your UI. Describe it to the agent. Can it accomplish the outcome?

**Common failure:** You build `create_note` and `read_notes` but forget `update_note` and `delete_note`. User asks the agent to fix a typo and the agent can't help.

---

## Granularity

Tools are atomic primitives. Decision logic lives in prompts, not tools.

```python
# Wrong — logic in tool
def classify_and_organize_files(files):
    category = categorize(files)      # your code decides
    priority = score(files)           # your code decides
    store(files, category, priority)  # your code decides

# Right — agent decides
tools = [read_file, write_file, move_file, bash]
prompt = "Organize the downloads folder by content type and recency"
# Agent applies judgment in a loop
```

**The test:** To change behavior, do you edit prompts or refactor code? If refactoring code, granularity is too low.

**The shift:** The agent pursues an outcome with judgment. It can encounter unexpected cases, adjust, or ask for clarification. The loop continues until the outcome is reached.

The more atomic your tools, the more flexibly the agent can compose them. Bundling decision logic into tools moves judgment back into code.

---

## Composability

With atomic tools and parity, new features = new prompts.

```
Prompt: "Review files modified this week. Summarize key changes.
Based on incomplete items and approaching deadlines,
suggest three priorities for next week."
```

No code written. Agent uses `list_files`, `read_file`, and judgment. You described an outcome; the agent loops until it's achieved.

This works for developers (ship new features by adding prompts) and users (customize behavior by modifying prompts or creating their own).

**The constraint:** Only works if tools are atomic enough to be composed in unanticipated ways, and if the agent has parity with users.

---

## Emergent Capability

The agent can accomplish things you didn't explicitly design for.

Example: Give the agent this prompt with no dedicated feature built:

```
"Cross-reference my meeting notes with my task list.
Tell me what I've committed to but haven't scheduled yet."
```

If the agent can read notes and tasks, it composes those tools to produce a commitment tracker you never coded.

**The flywheel:**
1. Build with atomic tools and parity
2. Users ask for things you didn't anticipate
3. Agent composes tools to accomplish them (or fails, revealing a gap)
4. Observe patterns in what's being requested
5. Add domain tools or prompts to make common patterns efficient
6. Repeat

This changes how you build. Instead of guessing features upfront, you create a capable foundation and learn from what emerges. Failures reveal gaps. Successes signal latent demand.

**Test:** Describe an outcome in your domain that you didn't build a specific feature for. Can the agent figure it out?

---

## Orchestration

When a single-agent loop becomes a bottleneck — context fills, tasks are long-running, or domains are distinct — split into orchestrator + worker agents.

**Orchestrator-worker pattern:**
- **Orchestrator** breaks goals into sub-tasks, delegates each to a specialized worker, and aggregates results
- **Workers** are focused agents with a constrained tool set and a specific role (researcher, writer, verifier)
- Each worker runs in its own context window — no shared state pollution

```
Orchestrator prompt: "Research and write a report on X"
  → Spawns Worker A: "Search for and summarize sources on X"
  → Spawns Worker B: "Draft report outline from these summaries"
  → Waits for results → composes final output
```

**When to graduate to multi-agent:**
- Single agent hits context limits on long tasks
- Independent sub-tasks can run in parallel
- Different sub-tasks need different tool permissions or model tiers

Keep the orchestrator as thin as possible — its job is delegation, not execution.

---

## Improvement Over Time

Agent-native applications improve without shipping code.

**Accumulated context:** State persists across sessions via context files — what exists, what the user has done, what worked. See the Files and Context reference for the `context.md` pattern.

**Prompt refinement at multiple levels:**
- Developer-level: update prompts for all users
- User-level: users modify prompts for their workflow
- Agent-level (advanced): agents adjust prompts based on feedback — requires approval gates and rollback paths

**Self-modification:** When agents can modify their own behavior, make the changes legible — visible, understandable, and reversible.
