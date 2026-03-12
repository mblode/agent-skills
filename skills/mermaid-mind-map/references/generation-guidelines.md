# Generation Guidelines

How to build effective mind maps: node constraints, depth control, and source-type strategies.

## Node Text Constraints

| Level | Max words | Examples |
|-------|-----------|---------|
| Root | 1-3 | `React App`, `Auth System`, `API` |
| Level 1 (main branches) | 1-4 | `State Management`, `Error Handling` |
| Level 2 | 1-5 | `JWT Token Validation`, `Rate Limiting` |
| Level 3-4 | 1-6 | `Refresh Token Rotation Flow` |

- Never use full sentences. If a concept needs a sentence, split into parent + child nodes.
- Extract keywords: "The authentication system uses JWT tokens" becomes `Auth` with child `JWT Tokens`.
- Prefer nouns and noun phrases. Use verbs only for process nodes.

## Depth and Branching Rules

| Depth | Max levels | Target nodes | Best for |
|-------|-----------|--------------|----------|
| overview | 2 | 8-15 | Quick orientation, executive summary |
| standard | 3 | 15-30 | General exploration, codebase maps |
| detailed | 4 | 25-40 | Deep dives, feature decomposition |

- 3-7 main branches off root (5 is ideal).
- 2-5 children per branch at each level.
- If a branch has only 1 child, merge the child into the parent.
- If a branch has more than 7 children, group into sub-categories.
- Total node count must not exceed 40.

## Source-Type Strategies

### Topic exploration

Root is the concept name. Branches are domain categories, dimensions, or perspectives. Sub-nodes are specific aspects, examples, or properties.

### Codebase overview

Root is the project name. Branches are architectural layers or module groups (Frontend, Backend, Infrastructure). Sub-nodes are specific modules, patterns, or key files. Use `[square]` for concrete modules, `(rounded)` for patterns/processes.

### File/document summary

Root is the document title or central theme. Branches are major sections or themes. Sub-nodes are key points, arguments, or findings within each theme.

### Feature planning / debugging

Root is the feature name or problem statement. Branches are components, phases, or categories of causes. Sub-nodes are specific tasks, options, or hypotheses. Use `{cloud}` for uncertain items and `))bang((` for critical paths.

## Node Shape Strategy

| Shape | When to use |
|-------|-------------|
| `((circle))` | Root node only |
| `[square]` | Concrete categories, modules, entities |
| `(rounded)` | Processes, actions, workflows |
| `{cloud}` | Uncertain items, hypotheses, ideas to explore |
| `))bang((` | Critical items, blockers, warnings |
| Default | General leaf nodes, simple items |

Use shapes sparingly. Most nodes should use default. Reserve shaped nodes for visual emphasis.

## Common Restructuring Patterns

- **Too deep** (5+ levels): Collapse intermediate levels or split into multiple maps.
- **Too wide** (8+ children): Group children into 2-3 sub-categories.
- **Unbalanced** (one branch 15 nodes, another 2): Split the heavy branch or elevate important sub-nodes.
- **Too abstract** (all nodes generic like "Backend"): Add one level of specificity with concrete technologies or components.
- **Too detailed** (looks like a file listing): Raise abstraction level; group files by purpose, not name.

## Quality Signals

**Good mind map:**
- Understandable in under 30 seconds
- Each branch tells a coherent sub-story
- Node labels are self-explanatory without additional context
- Depth is consistent across branches (within 1 level)

**Bad mind map:**
- Requires reading the source material to understand
- Nodes are sentences or long phrases
- Branches are unrelated grab-bags of information
- Single-child chains (A > B > C where B adds no value)
