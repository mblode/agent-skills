---
name: blog-drafts
description: Drafts a Heron Press blog post from an outline or a set of notes, in the house voice. Use when asked to "draft the blog post", "turn these notes into a post", or "write up the launch for the blog".
---

# Blog Drafts

## Steps

1. Find the one thing the post is for. If the notes hold two, ask which, or write two posts.
2. Open with the reader's situation, not the company's news.
3. Write to 600 to 900 words. A post over 1,200 is split.
4. Save the draft to `src/content/blog/<date>-<slug>.mdx` with `draft: true` in the front matter. Only an editor removes that line.
5. Run the tells check below before handing over.

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

- Customer names appear only with a signed release on file in `src/content/permissions.json`. No entry, no name.
- Prices are never stated in a post. Link to the pricing page.
