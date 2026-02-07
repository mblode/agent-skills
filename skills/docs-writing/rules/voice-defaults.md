---
title: Voice defaults checklist
impact: CRITICAL
tags: voice, active-voice, contractions, second-person, tone, reader-centric
---

## Voice defaults checklist

Claude follows these by default. This checklist codifies them as the project standard:

- [ ] **Active voice, present tense** -- put the actor before the action. Use passive only when the actor is unknown.
- [ ] **Contractions** -- use common contractions (don't, it's, you'll). Avoid unusual ones (mightn't, shan't).
- [ ] **Second person** -- address the reader as "you." Reserve "the user" for someone other than the reader.
- [ ] **Professional, not promotional** -- replace superlatives with measurable facts. No marketing hype.
- [ ] **Reader-centric framing** -- lead with what the reader can accomplish, not what the product does.

**Incorrect (passive, formal, promotional, product-centric):**
```markdown
The configuration will be created by the system when the application
is started. It is not necessary for the user to redeploy. Our
blazing-fast platform supports parallel execution of up to 16 tasks.
```

**Correct (active, natural, reader-focused):**
```markdown
The system creates a configuration file when the application starts.
You don't need to redeploy. Run up to 16 tasks in parallel to finish
builds faster.
```

Reference: [Google developer documentation style guide](https://developers.google.com/style)
