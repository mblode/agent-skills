# DX Audit Evaluation Scenarios

Scenarios for changing this skill. Evaluate the observable workflow, not whether the answer repeats the skill wording. This file never loads during a user task.

## 1. Targeted CLI diff

**Prompt:** "Audit the new `status --json` flag in this CLI."

**Expected behavior:**

- Locks scope to the changed status command and selects `cli-` plus the reached `err-` path.
- Reads the command registry, direct implementation, and nearest tests; runs the safe probes including a piped invocation.
- Lists CLI rule filenames, then opens only rules supported by candidate evidence.
- Cites impact from each opened rule's frontmatter.
- Does not inspect SDK exports, README prose, unrelated commands, or general web guidance.
- Reports up to five root-cause findings without per-file pass noise.

## 2. Multi-skill request

**Prompt:** "Use dx-audit, readme-creator, and codebase-architecture. Make this package simple."

**Expected behavior:**

- States that dx-audit owns only developer-facing API, CLI, error, type, onboarding, and config behavior.
- Does not duplicate README prose or repository-structure analysis.
- Uses the named or changed public surface instead of interpreting "simple" as a whole-repo sweep.

## 3. Localized fix

**Prompt:** "Improve this missing-config error with dx-audit."

**Expected behavior:**

- Uses fix mode with `err-` and only the config path needed to reproduce the error.
- Opens the exact candidate error rule, implements a localized fix, and tests the failing path.
- Does not audit all config options, add a framework, or rewrite documentation.
- Reports changed files and matching verification evidence.

## 4. Explicit exhaustive audit

**Prompt:** "Run an exhaustive DX audit of every public surface in this npm package. Report only."

**Expected behavior:**

- Maps all public surfaces from manifests and entry points before any parallel work.
- Partitions disjoint surfaces if using subagents and reads all rules for selected prefixes.
- Includes every material finding, merging repeated instances by root cause.
- Makes no edits and does not browse unless a named uncertainty requires current external evidence.

## 5. Agent-operated long-running CLI

**Prompt:** "Audit this job dispatcher and monitor loop for agent-friendly DX and token efficiency."

**Expected behavior:**

- Considers `cli-idempotent-resume` and `cli-delta-polling` as candidates because agent use is stated.
- Flags duplicate resource creation on retry and a `status` command that dumps full state on every tick.
- Recommends a compact snapshot with a stable fingerprint and a `wait` command, not a persistent orchestration system.

## 6. Package that installs but does not import

**Prompt:** "People say my package's types are wrong after install. Is it easy to adopt?"

**Expected behavior:**

- Selects `onboard-` and `types-`, builds, then runs `publint` and `attw --pack .` rather than reading `exports` by eye.
- Reports `onboard-exports-resolve-typed` with the specific publint or attw diagnostic (for example `types` after `import`, or masquerading as CJS) and the corrected map.
- Does not open `cli-` rules for a package with no `bin`, and does not rewrite the README.

## 7. Near miss that should not trigger

**Prompt:** "Scaffold a new TypeScript CLI with JSON output and a schema command."

**Expected behavior:**

- Routes to `scaffold-cli`; dx-audit has nothing to audit until the CLI exists.
