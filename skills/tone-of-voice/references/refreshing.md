# Refreshing the voice profiles

Maintenance procedure only. Never run this at drafting time; the skill must stay usable by agents with no data access. This is how you build your own `references/*.md` files from your real message history, replacing the shipped demo persona.

## First-time setup

Your voice files live in `~/.config/tone-of-voice/`, outside the repo and outside the managed install directory, so they survive every upgrade and are never published.

1. Create the folder: `mkdir -p ~/.config/tone-of-voice`.
2. For each platform, create `~/.config/tone-of-voice/<platform>.md` (`slack`, `email`, `whatsapp`, `linkedin`, `linear`). Start from the bundled demo of the same name (`references/<platform>.md`) so you keep the section structure.
3. Gather a sample of your own sent messages per platform (see Sources), then replace the persona's rules and excerpts with what your own data actually shows.

## Sources

Point this at whatever export or history you have. Common options:

| Platform | Where to get your messages |
|---|---|
| Slack | Workspace export, or a unified chat client that exposes messages as JSON; filter to your own sender ID. |
| WhatsApp | Per-chat "Export chat" (no media), or a unified client export; filter to your own sender. |
| LinkedIn DMs | LinkedIn data export (`messages.csv`); rows where you are the sender. |
| LinkedIn posts/comments | LinkedIn data export (`Shares.csv` / `Comments_*.csv`); parse with a CSV reader, the commentary fields are multiline. |
| Email | Sample your own sent mail (e.g. Gmail search `in:sent`); exclude calendar-acceptance noise. |
| Linear | Linear MCP `list_issues` (paginate by `createdAt`), full text via `get_issue`; keep issues you authored, drop agent-drafted tickets and long structured execution briefs. |

## Extraction (example)

For JSON message logs, extract your own lines, strip HTML, and drop empty/masked records. Adapt the sender filter to your export:

```bash
# Example: pull your own messages from a JSONL export
jq -r 'select(.sender_id=="YOUR_SENDER_ID" and .text != null and .text != "")
  | "[" + .chat_title + "] " + (.text | gsub("\n"; " "))' messages.jsonl \
  | sed -E 's/<[^>]+>//g; s/&amp;/\&/g; s/&lt;/</g; s/&gt;/>/g'

# Strata overview (which chats, how many messages)
jq -r 'select(.sender_id=="YOUR_SENDER_ID") | .chat_title' messages.jsonl | sort | uniq -c | sort -rn
```

## Sampling rules

- Stratify by conversation, not volume: cover several channels and DM partners on Slack; family, friends, and other contexts on WhatsApp. Do not let one chatty thread dominate.
- Skip noise rows: "You joined the chat", bot chats, forwarded messages, calendar acceptances.
- Watch for shifts in the norms (sign-off, emoji set, post structure), not just new excerpts. Update the rule text only when the data contradicts it.
- Verify every claimed frequency against the data before you keep it. Hand-written profiles drift badly: one can claim "an emoji in about one message in four" when the real rate is 6%, or list a signature opener that appears zero times in 700 messages. Count it, or cut it.

## Exclude AI-drafted source material

The biggest trap, and the one that silently inverts the skill. Any channel where you draft with an AI agent (ticket trackers, PR descriptions, docs) contains AI artifacts. Sampling that text teaches the profile to reproduce the exact tells this skill exists to strip.

Detect it with a cross-channel prevalence check, not by eye. Measure a marker (em dashes are the clearest) across every channel:

- If one channel is a wild outlier, that channel is AI-contaminated, not a different register of your voice. A real example: 32% of one person's tickets contained an em dash while their typed chat, email, and social sat at 0%. The tickets were agent-drafted.
- The channels where you type fast and unaided (chat, DMs, email) are the ground truth. Trust them over any channel you draft with help.

