---
name: dx-audit
description: Audits the smallest relevant developer-facing surface of a library, CLI, SDK, or npm package across API contracts, errors, CLI behavior, public types, onboarding, and config. Uses candidate-first rule loading, bounded local evidence, and compact root-cause findings. Use when asked to "audit my CLI", "make this CLI agent-friendly", "is this API ergonomic", "review the developer experience", "improve these errors", "simplify first run", or "review my SDK". For end-user UI use ui-audit, for agentic-app trust use ax-audit, for docs prose use docs-writing, for README work use readme-creator, and for repo architecture use define-architecture.
---

# DX Audit

Audit or improve what developers import, run, configure, or read when something fails.

- **IS:** a bounded review of public APIs, developer-facing errors, CLI commands, exported types,
  install and first-run behavior, and config.
- **IS NOT:** a repo-wide quality sweep, end-user UI audit (`ui-audit`), agent trust review
  (`ax-audit`), prose rewrite (`docs-writing`), README rewrite (`readme-creator`), or repository
  architecture review (`define-architecture`).

## Modes and scope lock

Choose the narrowest mode supported by the request:

1. **Targeted audit (default):** inspect the named surface or changed public surface and report.
2. **Fix:** only when the user asks to fix, improve, simplify, or implement; make localized fixes
   inside the locked scope, then verify them.
3. **Exhaustive:** only when the user explicitly asks for the whole package or every public surface.

Before exploration, write a one-line scope receipt:

```text
Scope: <mode>; surfaces: <commands/exports/config>; prefixes: <err-, cli->; excludes: <UI/docs/architecture/private internals>
```

If several skills are invoked, keep only the developer-facing surfaces above. Let sibling skills
own their areas without duplicating their search or findings. "DX", "gold standard", and "review
holistically" do not by themselves authorize a multi-repo or whole-package sweep.

## Audit progress

```text
DX audit progress:
- [ ] 1. Lock intent, public surfaces, and exclusions
- [ ] 2. Trace the minimum local evidence path
- [ ] 3. Select prefixes and candidate rule files
- [ ] 4. Confirm and rank material findings
- [ ] 5. Report, or fix only when requested
- [ ] 6. Re-run the same checks and record evidence
```

### 1. Lock the public surface

Default to `git diff` against the repository's normal base, then keep only changed files reachable
through a public entry point. With no useful diff, use the command, export, package, error, or config
named by the user.

Public reachability comes from evidence such as `package.json` `exports`/`bin`, a command registry,
an exported type, a documented config loader, or an observed error path. Do not audit a private
helper unless a public caller exposes its behavior.

### 2. Follow the evidence ladder, then stop

Take these rungs in order:

1. Read local instructions, the relevant manifest, and the diff or named entry point.
2. Trace only direct public dependencies and the nearest tests that establish behavior.
3. For a CLI, use a small safe probe set when useful: `--help`, `--version`, one success path, and
   one invalid-input path. Do not trigger a real mutation merely to test DX.
4. Check a prior release contract only when the diff changes a public export, signature, or return
   shape.

Stop when the behavior is proven, disproven, private, or outside scope. Do not browse general best
practice articles, inventory unrelated apps, build static repo maps, or spawn overlapping scouts.
External research is for an explicit comparison request or a named uncertainty local evidence
cannot resolve. In an explicit exhaustive audit, parallel work may partition disjoint public
surfaces; it must not run several generic whole-repo reviews.

### 3. Dispatch rules candidate-first

Read `rules/_sections.md`, then select only prefixes applicable to the locked surface:

| Priority | Prefix | Category | Default impact | Rules |
|----------|--------|----------|----------------|-------|
| 1 | `api-` | Public API and SDK | CRITICAL | 7 |
| 2 | `err-` | Developer-facing errors | CRITICAL | 5 |
| 3 | `cli-` | CLI UX | HIGH | 13 |
| 4 | `types-` | Exported type ergonomics | HIGH | 5 |
| 5 | `onboard-` | Install and first run | HIGH | 4 |
| 6 | `config-` | Config ergonomics | MEDIUM | 3 |

Map surfaces to prefixes: a public API entry point uses `api-`, `types-`, and reached `err-`
paths; a CLI uses `cli-` and reached `err-` paths; exported declarations use `types-`, plus
`api-` only when behavior changes; install and first run use `onboard-`; config loaders use
`config-` and reached `err-` paths.

Applicability outranks global priority. A CLI-only audit runs applicable `err-` rules before
`cli-`; it does not load `api-` merely because API rules have higher impact.

For a targeted audit:

