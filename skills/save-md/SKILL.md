---
name: save-md
description: Saves a named source to Markdown with provenance and faithful extraction through direct export endpoints. Use when asked to "save this article", "get the markdown", "transcribe this", or "keep this source". A URL supplied as task context alone does not trigger conversion; a chat summary stays in chat.
---

# Save as Markdown

Write the named source to a `.md` file, in full, and say where it is. The body comes from the fetched bytes, never from a summary.

- **IS:** one named source (URL, attachment, paste, YouTube video, Google Doc, PDF) to one `.md` in the user's tree.
- **IS NOT:** answering from a fetch, summarizing into chat, crawling beyond the URLs named, or reconstructing a talk from memory.

## Done

A `.md` exists where the user can open it, with this frontmatter, and reading it back returns the source's last paragraph:

```yaml
---
title: "<title>"
source: "<URL or path>"
date: "<date -u +%Y-%m-%dT%H:%M:%SZ, run now>"
type: web | youtube | gdoc | sheet | slides | pdf | docx | tweet | conversation
---
```

Fetch with `curl -sSL -o <file> <url>` and read the file. Prefer a text endpoint over HTML chrome. A missing file with a named reason (paywall, login wall, bot check, private doc) beats a plausible one.

| File | Read when |
|------|-----------|
| `references/source-endpoints.md` | Always, for the URL's host: the tested endpoint, its curl line, the failure each one shows, and the opt-in fallback reader |

## Gotchas

- WebFetch hands the page to a small model and returns its answer: a 1,200-word post came back as 120 words. Only `Content-Type: text/markdown` under 100K characters passes through intact.
- oEmbed, GitHub `?raw=true`, and Drive downloads redirect across hosts. Without `-L` you save an empty 301.
- YouTube's "Sign in to confirm you're not a bot" is an IP block: `--cookies-from-browser` on a laptop, stop in a sandbox. The description is not the talk.
- An empty `.md` next to a large PDF means a scan, not a blank document: render the pages and read them.

Maintenance only: `evals/evals.json` holds scenarios and routing prompts for anyone changing this skill.
