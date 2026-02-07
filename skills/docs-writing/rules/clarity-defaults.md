---
title: Clarity defaults checklist
impact: HIGH
tags: clarity, defaults, plain-language
---

## Clarity defaults checklist

Claude follows these by default. This checklist codifies them as the project standard:

- [ ] **Plain language** -- use "use" not "utilize," "start" not "initiate," "help" not "facilitate."
- [ ] **Cut filler** -- remove "very," "really," "just," "basically," "actually," "simply," "in order to."
- [ ] **Be specific** -- quantify claims; replace "fast," "easy," "powerful" with numbers or concrete examples.
- [ ] **Global audience** -- standard US English, no idioms, sports metaphors, or cultural references.
- [ ] **Short paragraphs** -- max 4 sentences per paragraph for web content. One-sentence paragraphs are fine for emphasis.

**Incorrect (vague, wordy, uses idioms and filler):**
```markdown
It is important to note that you should basically just utilize the
dashboard to facilitate deployment. The API is really fast and very
powerful. Once you get the hang of it, you'll hit the ground running.
Tokens expire after 24 hours. You can configure expiry. When a token
expires, the client must request a new one. The refresh endpoint
handles this automatically.
```

**Correct (plain, specific, literal, scannable):**
```markdown
Use the dashboard to start your deployment. The API responds in under
50ms and handles 10,000 concurrent requests.

Tokens expire after 24 hours by default. You can configure the expiry
time in the dashboard.

When a token expires, the client requests a new one. The refresh token
endpoint handles this automatically.
```

Reference: [Federal Plain Language Guidelines](https://www.plainlanguage.gov/guidelines/)
