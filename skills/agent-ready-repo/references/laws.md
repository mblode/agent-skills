# Laws

## Contents

- What a law is
- Where laws live
- Choosing the checker
- Writing a law
- Censuses and planted mutants
- Review
- Limits

## What a law is

A law is an invariant stated in plain words and backed by a check that explores many states rather than one example. It sits above "make it impossible" on the ladder because it covers what types cannot express: ordering, concurrency, convergence, and properties that hold across every input.

The idea comes from Bend (bend-lang.com), whose `LAWS.bend` is an AGENTS.md backed by proof, and from Boris Cherny's use of Lean and TLA+ to find race conditions. The payoff for a repo agents work in: humans review a short list of laws, and agents change the implementation freely underneath, because the checker rejects any change that breaks a law.

## Where laws live

- `LAWS.md` at the repo root: one line per law in plain words, each linking the check that backs it. AGENTS.md links `LAWS.md` and does not restate it.
- fast-check properties beside the module: `<module>.laws.test.ts`, run by the normal test command.
- TLA+ specs in `specs/<name>.tla` with `specs/<name>.cfg`, checked by TLC in CI.
- Lean proofs in `proofs/`, built with `lake build` in CI.

## Choosing the checker

| Checker | Default for | Cost | Example laws in our stack |
|---|---|---|---|
| fast-check property tests | Most laws: pure functions, reducers, parsers, idempotency, tenant isolation | Minutes to write; runs in the unit suite | "No query inside `withTenant(a)` returns a row of tenant `b`" (generate two tenants and random operations against PGlite); "applying a durable workflow step twice with one idempotency key has the effect of applying it once"; "rubric scores stay within their bounds for any rubric and answer" |
| TLA+ with TLC | Concurrency and state machines, where the bug is an interleaving | Hours; a model to maintain | A sync engine: every client converges to the server sequence under reordering and reconnects. Merge train: never merges a PR whose proof SHA differs from its head; the revert lane runs first; no two merges interleave in one repo. Durable workflows: a step's side effect happens at most once across crashes |
| Lean | Pure logic where a proof is worth more than sampling | Days; needs someone who reads Lean | Scoring or moderation arithmetic that money or grades depend on |

Start with fast-check. Reach for TLA+ when the failure needs two actors and a bad ordering to appear, since random tests rarely hit the interleaving. Reach for Lean rarely.

## Writing a law

1. State it in one sentence a reviewer can judge without reading code.
2. Write the check so it fails on a planted violation first, as with any guardrail. A property that passes on broken code is testing nothing.
3. Keep TLA+ models small: the states and actions that matter to the law, not a port of the implementation. Record in the spec header which code it models.
4. Tie the model to the code where possible: share the state machine's transition table between the implementation and a fast-check property, or replay recorded traces against the spec, so model and code drift is caught.
5. Put the command that runs it in CI and in `LAWS.md` next to the law.

## Censuses and planted mutants

Some promises are about the repo rather than one module: every app has a test or a reason, no deploy config lets git deploy main, every path a skill names exists, every CI gate blocks. Write each as a census: a script that walks the files and checks the promise everywhere, run by `check` when fast and nightly when not.

- Pair each census with a planted mutant: a fixture that breaks the promise and must fail the census. A census that passes its mutant checks nothing.
- Each claim in a census cites the file and line it read, so a refactor that moves the code fails the citation rather than leaving a stale pass.
- Never weaken a property, shrink a model, delete a mutant or widen a census exception to get green. Accept a new baseline only after re-reading the code it describes.
- State what a census does not prove. An intent trace that maps each request to a proof file proves the file exists, not that it proves the request.

## Review

Changes to `LAWS.md`, `specs/**`, `proofs/**`, censuses and `*.laws.test.ts` always need a person's review (CODEOWNERS or a ruleset). A builder that needs to weaken a law to pass is asking a human to change the product's guarantees; that is the one review the human always does. The implementation under a law can merge on a normal proof.

## Limits

- A law covers only what it states. Unstated behaviour is unchecked, however green the run.
- A TLA+ model is not the code. TLC proves the model; drift between model and implementation is a separate risk that trace replay or shared transition tables reduce but do not remove.
- fast-check samples; it does not prove. Shrinking finds minimal failures well, but a passing run is evidence, not proof. Pin the seed of any failure it finds as a regular test.
- TLC explores a bounded model. State the bounds (number of clients, queue length) in the spec so a reader knows what was checked.
