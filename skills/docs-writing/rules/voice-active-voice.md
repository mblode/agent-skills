---
title: Use active voice and present tense
impact: CRITICAL
tags: voice, active-voice, tense
---

## Use active voice and present tense

Active voice makes documentation direct and clear by putting the actor before the action. Passive voice obscures who or what is performing the action, forcing readers to work harder. Present tense keeps docs feeling current and avoids ambiguity about when something happens.

Use passive voice only when the actor is genuinely unknown or unimportant, such as "The file is deleted after 30 days."

**Incorrect (passive voice, future tense):**

```markdown
The configuration file will be created by the system when the
application is started. An error message will be displayed if the
port is already in use. The logs can be found in the output directory.
```

**Correct (active voice, present tense):**

```markdown
The system creates a configuration file when the application starts.
It displays an error message if the port is already in use. You can
find the logs in the output directory.
```

Reference: [Google developer documentation style guide — Active voice](https://developers.google.com/style/voice)
