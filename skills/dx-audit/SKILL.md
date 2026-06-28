---
name: dx-audit
description: Audits the developer-facing surface of a library, CLI, SDK, or npm package across API and SDK ergonomics, the error messages developers see, CLI UX, type ergonomics, install and first-run onboarding, and config ergonomics. 27 prefix-dispatched rules; reports findings by file and location with impact tiers and concrete fixes. Use when asked to "audit my CLI", "is this API ergonomic", "review the developer experience", "improve these error messages", "is this SDK easy to adopt", "is this package easy to install", or "review my library's DX". For end-user UI quality and React/Next UX use ui-audit, for agentic-app UX use ax-audit, for documentation prose use docs-writing, for a README use readme-creator, for AGENTS.md use agents-md, and for repo structure use define-architecture.
---

# DX Audit

Audit of the developer-facing surface of a library, CLI, SDK, or package. Loads only the rule categories the current surfaces need, reports findings with `file:line` and a concrete fix for each.

- **IS:** a quality audit of what other developers touch when they adopt your code: the public API and SDK shape, the error messages they read, the CLI commands they run, the types their editor surfaces, the install and first-run path, and the config they write.
- **IS NOT:** an end-user UI or React/Next UX audit (use `ui-audit`), an agentic-app pattern review (use `ax-audit`), a documentation prose review (use `docs-writing` for docs, `readme-creator` for a README, `agents-md` for AGENTS.md), or a repository structure design (use `define-architecture`).

## Audit Workflow

Copy and track this checklist during the audit:

```text
Audit progress:
- [ ] Step 1: Scope. List the developer surfaces under audit and the rule prefixes they need
- [ ] Step 2: Load rules. Read rules/<prefix>-*.md for selected prefixes only
- [ ] Step 3: CRITICAL pass. api-, err- against every scoped file
- [ ] Step 4: HIGH/MEDIUM pass. cli-, types-, onboard-, config- as scoped
- [ ] Step 5: Report. Findings per file with rule id, impact, and fix; clean files as pass
```

1. **Scope.** Default to the changed public surface only. A full-package sweep must be explicitly requested. Map each surface to the prefixes it can violate: a public entry point or `index.ts` needs `api-`, `types-`, `err-`; a `bin/` entry or command file needs `cli-`, `err-`; a `package.json`, README quickstart, or `postinstall` needs `onboard-`; a config loader or schema needs `config-`.
2. **Load rules by prefix.** Read `rules/_sections.md` for the category map, then only the `rules/<prefix>-*.md` files for selected prefixes.
3. **CRITICAL first.** Run `api-` and `err-` before anything else. A polished CLI flag does not matter while the SDK returns `T | T[] | null` or an error reads `undefined is not a function`. For `api-stable-contract`, first establish the prior public contract to diff against (last release tag, published `.d.ts`, or `git diff main`); with no prior version, fall back to the weaker signal that rule names.
4. **HIGH/MEDIUM next.** Then `cli-`, `types-`, `onboard-`, and `config-` as scoped.
5. **Report and verify.** Emit the output contract below. After fixes are applied, rerun the same rule subset on touched files before marking them pass; the rerun output is the evidence the audit is done.

## Rule Categories by Priority

27 rules total. Per-rule frontmatter may override the category impact, so report the rule's own impact, not the category's.

| Priority | Prefix | Category | Impact | Rules |
|----------|--------|----------|--------|-------|
| 1 | `api-` | API and SDK Ergonomics | CRITICAL | 7 |
| 2 | `err-` | Developer-Facing Errors | CRITICAL | 5 |
| 3 | `cli-` | CLI UX | HIGH | 4 |
| 4 | `types-` | Type Ergonomics | HIGH | 5 |
| 5 | `onboard-` | Install and First Run | HIGH | 4 |
| 6 | `config-` | Config Ergonomics | MEDIUM | 2 |

## Reference Files

Load on condition, not by default:

- `rules/_sections.md`: category map with impact rationale. Read at Step 2 of every audit.
- `rules/_template.md`: the rule-file shape. Read only when adding or editing a rule.
- `rules/<prefix>-*.md`: rule-level guidance and examples. Read only the prefixes selected in Step 1.
- `references/dx-principles.md`: the ten developer-experience principles each rule serves. Read when grounding the why behind a finding, or judging a borderline DX call.

## Review Output Contract

Report findings in this format:

```markdown
## DX Audit Findings

### src/client.ts
- [CRITICAL] `api-predictable-return-shape` (line 42): `find()` returns `User | User[] | null` depending on input.
  - Principle: Predictable by design.
  - Fix: Split into `findOne(): User | null` and `findMany(): User[]`; never overload the return shape on the argument.
- [HIGH] `types-no-leaked-any` (line 58): the public `parse()` returns `any`, erasing autocomplete downstream.
  - Principle: No detail is too small.
  - Fix: Return `ParseResult` and constrain the generic to the caller's input type.

### bin/cli.ts
- [CRITICAL] `err-suggest-the-fix` (line 31): config-not-found error states the failure but no remedy.
  - Principle: Fight uncertainty, never leave the developer hanging.
  - Fix: Append `Run \`mytool init\` to create one, or pass --config <path>.`

### src/clean-file.ts
- ✓ pass
```

- Group findings by file; include `file:line` when line numbers are available.
- Every finding states the issue, the DX principle it serves (from `references/dx-principles.md`), and a concrete fix, never just "improve the API".
- Use the rule's own impact from its frontmatter.
- Include every scoped file, clean ones as `✓ pass`.

## Gotchas

- Do not load all 27 rule files for a scoped audit; the context cost flattens finding quality. Load only the prefixes mapped in Step 1; a CLI-only audit needs `cli-` and `err-`, not `types-` or `config-`.
- Do not invent rule ids. Cite only filenames that exist under `rules/`, and describe id-less issues in prose.
- Do not audit internal or private code as if it were public surface. A `T | T[]` return on an unexported helper is not a DX finding; the audit scope is what consumers import, run, or configure.
- Do not widen scope unprompted. A full-package sweep when one entry point changed buries the real findings; a full sweep requires an explicit request.
- Do not reorder priorities for convenience. Reporting a config-default nit while the SDK throws raw stacks (`err-no-raw-stack-as-message`) inverts the table's load-bearing order; CRITICAL categories always run first.
- Do not mark `✓ pass` on a file you did not read against the loaded rules.
- This is not an end-user product audit. When the surface is buttons, pages, and flows rather than functions, flags, and types, stop and route to `ui-audit` or `ax-audit`.

## Related Skills

- `ui-audit`: end-user frontend audit, both rendered quality and accessibility and diff-aware React/Next.js UX (state coverage, focus, optimistic UI).
- `ax-audit`: agentic application patterns and trust design.
- `docs-writing`: writing or auditing documentation prose, API references, and tutorials.
- `readme-creator`: writing or rewriting a project's README from scratch.
- `agents-md`: writing or auditing AGENTS.md and CLAUDE.md agent-instruction files.
- `define-architecture`: folder structure, module contracts, and repository layout.
