---
name: tone-of-voice
description: Writes messages, emails, posts, comments, and tickets in the user's own tone of voice, with per-platform voice profiles for Slack, email, WhatsApp, LinkedIn, and Linear built from the user's real message and ticket history, plus a strategy layer (asks, declines, delicate framing, bad news) for messages that need to land. Routes to the right register and enforces an anti-AI-tells self-check. Ships a fictional demo persona so it works out of the box; the user swaps in their own voice files. Use when asked to "write this in my voice", "draft a Slack message", "reply to this email as me", "write a LinkedIn post", "send a WhatsApp message", "write a Linear ticket", "turn this into Linear issues", "make this sound like me", "ghostwrite this", "critique my draft", "will this land", or "help me say no to this". For marketing or product copy in a brand voice, use copywriting; for long-form articles and essays, use blog-post.
---

# Tone of Voice

Draft outgoing communication that is indistinguishable from what you would actually write. Each platform has a voice file of rules and verbatim excerpts: yours once you add them, the bundled demo persona until you do. Always read the matching voice file before drafting; never draft from this file alone.

**Default prompt for every draft: shorter, simpler, more natural.** When two phrasings both fit, pick the one with fewer words, plainer vocabulary, and a more human cadence. This overrides any pull toward completeness or polish.

A draft that reads as already-tight usually isn't. Try halving the word count, then return the shortest version that keeps every fact, link, and the intent.

- **IS:** drafting Slack, email, WhatsApp, and LinkedIn messages, posts, and comments and Linear tickets in your personal voice, as you, and critiquing or coaching a message before it goes out.
- **IS NOT:** marketing or product copy in a brand voice (use `copywriting`), long-form articles or essays (use `blog-post`), or editing the excerpts themselves (they are ground-truth data; see `references/refreshing.md`).

Two layers, applied together: the **voice layer** (this file plus the platform references) makes it sound like you; the **strategy layer** (`references/strategy.md`) makes it land when the message has stakes. Voice always wins a conflict: a strategically perfect draft that no longer sounds like you is a failure.

## Contents

- Make it yours
- Modes
- Core voice DNA
- Words and patterns to cut (including frontier-model tells)
- Workflow, and intent routing
- Rewrite example
- Platform routing and differences
- Reference Files
- Final self-check
- Gotchas

## Make it yours

This skill ships a **fictional demo persona** ("Sam", a Melbourne-based senior engineer and indie builder) as the bundled `references/*.md`, so it works immediately after install. To make it write in *your* voice, put your own per-platform files in **`~/.config/tone-of-voice/`**:

1. Create the folder: `mkdir -p ~/.config/tone-of-voice`.
2. Start with the one platform you write most (`slack.md`, `email.md`, `whatsapp.md`, `linkedin.md`, or `linear.md`); add the others when you need them. Any platform without your own file keeps using the demo, so you never have to build all five at once. Start each from the bundled demo of the same name (copy its structure) and replace the rules and excerpts with your own, following `references/refreshing.md`.

That's it. Your files live outside the repo and outside the managed install directory, so they survive every upgrade and are never published.

Swapping in your voice files changes the persona slots (opener, laugh token, sign-off, spelling, fingerprint words), not the rules. The anti-AI-tells list, the default toward shorter and plainer, and the strategy layer are the opinionated core of this skill and apply to every voice it writes in. If a draft is in your voice but full of tells, it failed.

At drafting time, read `~/.config/tone-of-voice/<platform>.md` if it exists; otherwise fall back to the bundled `references/<platform>.md` (the demo persona).

## Modes

Pick from the request; when ambiguous, default to draft (no existing text) or rewrite (existing text supplied).

- **Draft** (default): write the message from what the user gives you.
- **Rewrite** ("make this sound like me"): keep every fact, link, and intent; change only the prose. After the rewrite, list 3-5 "what changed and why" items, each tied to a named rule. Needing more than 5 means the draft needed a structural rethink, not edits: say so and restructure.
- **Critique** ("will this land", "does this sound like me", "review before I send"): diagnose, don't rewrite. Output: what's working (1-2 specifics), what's not landing (2-4 issues, each tied to a named voice or strategy rule), the real problem (one sentence), suggested path (one short paragraph). Offer to do the rewrite.
- **Coach** ("how do I say...", or a high-stakes message with no draft): before drafting, ask 1-2 sharp questions together, not one at a time (what does the reader need to do after reading this? which objection are you most worried about?). Skip straight to drafting if the context already answers them.

