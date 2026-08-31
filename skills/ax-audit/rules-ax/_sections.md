# Sections: Agentic Experience (Layer 2)

This file defines the 4 categories of agentic experience audit rules. Each rule file uses one of these category prefixes.

---

## 1. Trust & Transparency (trust)

**Default tier:** mostly fix-this-sprint; release-blocker for missing escalation paths
**Why critical:** Users won't trust an agent, even when it's right, unless they can see why it decided what it did. Confident wrong answers without uncertainty markers or escalation paths cause permanent trust damage that future accuracy can't recover. Disclosure is part of trust, not just explanation: a user who cannot see what the agent can reach has no way to judge whether to keep it connected.

## 2. Control & Recovery (control)

**Default tier:** release-blocker for missing escape hatches; fix-this-sprint for over-conversational
**Why critical:** Autonomy without exit is coercion. Every agent action needs a visible path to undo, revise, or override. The approval model must match the stakes and reversibility of the action. Chat-only interfaces for button-worthy actions waste user time and patience. As the interface shrinks the approval moment carries more weight, so a gate that fires correctly and shows nothing to decide on is a click-through, not a control.

## 3. Context & Memory (context)

**Default tier:** mostly fix-this-sprint to backlog
**Why critical:** Agents that don't show what they remember feel opaque. Agents that don't use available context feel stupid. Interfaces that don't reshape with task progression feel static. All three erode the relationship depth that makes agent products defensible.

## 4. Agent Communication (comm)

**Default tier:** release-blocker for silent execution; fix-this-sprint for missing handshake; backlog for missing drafts
**Why critical:** Silent agents feel broken. The communication contract between agent and user (progress signals, intent confirmation, and generative momentum) is the difference between a tool that works and a black box. The contract also covers the turns the user did not start: an agent that acts on a schedule cannot borrow permission from a request that never happened, so unprompted action blocks on a standing boundary plus a notice the user can act on.

---

## Rule index

```
trust-no-confidence-cues          trust-no-uncertainty-markers      trust-no-escalation-path
trust-undisclosed-access-scope
control-no-escape-hatch           control-no-approval-gate          control-over-conversational
control-thin-approval-payload
context-memory-not-visible        context-no-adaptive-canvas        context-under-contextual
comm-no-intent-handshake          comm-no-progress-signal           comm-no-generative-momentum
comm-unrequested-action-no-consent
```

Total: 15 rules.

---

## Cross-rule interactions

These pairings often co-fire on the same surface:

- **no-confidence-cues + no-uncertainty-markers**: both address "why should I trust this." Different targets: rationale vs. hedging.
- **no-escape-hatch + no-approval-gate**: for autonomous actions, both fire. Approval gate may partially satisfy escape hatch.
- **no-progress-signal + no-intent-handshake**: long-running tasks that didn't confirm scope AND show no progress are doubly opaque.
- **memory-not-visible + under-contextual**: complementary. One says the agent knows things the user can't see; the other says it doesn't know things it should.
- **over-conversational + no-generative-momentum**: paradoxical pairing. Forcing chat where buttons would do, while failing to offer drafts where blanks would benefit.
- **no-approval-gate + thin-approval-payload**: sequential, not simultaneous. The first asks whether the treatment matches the stakes, the second whether the prompt carries enough to decide. A surface with no gate at all is the first finding only; the second has nothing to inspect until a gate exists.
- **undisclosed-access-scope + memory-not-visible**: what the agent can reach versus what it has kept. Different disclosures, so file both when both fail, each with its own evidence. Merging them hides whichever the team did not think of.
- **unrequested-action-no-consent + no-escape-hatch**: an unattended run's notice is the only place an escape hatch can appear after the fact. If the notice is missing, report the consent finding; the escape-hatch fix has nowhere to attach until the user is told the action happened.
