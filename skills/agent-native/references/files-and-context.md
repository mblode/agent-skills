# Files and Context

<!-- TOC -->
- [Why Files](#why-files)
- [Entity-Scoped Directories](#entity-scoped-directories)
- [File Naming Conventions](#file-naming-conventions)
- [The context.md Pattern](#the-contextmd-pattern)
- [Context Injection](#context-injection)
- [Context Engineering](#context-engineering)
- [Files vs Database](#files-vs-database)
- [Conflict Model](#conflict-model)
<!-- /TOC -->

---

## Why Files

Agents are naturally fluent with files. The same architecture that makes Claude Code work applies broadly.

| Benefit | Why it matters |
|---------|---------------|
| **Already known** | Agents know `cat`, `grep`, `mv`, `mkdir` — file operations are the primitives they're most fluent with |
| **Inspectable** | Users can see, edit, move, and delete what the agent created — no black box |
| **Portable** | Export and backup are trivial; users own their data |
| **Syncs across devices** | On mobile with iCloud, all devices share the same file system without building a server |
| **Self-documenting** | `/projects/acme/notes/` is self-documenting in a way that `SELECT * FROM notes WHERE project_id = 123` isn't |

**Design principle:** Design for what agents can reason about. The best proxy is what would make sense to a human reading the file structure.

---

## Entity-Scoped Directories

```
{entity_type}/{entity_id}/
├── primary content
├── metadata
└── related materials
```

Example for a research app:
```
Research/books/{bookId}/
├── full_text.txt
├── notes.md
├── sources/
│   ├── wikipedia.md
│   └── sparknotes.md
└── agent_log.md
```

Separate ephemeral from durable:
```
Documents/
├── AgentCheckpoints/     # Ephemeral — delete freely
├── AgentLogs/            # Ephemeral — debugging only
└── Research/             # Durable — user's work
```

---

## File Naming Conventions

| File type | Pattern | Example |
|-----------|---------|---------|
| Entity data | `{entity}.json` | `library.json`, `status.json` |
| Human-readable content | `{content_type}.md` | `introduction.md`, `notes.md` |
| Agent reasoning log | `agent_log.md` | Per-entity history |
| Primary content | `full_text.txt` | Downloaded/extracted text |
| Multi-volume content | `volume{N}.txt` | `volume1.txt`, `volume2.txt` |
| External source | `{source_name}.md` | `wikipedia.md`, `sparknotes.md` |
| Checkpoints | `{sessionId}.checkpoint` | UUID-based |
| Configuration | `config.json` | Feature settings |

Use lowercase with underscores for directory names, not camelCase.

---

## The context.md Pattern

The agent reads this file at session start and updates it as state changes — portable working memory without code changes.

```markdown
# Context

## Who I Am
Reading assistant for the app.

## What I Know About This User
- Interested in military history and Russian literature
- Prefers concise analysis
- Currently reading *War and Peace*

## What Exists
- 12 notes in /notes
- Three active projects
- User preferences at /preferences.md

## Recent Activity
- User created "Project kickoff" (two hours ago)
- Analyzed passage about Austerlitz (yesterday)

## My Guidelines
- Don't spoil books they're reading
- Use their interests to personalize insights

## Current State
- No pending tasks
- Last sync: 10 minutes ago
```

The agent updates this file as state changes. It becomes a persistent, inspectable record of what the agent knows.

---

## Context Injection

System prompts should include three sections so the agent knows what it's working with:

**Available resources:**
```
## Available Data
- 12 notes in /notes, most recent: "Project kickoff" (today)
- Three projects in /projects
- Preferences at /preferences.md
```

**Capabilities:**
```
## What You Can Do
- Create, edit, tag, delete notes
- Organize files into projects
- Search across all content
```

**Recent activity:**
```
## Recent Context
- User created "Project kickoff" note (two hours ago)
- User asked about Q3 deadlines yesterday
```

For long sessions, provide a way to refresh context so the agent stays current with changes made since session start.

---

## Context Engineering

Context windows are finite. Long-running agents must actively manage what they carry.

**Three techniques:**

| Technique | What it does | When to use |
|-----------|-------------|------------|
| **Compaction** | Summarize old messages into a concise note; drop raw history | When context is >70% full |
| **Structured note-taking** | Agent maintains a running `notes.md` of what it has learned and decided | Multi-step research or planning tasks |
| **Just-in-time retrieval** | Load files, data, or tool schemas only when the current step needs them | Large data sets, many tools |

**Compaction pattern:**
```
Agent mid-session: "Summarize everything I've learned and decided so far
into a compact note. I'll continue from that summary."
→ Agent writes summary to notes.md
→ Orchestrator resets context with summary as the new starting point
```

**Just-in-time tool loading** — if your tool library is large, don't include all tool definitions in every call. Use MCP or dynamic discovery to load only the tools relevant to the current step.

Design tools to support iterative refinement (summary → detail → full) rather than all-or-nothing data loading.

---

## Files vs Database

| Use files for | Use database for |
|---------------|-----------------|
| Content users should read/edit | High-volume structured data |
| Configuration that benefits from version control | Data that needs complex queries |
| Agent-generated content | Ephemeral state (sessions, caches) |
| Anything that benefits from transparency | Data with relationships and indexing |
| Large text content | Data that needs aggregation |

**The principle:** Files for legibility, databases for structure. When in doubt, files — they're more transparent and users can always inspect them.

File-first works when:
- Scale is small (one user's library, not millions of records)
- Transparency is valued over query speed
- Cloud sync (iCloud, Dropbox) works well with files

**Hybrid approach:** Even if you need a database for performance, consider maintaining a file-based "source of truth" that the agent works with, synced to the database for the UI.

---

## Conflict Model

When agents and users write to the same files, you need a conflict strategy.

| Strategy | Behavior | When to use |
|----------|----------|-------------|
| Last write wins | Atomic writes; simple but can lose changes | Logs and status files |
| Check before writing | Skip write if modified since last read | User-edited content |
| Separate spaces | Agent writes to `drafts/`, user promotes | Agent-generated proposals |
| Append-only logs | Additive writes only, never overwrites | Agent reasoning logs |
| File locking | Prevent concurrent edits | Critical config files |

iCloud adds complexity by creating conflict copies (`{filename} (conflict).md`). Monitor `NSMetadataQueryDidUpdate` notifications to detect and resolve them explicitly.
