# Mermaid Diagramming Reference

Comprehensive reference for creating Mermaid diagrams beyond mindmaps. Use this when a different diagram type better suits the content.

## Table of Contents

- [Core Syntax](#core-syntax)
- [Diagram Type Selection](#diagram-type-selection)
- [Flowcharts](#flowcharts)
- [Sequence Diagrams](#sequence-diagrams)
- [ERD Diagrams](#erd-diagrams)
- [Class Diagrams](#class-diagrams)
- [C4 Architecture Diagrams](#c4-architecture-diagrams)
- [State Diagrams](#state-diagrams)
- [Styling and Configuration](#styling-and-configuration)
- [Best Practices](#best-practices)
- [Rendering and Export](#rendering-and-export)

## Core Syntax

All Mermaid diagrams follow this pattern:

```
diagramType
  definition content
```

- First line declares diagram type (e.g., `classDiagram`, `sequenceDiagram`, `flowchart`)
- Use `%%` for comments
- Line breaks and indentation improve readability but are not required
- Unknown words break diagrams; invalid parameters fail silently

## Diagram Type Selection

| Need | Diagram type |
|------|-------------|
| Process with decisions | Flowchart |
| API/system interactions | Sequence Diagram |
| Database structure | ERD |
| Object relationships | Class Diagram |
| System architecture | C4 Diagram |
| State transitions | State Diagram |
| Project timeline | Gantt Chart |
| Visual overview of concepts | Mindmap |

## Flowcharts

```
flowchart TD
    Start([Start]) --> Input[/User Input/]
    Input --> Validate{Valid?}
    Validate -->|Yes| Process[Process Data]
    Validate -->|No| Error[Show Error]
    Error --> Input
    Process --> Save[(Save to DB)]
    Save --> Success[/Success Response/]
    Success --> End([End])
```

**Node shapes:**

| Syntax | Shape | Use for |
|--------|-------|---------|
| `[text]` | Rectangle | Process step |
| `([text])` | Rounded | Start/End |
| `{text}` | Diamond | Decision |
| `[/text/]` | Parallelogram | Input/Output |
| `[(text)]` | Database | Data storage |
| `((text))` | Circle | Connector |

**Direction options:** `TD` (top-down), `LR` (left-right), `BT` (bottom-top), `RL` (right-left)

**Edge syntax:** `-->` (solid), `-.->` (dotted), `==>` (thick), `-->|label|` (labeled)

**Subgraphs** group related nodes:

```
flowchart TD
    subgraph Backend
        API --> DB
    end
    subgraph Frontend
        UI --> API
    end
```

**Validation:** All paths covered, decision points clear, start/end defined, flow direction logical.

## Sequence Diagrams

```
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant DB

    User->>Frontend: Click action
    Frontend->>API: POST /endpoint
    API->>DB: Query data
    DB-->>API: Return results
    API-->>Frontend: 200 OK
    Frontend-->>User: Show result
```

**Participant types:** `actor` (human), `participant` (system), `database` (data store)

**Arrow types:**

| Syntax | Meaning |
|--------|---------|
| `->` | Solid line (synchronous) |
| `-->` | Dotted line (response) |
| `->>` | Solid arrow (async message) |
| `-->>` | Dotted arrow (async response) |

**Activation:** `+` activates, `-` deactivates: `Client->>+API: Request` / `API-->>-Client: Response`

**Blocks:**

```
alt Condition
    A->>B: Path 1
else Other condition
    A->>B: Path 2
end

opt Optional
    A->>B: Maybe
end

loop Every 5 seconds
    A->>B: Poll
end

par Parallel
    A->>B: Task 1
and
    A->>C: Task 2
end
```

**Notes:** `note right of API: Validates token` or `note over Frontend,API: Encrypted`

**Validation:** All participants identified, message flow logical, return messages shown, blocks correct.

## ERD Diagrams

```
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : includes

    USER {
        int id PK
        string email UK
        string name
        datetime created_at
    }
```

**Relationship types:**

| Syntax | Meaning |
|--------|---------|
| `\|\|--\|\|` | One to one |
| `\|\|--o{` | One to many |
| `}o--o{` | Many to many |
| `\|\|--o\|` | One to zero or one |

**Cardinality symbols:** `||` (exactly one), `o|` (zero or one), `}o` (zero or more), `}|` (one or more)

**Attributes:** `type name PK/FK/UK` inside entity blocks.

**Validation:** All entities defined, relationships accurate, cardinality correct, keys marked.

## Class Diagrams

```
classDiagram
    Title -- Genre
    Title *-- Season
    Title *-- Review
    User --> Review : creates

    class Title {
        +string name
        +int releaseYear
        +play()
    }
```

**Visibility:** `+` public, `-` private, `#` protected, `~` package

**Relationships:**

| Syntax | Type |
|--------|------|
| `<\|--` | Inheritance |
| `*--` | Composition |
| `o--` | Aggregation |
| `--` | Association |
| `..>` | Dependency |
| `..\|>` | Realization |

**Multiplicity:** `"1"`, `"*"`, `"0..1"`, `"1..*"` added to relationship labels.

## C4 Architecture Diagrams

**Context level** (system in environment):

```
C4Context
    title System Context

    Person(user, "User", "End user")
    System(app, "Application", "Main system")
    System_Ext(ext, "External API", "Third-party service")

    Rel(user, app, "Uses", "HTTPS")
    Rel(app, ext, "Calls", "API")
```

**Container level** (applications and data stores):

```
C4Container
    title Containers

    Person(user, "User")
    Container(web, "Web App", "React", "Frontend")
    Container(api, "API", "Node.js", "Backend")
    ContainerDb(db, "Database", "PostgreSQL", "Storage")

    Rel(user, web, "Uses", "HTTPS")
    Rel(web, api, "Calls", "JSON/HTTPS")
    Rel(api, db, "Reads/Writes", "SQL")
```

**Component level** (internal structure):

```
C4Component
    title Components

    Component(routes, "Routes", "Router", "HTTP endpoints")
    Component(services, "Services", "Logic", "Domain operations")
    Component(models, "Models", "ORM", "Data access")

    Rel(routes, services, "Calls")
    Rel(services, models, "Uses")
```

**Elements:** `Person()`, `System()`, `System_Ext()`, `Container()`, `ContainerDb()`, `Component()`

**Validation:** Appropriate level selected, all systems shown, relationships clear, external systems identified.

## State Diagrams

```
stateDiagram-v2
    [*] --> Pending
    Pending --> Confirmed : Payment Success
    Pending --> Cancelled : Payment Failed
    Confirmed --> Active : Check-in
    Active --> Completed : Check-out
    Completed --> [*]
    Cancelled --> [*]
```

- Start/end markers: `[*]`
- Transitions: `State1 --> State2 : Event`
- State aliases: `state "Display Name" as Alias`
- Notes: `note right of State`
- Composite states: nest states inside `state Name { ... }`

**Validation:** All states defined, transitions logical, start/end marked, notes explain key states.

## Styling and Configuration

**Theme via frontmatter:**

```
---
config:
  theme: base
  themeVariables:
    primaryColor: "#3B82F6"
    primaryTextColor: "#fff"
    lineColor: "#6B7280"
---
```

**Available themes:** `default`, `forest`, `dark`, `neutral`, `base`

**Class styling:**

```
flowchart TD
    A[Normal] --> B[Success]:::success
    classDef success fill:#10B981,stroke:#059669,color:#fff
```

**Layout options:** `dagre` (default, balanced), `elk` (advanced, complex diagrams)

**Look options:** `classic` (traditional), `handDrawn` (sketch-like)

## Best Practices

- Start simple, add details incrementally
- Use clear, descriptive labels for all elements
- Consistent flow direction (usually top-down or left-right)
- Use subgraphs to group related elements
- Add notes to explain complex logic
- Keep under 20 nodes for readability
- One diagram per concept; split large diagrams into multiple focused views
- Store diagram source in markdown files alongside code
- Test rendering in target platform before committing
- Use `%%` comments in source for maintainability

## Rendering and Export

**Native support:** GitHub, GitLab, Notion, Obsidian, Confluence

**VS Code:** Requires Markdown Preview Mermaid Support extension

**Export options:**
- Mermaid Live Editor (`mermaid.live`) for PNG/SVG export
- CLI: `npm install -g @mermaid-js/mermaid-cli` then `mmdc -i input.mmd -o output.png`

**Common pitfalls:**
- Avoid `{}` in comments (breaks parsing)
- Misspellings break diagrams silently; validate in Live Editor
- Split complex diagrams rather than forcing everything into one view
