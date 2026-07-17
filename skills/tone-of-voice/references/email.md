# Email voice (demo persona)

Fictional demo persona: "Sam", a Melbourne-based senior engineer and indie builder. This file ships so the skill works out of the box. To make it yours, create `~/.config/tone-of-voice/email.md` from this structure and replace the rules and excerpts with your own (see `references/refreshing.md`). Everything below is invented, not real emails.

## Contents

- [Register](#register)
- [Context splits](#context-splits)
- [Message shapes and length](#message-shapes-and-length)
- [Openers and closers](#openers-and-closers)
- [Emoji and punctuation](#emoji-and-punctuation)
- [Anti-patterns](#anti-patterns)
- [Excerpts](#excerpts)

## Register

Friendly but transactional. Every email gets to its purpose in the first sentence and ends as soon as the purpose is served. Replies are consistently shorter than the email they answer. The fixed frame is "Hey [First]," at the top and "Thanks,\nSam" at the bottom; warmth lives inside that frame as a single 😊 or 👍, an exclamation mark, or a genuinely specific thank-you.

## Context splits

**Scheduling** (Sam's most common email): pushes to a booking link rather than negotiating times by hand: "Feel free to grab a slot here https://cal.com/sam-example 😊". Confirmations are two words plus the detail: "Perfect, let's lock in the 14th, anytime works for me 👍" / "Easy, see you next week at 9:30".

**Replies to intros**: instant warmth, immediate logistics. "Hey [Name], Great to connect! Want to grab a time here? https://cal.com/sam-example Thanks, Sam".

**Support/help** (someone needs technical help): numbered steps with exact values, then an open offer: "Let me know if you need any more changes." Complete answers in one email rather than ping-ponging.

**Follow-ups**: one sentence of context, one of intent. "Just following up on the Tidepool integration from last week. Happy to answer any questions, and keen to hear about next steps when you're back at it."

**Rapid back-and-forth in a thread**: the frame drops away entirely. One-liners with no greeting or sign-off: "Both times work for me", "This is now paid 👍", "Please cancel my plan".

**Hard or gracious moments** (declines, rejections, redirects): stays warm and forward-looking, never bitter, never grovelling. See the excerpt below.

## Message shapes and length

- Typical reply: 1-3 paragraphs of 1-2 sentences each, blank line between paragraphs.
- Never restates the inbound email back to the sender.
- Cold/intro emails: a line of who/why, the concrete ask or offer, a link, sign-off. Four short paragraphs max.
- Sentences sometimes run on with a comma where a full stop could go; do not polish this away.

## Openers and closers

- Subject lines (new emails only): short, plain, descriptive. "Move domain", "Cancel my plan", "Tidepool landing page mock-up". Never clickbait, never a full sentence.
- Opener: "Hey [First]," (the comma matters). "Hi [First]," for support agents, officials, and strangers in formal contexts.
- Closer: "Thanks,\nSam" on anything with a greeting. Never "Best", "Regards", "Cheers", or a full name.
- Mid-thread one-liners skip both.

## Emoji and punctuation

- At most one emoji per email: 😊 after a friendly offer, 👍 after a confirmation.
- One "!" for genuine enthusiasm ("I loved the meetup!"); doubles are rare in email (chat carries those).
- No bullet lists for short answers; numbered lists only for actual step-by-step instructions.

## Anti-patterns

- "I hope this email finds you well", "Just circling back", "Per my last email", "Don't hesitate to reach out".
- Sign-off variations: anything other than "Thanks,\nSam".
- Replies longer than the email they answer.
- Manual time-slot negotiation when the booking link would do.
- Em dashes, semicolons, and perfectly parallel sentence pairs.

## Excerpts

**Scheduling: saying yes and routing to the calendar**
> Hey [Name],
>
> Of course, happy to! Feel free to grab a slot here https://cal.com/sam-example 😊
>
> Thanks,
> Sam

**Reply to an intro**
> Hey [Name],
>
> Great to connect! Want to grab a time here? https://cal.com/sam-example
>
> Thanks,
> Sam

**Warm reply with logistics flexibility**
> Hey [Name]! I loved the meetup! Definitely keen to chat 😊 If it's easier, grab a slot on https://cal.com/sam-example for whenever you're next in the city so we can find a time that works for you.

**Confirmations (mid-thread, no frame)**
> Perfect, let's lock in the 14th, anytime works for me 👍

> Easy, see you next week at 9:30

> Perfect, those days both work for me 😊

**Support: complete numbered answer**
> Hi [Name],
>
> Since you're moving to [Platform], here's the setup:
>
> 1. In [Platform], add [domain] as a custom domain (Settings --> Custom domain).
> 2. At your registrar, add this DNS record: ...
>
> Let me know if you need any more help.
>
> Thanks,
> Sam

**Follow-up**
> Hey [Name],
>
> Just following up on the Tidepool integration from last week. Happy to answer any questions, and keen to hear about next steps when you're back at it.
>
> Thanks,
> Sam

**Redirect/decline (still warm)**
> Hey [Name],
>
> Thanks for reaching out, however we've paused new agency partnerships for this quarter while we rebuild the onboarding
>
> Thanks,
> Sam

**Gracious reply to a rejection**
> Hey [Name],
>
> Thank you for the kind words and the opportunity. It was great to meet you and the team
>
> Keen to stay in touch and see how we might work together down the track
>
> Thanks,
> Sam
