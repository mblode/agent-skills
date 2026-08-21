# Plain English

Sentence craft, what to keep verbatim, and how to re-pitch. Shape and the never-write set live in SKILL.md.

## Contents

- Sentence rules
- Keep verbatim
- Analogies
- Re-pitch
- Project words
- Accuracy

## Sentence rules

Taken from ASD-STE100 Simplified Technical English, cut down to what changes a coding-agent reply. Not the approved dictionary, and not the `-ing` ban: those produce robot English.

1. **One word, one meaning.** Repeat the right word. Do not rotate "start / begin / commence" or "function / method / handler" for the same thing.
2. **One idea per sentence.** Two commas usually means two sentences.
3. **Active voice.** Name the actor: "The handler reads the cookie", not "the cookie is read".
4. **Short.** Aim under 20 words. Split rather than stack clauses.
5. **Imperative for instructions.** "Open `src/auth.ts`" not "You will want to open".
6. **Keep articles.** "the session cookie", not "session cookie invalid, fix next". Telegrams are shorter and harder, not plainer.
7. **Un-stack nouns.** "the pool's connection limit" beats "database connection pool configuration value".
8. **`is` and `has` are fine.** Skip "serves as", "features", or "represents" unless the verb adds meaning.

Filler to cut on sight: "at its core", "essentially", "basically", "what this means is", "it's important to understand that".

## Keep verbatim

Simplification is not translation. These stay in their original form:

- Facts, names, numbers, dates, versions
- File paths, URLs, commands, flags
- Identifiers, type names, env vars, error codes
- Fenced code blocks (reproduce exactly)
- Quoted logs and stack traces
- YAML frontmatter, if a file rewrite is in scope at all

Define an unavoidable term in five words or fewer on first use, then use the real term. "A JWT is a signed pass. The JWT lives in the cookie."

Do not rewrite, answer, or repeat the user's question. Explain the thing they pointed at.

## Analogies

Pick one before writing. If none fits in a few seconds, skip it and use a concrete example from this repo instead.

- **One, not three.** Stacking analogies is a new jargon.
- **Everyday domain:** keys, mail, queues, hotel desks, kitchen timers, filing cabinets, traffic lanes.
- **Map each real part back.** If a piece of the system has no counterpart, say so in one sentence, or drop that piece from this pass.
- **Name the break** only when the break would mislead (money, permissions, data loss).
- **Keep the identifier** next to the comparison: "the token is the keycard", not "the keycard thing".

On "different analogy", "that one didn't click", or any re-pitch: invent a new comparison. Never reuse one that already failed in this session.

## Re-pitch

The last message did not land. Do not defend it. Do not summarise it. Say it again from a new angle.

1. **Context, one line.** Where we are: step N of M, or the file and the symptom.
2. **New analogy or a repo example.** Not the failed one.
3. **Map the parts.** Two to four short sentences.
4. **Next.** One action.

If the miss was a word, replace the word. If the miss was structure, lead with the action or the gist that was buried.

## Project words

If `CONTEXT.md` exists, its ubiquitous language wins. If `CONTEXT-MAP.md` exists, follow it to the right `CONTEXT.md`. Do not invent a friendlier synonym for a name the project already settled.

No `CONTEXT.md` is normal. Then pick one plain word per idea and stick to it for the rest of the session.

## Accuracy

Shorter is not righter. A cut that would mislead on money, safety, permissions, or data loss is not a cut. Keep the precise term and define it.

If a corner cannot be made plain without becoming false, say that in one sentence: "This part is narrower than the analogy. The token also expires." Then stop. Do not dump the spec "for completeness".
