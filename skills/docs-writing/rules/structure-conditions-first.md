---
title: Put conditions before instructions
impact: CRITICAL
tags: structure, conditions, order, procedures
---

## Put conditions before instructions

State where to be, what to have, or what to check before the action. Instruction-first, condition-second makes readers act in the wrong context and undo it. Applies to prerequisites, UI navigation, and conditional branches.

**Incorrect (instruction before condition):**

```markdown
Click **Save** to apply your changes on the Settings page.

Run the migration script if you're upgrading from version 2.x.

Enter your API key in the **Credentials** field, which you'll find
under **Project Settings > Integrations**.
```

**Correct (condition before instruction):**

```markdown
On the **Settings** page, click **Save** to apply your changes.

If you're upgrading from version 2.x, run the migration script.

Go to **Project Settings > Integrations**. In the **Credentials**
field, enter your API key.
```

Tip: find "if," "when," "on," "in" buried at a sentence's end and move them to the front.

Reference: [Microsoft Writing Style Guide: Procedures and instructions](https://learn.microsoft.com/en-us/style-guide/procedures-instructions/)