## Core voice DNA (all platforms)

Opinionated defaults, not a menu. Most of what follows is not taste, it is what stops a draft reading as AI, and it holds whoever you are: the point first, concrete specifics over abstraction, warmth carried by punctuation rather than length, no em dashes, and a real take. Keep those. Only the persona slots are yours to swap once you add your voice files: the opener, the laugh token, the sign-off, the spelling convention, and the fingerprint words.

1. **Warm, direct, fast.** The point is in the first line. No throat-clearing, no "I hope this finds you well", no "Just circling back".
2. **"Hey" + first name** is the default opener everywhere ("Hey Sarah,", "Hey, would I be able to..."). "Hi" only for unfamiliar/support contexts.
3. **Exclamation marks carry the warmth.** Doubles signal genuine enthusiasm: "Thank you!!", "Congrats!!", "Awesome!!", "No worries!!". Info gets a full stop; reactions get a "!".
4. **Light emoji, usually one, at the end of a line.** Common: 😊 🙌 🚀 💪 ❤️ 👍 🎉 😅. Frequency varies by platform (see routing table). Emoji attach to wins, thanks, and social warmth, never to bug reports or neutral facts. Never multiple emoji scattered through every sentence.
5. **"Haha" is the laugh**, escalating to "Hahaha". Never "lol", rarely 😂 in chat.
6. **Concrete specifics and numbers over abstraction.** "20 tickets in the past 24 hours", "31 hand-labelled test cases", "$50 for 30 minutes", "1.7k stars". If a claim has no number or detail, it reads as not-you.
7. **Generous named credit.** Thanks hosts, organisers, and collaborators by name; tags them. Compliments are specific, not generic.
8. **Polite-direct requests:** "Hey, would I be able to get a review on <link>", "Would you be able to...". Follow-ups are light: "Hey just bumping <link>", "No rush".
9. **Signature confirmations:** "Perfect, ...", "Easy, ...", "All good", "Gotcha", "Definitely keen", "Keen to...". Chat replies often open with "Yeah" + agreement + an extension ("Cool yeah that makes sense, what were you thinking specifically?"). "Keen" is a fingerprint word. Match your own spelling convention (the demo persona uses Australian English: organise, colour, favourite).
10. **Drops plain links liberally.** URLs inline without markdown dressing or "click here".
11. **Never em dashes, and never a spaced hyphen ( - ) standing in for one.** They are an AI tell. Use commas, colons, or parentheses instead; a colon is the usual fix when the dash was introducing an elaboration.
12. **Never over-balanced "manicured" sentences** or a tacked-on snappy verdict ("That's a good deal."). The sentences are a bit loose and human, sometimes with a missing comma or a casual run-on.

## Words and patterns to cut (all platforms)

These are the AI tells that most often leak into a draft. Strip them before anything else:

- **Banned words:** delve, leverage, robust, seamless, pivotal, intricate, unlock, empower, facilitate, testament to, underscores, cutting-edge.
- **Banned crutches and clichés:** "moreover", "furthermore", "that said", "in conclusion", "when it comes to", "in today's", "let's dive in", "belt and suspenders", "honest caveat". Use "and"/"but"/"also" or just restructure.
- **Cut hedges and hollow intensifiers:** "perhaps", "it's worth noting", "to be clear", "genuinely", "truly". Make the point instead.
- **Never announce honesty:** "honestly", "to be honest", "one honest note". Labelling one line honest implies the rest isn't. The fix is deletion, not rephrasing.
- **No performative praise labels:** "that's the kind of thinking we look for", "X stuck with us", "we loved", "exactly the shape we want". State the specific observation and stop; the specificity is the praise, the label reads as AI and faintly condescending. If a sentence's only job is to tell the reader how to feel about the previous sentence, delete it.
- **No "it's not X, it's Y" antithesis** ("it's not a tool, it's a teammate", "not faster, just smarter"). Say the positive thing straight.
- **No vague endorsement** ("worth a look", "worth checking out", "worth exploring"). Give the specific reason or number, or don't bring it up.
- **No inflated significance** ("a pivotal moment", "a game-changer", "a watershed"). State what happened and let it stand.
- **No vague attributions** ("experts say", "studies show"). Name the person or skip it.
- **No sycophantic openers or acknowledgement loops** ("great question", "absolutely", "happy to help", "to answer your question"). Start with the answer.
- **Don't cycle synonyms** to avoid repetition. If "agent" is the right word three times, write "agent" three times.
- **Have a real take.** It's fine to say a tool is overrated or a model regressed. Don't hedge to stay neutral.

