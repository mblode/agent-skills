# Generation Guidelines

Rules and heuristics for producing readable Mermaid diagrams, regardless of type. Covers labelling, sizing, structure, source-type strategies, and common restructuring patterns.

## Table of Contents

- [Label rules](#label-rules)
- [Size budgets per diagram type](#size-budgets-per-diagram-type)
- [Structure rules](#structure-rules)
- [Source-type strategies](#source-type-strategies)
- [Common restructuring patterns](#common-restructuring-patterns)
- [Quality signals](#quality-signals)

## Label rules

Apply to every node, edge label, message, state, entity, requirement, and slice.

| Element | Max words | Example |
|---|---|---|
| Diagram root / title | 1-4 | `Auth System`, `Order Lifecycle` |
| Top-level node / entity | 1-4 | `Payment Service`, `User` |
| Inner node / message | 1-6 | `Validate JWT token`, `POST /checkout` |
| Edge / transition label | 1-4 | `on success`, `retry` |
| Note / description | ≤ 15 words | A clarifying aside, not prose |

- Prefer nouns for entities; verbs for actions, messages, and transitions.
- Never use full sentences as labels. Split into parent + child or add a `Note`.
- Extract keywords: "The authentication system uses JWT tokens" → `Auth` with child `JWT Tokens`, or message `Validate JWT`.
- Escape or avoid `()[]{}` and stray colons in labels. Quote when needed (syntax varies per type).

## Size budgets per diagram type

| Type | Readable max | Notes |
|---|---|---|
| `flowchart` | 15-20 nodes | Split into subgraphs beyond 20; extract helper flows. |
| `sequenceDiagram` | 10 participants, 25 messages | Large exchanges: split by phase. |
| `classDiagram` | 12 classes | Namespace groups beyond 12. |
| `stateDiagram-v2` | 15 states | Nest with composite states; don't flatten. |
| `erDiagram` | 10-15 entities | Split into bounded contexts. |
| `C4Context` / `Container` / `Component` | 5-7 systems, 10 containers, 15 components | One level per diagram; link across. |
| `mindmap` | 40 total nodes, 4 levels | Split into focused maps beyond that. |
| `gantt` | 25 tasks | Split by phase/quarter. |
| `timeline` | 15 periods | Split by era. |
| `journey` | 3-5 sections, 5 tasks each | Split by journey stage. |
| `gitGraph` | 3-5 branches, 15 commits | Demonstrate a pattern, not full history. |
| `pie` | 5-7 slices | Group small slices into "Other". |
| `quadrantChart` | 10 points | Beyond that, the 2×2 gets illegible. |
| `requirementDiagram` | 10 requirements | Split by subsystem. |
| `xychart-beta` | 20 data points | Reduce to trend; don't dump tables. |
| `sankey-beta` | 20 flows | Collapse small flows. |
| `block-beta` | 15 blocks | Layout grid, not logic. |
| `architecture-beta` | 10 services | One concern per diagram. |

If the content exceeds the budget, **split into multiple diagrams** before compressing labels.

## Structure rules

- **One diagram, one concern.** Don't mix data, flow, and architecture in a single diagram.
- **Pick a direction and stick with it.** Top-down for process flows; left-right for timelines or pipelines. Don't mix.
- **Define before reference** where the syntax requires it (participants in sequence, classes in class diagrams, entities in ER).
- **Balance branches.** No single-child chains — merge into the parent. If one branch dwarfs others, split or elevate key sub-nodes.
- **Keep shape usage intentional.** Default shape for most nodes; shaped nodes only for visual emphasis (decisions, databases, external systems).
- **Group related nodes.** Use subgraphs (flowchart), namespaces (class), sections (journey/gantt/timeline), boundaries (C4), or composite states.

## Source-type strategies

### Codebase overview

- Root: the project/repo name.
- Extract from `package.json`/`pyproject.toml`/`Cargo.toml` + top-level folders + entry points.
- Best types: `mindmap` (hierarchy), `C4Context`/`C4Container` (architecture), `flowchart` (request flow).
- Label nodes by purpose, not filename: "Auth service" beats "auth/index.ts".

### File / document summary

- Root or title: the document's central theme.
- Branches or sections: top-level headings.
- Best types: `mindmap` (concepts), `flowchart` (procedures), `timeline` (history documents).
- Node labels are keyphrases, not bullet text.

### Feature planning or design

- Identify actors, inputs, outputs, and happy/unhappy paths.
- Best types: `sequenceDiagram` (API feature), `stateDiagram-v2` (stateful entity), `flowchart` (branching logic), `C4Container` (system placement).
- Include error paths only when they change the design.

### Debugging or incident analysis

- Focus on the boundary between expected and actual behavior.
- Best types: `sequenceDiagram` (request timeline), `stateDiagram-v2` (stuck state), `flowchart` (failure tree).
- Use `Note` blocks to flag the suspect step.

### Topic exploration / brainstorm

- Ask one clarifying question about audience or scope if ambiguous, then commit.
- Best types: `mindmap`, `quadrantChart`, `journey`.

### Requirements / compliance

- Best type: `requirementDiagram` when verification linkage matters; `erDiagram` or `classDiagram` for artefact modeling.

## Common restructuring patterns

- **Too dense** (over budget): split by subsystem, phase, or level of detail.
- **Too abstract** (all generic labels): add one level of specificity — concrete technologies, service names, data types.
- **Too detailed** (file listing, method dump): raise the abstraction level; group by purpose.
- **Unbalanced branches**: elevate important sub-nodes or split the heavy branch.
- **Crossings everywhere**: change direction (LR ↔ TD), use subgraphs, or apply `layout: elk` in frontmatter.
- **Circular flow looks linear**: add an edge back to the start or use a `stateDiagram-v2` loop.
- **Unclear start/end**: add explicit terminal nodes (`[*]`, `Start`/`End`).

## Quality signals

**Good diagram:**
- Parseable by a reader in under 30 seconds.
- Every element's role is clear from its label.
- Depth/branching is balanced (within one level of neighbors).
- Direction and flow are consistent.
- No duplicate information between the diagram and surrounding text.

**Bad diagram:**
- Requires the source material to interpret.
- Labels are full sentences.
- Branches are grab-bags of unrelated concerns.
- Single-child chains, orphan nodes, or unconnected clusters.
- Mixes diagram types' idioms (e.g. sequence arrows in a flowchart).
