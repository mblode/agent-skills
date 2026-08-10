# Sections: Agentic Experience (Layer 2)

This file defines the 4 categories of agentic experience audit rules. Each rule file uses one of these category prefixes.

---

## 1. Trust & Transparency (trust)

**Default tier:** mostly fix-this-sprint; release-blocker for missing escalation paths
**Why critical:** Users won't trust an agent, even when it's right, unless they can see why it decided what it did. Confident wrong answers without uncertainty markers or escalation paths cause permanent trust damage that future accuracy can't recover. The same damage arrives from the other direction when the agent has no way to stop: with every path ending in an action, a request it cannot serve becomes a speculative one that reads exactly like a real answer.

## 2. Control & Recovery (control)

**Default tier:** release-blocker for missing escape hatches; fix-this-sprint for over-conversational
**Why critical:** Autonomy without exit is coercion. Every agent action needs a visible path to undo, revise, or override. The approval model must match the stakes and reversibility of the action. Chat-only interfaces for button-worthy actions waste user time and patience.

## 3. Context & Memory (context)

**Default tier:** mostly fix-this-sprint to backlog
**Why critical:** Agents that don't show what they remember feel opaque. Agents that don't use available context feel stupid. Interfaces that don't reshape with task progression feel static. All three erode the relationship depth that makes agent products defensible.

## 4. Agent Communication (comm)

**Default tier:** release-blocker for silent execution; fix-this-sprint for missing handshake; backlog for missing drafts
**Why critical:** Silent agents feel broken. The communication contract between agent and user (progress signals, intent confirmation, and generative momentum) is the difference between a tool that works and a black box.

---

## Rule index

```
trust-no-confidence-cues          trust-no-uncertainty-markers      trust-no-escalation-path
trust-no-refusal-path
control-no-escape-hatch           control-no-approval-gate          control-over-conversational
context-memory-not-visible        context-no-adaptive-canvas        context-under-contextual
comm-no-intent-handshake          comm-no-progress-signal           comm-no-generative-momentum
```

Total: 13 rules.

---

## Cross-rule interactions

These pairings often co-fire on the same surface:

- **no-confidence-cues + no-uncertainty-markers**: both address "why should I trust this." Different targets: rationale vs. hedging.
- **no-uncertainty-markers + no-refusal-path**: a spectrum, not a pair. Hedging is for an answer worth giving with a caveat; refusal is for one not worth giving. Report the refusal finding when the agent completed an action it had no safe path to, and the hedging finding when the answer was fine but rendered as certain.
- **no-refusal-path + no-escalation-path**: escalation is the stronger fix and supersedes refusal where a human queue exists. On a surface with no one to escalate to, refusal is the whole remedy; do not report both as separate work.
- **no-escape-hatch + no-approval-gate**: for autonomous actions, both fire. Approval gate may partially satisfy escape hatch.
- **no-progress-signal + no-intent-handshake**: long-running tasks that didn't confirm scope AND show no progress are doubly opaque.
- **memory-not-visible + under-contextual**: complementary. One says the agent knows things the user can't see; the other says it doesn't know things it should.
- **over-conversational + no-generative-momentum**: paradoxical pairing. Forcing chat where buttons would do, while failing to offer drafts where blanks would benefit.
