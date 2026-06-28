# Developer Experience Principles

The recurring principles strong DX teams converge on. Each rule in this skill enforces one or more of them, so cite the principle a finding serves, not just the mechanical defect. When a call is borderline, judge it against these.

## 1. Progressive disclosure of complexity

A tool should be approachable for a beginner and powerful for an expert at the same time. The simplest use should take as little as one line, and the same surface should scale to sophisticated cases without a rewrite. Let the developer take incremental steps and learn by doing: capability grows gradually as needs grow, never in one cliff that demands a rewrite to move from simple to advanced. Make complexity available, never required.

## 2. Zero friction from the first moment

Nothing should stand between the developer and a working hello-world: no account, no payment, no demo call, no multi-step verification first. The path from hello-world to production should be minutes, not days. The first attempt has to succeed quickly, because a developer who hits friction early rarely comes back. The onboarding is the first impression.

## 3. Predictable by design

Contracts stay stable: response shapes, error codes, and public signatures keep working and do not change without notice. The same kind of operation returns the same kind of shape and the same kind of error everywhere. Predictability is what lets a developer build on you without re-reading the source each time.

## 4. Fight uncertainty, never leave the developer hanging

When something fails, the message names the cause and the offending value, suggests the fix, and points at the next step. Validate at the boundary and fail fast, while there is still enough context to be specific. A developer should never be left staring at a failure with no idea why or what to do.

## 5. Decide for me, but let me have the final say

Ship strong, sensible defaults so configuration is optional, and pair them with escape hatches for the cases the defaults do not fit. The common path should need no config; the advanced path should never be walled off. Opinionated defaults and full control are not opposites.

## 6. Show code in context, not just a bare hello-world

Real, copy-pasteable usage that runs as written teaches an API faster than prose. The runnable examples are part of the product, not an afterthought, so they must run as written and stay current with the surface. This skill checks only that runnable in-context examples and a quickstart exist and actually work, because they are a primary DX touchpoint; it does not judge the surrounding prose. Prose quality is the job of docs-writing and README structure the job of readme-creator; verify the examples run, then route prose and structure out.

## 7. Fast is better than slow

Speed is a feature: install time, first-run time, and response time all shape how the tool feels. When two designs are otherwise equal, choose the one that is faster for the developer, even when it is harder to build. Slowness is a tax paid on every use.

## 8. Aim for clarity, do not invent terms

Call a thing what it is and name it the same way everywhere. Consistent, unsurprising naming lets a developer guess the next method correctly instead of looking it up. Novel vocabulary for ordinary concepts is friction, not sophistication.

## 9. No detail is too small

Care about every state, edge case, word, and interaction in the developer-facing surface, and own it end to end. A single confusing flag, a leaked `any`, or a vague error chips away at trust. The sum of small, well-handled details is what creates the magical moments that make one tool feel an order of magnitude better than another; craft is the difference between adequate and delightful.

## 10. Build for everyone

Account for different skill levels, languages, runtimes, abilities, machines, and networks. Generous defaults, broad compatibility, and documentation that serves beginners as well as experts widen who can succeed. The audience is larger and more varied than the maintainers.

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
