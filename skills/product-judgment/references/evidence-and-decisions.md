# Evidence and Decisions

Read when investigating why a product works as it does, reconciling accounts, or preserving a decision for later work.

## Recover the why without inventing it

Start with the actual behavior and the source most likely to explain it: linked issues, design proposals, decision records, support conversations, or the relevant commit and pull request history. Follow a consequential lead rather than reading the whole repository.

Distinguish four things:

| Kind | What it can establish |
|---|---|
| Current behavior | What the product actually does, verified by code or observation |
| Recorded intent | Why an identifiable decision was made, with a source and date |
| Customer signal | What a person reported or did, with scope and limits |
| Inference | A plausible explanation that has not been established |

Authorship does not prove decision ownership. A commit author may implement another person's decision. If asked who decided something, distinguish authors, reviewers, and the person explicitly recorded as deciding.

Newer documents may supersede older ones, but dates alone do not resolve authority. Check whether the decision was approved, implemented, withdrawn, or still proposed. A public promise creates an expectation; it is not proof that the capability exists.

If sources disagree, state the conflicting claims and how each affects the call. Keep the user's current instruction and verified evidence visible instead of averaging conflicting doctrines into a fictional consensus.

## Match evidence to the decision

A few requests can reveal a problem without establishing prevalence. A frequent behavior can signal friction or deliberate preference. State the interpretation separately from the observation.

When demand cannot be read, say so. Do not use competitor feedback as this product's feedback. For expensive or difficult-to-reverse decisions, resolve the uncertainty most likely to reverse the choice before increasing commitment. A reversible exploration can proceed with less evidence when its learning purpose and cost are explicit.

Do not claim access to an issue tracker, feedback store, analytics service, or company history simply because the product uses it. Use whatever authorized sources are available and make missing coverage explicit.

## Keep a decision useful after this conversation

If the user asks for a durable decision record, follow the project's existing format. Include enough for a future teammate to recover:

- the call, date, and whether it is proposed or accepted;
- the need and evidence that mattered;
- alternatives and the strongest objection;
- the scope, expected outcome, and observation that would change the call.

Link back to primary evidence and the work affected. Do not turn an agent recommendation into an approved company decision, invent an owner, or write to external systems without the user's authorization.
