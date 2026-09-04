---
name: dx-audit
description: Audits libraries, CLIs, and SDKs using 38 rules for public contracts, package exports, piped output, errors, and configuration. Use when asked to "audit my CLI", "review my SDK", "make this agent-friendly", or diagnose package type resolution. For agentic product trust use ax-audit; for docs use docs-writing.
---

# DX Audit

Audit or improve what developers import, run, configure, or read when something fails.

- **IS:** a bounded review of public APIs, developer-facing errors, CLI commands, exported types, install and first-run behavior, and config, with fixes only when asked.
- **IS NOT:** a repo-wide quality sweep (`pr-reviewer`), end-user UI (`ui-design` Audit mode), agent trust review (`ax-audit`), docs prose (`docs-writing`), README (`readme-creator`), repository architecture (`codebase-architecture`), or building a new CLI (`scaffold-cli`).

## Modes

Pick the narrowest mode the request supports, and write a one-line scope receipt before reading code:

| Mode | When | Output |
|------|------|--------|
| Targeted (default) | a named or changed public surface | findings report, read-only |
| Fix | the user says fix, improve, simplify, or implement | localized edits inside the receipt, then verification |
| Exhaustive | the user explicitly asks for the whole package or every public surface | every material finding, partitioned by surface |

```text
Scope: <mode>; surfaces: <commands/exports/config>; prefixes: <err-, cli->; excludes: <UI, docs, architecture, private internals>
```

"DX", "gold standard", and "review holistically" do not by themselves widen a targeted audit into exhaustive. When several skills are invoked together, this one owns only the surfaces above.

## Audit progress

```text
DX audit progress:
- [ ] 1. Lock the public surface and write the scope receipt
- [ ] 2. Gather local evidence and run the safe probes
- [ ] 3. Select prefixes, then open candidate rules
- [ ] 4. Rank root causes
- [ ] 5. Report, or fix when asked
- [ ] 6. Verify on the same scope
```

### 1. Lock the public surface

Start from `git diff` against the normal base and keep only changed files reachable from a public entry point: `package.json` `exports` or `bin`, a command registry, an exported type, a documented config loader, or an observed error path. With no useful diff, use the command, export, error, or config the user named. A private helper enters scope only through a public caller.

### 2. Gather evidence, then stop

1. Local instructions, the manifest, and the diff or named entry point.
2. Direct public dependencies and the nearest tests that pin behavior.
3. Safe probes against the local build:
   - CLI: `--help`, `--version`, one success path, one invalid-input path, and the same command with stdout piped (`| cat`) to see non-TTY behavior. Never trigger a real mutation to test DX; use `--dry-run` where it exists.
   - Package: `npx publint` and `npx @arethetypeswrong/cli --pack .` after a build. These inspect packaging, but packing may invoke lifecycle scripts. Inspect those scripts first or use a disposable checkout before calling `--pack`.
4. The prior release contract, only when the diff changes a public export, signature, or return shape.

Stop when the behavior is proven, disproven, private, or out of scope. External research is for an explicit comparison request or a named uncertainty local evidence cannot resolve; `references/standards-map.md` carries the standards this skill already leans on.

### 3. Dispatch rules candidate-first

Read `rules/_sections.md`, then select prefixes by surface:

| Priority | Prefix | Category | Default impact | Rules |
|----------|--------|----------|----------------|-------|
| 1 | `api-` | Public API and SDK | CRITICAL | 7 |
| 2 | `err-` | Developer-facing errors | CRITICAL | 5 |
| 3 | `cli-` | CLI UX for humans and agents | HIGH | 13 |
| 4 | `types-` | Exported type ergonomics | HIGH | 5 |
| 5 | `onboard-` | Install and first run | HIGH | 5 |
| 6 | `config-` | Config ergonomics | MEDIUM | 3 |

| Surface | Prefixes |
|---------|----------|
| Public API entry point | `api-`, `types-`, reached `err-` paths |
| CLI command | `cli-`, reached `err-` paths |
| Exported declarations | `types-`, plus `api-` when behavior changed |
| Install, `package.json`, first run | `onboard-` |
| Config loader | `config-`, reached `err-` paths |

Applicability outranks priority: a CLI-only audit never loads `api-` because API rules rank higher.

Targeted mode: list the filenames for the selected prefixes (the names are the checklist), look for concrete evidence, then open only the rule files a finding needs. Exhaustive mode: read every rule in the selected prefixes.

Capability gates, applied inside a selected prefix:

