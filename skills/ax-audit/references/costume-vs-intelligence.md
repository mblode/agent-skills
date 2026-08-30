# Costume vs Intelligence

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

## When there is no chrome left

Strip the interface and the costume has nothing to hang on, which does not make the brand question go away. It moves. What a user recognises across a chat thread, a phone, a voice, and a notification is character: the tone of a sentence, the restraint of an interruption, the confidence of an approval request, whether the thing admits what it does not know. That is the brand now, and it is design work, but no single finding can carry it.

Two of the summary fields already have room for it:

- `keyGap` when the service behaves like a different product in each place it appears, or when the layer above it cannot reach it at all (see `parity-not-externally-reachable`, whose tier is deliberately lower than its stake).
- `trustQuestion` when only prototyping or research can settle whether the character holds. "Does the agent sound like the same product in a push notification as it does in the chat panel?" is a better question than any rule.
