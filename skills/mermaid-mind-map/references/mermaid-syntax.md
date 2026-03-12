# Mermaid Mindmap Syntax

Syntax reference for Mermaid's mindmap diagram type. Hierarchy is defined purely by indentation.

## Basic Structure

```
mindmap
  root((Central Topic))
    Branch A
      Sub-topic 1
      Sub-topic 2
    Branch B
      Sub-topic 3
```

- First line is always `mindmap`
- Second line (indented) is the root node
- All subsequent lines use consistent indentation increments per level
- No blank lines inside the mindmap block

## Node Shapes

| Shape | Syntax | Use for |
|-------|--------|---------|
| Default (rounded rect) | `Node text` | Leaf nodes, general items |
| Square | `[Node text]` | Categories, modules, concrete items |
| Rounded square | `(Node text)` | Processes, actions, flows |
| Circle | `((Node text))` | Central concept (root node) |
| Bang | `))Node text((` | Warnings, critical items, emphasis |
| Cloud | `{Node text}` | Uncertain items, ideas, questions |

## Icons

Add Font Awesome icons using `::icon()` syntax:

```
mindmap
  root((Project))
    Deploy::icon(fa-rocket)
    Settings::icon(fa-gear)
```

Icons require Font Awesome to be available in the rendering environment. Only add when explicitly requested.

## Indentation Rules

- Use spaces only (no tabs)
- Keep indentation increments consistent (2 or 4 spaces per level)
- Each deeper level adds one increment
- No blank lines inside the block (breaks rendering)
- No trailing whitespace

## Known Limitations

- **Long text crashes**: Nodes exceeding roughly 30 characters can cause infinite loops in the renderer. Keep all nodes under 6 words.
- **Special characters**: Unescaped `(`, `)`, `[`, `]`, `{`, `}` in node text are interpreted as shape delimiters. Rephrase to avoid them.
- **Colons**: Colons in node text can cause parsing issues. Rephrase to avoid.
- **No cross-links**: Mindmaps are trees, not graphs. Cannot link between branches.
- **No layout control**: Mermaid auto-layouts the tree. Cannot control left/right branch distribution.
- **Experimental**: Mermaid mindmap syntax may change in future versions.

## Complete Example

```mermaid
mindmap
  root((Project Architecture))
    [Frontend]
      (React Components)
      (State Management)
      (Routing)
      API Integration
    [Backend]
      (API Layer)
      (Database)
      (Authentication)
      Background Jobs
    [Infrastructure]
      (CI/CD Pipeline)
      (Hosting)
      {Monitoring}
      {Alerting}
    [Documentation]
      API Reference
      User Guide
      Architecture Decisions
```
