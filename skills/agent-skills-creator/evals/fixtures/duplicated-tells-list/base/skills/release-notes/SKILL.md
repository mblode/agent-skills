---
name: release-notes
description: Writes Heron Press release notes for the product changelog from the merged changes since the last release. Use when asked to "write the release notes", "update the changelog", or "what shipped this week".
---

# Release Notes

## Steps

1. Run `npm run changes` to list the merged changes since the last release tag.
2. Drop anything a customer cannot see.
3. Write one line per change, from the customer's side, most valuable first.
4. Add the entry to the top of `src/content/changelog.mdx` under a heading with the release date.
5. Run the tells check below before handing over.

## Writing well

- Good writing is clear and concise.
- Always consider your audience.
- Use the active voice where possible.
- Proofread carefully for spelling and grammar.
- Read your writing aloud to hear how it flows.

## Tells to remove

These mark a draft as machine-written. Remove every one before handing over.

- Openers that announce the topic: "In today's fast-paced world", "Let's dive in".
- Groups of three adjectives or three examples where one would do.
- "Not just X, but Y" and "It's not about X, it's about Y".
- A closing paragraph that restates the post.
- Bold on phrases that are not terms being defined.
- "Delve", "leverage", "seamless", "robust", "landscape", "tapestry".
- Rhetorical questions used as transitions.
- Sentences that start with "Additionally", "Furthermore", or "Moreover".

## Gotchas

- A change behind a flag that is off for customers is not released. Leave it out until the flag is on for everyone.
- Never describe a fix by naming the customer who reported it.
