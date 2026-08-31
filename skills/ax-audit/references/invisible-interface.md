# The Invisible Interface

The user reaches an agent connected to their mail, calendar, files, and accounts. The apps underneath do the work without being looked at. Four rules in this skill exist because of that. Three further arguments carry no rule: they are real, and nothing about them can change a ship verdict, so they belong in `keyGap` or `trustQuestion`. Source: <https://designplusai.com/p/invisible-interfaces>.

## Contents

- [What the four rules catch](#what-the-four-rules-catch)
- [What stays in the AX summary](#what-stays-in-the-ax-summary)
- [Where the arguments land](#where-the-arguments-land)

## What the four rules catch

The service layer is closer to a protocol than a screen: legible, structured, operable, and honest about its state. A tool that answers failure with a sentence and a 200 is not honest, and every capability above it is guessing (`parity-unstructured-tool-output`).

The approval moment is one of the few surfaces left. It has to carry enough of the act for a confident yes or no. A gate that names the tool and hides its arguments is a click-through (`control-thin-approval-payload`).

Legitimacy is what the agent can reach, what it keeps, and what it does when nobody is watching. The checkable form: the user can see the grants in their own terms and take one back without disconnecting everything (`trust-undisclosed-access-scope`).

An action nobody requested cannot borrow permission from a request. Scheduled and triggered runs need a boundary agreed in advance and a notice afterwards the user can act on (`comm-unrequested-action-no-consent`). That is the safety cost of the Maintain and Partner rungs.

## What stays in the AX summary

**Connectability.** The best interface still loses if the layer where the user lives cannot reach it. That is a strategy gap, not a user-harm gap. A rule for it would sit at `backlog` on every surface and never change a verdict. Raise it in `keyGap`.

**Considered transparency.** `comm-no-progress-signal` catches showing too little. Showing too much (a raw token and tool-call dump with no summary) needs the rendered flow, so a rule for it could only return `unknown` on static evidence. Say so in `keyGap`.

**Character across surfaces.** Tone, restraint, and whether the thing admits what it does not know. No rule. `keyGap` when it behaves like a different product in each place; `trustQuestion` when only research can tell.

## Where the arguments land

| Argument | Lands in |
|---|---|
| The tool surface is a protocol, honest about its state | `rules-arch/parity-unstructured-tool-output` |
| The approval moment carries the decision | `rules-ax/control-thin-approval-payload` |
| Legitimacy: what can it reach | `rules-ax/trust-undisclosed-access-scope` |
| Proactive action needs standing consent | `rules-ax/comm-unrequested-action-no-consent` |
| Connectability is existential | No rule; `keyGap` |
| Considered transparency, not a log wall | No rule; `keyGap` |
| Character across surfaces | No rule; `keyGap` and `trustQuestion` |
