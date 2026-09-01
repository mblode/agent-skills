---
title: Voice defaults checklist
impact: CRITICAL
tags: voice, active-voice, contractions, second-person, tone, reader-centric
---

## Voice defaults checklist

Default behaviors, codified as the project standard:

- [ ] **Active voice, present tense**: actor before action. Use passive only when the actor is unknown or irrelevant.
- [ ] **Contractions**: use common ones (don't, it's, you'll); avoid unusual ones (mightn't, shan't).
- [ ] **Second person**: address the reader as "you." Reserve "the user" for someone other than the reader. "We" is fine for the authoring organization ("we recommend") and, in tutorials only, for the tutor-learner voice Diataxis describes ("In this tutorial, we build...").
- [ ] **Professional, not promotional**: replace superlatives with measurable facts. No marketing hype, no "simply" or "easy."
- [ ] **Reader-centric framing**: lead with what the reader can accomplish, not what the product does.

**Incorrect (passive, formal, promotional, product-centric):**
```markdown
The configuration will be created by the system when the application
is started. It is not necessary for the user to redeploy. Our
blazing-fast platform simply supports parallel execution of up to 16 tasks.
```

**Correct (active, natural, reader-focused):**
```markdown
The system creates a configuration file when the application starts.
You don't need to redeploy. Run up to 16 tasks in parallel to finish
builds faster.
```

Reference: [Google developer documentation style guide: Voice and tone](https://developers.google.com/style/tone), [Diataxis: Tutorials](https://diataxis.fr/tutorials/)
