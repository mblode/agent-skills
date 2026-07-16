---
title: Expose a Machine-Readable Schema
impact: HIGH
impactDescription: lets an agent discover commands, params, and enums without scraping help text
tags: cli, schema, introspection, agents
---

## Expose a Machine-Readable Schema

Agents parse `--help` prose unreliably and guess at valid values, so ship a `schema` command (or a `--describe` flag) that prints every command, its params, their types, enums, defaults, and whether they are required as JSON. Listing defaults here is also what keeps them observable, so an agent can see a value it did not pass rather than be surprised by it.

**Incorrect (valid values and defaults live only in prose help or source):**

```text
$ mytool issues create --help
Usage: mytool issues create [options]
  --priority <level>   priority
# which levels are valid? what is the default? unknown without reading the source
```

**Correct (a schema command prints the contract as JSON):**

```text
$ mytool schema issues.create
{
  "command": "issues.create",
  "params": [
    { "name": "title", "type": "string", "required": true },
    { "name": "priority", "type": "string", "enum": ["low", "medium", "high"], "default": "medium", "required": false }
  ]
}
```
