# AX Evolution Curve

A 4-stage model for evaluating how deep the relationship between user and agent is in a given design. Used during audit to calibrate expectations: a Conversational agent missing memory features is fine; a Personally Intelligent agent missing memory visibility is a finding.

## The Four Stages

### 1. Conversational

Every interaction starts from scratch. No memory, no context from prior sessions. User must re-explain everything each time.

Behavior: a chatbot that forgets everything on page refresh. User says "like I mentioned earlier" and the agent has no idea what they mean.

### 2. Task-Aware

Watches and adjusts in the moment. Understands current task state, tracks multi-step progress, reacts to what is happening now. Forgets between sessions.

Behavior: an agent that sees your current document and makes suggestions, but does not know your preferences or recall past decisions.

### 3. Personally Intelligent

Remembers preferences and history across sessions. Accumulates context over time, adapts to user patterns, gets better with use.

Behavior: an agent that knows you prefer concise answers, remembers your project conventions, recalls decisions from three weeks ago.

### 4. Socially Embedded

Understands role, team, and cultural context. Speaks on behalf of the user to others, manages cross-team communication, navigates organizational dynamics.

Behavior: an agent that drafts messages to your team in your voice, understanding who needs what context and how to frame requests for different audiences.

## The Defensibility Line

The defensibility line sits between Task-Aware and Personally Intelligent. Below it, features are commoditized: anyone can build a stateless chatbot or a task tracker. Above it, accumulated context creates a moat. Switching costs increase because the agent knows the user. The longer someone uses the product, the harder it is to leave.

When auditing, note where a product sits relative to this line. Products below it need differentiation through execution quality. Products above it need to make accumulated context visible and portable (or risk trust erosion when users feel locked in).

## Mapping to Rules

Which ax-audit rules matter most at each stage:

| Stage | Key rules |
|---|---|
| Conversational | `control-over-conversational`, `comm-no-progress-signal` |
| Task-Aware | `comm-no-intent-handshake`, `control-no-escape-hatch`, `control-no-approval-gate`, `trust-no-escalation-path` |
| Personally Intelligent | `context-memory-not-visible`, `context-under-contextual`, `trust-no-confidence-cues`, `trust-no-uncertainty-markers` |
| Socially Embedded | `context-no-adaptive-canvas`, `comm-no-generative-momentum` |

Rules from earlier stages still apply at later stages. A Socially Embedded agent that lacks an escape hatch is still a finding.

## Assessment

To determine which stage a design sits at:

- **What persists between sessions?** Nothing = Conversational. Task state only = Task-Aware. User preferences and history = Personally Intelligent. Relationships and organizational context = Socially Embedded.
- **Does the agent adapt to individual users?** If two different users get identical responses in identical situations, the agent is at most Task-Aware.
- **Does the agent interact with other people or systems on behalf of the user?** If yes, evaluate whether it understands enough social context to do so without causing harm.

Describe behaviors in audit output, not labels. Write "the agent remembers preferences across sessions" rather than "this is a Stage 3 product." The framework is for reasoning about depth, not for vocabulary.
