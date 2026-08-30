# The Invisible Interface

A new step now sits in front of every interface. The user reaches an agent connected to their mail, calendar, files, and accounts, says what they want, and the apps underneath do the work without being looked at. They did not get worse. Nobody is opening them.

Two consequences follow, and four rules in this skill exist because of them. Two further arguments below carry no rule on purpose: they are real, and nothing about them can change a ship verdict, so they belong in the AX Relationship Summary instead. Source: <https://designplusai.com/p/invisible-interfaces>.

## Contents

- [Your user becomes an agent](#your-user-becomes-an-agent)
- [Connectability is distribution](#connectability-is-distribution)
- [Legitimacy, not usability](#legitimacy-not-usability)
- [The three trust surfaces](#the-three-trust-surfaces)
- [Proactive action needs its own consent](#proactive-action-needs-its-own-consent)
- [Where the rules land](#where-the-rules-land)

## Your user becomes an agent

The interface a team polished for years becomes a back end, and its primary caller is software acting for a person. Craft aimed at human perception, hierarchy, contrast, easing, is invisible to a caller that traverses the flow in two hundred milliseconds.

Design does not stop; it changes altitude. The service layer becomes closer to a protocol: legible, structured, operable, and honest about its state. A tool that answers failure with a sentence and a 200 is not honest about its state, and every capability built above it is guessing.

## Connectability is distribution

The best product interface in the world still loses if the layer where the user lives cannot reach it. Being connectable becomes as existential as being usable. Distribution stops being a spot on the home screen and becomes being trusted, integrated, and preferred by the interface above you.

This is a strategic gap, not a user-harm gap, and it gets no rule. A rule for it would sit at `backlog` on every surface, since no PR should ever be blocked on it, and a finding that can never change a verdict is documentation wearing a rule's costume. Raise it in `keyGap` instead, where it belongs and where it is often the most important thing to say about the product.

The app is one form the service takes, and possibly not the most important one. The same service shows up on a laptop, a phone, a TV, inside a conversation, and as a voice, and what makes those one product is character rather than chrome: the tone of a sentence, the restraint of a notification, the confidence of an approval request. There is no rule for that. It belongs in the AX Relationship Summary, in `keyGap` when the service behaves like a different product in each place it appears, and in `trustQuestion` when only research can tell you whether it does.

## Legitimacy, not usability

The loudest question asked of every product in this category is not how easy it is. It is what it can access, what it stores, and what it does when nobody is watching. A product that reads a person's mail and spends their money has a legitimacy problem before it has a usability problem, and no amount of interface quality answers it.

The audit form of that question is narrow and checkable: can the user see what the agent can reach, in their own terms, and take one piece of it back without disconnecting everything.

## The three trust surfaces

With the interface gone, the old trust signals go with it. The confirmation screen, the progress bar, the padlock, the receipt: all of them were visual because the visual layer was all there was. What remains concentrates into three places.

**How the agent communicates.** Tone, honesty, restraint. Whether it admits what it does not know and asks before it assumes. Every sentence is a design decision, and the conversation is the brand.

**How it shows its work.** Not a wall of logs. The reassuring sense that the work is visible whenever you care to look, which means a summary with the detail one level down. `comm-no-progress-signal` catches the too-little end. The too-much end gets no rule: judging a trace unreadable needs the rendered flow, so a rule for it could only ever return `unknown` on static evidence, and it would sit at `backlog` anyway. When a run panel is a raw token and tool-call dump with no summary layer, say so in `keyGap`.

**The approval moment.** The brief flash where an interface does appear, right before an action is taken. It has to carry exactly enough context for a confident yes or no. The fewer pixels remain, the more each one weighs, which makes a gate that names the tool and hides its arguments a click-through wearing a gate's clothes.

## Proactive action needs its own consent

The layer in front does not wait for input. It reads context, anticipates, acts, and checks in when it should. Every approval pattern in this skill assumes a user-initiated turn, and a scheduled or triggered run reaches the same executor with nobody at the keyboard.

An action nobody requested cannot borrow permission from a request. It needs a boundary agreed in advance and a notice afterwards the user can act on. This is the safety cost of the Maintain and Partner rungs in the action-depth ladder, and a product climbing them without paying it is the one that archives forty documents at 3am.

## Where the rules land

| Argument | Rule |
|---|---|
| The tool surface is a protocol, honest about its state | `rules-arch/parity-unstructured-tool-output` |
| Connectability is existential | No rule; `keyGap` |
| The approval moment carries the decision | `rules-ax/control-thin-approval-payload` |
| Legitimacy: what can it reach | `rules-ax/trust-undisclosed-access-scope` |
| Proactive action needs standing consent | `rules-ax/comm-unrequested-action-no-consent` |
| Considered transparency, not a log wall | No rule; `keyGap` |
| Character across surfaces | No rule; `keyGap` and `trustQuestion` in the AX summary |