1. List filenames for the selected prefixes; their names form the candidate checklist.
2. Inspect the scoped behavior for concrete candidate evidence.
3. Open only the exact candidate rule files needed to confirm or reject a finding.
4. Cite a rule id only after reading that file. Never invent one from memory.

For an explicit exhaustive audit, read every rule in the selected prefixes. Read
`references/dx-principles.md` only when the user asks for rationale or a borderline finding needs a
tie-breaker. Read `rules/_template.md` only when adding or editing a rule.

Capability-gate candidate rules even inside a selected prefix:

- Structured JSON input and schema introspection apply when automation or agent use is promised,
  requested, or already supported.
- Dry-run and confirmation apply to destructive, expensive, or difficult-to-reverse mutations.
- Progress, delta polling, and resume apply to operations that can block, outlive one command, or
  be retried after ambiguous output.
- `stdin` applies when the command semantically accepts file or stream data.
- Stable-contract comparison applies only when a public contract changed.

### 4. Rank root causes, not instances

- CRITICAL findings first, then HIGH, then MEDIUM using each rule's frontmatter impact.
- Copy the rule's frontmatter impact exactly. Impact is the rule's declared consequence, not a
  confidence score; never downgrade it because the local instance feels minor.
- Merge repeated instances of one root cause into one finding with up to three representative
  locations.
- Do not flag a hypothetical missing feature with no current consumer path. YAGNI is not a defect.
- Do not turn absence of JSDoc, error codes, or a flag into one finding per symbol or command.
- In targeted mode, report all CRITICAL findings, then the highest-value remaining findings up to
  five total. Summarize any remainder by category rather than expanding the audit.
- Before reporting, compare every cited rule id with the rule files actually opened. Open any
  missing file and use its frontmatter impact, or remove the citation.

### 5. Report or fix

Audit-only requests are read-only. A request to improve or fix authorizes localized changes inside
the scope receipt, not a redesign of adjacent docs, UI, or architecture.

Use this compact output:

```markdown
## DX Audit

Scope: `tool status` CLI; `err-`, `cli-`; 4 files inspected.

### Findings
- [HIGH] `cli-idempotent-resume` at `src/start.ts:42`: retrying the same target creates a second job.
  Fix: return the existing job id and state unless the caller passes `--fresh`.

### Deferred
- 2 lower-impact config candidates were outside the locked CLI scope.
```

Only list files with findings. If none are material, return one pass line naming the surfaces and
rule files checked. Do not emit a `✓ pass` entry for every clean file or repeat a DX principle under
every finding. In exhaustive mode, include every material finding; list clean files only when the
user requests compliance-style evidence.

For fix mode, replace `Deferred` with `Changed` and `Verification`, including the exact commands or
runtime probes that passed.

Before sending the report, check:

```text
Report preflight:
- every cited rule file was opened
- every [IMPACT] exactly matches that file's frontmatter
- the inspected-file count matches the unique files named
- no out-of-scope or per-clean-file filler entered the report
```

### 6. Verify on the same scope

Re-open every touched or cited location, rerun the same safe probes and focused project checks, and
reapply the same candidate rules. A clean build alone does not prove CLI behavior; a runtime probe
alone does not prove exported types. Verification evidence must match the finding.

## Reference files

| File | Read when |
|------|-----------|
| `rules/_sections.md` | Every audit, for prefix applicability and priority |
| `rules/<prefix>-*.md` | A targeted candidate exists, or the user requests exhaustive coverage |
| `references/dx-principles.md` | Rationale is requested or a finding is borderline |
| `references/evaluation-scenarios.md` | Evaluating or changing this skill's workflow |
| `rules/_template.md` | Adding or editing a rule |

## Gotchas

- **Selected prefixes are not permission to read the whole repo.** Stay on public reachability from
  the scope receipt.
- **Priority is conditional on applicability.** Do not run `api-` against a CLI-only change.
- **Contract archaeology needs a changed contract.** Do not search tags or npm for an unchanged
  public surface.
- **A long session is not stronger evidence.** Stop after the behavior and fix are concrete.
- **Multiple skills need one owner per surface.** Do not duplicate README, UI, architecture, or docs
  work owned by sibling skills.
- **A safe audit does not create real resources.** Use dry-run, fixtures, or a disposable local
  target for mutation paths.

## Related skills

- `ui-audit`: rendered end-user frontend quality and accessibility
- `ax-audit`: agentic application architecture and trust
- `docs-writing`: documentation prose and information quality
- `readme-creator`: README structure and first-reader narrative
- `agents-md`: AGENTS.md and CLAUDE.md instruction files
- `define-architecture`: repository and module structure
