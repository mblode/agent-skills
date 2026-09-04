# Format and Host Compatibility

Use the [Agent Skills specification](https://agentskills.io/specification) as the source of truth for portable packages and the [creator best practices](https://agentskills.io/skill-creation/best-practices) for authoring guidance. Check the current host documentation when a task needs extensions. The repository validator encodes mechanical limits; its `format` checks enforce the portable contract and its `house` checks enforce local conventions, including recommendations adopted as gates.

## Portable package

A skill needs `SKILL.md` with YAML frontmatter and a Markdown body. Supporting directories are optional; the spec permits additional files and directories. This repository uses:

```text
skill-name/
├── SKILL.md
├── references/       # documentation loaded for a named condition
├── scripts/          # executable helpers with documented dependencies
├── assets/           # templates and static resources
├── rules/            # local audit pattern, not a spec requirement
└── evals/evals.json   # local evaluation fixtures, not a spec requirement
```

Root track files, rule schemas, README bullets, naming preferences for reference files, and evaluation JSON are collection conventions. They must not be presented as restrictions imposed by the open format.

## Frontmatter

`name` and `description` are required strings. The optional portable fields are `license`, `compatibility`, `metadata`, and `allowed-tools`. The validator checks their types and limits. Put custom properties inside `metadata`, with string keys and values, rather than inventing top-level fields.

Use `compatibility` only when a real prerequisite affects execution: a Git checkout, required CLI, network access, browser automation, or a particular host. A capability requirement is usually more useful than a vendor name.

`allowed-tools` is an experimental portable field. Support and permission behavior depend on the host. It is not a portable sandbox, and listing a tool does not establish that the host provides it.

## Host extensions

Fields such as `disable-model-invocation`, `context`, and `hooks` are host extensions, not portable fields. A host may support, reject, or ignore them. For a host-specific package, consult that host's current schema and document the dependency. This collection's portable validator rejects extra top-level fields.

Do not add a host extension automatically because a workflow has side effects. State the action scope in the body, follow the user's authorization, and rely on the host's permission system. A skill cannot create tool access or authorization by declaring it in frontmatter.

Claude Code substitutions such as `${CLAUDE_SKILL_DIR}`, `$ARGUMENTS`, and shell injection syntax require documented host support. For portable commands, resolve the installed SKILL.md directory and use its absolute path for bundled scripts. Do not assume the shell's current directory is the skill directory.

## Loading and references

Put the task, completion evidence, and essential constraints in SKILL.md. Give each optional reference a direct path and a condition for loading it. Keep references focused so the agent can read only the material needed now. Avoid chains that require loading one document merely to discover another.

Skills do not provide a universal context budget, reload policy, compaction behavior, installation directory, or dependency manager. Resolve those from the active host and installer. A sibling skill named in prose may be absent; give a fallback or report the specific missing dependency when it is essential.

## Validation and execution

Run this collection's validator after edits. For an independent format check, use `skills-ref validate <skill-directory>` from the [official reference implementation](https://github.com/agentskills/agentskills/tree/main/skills-ref), recording the revision used. Its scope is metadata and naming, not workflow correctness or host compatibility.

An installation smoke-test must load the edited local source in a disposable target. Installing an unchanged remote branch does not test local edits. Real task evaluations check routing, output quality, tool use, and failure handling separately from format compliance.