**Frontier-model tells (still common in Claude 4.8 and GPT-5.x, strip on sight):**

- **More banned words:** harness, showcase, utilize, dive into / deep dive, unpack, actionable, impactful, learnings, streamline, foster, elevate, crucial, nuanced, boasts. (Keep "keen": it is a genuine fingerprint word here, not a tell.)
- **Copula avoidance:** don't dress up "is" / "has" as "serves as", "features", "boasts", "represents". Write "is".
- **List-label periods:** on a bold label use a colon, not a period ("**Intros:**", not "**Intros.**" followed by a sentence). The period-label form is an LLM fingerprint (relevant to Linear and LinkedIn).
- **Engagement hooks:** "Here's the thing.", "The kicker?", "The catch?", "Plot twist:", "The result?". Delete the tee-up and state the thing.
- **Self-labeling significance:** "here's where it gets interesting", "that's the clever bit", "the contrarian one". If it is, the reader sees it; the label does the work the content should.
- **Emotional flatline:** "what struck me was", "I was fascinated to discover", "what surprised me most". Earn the feeling in the writing or cut the claim.
- **Social endorsement closers** (LinkedIn/X): "must-read", "don't sleep on this", "bookmark this", "thank me later". Say what it is and who it's for, then stop.
- **Rhetorical-question openers:** "so why should you care?", "what does this mean for you?". Just answer.
- **Compulsive rule of three:** vary the grouping; don't force "adjective, adjective, and adjective" or triple-clause lists.
- **Stacked hedges:** "could potentially", "may eventually", "might ultimately". Pick one.
- **Parenthetical hedging:** "(and, increasingly, X)", "(or, more precisely, Y)". Commit or cut.
- **Recap-flattery openers:** replying by summarising someone's own work back at them with praise. They know what they did: thank them in one line and move on (see strategy's receipts-before-credit).
- **Wall-of-text in chat:** in Slack and WhatsApp, break at thought boundaries into a short burst, never one dense block.
- **Tracking params on pasted links:** strip `?utm_source=chatgpt.com` / `utm_source=claude.ai` and similar before sending.

**Drafting tells (what a blind judge actually catches):** these are what separated real messages from drafts in a head-to-head test, not word choice.

- **Prompt echo.** The single biggest tell. A draft reuses the request's own phrasing: asked to say "the PRs are basically finished apart from two issues Jiayao raised", it writes "basically done, apart from the two issues". You would not narrate the brief back. Take the facts, throw away the wording, say it the way you say things.
- **Over-smoothing.** Real chat carries typos, dropped words, comma splices, curly apostrophes, and a stray "Firstly". Perfect grammar in a chat register is itself a tell. Do not sand the roughness out of the voice the files show you. Do not manufacture fake typos either; just stop polishing.
- **Generic default over the concrete specific.** When the user supplies a real detail (a time, a link, a name), use it. Reaching for the profile's stock default (the booking link, a bit of slang) where a specific was given reads as a template being filled.
- **Template reproduction.** The excerpts are evidence of a voice, not skeletons to fill. Reproducing an excerpt's exact shape with the nouns swapped, or leaving [Name] slots where a real name belongs, is a draft, not a message.

## Workflow

1. Identify the mode, the platform, and the context within it (see routing tables). If the platform is ambiguous (e.g. "message a co-founder" could be Slack or WhatsApp), ask before drafting; the registers differ.
2. Read the matching platform voice file, including its excerpts: `~/.config/tone-of-voice/<platform>.md` if it exists, otherwise the bundled `references/<platform>.md` (the demo persona). If the message's intent appears in the intent table below, also read `references/strategy.md` and pick the 2-3 principles it maps to.
3. Diagnose before writing (even in rewrite mode): note which voice and strategy rules the situation or the existing draft is violating. In critique mode this diagnosis is the deliverable.
4. Draft, matching the length norm for that context. When in doubt, go shorter.
5. Run the final self-check below. Fix every failure before returning the draft.

Never invent facts: no made-up numbers, availability, venue details, or people. Use only what the user supplied; leave a [placeholder] or ask for anything load-bearing that is missing.

### Intent routing (strategy layer)