Drop contaminated records before sampling. Practical markers: em dashes, unicode arrows, and templated multi-header bodies (## Problem / ## Root cause / ## Verification) that read as agent execution briefs rather than something a person typed.

Never resolve a contradiction in favour of the polluted channel. If the data says you use em dashes but only in the one place you use an agent, the honest reading is that the agent uses them and you do not.

## Redaction rules (non-negotiable before saving)

- Excerpts are ground-truth style data. Never paraphrase, polish, summarise, or "improve" excerpt text. The only permitted edits inside an excerpt are the redaction substitutions below; otherwise swap in a whole new verbatim excerpt or leave the old one alone.
- Your words verbatim; replace other people's names with `[Name]` (or `[Partner]`, `[Sibling]`, `[Cofounder]`), private counterpart companies with `[Company]`, products with `[Product]` where not public.
- Your own public companies/products can stay.
- Never include: API keys/tokens, bank or tax details, health details, the most private 1:1 relationships (e.g. a partner), job-application specifics, NDA-covered material (raw chat logs contain all of these; check every excerpt).
- After editing, grep the skill folder for every third-party full name you saw during analysis; the grep must come back empty.
- Em-dash policy: a verbatim excerpt keeps whatever punctuation was actually typed, but after a refresh run `grep -rn "$(printf '\xe2\x80\x94')" <skill folder>` (the bytes for the em-dash character); hits are allowed only inside blockquoted excerpts or demonstrated AI-tell examples, never in rule prose.

## What to update

- Excerpts and any contradicted norms in the platform references.
- Do not restructure files or grow SKILL.md during a refresh; the structure is stable on purpose.

## Eval scenarios (re-run after every refresh)

Give a fresh agent session only the skill files plus one scenario; judge the draft against the reference rules and 2-3 held-out real messages. Any em dash is an automatic fail.

**Keep the split disjoint, or the eval grades itself.** Split the corpus into a profile set and a held-out set *first*, build the profile only from the profile set, then grep the finished profile to confirm no held-out message is quoted in it. If you sample excerpts from the same corpus you test against, the skill reproduces the excerpt near-verbatim and every score inflates. Refreshing a profile from the full corpus after a held-out set already exists silently breaks the split, so rebuild the split whenever you rebuild a profile.

**Blind the drafter.** In a real-vs-generated comparison, the agent writing the candidate must never see the real message, only a neutral one-line scenario derived from it. An agent that reads the real text first will mimic it, and an indistinguishable result then proves nothing.

1. **Slack channel reply.** A teammate asks whether anyone validated a flow; you did and found a minor ticketed bug. Expect: your reply-opener shape, the ticket ID delivered plainly with a colon, no emoji on the bug, no sign-off.
2. **Email accepting a speaking invite.** Expect: "Hey [First]," / genuine keenness / logistics in one or two short paragraphs / your sign-off / at most one emoji.
3. **LinkedIn post announcing a side project milestone.** Expect: punchy hook, the supplied numbers (never invented ones), exactly one lesson line, 3-6 short blocks, 1-2 emoji, light CTA.
4. **WhatsApp reschedule with a close friend.** Expect: under ~20 words total, no sign-off, "!!" or one emoji max, reads like a text not a memo.
5. **Slack ask for a decision (strategy layer).** You want sign-off to move QA checks into CI; the obvious pushback is CI time. Expect: point in the first line, the objection named and answered in the same breath, a bounded ask with a concrete time or an honest "no rush", and it still reads like your DMs, not an exec memo ("Recommending X. Main risk: Y." shape is a fail).
6. **Email declining an intro request (warm no).** Expect: the no is clear and early, next step carried by you ("I'll ping you when..."), one bounded offer at most, one recallable specific, your sign-off, no announced honesty or apology stacking.
7. **Critique mode.** Paste a hedgy draft ("I was thinking maybe we could possibly...") and ask "will this land?". Expect: no rewrite, the four-part critique shape (working / not landing / real problem / path), each issue tied to a named voice or strategy rule, and an offer to rewrite.
