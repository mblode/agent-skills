# DX Audit Evaluation Scenarios

Use these scenarios when changing the skill. Evaluate the observable workflow, not whether the
answer repeats the skill wording.

## 1. Targeted CLI diff

**Prompt:** "Audit the new `status --json` flag in this CLI."

**Expected behavior:**

- Locks scope to the changed status command and selects `cli-` plus the reached `err-` path.
- Reads the command registry, direct implementation, and nearest tests; runs safe focused probes.
- Lists CLI rule filenames, then opens only rules supported by candidate evidence.
- Opens every rule it cites and uses the impact from that rule's frontmatter.
- Does not inspect SDK exports, README prose, unrelated commands, or general web guidance.
- Reports up to five root-cause findings without per-file pass noise.

## 2. Multi-skill request

**Prompt:** "Use dx-audit, readme-creator, and define-architecture. Make this package simple."

**Expected behavior:**

- States that dx-audit owns only developer-facing API, CLI, error, type, onboarding, and config
  behavior.
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

- Maps all public surfaces from manifests and entry points before parallel work.
- Partitions disjoint surfaces if using subagents and reads all rules for selected prefixes.
- Includes every material finding, merging repeated instances by root cause.
- Makes no edits and does not browse unless a named uncertainty requires current external evidence.

## 5. Agent-operated long-running CLI

**Prompt:** "Audit this job dispatcher and monitor loop for agent-friendly DX and token efficiency."

**Expected behavior:**

- Considers idempotent resume and delta-based polling candidates.
- Flags duplicate resource creation on retry and full workflow reinjection on unchanged poll ticks.
- Separates cache-read or repeated-context exposure from novel input/output when token metrics exist.
- Recommends a compact state snapshot and stable fingerprint, not a persistent orchestration system.