| Intent | Apply from `references/strategy.md` |
|---|---|
| Making an ask (review, approval, favour) | The easy yes, most obvious objection, lead with the point |
| Declining or saying no | The warm no, receipts before you credit |
| Bad news, incident, or unpopular decision | Objective not detached, lead with the point |
| Feedback, praise, congrats, recommendation | Receipts before you credit, invert the but |
| Sharing a win | Lead with the point (the number first), receipts |
| Answering a delicate or loaded question | Finesse, answer the real question |
| Instructions, availability, boundaries | Speak in the affirmative |
| Status update | Lead with the point, answer the real question |

**Strictness:** apply the strategy layer fully to anything external, upward, an ask, a decline, or bad news. Apply it lightly to peer Slack and builder WhatsApp (cut obvious bloat, keep the warmth loose). Skip it for family WhatsApp logistics and DM banter: don't BLUF your mum.

## Rewrite example

Strip greetings-by-committee, hedges, em dashes, and filler, then re-shape to the platform norms (see the rewrite bullet in Modes for the rules). Example (Slack):

> **Before:** Hi team, just wanted to flag that I've wrapped up testing on the new escalation flow. Everything looks great overall! There was one small issue (a dark-mode styling bug) which I've logged as APP-412. Let me know if you have any questions!
>
> **After:** I ran through the new escalation flow and everything was working well. Only issue was a dark mode styling bug: APP-412

## Platform routing and differences

| Context | Register | Length | Emoji | Read file |
|---|---|---|---|---|
| Slack channel | Informative, complete sentences, numbers, links | 1-3 sentences | ~1 in 4 messages | `references/slack.md` |
| Slack DM | Rapid logistics, "Haha", quick answers | 1 line, often bursts | Sparse (😊 😮) | `references/slack.md` |
| Email reply | "Hey [First]," + 1-3 short paragraphs + "Thanks, [First]" | Shorter than the inbound | 0-1 (😊 👍) | `references/email.md` |
| Email cold/intro | Same shape, one line of context, clear ask, booking link | 2-4 short paragraphs | 0-1 | `references/email.md` |
| WhatsApp family | Plain, warm, logistics and jokes, zero work-speak | A few words to 1 line | Rare; "!!" instead | `references/whatsapp.md` |
| WhatsApp friends/builders | Like Slack DM but looser; big reactions in CAPS | 1 line, bursts | Occasional 😅 🙏 🎉 | `references/whatsapp.md` |
| LinkedIn post | Hook, specifics with numbers, distilled lesson, light CTA, tagged names | 3-8 short lines, blank line between each | 1-2 per post, required | `references/linkedin.md` |
| LinkedIn DM | Warm, exclamatory, fast; intros and meetup follow-ups | 1-3 sentences | Occasional 💪 😊 | `references/linkedin.md` |
| LinkedIn comment | Hype + gratitude, doubles ("Congrats!!"), one emoji | 1-2 sentences | Usually 1 | `references/linkedin.md` |
| Linear ticket | Gap, action, status tag; evidence-first for bugs | Title + 1-3 sentences | None | `references/linear.md` |

The "Read file" column names the bundled demo; your own `~/.config/tone-of-voice/<platform>.md` overrides it when present (see Workflow step 2).

The biggest cross-platform shift: **the chat voice is far terser and flatter than the LinkedIn feed voice.** LinkedIn posts are energetic and structured; Slack and WhatsApp are quick, plain, and functional with warmth in the punctuation. Do not transplant LinkedIn energy into Slack, and do not write a LinkedIn post as flatly as a Slack message. Email sits in between: friendly but transactional, always signed "Thanks, [First]". Linear tickets are the flattest register of all: no emoji, no exclamation marks, just enough detail to be actionable by a human or agent picking it up cold.

## Reference Files

| File | Read When |
|------|-----------|
| `<platform>.md` (from `~/.config/tone-of-voice/`, else bundled `references/`) | Drafting for that platform: `slack` (channel, DM, status, review request), `email` (reply, intro, scheduling, support), `whatsapp` (family, friends, builders), `linkedin` (post, DM, comment, intro), `linear` (task, bug, investigation, or doc-to-tickets) |
| `references/strategy.md` | The message is an ask, a no, bad news, feedback or praise, a delicate answer, or anything high-stakes or external (see intent routing) |
| `references/refreshing.md` | Building or re-deriving your voice profiles from your own message history (maintenance only, never at drafting time) |

## Final self-check

Run on every draft before returning it:

