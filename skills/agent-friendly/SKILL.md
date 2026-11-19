---
name: agent-friendly
description: >-
  Makes a codebase agent-friendly: builds the guardrails, instructions and verification agents need, or audits a repo against the catalogue and fixes the top gap. Use when asked to "make this repo agent-friendly", "set up a repo for agents", "audit this for agents", or "agents keep making the same mistake".
---

# Agent friendly

The one catalogue of what makes a codebase safe for agents to work in unattended, and the order to build it in. Each item states the rule in a line, the section says why it matters, `references/audit-checklist.md` says how to check it, `references/build-playbook.md` says how to install it, and the owner named at the end of each section holds the detail. When an owner and this file disagree, the owner wins and this file is stale.

The build order comes from a production monorepo of dozens of apps written mostly by agents; each step there exists because an agent-written pull request hit the failure it prevents.

- **IS:** installing the guardrails, instructions and verification in order (Build), explaining which rule applies and why (Explain), scoring a repo across every section with evidence (Audit), and fixing the highest-leverage gap (Apply).
- **IS NOT:** the detail behind any rule (read its owner), module and interface design (`codebase-architecture`), the content of AGENTS.md (`agents-md`), a product's verify CLI and feature map (`app-verification`), or CI speed (`ci-speedup`).

## Files

| File | Read when |
|------|-----------|
| `references/build-playbook.md` | Build mode, or Apply mode when the gap is a missing step: the ordered steps, each with the incident behind it, its check and its owner |
| `references/audit-checklist.md` | Audit mode: rule, check and owner per row, and the verdict rules |
| `references/doctrine.md` | Explain mode: worked examples of each rule in a real repo |
| `references/diagnostics.md` | Writing a lint, type, build, startup or guard message that names the fix |
| `references/laws.md` | Adding or reviewing a law or a repo-level promise: fast-check, census with a planted mutant, TLA+, Lean, and their limits |

## Modes

- **Build:** walk `references/build-playbook.md` in order, skipping steps the repo already passes (check each with its audit row first). Each step lands green with its existing violations fixed or listed, and is proven to bite. Done when the repo's one `check` command exits 0, a planted violation of every guard added fails with a message naming the fix, and the plants are reverted.
- **Explain:** find the section, state the rule, why it applies to this code, the check that would prove it, and the owner to read next. Done when all four are in the answer.
- **Audit:** score every section with `references/audit-checklist.md`, a verdict per section with evidence per row, then file each gap in the repo's tracker with the row's check as its done condition. Done when every section has a verdict and every gap has a task.
- **Apply:** pick the highest-leverage gap: first anything blocking verification, then the highest ladder rung that stops a recurring mistake, then the rest. Fix it by its owner's method, prove it (a planted violation fails, the check passes), and delete any prose the fix replaces. Done when the row's check passes in the working tree.

## The catalogue

### 1. Codebase shape
The codebase is the agent's memory: it copies what it sees, so one workaround becomes the pattern.
- A few nouns (app, package, feature, route), each with one place in the tree, one name used everywhere (folder, package, deploy target), and one generator that creates it.
- Files, not registries; where a registry exists, a check fails when it disagrees with the folders.
- One writer per durable value; boundaries enforced on the import graph.
- One paved path per task; design for the least-context contributor.
- No history or reviewer comments. Legacy code is marked and fenced so it is not copied.
Owner: `codebase-architecture` (`wayfinding.md`, `contagion-markers.md`, `guardrail-tooling.md`).

### 2. Enforcement ladder
Prose rules get forgotten; only checks that fail scale to thousands of agent PRs.
- Laws, then codebase, then static analysis, then rules, skills and review, then a style guide. Take the highest rung that holds.
- Every review comment repeated twice is a missing rule.
- Guards ordered by when they fire: edit hook, pre-push, CI, nightly. One `check` command runs them all.
- Diagnostics name the fix and the owner.
- Exception lists only shrink, fail on stale entries, and carry a reason per entry.
Owners: `codebase-architecture` (`enforcement-ladder.md`, `agent-runtime.md`); `references/diagnostics.md`.

### 3. Laws and repo promises
Humans can review a short list of laws where they cannot review a thousand diffs.
- `LAWS.md`: invariants in plain words, each linked to the check that backs it.
- fast-check properties by default; a census with a planted mutant for repo-wide promises; TLA+ for concurrency; Lean rarely.
- Law changes go to a person; the implementation under them can change freely.
Owner: `references/laws.md`.

### 4. Verification
Without verification the human is the verifier, and nothing runs in parallel.
- `doctor` first; `verify` proves the changed features and fails if no checks ran.
- Every app has a test or a listed reason; each instruction file says what its verify command proves and what it does not.
- Deterministic seed and test accounts; per-worktree ports and databases.
- Reproduce before fixing. Report built, merged, deployed and verified-live separately.
Owners: `app-verification`; `ui-verification`; `codebase-architecture` `verification-tiers.md`.

### 5. Agent instructions
Instructions load every session; wrong or duplicated lines cost every task.
- One root AGENTS.md; nested files hold only what differs, under a shared heading set.
- Every command in it verified by running it; every rule names the check that enforces it.
- `REVIEW.md` aimed at over-production; a docs index with trust labels; a dated lessons log.
Owners: `agents-md`; `codebase-architecture` `wayfinding.md`.

### 6. Skills
A skill is onboarding for an agent with zero context; a bad one routes wrongly or teaches the wrong thing.
- One `skills/` folder linked into every agent's skills path; short descriptions with quoted triggers.
- Evals with neutral workspace names and a with-and-without comparison.
Owner: `agent-skills-creator`.

### 7. Parallel agents and review
Parallel agents need isolation built into the tools, and review aimed at what checks cannot catch.
- Worktree isolation that refuses the main instance; small PRs; one owner per PR.
- One required CI check; drafts skip CI; every PR names the request it answers.
- Review blocks one-caller abstractions, duplicates, mock-asserting tests and widened exceptions.
Owners: `app-verification` `worktree-isolation.md`; `ci-speedup`; `tidy`; `test-audit`.

### 8. Stack
The stack decides how much an agent can get wrong silently.
- Strictest compiler settings, branded ids, row-level security, one package manager, env read in one file, pinned versions with written reasons.
Owners: `codebase-architecture` `stack-defaults.md`; `references/build-playbook.md`.

### 9. Tools and CLIs agents use
Agents drive tools through output and exit codes, not screens.
- JSON output, stable exit codes, errors that name the fix, dry-run, idempotent commands.
Owners: `dx-audit`; `ax-audit`.

### 10. Sites and docs agents read
- `llms.txt`, Markdown routes, agent-readiness scores.
Owners: `agent-ready`; `seo`.

## Permissions

Explain and Audit are read-only: reading files and running the repo's own check, test and doctor commands change nothing, so run them freely. Build and Apply edit the working tree and rerun checks until green without asking. A change that loosens a law, a guard's config, an exception list or CI goes to a person for review; adding or tightening one does not.

## Gotchas

- This file is an index. Copying an owner's detail here creates a second copy that drifts; link instead.
- A green audit row needs evidence from this repo at this SHA. Passing because an owner skill exists is the most common false pass.
- Build mode on an existing repo: a new guard that ships red teaches everyone it is noise. List the current offenders per file in the same change, then shrink the list.
- A guard with no planted violation is unproven. The common silent failure is a glob or path that matches nothing and passes forever.
