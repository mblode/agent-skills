# Styling and Output

How to theme Mermaid diagrams, apply per-element styling, configure layout, and export to images or files. Apply styling only when the user asks — default output is unstyled.

## Table of Contents

- [Frontmatter config](#frontmatter-config)
- [Themes](#themes)
- [Per-element styling](#per-element-styling)
- [Layout options](#layout-options)
- [Rendering targets](#rendering-targets)
- [Export](#export)
- [Common failure modes](#common-failure-modes)

## Frontmatter config

Mermaid supports a YAML frontmatter block at the top of the diagram to set title, theme, and config.

```
---
title: My Diagram
config:
  theme: dark
  layout: elk
  themeVariables:
    primaryColor: "#3B82F6"
    primaryTextColor: "#fff"
    lineColor: "#6B7280"
---
flowchart TD
  A --> B
```

Frontmatter applies per-diagram. Use it instead of `%%{init: {...}}%%` directives when possible — cleaner and easier to maintain.

## Themes

Built-in themes set via `theme:` in frontmatter:

| Theme | Use for |
|---|---|
| `default` | Standard light background |
| `neutral` | Muted grayscale — docs, print |
| `dark` | Dark background — dashboards |
| `forest` | Green accent |
| `base` | Starting point for custom overrides via `themeVariables` |

**Common `themeVariables`:** `primaryColor`, `primaryBorderColor`, `primaryTextColor`, `lineColor`, `secondaryColor`, `tertiaryColor`, `background`, `mainBkg`. Diagram-specific variables exist too (e.g. `actorBkg`, `actorBorder` for sequence; `nodeBorder` for flowchart).

C4 diagrams ignore theme — they use fixed built-in styles.

## Per-element styling

### Flowchart / state / block

```
flowchart TD
  A[Normal] --> B[Success]:::success
  classDef success fill:#10B981,stroke:#059669,color:#fff,stroke-width:2px
```

- `classDef name fill:...,stroke:...,color:...,stroke-width:...`
- Apply: `NodeId:::className` or `class A,B,C className` on a separate line.
- Inline: `style A fill:#f9f,stroke:#333`.

### Sequence diagram

- `rect rgb(r,g,b) ... end` highlights a region.
- `Note over A,B: text` adds a note.
- Per-actor color via themeVariables.

### Class diagram

- `cssClass "A,B,C" className` applies a class.
- `classDef` before the references.

### State diagram

- Same `classDef` + `:::` syntax as flowchart.
- **Limitation:** `classDef` cannot apply to `[*]` or to states inside composite states.

### Quadrant chart

- Inline: `Point: [x, y] radius: 8 color: #ff3300 stroke-color: #10f0f0 stroke-width: 3px`.
- Via class: `Point:::className: [x, y]` plus `classDef`.

### C4

C4 has its own API:
- `UpdateElementStyle(alias, $bgColor, $fontColor, $borderColor, $shadowing, $shape)`
- `UpdateRelStyle(from, to, $textColor, $lineColor, $offsetX, $offsetY)`
- `UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="2")`
- Must appear **after** all elements and relationships.

## Layout options

Via frontmatter `config.layout`:

| Value | Behavior |
|---|---|
| `dagre` | Default. Balanced, fast. |
| `elk` | Advanced. Better for large / crossed diagrams. Requires renderer support. |

`look: handDrawn` produces a sketch aesthetic; `look: classic` is default.

For flowcharts, Mermaid 11+ accepts `config.flowchart.curve: basis|linear|step|natural|cardinal` to control edge curvature.

## Rendering targets

| Target | Native support | Notes |
|---|---|---|
| GitHub markdown | Yes | Block fenced ```` ```mermaid ```` |
| GitLab markdown | Yes | Same |
| Notion | Yes (code block → Mermaid) | |
| Obsidian | Yes (with Mermaid core plugin) | |
| Confluence | Yes (Mermaid macro) | |
| VS Code | Requires `Markdown Preview Mermaid Support` extension | |
| Mermaid Live Editor | `mermaid.live` | Full support, latest features first |
| ChatGPT / Claude web | Via pasted markdown | Depends on client |

Font Awesome icons (`::icon(fa fa-...)` in mindmaps) only render where Font Awesome is available. Default GitHub markdown does **not** render them.

## Export

### Mermaid Live Editor

1. Open `mermaid.live`.
2. Paste the diagram source.
3. Export → PNG, SVG, or Markdown-embedded link.
4. Share link embeds the source for others to edit.

### CLI

```
npm install -g @mermaid-js/mermaid-cli
mmdc -i input.mmd -o output.png
mmdc -i input.md -o output.svg --theme dark
```

`-i` accepts `.mmd`, `.md`, or `.markdown`. `-o` picks format by extension (`.png`, `.svg`, `.pdf`).

### Programmatic

Import `mermaid` as an npm package in JS / TS:

```
import mermaid from 'mermaid';
mermaid.initialize({ theme: 'dark' });
const { svg } = await mermaid.render('id', diagramSource);
```

## Common failure modes

- **`{}` inside a comment** breaks parsing. Strip braces from comments.
- **Silent misspelling** of a diagram keyword drops the whole diagram. Validate in Mermaid Live Editor.
- **Reserved words as node IDs** (`end`, `class`, `state`, `node`, `subgraph`) break parsing. Rename to `End1`, `ClassA`, etc.
- **Emoji / special unicode** in IDs breaks some renderers; keep IDs ASCII.
- **Very long labels** can crash mindmap rendering — keep node text under 30 characters.
- **Nested fenced blocks** in a markdown file: use ```` ```` (four backticks) on the outer block to render diagrams inside code samples.
- **Mixed tabs and spaces** break mindmaps and some beta diagrams. Use spaces only.