- Structured JSON input, schema introspection, and compact polling snapshots apply when automation or agent use is promised, requested, or already supported.
- Dry-run and confirmation apply to destructive, expensive, or hard-to-reverse mutations.
- Progress and resume apply to operations that can block, outlive one command, or be retried after ambiguous output.
- `stdin` applies when the command semantically accepts file or stream data.
- Stable-contract comparison applies only when a public contract changed.

### 4. Rank root causes, not instances

- Order CRITICAL, HIGH, MEDIUM by each cited rule's frontmatter `impact`, copied exactly. Impact is the rule's declared consequence, not a confidence score.
- Merge repeated instances of one root cause into one finding with up to three representative locations. Missing JSDoc, error codes, or `--json` across a surface is one finding, not one per symbol.
- A missing feature with no current consumer path is not a defect.
- Targeted mode: every CRITICAL finding, then the highest-value remainder up to five total; summarize the rest by category.

### 5. Report or fix

Audit requests are read-only. A fix request authorizes localized changes inside the receipt, not a redesign of adjacent docs, UI, or architecture.

```markdown
## DX Audit

Scope: `tool status` CLI; `err-`, `cli-`; 4 files inspected.

### Findings
- [HIGH] `cli-idempotent-resume` at `src/start.ts:42`: retrying the same target creates a second job.
  Fix: return the existing job id and state unless the caller passes `--fresh`.

### Deferred
- 2 lower-impact config candidates were outside the locked CLI scope.
```

List only files with findings; a clean surface gets one pass line naming the surfaces and rule files checked. In fix mode, replace `Deferred` with `Changed` and `Verification` (the exact commands or probes that passed). Length follows findings, not the template.

### 6. Verify on the same scope

Re-open every touched or cited location, rerun the same probes and focused project checks, and reapply the same candidate rules. Match the evidence to the claim: a clean build does not prove CLI behavior, a runtime probe does not prove exported types, and only `attw` or a consumer-style `tsc` import proves a types resolution.

## Reference files

| File | Read when |
|------|-----------|
| `rules/_sections.md` | Every audit, for prefix applicability and priority |
| `rules/<prefix>-*.md` | A candidate has evidence, or exhaustive mode |
| `references/standards-map.md` | A finding needs an external citation, the user asks why something is a rule, or a borderline call needs a tie-break |
| `references/evaluation-scenarios.md` | Changing this skill; never during a user task |
| `rules/_template.md` | Adding or editing a rule |

## Gotchas

- **`npx <pkg>` and a global install probe the registry copy, not the working tree.** `--help`, exit codes, and error strings then describe a released version. Build, then invoke the local entry point (`node ./dist/cli.js`).
- **`process.stdout.isTTY` is `undefined` under a pipe, not `false`.** A guard written as `isTTY === false` never disables color or spinners when piped, so ANSI codes reach the redirected file. Probe with `| cat` rather than trusting the guard.
- **`process.exit(1)` right after `console.log` can truncate the output it was meant to explain.** stdout writes are asynchronous when piped, so a CLI that prints usage and calls `exit()` can emit nothing under `| cat`. The fix is `process.exitCode = 1` and a natural return (`cli-exit-codes`).
- **An `exports` map that reads correctly can still resolve wrong.** `"require"` pointing at a `.js` file under `"type": "module"` masquerades as CJS, and a `types` condition listed after `import` is never reached. `publint` and `attw` catch both; reading the map does not (`onboard-exports-resolve-typed`).
- **A rule id cited from memory drifts from the file.** The frontmatter title and impact are the contract. Open the file before citing it, and drop the citation if no such file exists.
- **Downgrading an impact because the instance feels small hides a class of defect.** Exit 0 on failure in one subcommand is still HIGH; the CI gate it defeats is the same. Copy the frontmatter value.

## Related skills

- `ui-design` Audit mode: rendered end-user frontend quality and accessibility
- `ax-audit`: same files, different reader; asks whether an agent can operate and recover, where this skill asks whether a developer finds the surface ergonomic
- `scaffold-cli`: builds a new CLI with these patterns already in place; this skill audits what exists
- `pr-reviewer`: general correctness and structure of a diff
- `docs-writing`: documentation prose and information quality
- `readme-creator`: README structure and first-reader narrative
- `agents-md`: AGENTS.md and CLAUDE.md instruction files
- `codebase-architecture`: repository structure and module contracts inside the repo, rather than the surface a package ships outward

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
