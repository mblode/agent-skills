# Sections: Agentic Experience (Layer 2)

This file defines the 4 categories of agentic experience audit rules. Each rule file uses one of these category prefixes.

---

## 1. Trust & Transparency (trust)

**Default tier:** mostly fix-this-sprint; release-blocker for missing escalation paths
**Why critical:** Users won't trust an agent even when it's right unless they can see why it decided what it decided. Confident wrong answers without uncertainty markers or escalation paths cause permanent trust damage that no amount of future accuracy recovers.

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
control-no-escape-hatch           control-no-approval-gate          control-over-conversational
context-memory-not-visible        context-no-adaptive-canvas        context-under-contextual
comm-no-intent-handshake          comm-no-progress-signal           comm-no-generative-momentum
```

Total: 12 rules.

---

## Cross-rule interactions

These pairings often co-fire on the same surface:

- **no-confidence-cues + no-uncertainty-markers**, Both address "why should I trust this." Different targets: rationale vs. hedging.
- **no-escape-hatch + no-approval-gate**: For autonomous actions, both fire. Approval gate may partially satisfy escape hatch.
- **no-progress-signal + no-intent-handshake**: Long-running tasks that didn't confirm scope AND show no progress are doubly opaque.
- **memory-not-visible + under-contextual**, Complementary: one says the agent knows things the user can't see; the other says it doesn't know things it should.
- **over-conversational + no-generative-momentum**, Paradoxical pairing: forcing chat where buttons would do, while failing to offer drafts where blanks would benefit.
