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

Sits between Task-Aware and Personally Intelligent. Below it, features are commoditized (anyone can build a stateless chatbot or task tracker). Above it, accumulated context is a moat: switching costs rise because the agent knows the user, so the longer it is used the harder it is to leave. Unused product starves that context: no contact, stale help, then replacement.

When auditing, note where the product sits. Below the line: differentiate through execution quality. Above it: make accumulated context visible and portable, or risk trust erosion when users feel locked in.

## Action depth

The four stages are memory. They cannot see an agent that remembers everything and only ever suggests. When the agent takes actions, name the highest rung it actually uses. A Personally Intelligent agent stuck at Tip has plateaued.

1. **Tip:** the user reads a suggestion.
2. **Preview:** evidence, then ask.
3. **Receipt:** it acted, said what changed, undo is one tap.
4. **Maintain:** it keeps the job in order and reports without being asked.
5. **Partner:** it proposes the next job before the user asked.

## Mapping to Rules

Which ax-audit rules matter most at each stage:

| Stage | Key rules |
|---|---|
| Conversational | `control-over-conversational`, `comm-no-progress-signal` |
| Task-Aware | `comm-no-intent-handshake`, `control-no-escape-hatch`, `control-no-approval-gate`, `control-thin-approval-payload`, `trust-no-escalation-path` |
| Personally Intelligent | `context-memory-not-visible`, `context-under-contextual`, `trust-no-confidence-cues`, `trust-no-uncertainty-markers`, `trust-undisclosed-access-scope` |
| Socially Embedded | `context-no-adaptive-canvas`, `comm-no-generative-momentum`, `comm-unrequested-action-no-consent` |

Earlier-stage rules still apply at later stages. A Socially Embedded agent lacking an escape hatch is still a finding. Maintain and Partner rungs without standing consent are `comm-unrequested-action-no-consent`.

## Costume vs intelligence

Feeling intelligent and feeling like AI are different axes. Users already love the top-left. They reject the right edge when chat is bolted onto a tool they already had.

| | Does not wear the costume | Wears the costume |
|---|---|---|
| **Feels intelligent** | Native intelligence. Maps ETA, Discover Weekly, For You. Nobody calls it AI. | Destination AI. ChatGPT, Claude. Fine when chat is the product. |
| **Does not feel intelligent** | Static tool. | Sparkle graveyard. Bolted-on "Ask AI". |

When writing the AX Relationship Summary:

- If chat is the product, destination chrome is fine.
- If chat is bolted onto an existing tool, sparkle, "Ask AI", "How can I help you", or a named persona as the UI is the finding. Put it in `keyGap` or `trustQuestion` when it is the most important gap.
- Thinking dots and token streaming become costume when they are the product, not a way to show work in progress.
- Thumbs up/down as the only feedback is costume, not a trust mechanism.

Strip the interface and the costume has nothing to hang on. What a user recognises across a chat thread, a phone, a voice, and a notification is character. No single finding can carry that. Put it in `keyGap` when the service behaves like a different product in each place, and in `trustQuestion` when only research can tell you whether it does.

## Assessment

To place a design:

- **What persists between sessions?** Nothing = Conversational; task state only = Task-Aware; preferences + history = Personally Intelligent; relationships + org context = Socially Embedded.
- **Does it adapt to individual users?** If two users get identical responses in identical situations, it is at most Task-Aware.
- **Does it act on others' behalf?** If yes, check whether it grasps enough social context to avoid harm.
- **If it takes actions, which rung is the highest it actually uses?** Write that into `evolutionStage.behavior` with the memory stage. Do not add a second field.

Describe behaviors in output, not labels: write "remembers preferences across sessions, acts at Preview," not "Stage 3 product." The framework is for reasoning about depth, not vocabulary.
