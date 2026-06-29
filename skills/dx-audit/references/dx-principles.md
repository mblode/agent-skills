# Developer Experience Principles

Principles strong DX teams converge on. Cite the principle a finding serves, not just the defect; judge borderline calls against these.

## 1. Progressive disclosure of complexity

Simplest use is one line; scale to advanced cases without a rewrite. Complexity optional, never required.

## 2. Zero friction from the first moment

No account, payment, or demo call before a working hello-world; early friction loses developers for good.

## 3. Predictable by design

Stable contracts (response shapes, error codes, public signatures); same operation, same shape and error everywhere.

## 4. Fight uncertainty, never leave the developer hanging

Validate at the boundary; fail fast naming the cause, the offending value, the fix, and the next step.

## 5. Decide for me, but let me have the final say

Strong defaults make config optional; keep escape hatches for the cases they miss. Defaults and full control coexist.

## 6. Show code in context, not just a bare hello-world

Copy-pasteable usage that runs teaches faster than prose. This skill checks only that in-context examples and a quickstart exist and run; prose routes to docs-writing, README structure to readme-creator.

## 7. Fast is better than slow

Install, first-run, and response time shape how the tool feels; all else equal, choose the faster.

## 8. Aim for clarity, do not invent terms

Name a thing what it is, the same way everywhere, so the next method is guessable instead of looked up.

## 9. No detail is too small

Every state, edge case, word, and interaction matters; one confusing flag, leaked `any`, or vague error costs trust.

## 10. Build for everyone

Serve all skill levels, languages, runtimes, abilities, machines, and networks via generous defaults and broad compatibility.

## Principle to rule-prefix map

| Principle | Enforced primarily by |
|-----------|-----------------------|
| 1. Progressive disclosure | `onboard-`, `api-`, `config-` |
| 2. Zero friction | `onboard-` |
| 3. Predictable by design | `api-` (stable contract, async consistency), `err-` |
| 4. Fight uncertainty | `err-` |
| 5. Decide for me, final say mine | `config-`, `api-` |
| 6. Code in context | `onboard-` (examples exist and run; prose routes to docs-writing) |
| 7. Fast is better than slow | `onboard-` (minimal install, tree-shakeable bundle), `cli-` |
| 8. Clarity, no invented terms | `api-`, `cli-`, `types-` |
| 9. No detail is too small | every category |
| 10. Build for everyone | `onboard-`, `types-`, `cli-` |
