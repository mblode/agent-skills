# AX Evolution Curve

A 4-stage model for how deep the user-agent relationship is in a design. Calibrates audit expectations: a Conversational agent missing memory is fine; a Personally Intelligent one missing memory visibility is a finding.

## The Four Stages

### 1. Conversational

Starts from scratch every time: no memory across sessions, the user re-explains everything. Behavior: a chatbot that forgets on refresh; "like I mentioned earlier" means nothing to it.

### 2. Task-Aware

Watches and adjusts in the moment: tracks current task state and multi-step progress, reacts to now. Forgets between sessions. Behavior: sees your current document and suggests, but does not know your preferences or recall past decisions.

### 3. Personally Intelligent

Remembers preferences and history across sessions: accumulates context, adapts to patterns, gets better with use. Behavior: knows you prefer concise answers, remembers your conventions, recalls decisions from weeks ago.

### 4. Socially Embedded

Understands role, team, and cultural context: speaks for the user to others, manages cross-team comms, navigates org dynamics. Behavior: drafts messages to your team in your voice, knowing who needs what context and how to frame requests for each audience.

## The Defensibility Line

Sits between Task-Aware and Personally Intelligent. Below it, features are commoditized (anyone can build a stateless chatbot or task tracker). Above it, accumulated context is a moat: switching costs rise because the agent knows the user, so the longer it is used the harder it is to leave.

When auditing, note where the product sits. Below the line: differentiate through execution quality. Above it: make accumulated context visible and portable, or risk trust erosion when users feel locked in.

## Mapping to Rules

Which ax-audit rules matter most at each stage:

| Stage | Key rules |
|---|---|
| Conversational | `control-over-conversational`, `comm-no-progress-signal` |
| Task-Aware | `comm-no-intent-handshake`, `control-no-escape-hatch`, `control-no-approval-gate`, `trust-no-escalation-path` |
| Personally Intelligent | `context-memory-not-visible`, `context-under-contextual`, `trust-no-confidence-cues`, `trust-no-uncertainty-markers` |
| Socially Embedded | `context-no-adaptive-canvas`, `comm-no-generative-momentum` |

Earlier-stage rules still apply at later stages. A Socially Embedded agent lacking an escape hatch is still a finding.

## Assessment

To place a design:

- **What persists between sessions?** Nothing = Conversational; task state only = Task-Aware; preferences + history = Personally Intelligent; relationships + org context = Socially Embedded.
- **Does it adapt to individual users?** If two users get identical responses in identical situations, it is at most Task-Aware.
- **Does it act on others' behalf?** If yes, check whether it grasps enough social context to avoid harm.

Describe behaviors in output, not labels: write "remembers preferences across sessions," not "Stage 3 product." The framework is for reasoning about depth, not vocabulary.
