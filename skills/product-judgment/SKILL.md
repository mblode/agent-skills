---
name: product-judgment
description: Pressure-tests feature requests, priorities, and product direction against customer reality and product coherence. Use when asked "should we build this", "is this worth building", "what problem are we solving", or "challenge this feature idea". For interaction decisions use product-design; for an approved implementation plan use planning.
---

# Product Judgment

Decide which problem deserves solving and which direction earns the investment. Produce a defensible call, including a supported yes, rather than an automatic feature spec or an automatic refusal.

- **IS:** interpreting feature requests, recovering decision context, testing product fit, comparing priorities, and choosing whether and where to invest.
- **IS NOT:** issue-tracker operation, interaction specifications (`product-design`), implementation plans (`planning`), brand identity (`branding`), or routine execution of approved work.

## The stance

- **A request is evidence about a need.** Investigate the work someone is trying to do before accepting their proposed mechanism. The user's explicit instructions still govern this task; do not use this stance to obstruct approved implementation.
- **Product coherence is cumulative.** Prefer improvements that strengthen the core job and reuse understandable concepts. Count the learning, maintenance, and support burden of a feature alongside its initial build cost.
- **Quality is the whole experience.** Judge reliability, recovery, speed, clarity, and usefulness alongside visual craft. Cut scope before breaking the promise of the slice being shipped.
- **Conviction needs contact with reality.** Customer accounts, observed behavior, business constraints, and product vision inform judgment. Request counts and metrics alone do not decide it; taste alone does not establish demand.
- **Restraint should sharpen a yes.** Make the strongest case against an investment, then decide whether it survives. The number of refusals is not a quality metric.

## References

| File | Read when |
|---|---|
| [Evidence and decisions](references/evidence-and-decisions.md) | Recovering historical intent, resolving conflicting evidence, or handing a decision to another person or task |
| [Inspiration and boundaries](references/inspiration.md) | The user invokes Linear, Vercel, or Done Bear, or asks where the method comes from |

`evals/evals.json` contains maintenance scenarios and routing prompts; do not load it during ordinary product work.

## Workflow

### 1. Recover the context that could change the call

Identify the product's audience, core job, current commitments, and constraints from the consuming project. Read [Evidence and decisions](references/evidence-and-decisions.md) when investigating history or competing claims.

Inspect the relevant existing behavior, feedback, past decisions, and code or issue history using available sources. Look for whether the need is already served, whether the behavior was intentional, and what earlier attempts learned. Stop when further retrieval is unlikely to change the decision; do not turn a small request into an exhaustive company audit.

If feedback or historical reasoning is unavailable, name that gap. Lack of a record is not proof that nobody thought about the issue. External essays supply hypotheses, not the consuming project's policies.

### 2. Name the need and the stakes

State who cannot accomplish what, in which situation, and the consequence. Separate the requested solution from that need. Explain what happens if nothing changes and why this deserves attention relative to current work.

Use the product's own promises and refusal boundaries when they exist. If they are absent, label the proposed product assumptions rather than importing another company's target audience or category limits.

### 3. Explore a coherent intervention

Compare materially different directions where the problem warrants it. Consider existing capability or discoverability, a narrower intervention, and doing nothing. When the team is stuck optimizing one solution, explore opposing extremes such as maximum speed versus maximum recoverability, then retain the useful insight rather than averaging arbitrary options.

Make the strongest case against the promising direction: whose workflow worsens, what new concept it introduces, what it displaces, and the ongoing commitment it creates. Explain whether that case changes the recommendation.

Cost uncertainty honestly. A small UI change and a new data or sync model have different consequences. Use estimates only when grounded; do not manufacture engineering days to make a recommendation look precise.

### 4. Make the call and define the next evidence

Recommend the smallest coherent direction that resolves the need, or explain why no investment is justified. Useful calls include:

- **Proceed:** the need and fit are supported; name the scope and the promise this slice must keep.
- **Already served:** verify the existing route and distinguish a discovery problem from missing capability.
- **Investigate:** uncertainty could change the call; name a focused observation, conversation, or experiment and how its result affects the decision.
- **Defer:** another constraint wins now; state a concrete condition for reconsideration.
- **Decline:** the cost or product mismatch outweighs the benefit; explain the unmet need that remains.

Choose the call that fits. Do not force every request into a fixed negative taxonomy. Missing instrumentation may justify collecting evidence; it is not automatically a reason to decline.

Define observable success and failure before implementation. Qualitative evidence is valid when named honestly. Separate feasibility probes from production commitments: a throwaway prototype can help understand a problem without settling the design.

### 5. Leave a useful decision

Lead with the call. Include the underlying need, decisive evidence with sources, strongest objection, chosen scope, and what would change the decision. Omit sections that add no information for a small question.

When asked to save the decision, use the project's established durable location and keep rationale next to the work. Do not silently rewrite doctrine. When implementation is also authorized, carry the decision into the appropriate planning or build workflow without another permission ceremony. Otherwise, finish at the decision.

## Gotchas

- **Customer counts are invented.** A competitor essay or an unreadable feedback store does not establish demand for this product. Separate reports, verified counts, and hypotheses.
- **Contrarianism replaces judgment.** Rejecting good proposals is as unhelpful as accepting weak ones. A supported yes must remain possible.
- **Shipped behavior becomes policy.** Code proves what happens, not what should happen. Investigate the difference between current behavior, intended behavior, and an explicit promise.
- **Historical choices become permanent vetoes.** Recover why a decision was made and whether its constraints still hold. Surface conflicts instead of treating the newest timestamp as unquestionable authority.
- **Research blocks approved work.** An explicit request to implement a settled feature belongs downstream. Raise a newly discovered material conflict, but do not reopen its existence by default.

## Related skills

Use `product-design` for interactions, `planning` for execution, and `branding` for positioning expressed as identity. If a sibling is unavailable, supply a clear handoff without claiming it was executed. This workflow does not require Linear, Done Bear, or any particular connector.