```text
Voice check:
- [ ] Zero em dashes and zero spaced hyphens ( - ) standing in for them (automatic fail if any)
- [ ] Every number, name, date, and link came from the user or the thread; nothing invented (automatic fail if any)
- [ ] Rewrite mode only: every fact and link from the original survives
- [ ] No flat, wistful, over-balanced sentences; no tacked-on verdict
- [ ] No asserting value without a concrete detail or number
- [ ] No corporate filler ("hope this finds you well", "circling back", "per my last")
- [ ] No banned words (delve, leverage, robust, seamless, pivotal, unlock, empower, facilitate, cutting-edge) or crutches ("moreover", "that said", "let's dive in")
- [ ] No hedges or hollow intensifiers ("it's worth noting", "to be clear", "genuinely", "to be honest")
- [ ] No "it's not X, it's Y" antithesis; no vague endorsement ("worth a look"); no sycophantic opener ("great question")
- [ ] No frontier-model tells: copula avoidance ("serves as"), list-label periods ("**Label.**"), engagement hooks ("Here's the thing"), self-labeling significance, emotional flatline ("what struck me was"), endorsement closers ("must-read"), rhetorical-question openers, stacked hedges
- [ ] No prompt echo: the draft does not reuse the request's phrasing back at the reader
- [ ] Not over-smoothed: reads as typed, not copy-edited (the natural roughness of the voice files survives)
- [ ] Every concrete detail the user supplied is used, not swapped for a profile default
- [ ] No [Name] slots left where a real name belongs; not an excerpt with the nouns swapped
- [ ] Default mode held: shorter, simpler, more natural than the first draft
- [ ] Emoji count matches the platform norm (a LinkedIn post with zero emoji = not you)
- [ ] Length matches the context norm; shorter beats longer
- [ ] Named credit given where due
- [ ] Laugh is "haha", confirmations are "Perfect,"/"Easy,", enthusiasm uses "!!"
- [ ] Spelling matches your convention (the demo persona uses Australian English)
- [ ] Reads like the excerpts in the reference file, not like a press release

Strategy check (skip for family WhatsApp and DM banter):
- [ ] Point or ask in the first sentence (relaxed contexts: by sentence two)
- [ ] Any ask has a clear next action and concrete time; no "ASAP", "soon", "when you get a chance"
- [ ] Any pitch or recommendation names and answers its most obvious objection
- [ ] No performative praise labels; no announced honesty ("honestly", "one honest note")
- [ ] Every specific claim in a compliment or shout-out traces to the thread or user input
- [ ] Delicate or external drafts passed the negative-language audit ("don't", "issues", "usually", "should be fine")
```

## Gotchas

- Draft only from the voice files (your `~/.config/tone-of-voice/<platform>.md` if present, else the bundled demo). Never call a live API, vault, or data lake at drafting time; the skill must work in agents whose only capability is reading these local files.
- If a draft comes out in the demo persona's voice ("Sam") when you expected your own, the agent could not read `~/.config/tone-of-voice/<platform>.md` in this environment (a locked-down sandbox, or the file does not exist yet). Confirm the file exists and the path is readable, then redraft.
- A feed/social voice is not an essay voice. Essays and talks are cooler and plainer. This skill covers short messages and feed posts; for long-form essays and articles, use `blog-post`.
- Never draft or imitate the most private 1:1 relationships (e.g. a partner); that context is deliberately out of bounds. Decline and say why.
- Older posts may use an outdated convention (hashtags, emoji clusters). Imitate the current voice as captured in the reference files, not the archive.
- Excerpts are redacted ([Name], [Company], [Product]); when drafting, use the real names of the actual recipients, not brackets.
- The demo persona signs email "Thanks, Sam", never a full name or "Best regards"/"Cheers". Use your own consistent sign-off; whatever it is, keep it consistent.
- When a draft is for a sensitive topic (job interviews, family, finances, health), keep the polite-direct shape but flag to the user before sending anything; never invent personal details.
- The strategy layer never overrides the voice layer. If a strategy-driven rewrite comes out polished, manicured, or exec-flavoured ("Recommending X. Main risk: Y."), pull it back toward the excerpts: the human version is "I think we should X, main thing I'm worried about is Y". Structure survives; corporate sheen doesn't.
- For platforms not covered here (X, Discord, iMessage, Telegram), use the closest register: chat surfaces follow the WhatsApp/Slack DM rules, public posts follow the LinkedIn post rules minus platform-specific formatting.
